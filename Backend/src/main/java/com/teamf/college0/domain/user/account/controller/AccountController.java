package com.teamf.college0.domain.user.account.controller;


import com.teamf.college0.domain.user.account.entity.UserAccount.Role;
import com.teamf.college0.domain.user.account.service.AccountApprovalService;
import com.teamf.college0.utils.dtos.WebDTOs;
import com.teamf.college0.utils.dtos.WebDTOs.AccountAuthFlow.ApprovalRequestDTO;
import com.teamf.college0.utils.dtos.WebDTOs.AccountAuthFlow.ApprovedResultDTO;
import com.teamf.college0.utils.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("registrar/accounts")
public class AccountController {
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AccountApprovalService accountApprovalService;

    @PatchMapping("/process/approve")
    public ResponseEntity<?> processAccount(HttpServletRequest request, @RequestBody ApprovalRequestDTO requestDTO) {
        try {
            String token = jwtUtil.extractAndValidateToken(request);

            Role role = jwtUtil.extractRole(token);
            boolean isAdmin = Role.REGISTRAR.equals(role);

            if(!isAdmin) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            ApprovedResultDTO result = accountApprovalService.processApprovalRequest(requestDTO, jwtUtil.extractUsername(token));
            return ResponseEntity.ok(result);
        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Invalid Token: " + e.getMessage());
        }
    }


}
