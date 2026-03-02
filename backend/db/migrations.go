package db

import (
	"backend/models"
	"log"
)

func AutoMigrate() {
	err := DB.AutoMigrate(
		&models.Task{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
}
