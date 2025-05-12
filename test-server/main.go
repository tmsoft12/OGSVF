package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

var phoneNumber = "123-456-7890" // Statik olarak bellekte saklanır

func main() {
	app := fiber.New()

	// CORS middleware (React için gerekebilir)
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusOK)
		}
		return c.Next()
	})

	// Fiber'ın yerleşik logger middleware'ini ekledik
	app.Use(logger.New())

	// GET /phone → Şu anki telefon numarasını döner
	app.Get("/phone", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"phoneNumber": phoneNumber,
		})
	})

	// POST /updatePhone → Yeni numarayı kaydeder
	app.Post("/updatePhone", func(c *fiber.Ctx) error {
		type Request struct {
			PhoneNumber string `json:"phoneNumber"`
		}

		var body Request
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Geçersiz veri",
			})
		}

		// Yeni numarayı belleğe yaz
		phoneNumber = body.PhoneNumber
		fmt.Println("Yeni numara:", phoneNumber)
		return c.JSON(fiber.Map{
			"message": "Numara başarıyla güncellendi",
		})
	})

	// POST /api/login → Giriş kontrolü
	app.Post("/api/login", func(c *fiber.Ctx) error {
		type LoginRequest struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		var body LoginRequest
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Geçersiz veri",
			})
		}

		if body.Username == "admin" && body.Password == "1234" {
			return c.JSON(fiber.Map{
				"token":   "fake-jwt-token",
				"message": "Giriş başarılı",
			})
		}

		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Kullanıcı adı veya şifre hatalı",
		})
	})

	app.Listen(":3000")
}
