package handlers

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all generated API routes
func RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/tasks", GetTasks)
	rg.POST("/tasks", CreateTask)
	rg.PUT("/tasks/:id", UpdateTask)
	rg.DELETE("/tasks/:id", DeleteTask)
}
