package com.teamf.college0.domain.chat.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final VectorSearchService vectorSearch;

    public ChatService(VectorSearchService vectorSearch) {
        this.vectorSearch = vectorSearch;
    }

    public String chat(List<Map<String, String>> messages) {
        String latestMessage = messages.get(messages.size() - 1).get("content");

        List<String> results = vectorSearch.search(latestMessage);
        boolean hasContext = !results.isEmpty();

        String systemPrompt = hasContext
            ? "You are a helpful assistant. Use the context below to answer.\n\nContext:\n"
              + String.join("\n\n", results)
            : "You are a helpful assistant. Answer the user's question as best you can. Make sure to give a halucination warning";
            

        Client gemini = Client.builder()
            .apiKey(apiKey)
            .build();

        GenerateContentConfig config = GenerateContentConfig.builder()
            .systemInstruction(Content.fromParts(Part.fromText(systemPrompt)))
            .build();


        List<Content> history = messages.stream()
            .map(m -> Content.fromParts(Part.fromText(m.get("content")))
                .toBuilder()
                .role("user".equals(m.get("role")) ? "user" : "model")
                .build())
            .collect(Collectors.toList());


        GenerateContentResponse response = gemini.models.generateContent(
            "gemini-2.5-flash", history, config
        );

        return response.text();
    }
}