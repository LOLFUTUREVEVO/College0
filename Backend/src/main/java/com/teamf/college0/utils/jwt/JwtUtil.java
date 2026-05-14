package com.teamf.college0.utils.jwt;

import com.teamf.college0.domain.user.account.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    @Autowired
    private UserAccountRepository accountRepository;
}
