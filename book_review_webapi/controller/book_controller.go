package controller

import (
	"book-review-app/model"
	"book-review-app/service"
	"github.com/gin-gonic/gin"
	"net/http"
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
	var book model.Book
	err := ctx.ShouldBindJSON(&book)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	existingBook, _ := c.service.FindOneByIsbn(book.Isbn)
	if existingBook != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "Book already exists"})
		return
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
