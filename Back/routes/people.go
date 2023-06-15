package routes

import (
	"SQLFiberApi/database"
	"SQLFiberApi/models"
	"encoding/json"
	"errors"

	"github.com/gofiber/fiber/v2"
)

type Person struct {
	ID        uint   `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Gender    string `json:"gender"`
	Phone     string `json:"phone"`
	Emails    string `json:"emails"`
	Addresses string `json:"addresses"`
	Age       int    `json:"age"`
	Birthday  string `json:"birthday"`
	Accounts  string `json:"accounts"`
}

type Response struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func FindUserById(id int, user *models.Person) error {
	database.Database.DB.Find(&user, "id = ?", id)
	if user.ID == 0 {
		return errors.New("User not found")
	}
	return nil
}

func CreateResponseUser(userModel models.Person) Person {
	return Person{ID: userModel.ID, FirstName: userModel.FirstName, LastName: userModel.LastName, Gender: userModel.Gender, Phone: userModel.Phone, Emails: userModel.Emails, Addresses: userModel.Addresses, Age: userModel.Age, Birthday: userModel.Birthday}
}

func CreateResponse(_message string, _code int) Response {
	return Response{Message: _message, Code: _code}
}

func CreateUser(ctx *fiber.Ctx) error {
	var user models.Person

	if err := ctx.BodyParser(&user); err != nil {
		return ctx.Status(400).JSON(CreateResponse(err.Error(), 400))
	}

	// Check if all body is empty

	database.Database.DB.Create(&user)

	return ctx.Status(200).JSON(CreateResponse("User created successfully", 200))
}

func GetUsers(ctx *fiber.Ctx) error {
	users := []models.Person{}

	database.Database.DB.Find(&users)
	responseUsers := []Person{}
	for _, user := range users {
		responseUser := CreateResponseUser(user)
		responseUsers = append(responseUsers, responseUser)
	}

	return ctx.Status(200).JSON(responseUsers)
}

func GetUserById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")

	var user models.Person

	type Account struct {
		Provider string `json:"provider"`
	}

	type UserResponse struct {
		ID        uint      `json:"id"`
		FirstName string    `json:"first_name"`
		LastName  string    `json:"last_name"`
		Gender    string    `json:"gender"`
		Phone     string    `json:"phone"`
		Emails    string    `json:"emails"`
		Addresses string    `json:"addresses"`
		Age       uint      `json:"age"`
		Birthday  string    `json:"birthday"`
		Accounts  []Account `json:"accounts"`
	}

	if err != nil {
		return ctx.Status(400).JSON("Please, ensure that :id is an integer!")
	}

	if err := FindUserById(id, &user); err != nil {
		return ctx.Status(400).JSON(err.Error())
	}

	var accounts []Account
	if err := json.Unmarshal([]byte(user.Accounts), &accounts); err != nil {
		return ctx.Status(500).JSON(CreateResponse(err.Error(), 500))
	}

	responseUser := UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Gender:    user.Gender,
		Phone:     user.Phone,
		Emails:    user.Emails,
		Addresses: user.Addresses,
		Age:       uint(user.Age),
		Birthday:  user.Birthday,
		Accounts:  accounts,
	}

	return ctx.Status(200).JSON(responseUser)
}

func UpdateUserById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")

	var user models.Person

	if err != nil {
		return ctx.Status(400).JSON(CreateResponse("Please, ensure that :id is an integer!", 400))
	}

	if err := FindUserById(id, &user); err != nil {
		return ctx.Status(400).JSON(CreateResponse(err.Error(), 400))
	}

	type UserToUpdate struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Gender    string `json:"gender"`
		Phone     string `json:"phone"`
		Emails    string `json:"emails"`
		Addresses string `json:"addresses"`
		Age       int    `json:"age"`
		Birthday  string `json:"birthday"`
		Accounts  string `json:"accounts"`
	}

	var dataToUpdate UserToUpdate

	if err := ctx.BodyParser(&dataToUpdate); err != nil {
		return ctx.Status(500).JSON(CreateResponse(err.Error(), 500))
	}

	user.FirstName = dataToUpdate.FirstName
	user.LastName = dataToUpdate.LastName
	user.Age = dataToUpdate.Age
	user.Birthday = dataToUpdate.Birthday
	user.Addresses = dataToUpdate.Addresses
	user.Emails = dataToUpdate.Emails
	user.Phone = dataToUpdate.Phone
	user.Gender = dataToUpdate.Gender
	user.Accounts = dataToUpdate.Accounts

	database.Database.DB.Save(&user)
	return ctx.Status(200).JSON(CreateResponseUser(user))
}

func DeleteUserById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")

	var person models.Person

	if err != nil {
		return ctx.Status(400).JSON(CreateResponse("Please, ensure that :id is an integer!", 400))
	}

	if err := FindUserById(id, &person); err != nil {
		return ctx.Status(400).JSON(CreateResponse(err.Error(), 400))
	}

	if err := database.Database.DB.Delete(&person).Error; err != nil {
		return ctx.Status(404).JSON(CreateResponse(err.Error(), 400))
	}

	return ctx.Status(200).JSON(CreateResponse("User deleted successfully", 200))
}

func AddUserAccounts(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")

	var person models.Person

	if err != nil {
		return ctx.Status(400).JSON(CreateResponse("Please, ensure that :id is an integer!", 400))
	}

	if err := FindUserById(id, &person); err != nil {
		return ctx.Status(400).JSON(CreateResponse(err.Error(), 400))
	}

	type Account struct {
		Provider string `json:"provider"`
		Link     string `json:"link"`
	}

	type UserToUpdate struct {
		Accounts []Account `json:"accounts"`
	}

	var dataToUpdate UserToUpdate

	if err := ctx.BodyParser(&dataToUpdate); err != nil {
		return ctx.Status(500).JSON(CreateResponse(err.Error(), 500))
	}

	// Transform the accounts into a JSON string
	accountsJSON, err := json.Marshal(dataToUpdate.Accounts)
	if err != nil {
		return ctx.Status(500).JSON(CreateResponse(err.Error(), 500))
	}

	person.Accounts = string(accountsJSON)

	database.Database.DB.Save(&person)
	return ctx.Status(200).JSON(CreateResponseUser(person))
}
