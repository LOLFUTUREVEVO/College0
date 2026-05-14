package com.teamf.college0.domain.chat.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VectorSearchService {

    private final JdbcTemplate jdbc;

    public VectorSearchService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<String> search(String query) {
        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT content, embedding FROM documents"
        );

        float[] queryEmbedding = embed(query);

        return rows.stream()
            .map(row -> {
                float[] stored = parseEmbedding((String) row.get("embedding"));
                double score = cosineSimilarity(queryEmbedding, stored);
                return Map.entry((String) row.get("content"), score);
            })
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .limit(3)
            .filter(e -> e.getValue() > 0.7)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    private float[] embed(String text) {
        return new float[]{};
    }

    private float[] parseEmbedding(String json) {
        return new float[]{};
    }

    private double cosineSimilarity(float[] a, float[] b) {
        if (a.length == 0 || b.length == 0) return 0;
        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}