package main

import (
	"book-review-app/config"
	"book-review-app/controller"
	"book-review-app/repository/repository_impl"
	"book-review-app/routes"
	"book-review-app/service"
	"errors"
	"golang.org/x/net/context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	db := config.ConnectDatabase()

	userRepo := repository_impl.NewUserRepositoryImpl(db)
	bookRepo := repository_impl.NewBookRepositoryImpl(db)

	userService := service.NewUserService(userRepo)
	bookService := service.NewBookService(bookRepo)

	authController := controller.NewAuthController(userService)
	userController := controller.NewUserController(userService)
	bookController := controller.NewBookController(bookService)

	// Setup routes
	router := routes.SetupRouter(authController, userController, bookController)

	// Create an HTTP server with the Gin router
	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	// Channel to listen for OS interrupt signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Run the server in a goroutine to allow the main thread to listen for shutdown signals
	go func() {
		err := srv.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	log.Println("Server is running on http://localhost:8080")

	// Wait for a signal to initiate a graceful shutdown
	<-quit
	log.Println("Shutting down server...")

	// Create a deadline for the graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Attempt to gracefully shutdown the server
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}
