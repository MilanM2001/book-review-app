package dto

import "book-review-app/model"

type UpdateBook struct {
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Categories  []model.Category `json:"categories"`
}
