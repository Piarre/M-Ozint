package models

import "time"

type Person struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time
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
