package controller

import (
	"book-review-app/model"
	"book-review-app/service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

type ReviewController struct {
	service *service.ReviewService
}

func NewReviewController(service *service.ReviewService) *ReviewController {
	return &ReviewController{service: service}
}

func (c *ReviewController) GetAllReviews(ctx *gin.Context) {
	reviews, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, reviews)
}

func (c *ReviewController) GetReviewById(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	review, err := c.service.FindOneById(uint(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, review)
}

func (c *ReviewController) GetAllByUsername(ctx *gin.Context) {
	username := ctx.Param("username")
	reviews, err := c.service.FindByUsername(username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, reviews)
}

func (c *ReviewController) GetAllByBookIsbn(ctx *gin.Context) {
	bookIsbn := ctx.Param("book_isbn")
	reviews, err := c.service.FindByBookIsbn(bookIsbn)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, reviews)
}

func (c *ReviewController) CreateReview(ctx *gin.Context) {
	var review model.Review

	username, exists := ctx.Get("username")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	err := ctx.ShouldBind(&review)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	review.CreatedAt = time.Now()
	review.Username = username.(string)

	newReview, err := c.service.Create(review)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newReview)
}
