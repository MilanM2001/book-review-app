package repository_impl

import (
	"book-review-app/model"
	"book-review-app/repository"
	"gorm.io/gorm"
)

type ReviewRepositoryImpl struct {
	db *gorm.DB
}

func NewReviewRepositoryImpl(db *gorm.DB) repository.ReviewRepository {
	return &ReviewRepositoryImpl{db: db}
}

func (repo *ReviewRepositoryImpl) FindAll() ([]model.Review, error) {
	var reviews []model.Review
	err := repo.db.Find(&reviews).Error
	if err != nil {
		return nil, err
	}

	return reviews, nil
}

func (repo *ReviewRepositoryImpl) FindOneById(id uint) (*model.Review, error) {
	var review *model.Review
	err := repo.db.Where("id = ?", id).First(&review).Error
	if err != nil {
		return nil, err
	}

	return review, nil
}

func (repo *ReviewRepositoryImpl) FindByUsername(username string) ([]model.Review, error) {
	var reviews []model.Review
	err := repo.db.Where("username = ?", username).Find(&reviews).Error
	if err != nil {
		return nil, err
	}

	return reviews, nil
}

func (repo *ReviewRepositoryImpl) FindByBookIsbn(bookIsbn string) ([]model.Review, error) {
	var reviews []model.Review
	err := repo.db.Where("book_isbn = ?", bookIsbn).Find(&reviews).Error
	if err != nil {
		return nil, err
	}

	return reviews, nil
}

func (repo *ReviewRepositoryImpl) Create(review model.Review) (*model.Review, error) {
	err := repo.db.Create(&review).Error
	if err != nil {
		return nil, err
	}

	return &review, nil
}
