package handlers

import (
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	utils.SendSuccess(c, http.StatusOK, gin.H{
		"status": "ok",
	})
}
