package web

import (
	"backend/handlers"
	"backend/middleware"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.ErrorHandler())

	api := r.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		handlers.RegisterRoutes(api)
	}

	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		distPath := "./dist"
		filePath := filepath.Join(distPath, path)

		if info, err := os.Stat(filePath); err == nil && !info.IsDir() {
			c.File(filePath)
			return
		}

		c.File(filepath.Join(distPath, "index.html"))
	})

	return r
}

func StartServer() {
	r := SetupRouter()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}