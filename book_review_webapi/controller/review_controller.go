package controller

import (
	"book-review-app/model"
	"book-review-app/service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
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

func (c *ReviewController) CreateReview(ctx *gin.Context) {
	var review model.Review
	err := ctx.ShouldBind(&review)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newReview, err := c.service.Create(review)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newReview)
}
