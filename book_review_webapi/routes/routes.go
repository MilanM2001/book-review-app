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
		authGroup.POST("/register", userController.Register)
		authGroup.POST("/login", userController.Login)
	}

	usersGroup := router.Group("/api/users")
	{
		usersGroup.GET("/all", userController.GetAllUsers)
		usersGroup.GET("/:username", userController.GetUserByUsername)
	}

	booksGroup := router.Group("/api/books")
	{
		booksGroup.GET("/all", bookController.GetAllBooks)
		booksGroup.GET("/:isbn", bookController.GetBookByIsbn)
		booksGroup.POST("/create", middleware.AdminOnly(), bookController.CreateBook)
	}

	return router
}
