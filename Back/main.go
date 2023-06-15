package main

import (
	"SQLFiberApi/database"
	"SQLFiberApi/routes"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"

	"github.com/gofiber/fiber/v2"
)

var apiBaseUrl string = "/api/v1"

func welcome(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello World!")
}

func setupRoutes(server *fiber.App) {
	server.Get("/", welcome)

	// ? User endpoints
	server.Get(apiBaseUrl+"/people", routes.GetUsers)
	// Get method(s)
	server.Get(apiBaseUrl+"/people/:id", routes.GetUserById)
	// Post method(s)
	server.Post(apiBaseUrl+"/people", routes.CreateUser)
	server.Post(apiBaseUrl+"/people/:id", routes.AddUserAccounts)
	// Put method(s)
	server.Put(apiBaseUrl+"/people/:id", routes.UpdateUserById)

	// Delete method(s)
	server.Delete(apiBaseUrl+"/people/:id", routes.DeleteUserById)
}

func main() {
	// * Open SQLite DB file.
	database.ConnectDatabase()

	// ? Setup the server app.
	server := fiber.New()

	// Configure CORS middleware
	config := cors.Config{
		AllowOrigins: "*",
	}
	server.Use(cors.New(config))

	setupRoutes(server)

	log.Fatal(server.Listen(":8080"))
}
