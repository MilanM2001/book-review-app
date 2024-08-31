package model

import (
	"time"
)

type Review struct {
	ID        uint `json:"id" gorm:"primaryKey;unique;autoIncrement"`
	CreatedAt time.Time
	UpdatedAt *time.Time
	Text      string `json:"text"`
	BookID    uint   `json:"book_id"`
	UserID    uint   `json:"user_id"`
}
