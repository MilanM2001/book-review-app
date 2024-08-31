package routes

import (
	"book-review-app/controller"
	"github.com/gin-gonic/gin"
)

func SetupRouter(userController *controller.UserController, bookController *controller.BookController) *gin.Engine {
	router := gin.Default()

	usersGroup := router.Group("/api/users")
	{
		usersGroup.GET("/all", userController.GetAllUsers)
		usersGroup.GET("/:username", userController.GetUserByUsername)
		usersGroup.POST("/create", userController.CreateUser)
	}

	booksGroup := router.Group("/api/books")
	{
		booksGroup.GET("/all", bookController.GetAllBooks)
		booksGroup.GET("/:isbn", bookController.GetBookByIsbn)
		booksGroup.POST("/create", bookController.CreateBook)
	}

	return router
}
