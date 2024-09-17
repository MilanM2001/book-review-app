package model

type User struct {
	Username string   `json:"username" gorm:"primaryKey;unique"`
	Email    string   `json:"email" gorm:"unique"`
	Password string   `json:"password"`
	Role     string   `json:"role"`
	Reviews  []Review `json:"reviews" gorm:"foreignKey:username"`
}
