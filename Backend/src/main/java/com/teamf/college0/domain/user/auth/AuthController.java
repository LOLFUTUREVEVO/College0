package com.teamf.college0.domain.user.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import com.teamf.college0.utils.dtos.WebDTOs;
import com.teamf.college0.utils.dtos.WebDTOs.AuthResponseDTO;
import com.teamf.college0.utils.jwt.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private UserAccountRepository accountRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody WebDTOs.LoginDTO dto) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getUsername(),
                            dto.getPassword()
                    )
            );
            logger.info("GOT PAST AUTH READ!");
            UserAccount authAccount = accountRepository.findByUserName(dto.getUsername())
                    .orElseThrow(() -> new RuntimeException("Member not found")
                    );

            String token = jwtUtil.generateToken(authAccount);

            AuthResponseDTO response = new AuthResponseDTO();
            response.setToken(token);
            response.setUsername(authAccount.getUserName());
            response.setRole(authAccount.getRole());
            response.setUserId(authAccount.getUserId());
            response.setStatus(authAccount.getStatus());

            return ResponseEntity.ok(response);
        }

        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }


}
