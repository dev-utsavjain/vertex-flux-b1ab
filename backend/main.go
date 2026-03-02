package main

import (
	"backend/db"
	"backend/web"
)

func main() {
	db.InitDB()
	db.AutoMigrate()
	web.StartServer()
}
