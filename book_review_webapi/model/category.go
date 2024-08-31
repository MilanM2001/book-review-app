package model

type Category struct {
	ID    uint   `json:"id" gorm:"primaryKey;unique;autoIncrement"`
	Name  string `json:"name" gorm:"unique"`
	Books []Book `gorm:"many2many:book_categories;"`
}
