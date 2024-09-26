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
	reviewController *controller.ReviewController,
	categoryController *controller.CategoryController) *gin.Engine {
	router := gin.Default()
	corsConfig := utils.CorsConfiguration()

	router.Use(cors.New(corsConfig))

	router.Static("/images", "D:\\Projects\\book_review_project\\book_review_webapp\\public\\images")

	publicAuthGroup := router.Group("/api/auth")
	{
		publicAuthGroup.POST("/register", authController.Register)
		publicAuthGroup.POST("/registerAdmin", authController.RegisterAdmin)
		publicAuthGroup.POST("/login", authController.Login)
		publicAuthGroup.POST("/refresh", authController.RefreshToken)
	}

	privateAuthGroup := router.Group("/api/auth")
	privateAuthGroup.Use(middleware.AuthMiddleware())
	{
		privateAuthGroup.GET("/getMe", authController.GetMe)
	}

	publicUsersGroup := router.Group("/api/users")
	{
		publicUsersGroup.GET("/all", userController.GetAllUsers)
		publicUsersGroup.GET("/:username", userController.GetUserByUsername)
	}

	publicBooksGroup := router.Group("/api/books")
	{
		publicBooksGroup.GET("/all", bookController.GetAllBooks)
		publicBooksGroup.GET("/allPageable", bookController.GetAllBooksPageable)
		publicBooksGroup.GET("/:isbn", bookController.GetBookByIsbn)
		publicBooksGroup.GET("/search", bookController.SearchBooks)
	}

	privateBooksGroup := router.Group("/api/books")
	privateBooksGroup.Use(middleware.AuthMiddleware())
	{
		privateBooksGroup.POST("/create", middleware.AdminOnly(), bookController.CreateBook)
		privateBooksGroup.DELETE("/delete/:isbn", middleware.AdminOnly(), bookController.DeleteBookByIsbn)
		privateBooksGroup.PUT("/update/:isbn", middleware.AdminOnly(), bookController.UpdateBook)
	}

	publicReviewsGroup := router.Group("/api/reviews")
	{
		publicReviewsGroup.GET("/all", reviewController.GetAllReviews)
		publicReviewsGroup.GET("/:id", reviewController.GetReviewById)
		publicReviewsGroup.GET("/allByUsername/:username", reviewController.GetAllByUsername)
		publicReviewsGroup.GET("/allByBookIsbn/:book_isbn", reviewController.GetAllByBookIsbn)
	}

	privateReviewsGroup := router.Group("/api/reviews")
	privateReviewsGroup.Use(middleware.AuthMiddleware())
	{
		privateReviewsGroup.POST("/create", reviewController.CreateReview)
	}

	publicCategoryGroup := router.Group("/api/categories")
	{
		publicCategoryGroup.GET("/all", categoryController.GetAllCategories)
	}

	privateCategoryGroup := router.Group("/api/categories")
	privateCategoryGroup.Use(middleware.AuthMiddleware())
	{
		privateCategoryGroup.POST("/create", middleware.AdminOnly(), categoryController.CreateCategory)
		privateCategoryGroup.DELETE("/delete/:name", middleware.AdminOnly(), categoryController.DeleteCategory)
	}

	return router
}
