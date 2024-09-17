package model

import (
	"time"
)

type Review struct {
	ID        uint      `json:"id" gorm:"primaryKey;unique;autoIncrement"`
	CreatedAt time.Time `json:"created_at"`
	Title     string    `json:"title"`
	Text      string    `json:"text"`
	Rating    float32   `json:"rating"`
	BookISBN  string    `json:"book_isbn" gorm:"not null"`
	Username  string    `json:"username" gorm:"not null"`
}
