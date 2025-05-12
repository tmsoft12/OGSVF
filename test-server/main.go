package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
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

	app.Listen(":3000")
}
