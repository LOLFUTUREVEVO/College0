package com.teamf.college0.domain.chat.controller;

import com.teamf.college0.domain.chat.model.ChatRequest;
import com.teamf.college0.domain.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody ChatRequest request) {
        String reply = chatService.chat(request.getMessages());
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}