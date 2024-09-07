package service

import (
	"book-review-app/model"
	"book-review-app/repository"
)

type CategoryService struct {
	repo repository.CategoryRepository
}

func NewCategoryService(repo repository.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (service *CategoryService) FindAll() ([]model.Category, error) {
	return service.repo.FindAll()
}

func (service *CategoryService) FindOne(id uint) (*model.Category, error) {
	return service.repo.FindOne(id)
}

func (service *CategoryService) FindOneByName(name string) (*model.Category, error) {
	return service.repo.FindOneByName(name)
}

func (service *CategoryService) Create(category model.Category) (*model.Category, error) {
	return service.repo.Create(category)
}
