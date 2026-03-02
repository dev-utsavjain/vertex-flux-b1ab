package middleware

import (
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			utils.SendError(c, http.StatusInternalServerError, err.Error())
		}
	}
}
