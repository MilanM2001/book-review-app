package controller

import (
	"book-review-app/model"
	"book-review-app/model/dto"
	"book-review-app/service"
	"book-review-app/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type AuthController struct {
	service *service.UserService
}

func NewAuthController(service *service.UserService) *AuthController {
	return &AuthController{service: service}
}

func (c *AuthController) Register(ctx *gin.Context) {
	var user model.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	existingUser, _ := c.service.FindOneByUsername(user.Username)
	if existingUser != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)
	user.Role = "user"

	newUser, err := c.service.Create(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newUser)
}

func (c *AuthController) Login(ctx *gin.Context) {
	var loginRequestDto dto.LoginRequestDto

	err := ctx.ShouldBindJSON(&loginRequestDto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := c.service.FindOneByUsername(loginRequestDto.Username)
	if err != nil || user == nil {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Incorrect username or password"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequestDto.Password))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect username or password"})
		return
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.Username, user.Role)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	var loginResponseDto dto.LoginResponseDto

	loginResponseDto.AccessToken = accessToken
	loginResponseDto.RefreshToken = refreshToken

	ctx.JSON(http.StatusOK, loginResponseDto)
}

func (c *AuthController) RefreshToken(ctx *gin.Context) {
	var tokenData struct {
		RefreshToken string `json:"refreshToken"`
	}
	var tokenResponse struct {
		AccessToken string `json:"accessToken"`
	}

	err := ctx.ShouldBindJSON(&tokenData)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	claims, err := utils.ParseToken(tokenData.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	accessToken, _, err := utils.GenerateTokens(claims.Username, claims.Role)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate new access token"})
		return
	}

	tokenResponse.AccessToken = accessToken

	ctx.JSON(http.StatusOK, tokenResponse)
}

func (c *AuthController) RegisterAdmin(ctx *gin.Context) {
	var user model.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	existingUser, _ := c.service.FindOneByUsername(user.Username)
	if existingUser != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)
	user.Role = "admin"

	newUser, err := c.service.Create(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newUser)
}

func (c *AuthController) GetMe(ctx *gin.Context) {
	// Retrieve the username from the context (set by the middleware)
	username, exists := ctx.Get("username")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	usernameStr, ok := username.(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing username"})
		return
	}

	user, err := c.service.FindOneByUsername(usernameStr)
	if err != nil || user == nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}
