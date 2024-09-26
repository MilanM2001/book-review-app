package controller

import (
	"book-review-app/model"
	"book-review-app/model/dto"
	"book-review-app/service"
	"book-review-app/utils"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type BookController struct {
	service *service.BookService
}

func NewBookController(service *service.BookService) *BookController {
	return &BookController{service: service}
}

func (c *BookController) GetAllBooks(ctx *gin.Context) {
	books, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, books)
}

func (c *BookController) GetAllBooksPageable(ctx *gin.Context) {
	pageStr := ctx.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSizeStr := ctx.DefaultQuery("pageSize", "5")
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize <= 0 {
		pageSize = 5
	}

	books, totalPages, err := c.service.FindAllPageable(page, pageSize)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"books":       books,
		"currentPage": page,
		"totalPages":  totalPages,
	})
}

func (c *BookController) GetBookByIsbn(ctx *gin.Context) {
	isbn := ctx.Param("isbn")
	book, err := c.service.FindOneByIsbn(isbn)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, book)
}

func (c *BookController) CreateBook(ctx *gin.Context) {
	bookJson := ctx.PostForm("book")
	if bookJson == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing book data"})
		return
	}

	var book model.Book
	if err := json.Unmarshal([]byte(bookJson), &book); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book data"})
		return
	}

	existingBook, _ := c.service.FindOneByIsbn(book.Isbn)
	if existingBook != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "Book already exists"})
		return
	}

	if file, err := ctx.FormFile("image"); err == nil { // File was uploaded
		_, err := utils.SaveImageLocally(ctx, file) // Save the file
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		// Set the ImageURL to the relative path accessible by the frontend
		book.ImageURL = "/images/" + file.Filename
	}

	newBook, err := c.service.Create(book)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newBook)
}

func (c *BookController) SearchBooks(ctx *gin.Context) {
	term := ctx.Query("term")

	books, err := c.service.SearchBooks(term)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, books)
}

func (c *BookController) DeleteBookByIsbn(ctx *gin.Context) {
	isbn := ctx.Param("isbn")
	err := c.service.DeleteByIsbn(isbn)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}

func (c *BookController) UpdateBook(ctx *gin.Context) {
	isbn := ctx.Param("isbn")
	var updateBook dto.UpdateBook
	if err := ctx.ShouldBindJSON(&updateBook); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedBook, err := c.service.UpdateBook(updateBook, isbn)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, updatedBook)
}
