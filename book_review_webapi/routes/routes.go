package routes

import (
	"book-review-app/controller"
	"book-review-app/middleware"
	"book-review-app/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(authController *controller.AuthController,
	userController *controller.UserController,
	bookController *controller.BookController,
	reviewController *controller.ReviewController) *gin.Engine {
	router := gin.Default()
	corsConfig := utils.CorsConfiguration()

	router.Use(cors.New(corsConfig))

	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/register", authController.Register)
		authGroup.POST("/login", authController.Login)
	}

	publicUsersGroup := router.Group("/api/users")
	{
		publicUsersGroup.GET("/all", userController.GetAllUsers)
		publicUsersGroup.GET("/:username", userController.GetUserByUsername)
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

	publicReviewsGroup := router.Group("/api/reviews")
	{
		publicReviewsGroup.GET("/all", reviewController.GetAllReviews)
		publicReviewsGroup.GET("/:id", reviewController.GetReviewById)
	}

	privateReviewsGroup := router.Group("/api/reviews")
	privateReviewsGroup.Use(middleware.AuthMiddleware())
	{
		privateReviewsGroup.POST("/create", reviewController.CreateReview)
	}

	return router
}
