package controller

import (
	"book-review-app/model"
	"book-review-app/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CategoryController struct {
	service *service.CategoryService
}

func NewCategoryController(service *service.CategoryService) *CategoryController {
	return &CategoryController{service: service}
}

func (c *CategoryController) GetAllCategories(ctx *gin.Context) {
	categories, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, categories)
}

func (c *CategoryController) CreateCategory(ctx *gin.Context) {
	var category model.Category
	err := ctx.ShouldBindJSON(&category)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	existingCategory, _ := c.service.FindOneByName(category.Name)
	if existingCategory != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "Category already exists"})
		return
	}

	newCategory, err := c.service.Create(category)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newCategory)
}

func (c *CategoryController) DeleteCategory(ctx *gin.Context) {
	name := ctx.Param("name")
	err := c.service.Delete(name)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}
