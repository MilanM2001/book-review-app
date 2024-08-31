package repository_impl

import (
	"book-review-app/model"
	"book-review-app/repository"
	"gorm.io/gorm"
)

type UserRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepositoryImpl(db *gorm.DB) repository.UserRepository {
	return &UserRepositoryImpl{
		db: db,
	}
}

func (repo UserRepositoryImpl) FindAll() ([]model.User, error) {
	var users []model.User
	err := repo.db.Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (repo UserRepositoryImpl) FindOneByUsername(username string) (*model.User, error) {
	var user *model.User
	err := repo.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (repo UserRepositoryImpl) Create(user model.User) (*model.User, error) {
	err := repo.db.Create(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}
