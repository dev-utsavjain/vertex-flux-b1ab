package models

import (
	"time"
	"gorm.io/gorm"
)

type Task struct {
	ID          int64          `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string         `gorm:"type:varchar(100);not null" json:"title"`
	Description string         `gorm:"type:varchar(500)" json:"description"`
	Completed   bool           `gorm:"default:false" json:"completed"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Task) TableName() string {
	return "tasks"
}
