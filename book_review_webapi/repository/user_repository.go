package repository

import "book-review-app/model"

type UserRepository interface {
	FindAll() ([]model.User, error)
	FindOneByUsername(username string) (*model.User, error)
	Create(user model.User) (*model.User, error)
}
