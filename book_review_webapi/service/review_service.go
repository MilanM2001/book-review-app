package service

import (
	"book-review-app/model"
	"book-review-app/repository"
)

type ReviewService struct {
	repo repository.ReviewRepository
}

func NewReviewService(repo repository.ReviewRepository) *ReviewService {
	return &ReviewService{repo: repo}
}

func (service *ReviewService) FindAll() ([]model.Review, error) {
	return service.repo.FindAll()
}

func (service *ReviewService) FindOneById(id uint) (*model.Review, error) {
	return service.repo.FindOneById(id)
}

func (service *ReviewService) FindByUsername(username string) ([]model.Review, error) {
	return service.repo.FindByUsername(username)
}

func (service *ReviewService) FindByBookIsbn(bookIsbn string) ([]model.Review, error) {
	return service.repo.FindByBookIsbn(bookIsbn)
}

func (service *ReviewService) Create(review model.Review) (*model.Review, error) {
	return service.repo.Create(review)
}
