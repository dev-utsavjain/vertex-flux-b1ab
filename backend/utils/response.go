package utils

import (
	"backend/views"

	"github.com/gin-gonic/gin"
)

func SendSuccess(c *gin.Context, status int, data interface{}) {
	c.JSON(status, views.SuccessResponse{
		Success: true,
		Data:    data,
	})
}

func SendError(c *gin.Context, status int, message string) {
	c.JSON(status, views.ErrorResponse{
		Success: false,
		Error:   message,
	})
}
