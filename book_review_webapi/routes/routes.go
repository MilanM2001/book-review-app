package routes

import (
	"book-review-app/controller"
	"book-review-app/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter(authController *controller.AuthController, userController *controller.UserController, bookController *controller.BookController) *gin.Engine {
	router := gin.Default()

	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/register", authController.Register)
		authGroup.POST("/login", authController.Login)
	}

	usersGroup := router.Group("/api/users")
	//usersGroup.Use(middleware.AuthMiddleware())
	{
		usersGroup.GET("/all", userController.GetAllUsers)
		usersGroup.GET("/:username", userController.GetUserByUsername)
	}

	publicBooksGroup := router.Group("/api/books")
	{
		publicBooksGroup.GET("/all", bookController.GetAllBooks)
		publicBooksGroup.GET("/:isbn", bookController.GetBookByIsbn)
	}

	privateBooksGroup := router.Group("/api/books")
	privateBooksGroup.Use(middleware.AuthMiddleware())
	{
		privateBooksGroup.POST("/create", middleware.AdminOnly(), bookController.CreateBook)
	}

	return router
}
