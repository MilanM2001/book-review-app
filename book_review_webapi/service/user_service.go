package service

import (
	"book-review-app/model"
	"book-review-app/repository"
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (service *UserService) FindAll() ([]model.User, error) {
	return service.repo.FindAll()
}

func (service *UserService) FindOneByUsername(username string) (*model.User, error) {
	return service.repo.FindOneByUsername(username)
}

func (service *UserService) Create(user model.User) (*model.User, error) {
	return service.repo.Create(user)
}
