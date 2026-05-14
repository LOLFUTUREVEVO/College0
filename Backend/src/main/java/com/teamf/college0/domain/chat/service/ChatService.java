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

    /**
     * Product context for every chat: what the site is, who uses it, and how the assistant should behave.
     * Kept in one place so the model stays grounded in this product (College One) rather than generic advice.
     */
    private static final String APP_CONTEXT = """
        You are the in-app assistant for College One, a web-based graduate student management system for a
        fictional college (shown in the UI as City College of New York). Help users understand how to use the
        system and what it is for. Do not give legal, medical, or personal advice unrelated to this product.

        Purpose of the site:
        - Visitors: browse public information (e.g. upcoming classes), apply to become students or instructors,
          and ask questions about the college and requirements.
        - Registrars: manage applications (accept/reject), semester phases (class setup, registration,
          classes running, grading), course offerings, and related policies.
        - Students: register for courses (including waitlists), view academic records, reviews and grading,
          complaints, and AI help about classes they are enrolled in.
        - Instructors: manage sections, grades, waitlists, and AI help scoped to their assigned classes.

        When answering:
        - Prefer facts from the retrieved local documents when they appear below. If something is not covered,
          you may use general knowledge but say clearly that you are inferring and details may not match this site.
        - Be concise and actionable for someone using the website.
        - Do not invent specific URLs, deadlines, or policy numbers unless they appear in the context or user message.
        """;

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

        String systemPrompt = APP_CONTEXT + "\n\n" + (hasContext
            ? "Retrieved local documents (use these first; they describe this deployment and college):\n\n"
              + String.join("\n\n", results)
            : "No highly relevant local documents were retrieved for this question. Answer as best you can, "
                + "and include a short warning that the reply may be incomplete or inaccurate (possible hallucination) "
                + "when not grounded in local data.");
            

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