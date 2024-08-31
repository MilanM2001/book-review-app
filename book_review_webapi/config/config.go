package config

import (
	"book-review-app/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func ConnectDatabase() *gorm.DB {
	dsn := "host=localhost user=postgres password=postgres dbname=book-review port=5432 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}

	// Auto migrate model
	err = database.AutoMigrate(&model.User{}, &model.Book{}, &model.Review{}, &model.Category{})
	if err != nil {
		return nil
	}

	DB = database
	return database
}
