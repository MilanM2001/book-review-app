package utils

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

func CorsConfiguration() cors.Config {
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "UPDATE"}
	corsConfig.AllowHeaders = []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With", "user-agent"}
	corsConfig.ExposeHeaders = []string{"Content-Length"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 12 * time.Hour

	return corsConfig
}

func SetupLogger() (*zap.Logger, error) {
	logger, err := zap.NewProduction()
	if err != nil {
		return nil, err
	}
	return logger, nil
}

func SaveImageLocally(ctx *gin.Context, file *multipart.FileHeader) (string, error) {
	// Specify the directory to store images
	dir := "D:\\Projects\\book_review_project\\book_review_webapp\\public\\images"

	// Create the directory to store images if it doesn't exist
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		return "", err
	}

	// Generate a file path for the image (e.g., images/filename.ext)
	filePath := filepath.Join(dir, file.Filename)

	// Save the file to the local filesystem using Gin's ctx.SaveUploadedFile method
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		return "", err
	}

	return filePath, nil
}
