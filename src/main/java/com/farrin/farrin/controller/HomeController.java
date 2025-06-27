package com.farrin.farrin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return """
            <html>
            <head><title>Farrin Travel App</title></head>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
                <h1>🛫 Farrin Travel Companion API</h1>
                <p>Backend is running successfully!</p>
                <h3>Available Endpoints:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li>📱 <strong>Frontend:</strong> <a href="http://localhost:3000">http://localhost:3000</a></li>
                    <li>🔐 <strong>Auth:</strong> /auth/login, /auth/register</li>
                    <li>✈️ <strong>Trips:</strong> /trips</li>
                    <li>👤 <strong>Profile:</strong> /profile</li>
                    <li>🎯 <strong>Recommendations:</strong> /recommendations</li>
                </ul>
                <p><em>Visit the frontend at localhost:3000 for the full experience!</em></p>
            </body>
            </html>
            """;
    }
}