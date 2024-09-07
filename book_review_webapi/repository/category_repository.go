package repository

import "book-review-app/model"

type CategoryRepository interface {
	FindAll() ([]model.Category, error)
	FindOne(ID uint) (*model.Category, error)
	Create(category model.Category) (*model.Category, error)
	FindOneByName(name string) (*model.Category, error)
}
