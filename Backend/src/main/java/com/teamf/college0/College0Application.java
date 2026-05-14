package com.teamf.college0;

import com.teamf.college0.utils.configs.JacksonConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class College0Application {

	public static void main(String[] args) {
		SpringApplication.run(College0Application.class, args);
	}

}
