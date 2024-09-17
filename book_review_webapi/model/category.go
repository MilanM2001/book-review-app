package model

type Category struct {
	Name  string `json:"name" gorm:"primaryKey;unique"`
	Books []Book `gorm:"many2many:book_categories;"`
}
