package model

import "time"

type Book struct {
	Isbn        string     `json:"isbn" gorm:"primary_key;size:11;unique"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	ImageURL    string     `json:"image_url"`
	Author      string     `json:"author"`
	ReleaseDate time.Time  `json:"release_date"`
	Rating      float32    `json:"rating"`
	Reviews     []Review   `json:"reviews" gorm:"foreignKey:book_isbn"`
	Categories  []Category `json:"categories" gorm:"many2many:book_categories;"`
}
