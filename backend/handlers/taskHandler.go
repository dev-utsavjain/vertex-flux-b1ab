package handlers

import (
	"backend/db"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTasks(c *gin.Context) {
	var tasks []models.Task
	if err := db.DB.Order("created_at desc").Find(&tasks).Error; err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch tasks")
		return
	}
	utils.SendSuccess(c, http.StatusOK, tasks)
}

func CreateTask(c *gin.Context) {
	type CreateTaskRequest struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description"`
	}

	var req CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	task := models.Task{
		Title:       utils.TrimAndValidate(req.Title),
		Description: utils.TrimAndValidate(req.Description),
		Completed:   false,
	}

	if err := db.DB.Create(&task).Error; err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to create task")
		return
	}

	utils.SendSuccess(c, http.StatusCreated, task)
}

func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	type UpdateTaskRequest struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	var req UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	var task models.Task
	if err := db.DB.First(&task, id).Error; err != nil {
		utils.SendError(c, http.StatusNotFound, "Task not found")
		return
	}

	if req.Title != "" {
		task.Title = utils.TrimAndValidate(req.Title)
	}
	if req.Description != "" {
		task.Description = utils.TrimAndValidate(req.Description)
	}

	if err := db.DB.Save(&task).Error; err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to update task")
		return
	}

	utils.SendSuccess(c, http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
	id := c.Param("id")

	if err := db.DB.Delete(&models.Task{}, id).Error; err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to delete task")
		return
	}

	utils.SendSuccess(c, http.StatusOK, gin.H{
		"message": "Task deleted",
	})
}

func ToggleTask(c *gin.Context) {
	id := c.Param("id")

	var task models.Task
	if err := db.DB.First(&task, id).Error; err != nil {
		utils.SendError(c, http.StatusNotFound, "Task not found")
		return
	}

	task.Completed = !task.Completed
	if err := db.DB.Save(&task).Error; err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to toggle task")
		return
	}

	utils.SendSuccess(c, http.StatusOK, task)
}
