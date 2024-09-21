package repository_impl

import (
	"book-review-app/model"
	"book-review-app/repository"
	"gorm.io/gorm"
)

type CategoryRepositoryImpl struct {
	db *gorm.DB
}

func NewCategoryRepositoryImpl(db *gorm.DB) repository.CategoryRepository {
	return &CategoryRepositoryImpl{db: db}
}

func (repo CategoryRepositoryImpl) FindAll() ([]model.Category, error) {
	var categories []model.Category
	err := repo.db.Find(&categories).Error
	if err != nil {
		return nil, err
	}

	return categories, nil
}

func (repo CategoryRepositoryImpl) FindOneByName(name string) (*model.Category, error) {
	var category *model.Category
	err := repo.db.Where("name = ?", name).First(&category).Error
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (repo CategoryRepositoryImpl) Create(category model.Category) (*model.Category, error) {
	err := repo.db.Create(&category).Error
	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (repo CategoryRepositoryImpl) Delete(name string) error {
	err := repo.db.Exec("DELETE FROM book_categories WHERE category_name = ?", name).Error
	if err != nil {
		return err
	}

	var category *model.Category
	err = repo.db.Where("name = ?", name).Delete(&category).Error
	if err != nil {
		return err
	}

	return nil
}
