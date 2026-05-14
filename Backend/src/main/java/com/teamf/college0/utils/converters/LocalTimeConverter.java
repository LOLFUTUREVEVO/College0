package com.teamf.college0.utils;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;

@Converter(autoApply = true)
public class LocalTimeConverter implements AttributeConverter<LocalTime, String> {

    private static final DateTimeFormatter FORMATTER = new DateTimeFormatterBuilder()
            .appendOptional(DateTimeFormatter.ofPattern("HH:mm:ss"))
            .appendOptional(DateTimeFormatter.ofPattern("HH:mm"))
            .toFormatter();

    @Override
    public String convertToDatabaseColumn(LocalTime time) {
        return time == null ? null : time.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    @Override
    public LocalTime convertToEntityAttribute(String value) {
        return value == null ? null : LocalTime.parse(value, FORMATTER);
    }
}