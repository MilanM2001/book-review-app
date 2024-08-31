package main

import (
	"book-review-app/config"
	"book-review-app/controller"
	"book-review-app/repository/repository_impl"
	"book-review-app/routes"
	"book-review-app/service"
)

func main() {
	db := config.ConnectDatabase()

	// Initialize repositories, services, and controllers
	userRepo := repository_impl.NewUserRepositoryImpl(db)
	userService := service.NewUserService(userRepo)
	userController := controller.NewUserController(userService)

	bookRepo := repository_impl.NewBookRepositoryImpl(db)
	bookService := service.NewBookService(bookRepo)
	bookController := controller.NewBookController(bookService)

	// Setup routes
	router := routes.SetupRouter(userController, bookController)

	// Start the server
	router.Run(":8080")
}
