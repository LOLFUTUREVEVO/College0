package com.teamf.college0.domain.user.auth;

import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MemberDetailService implements UserDetailsService {

    @Autowired
    UserAccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount user = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("No member with this username."));

        return User.builder()
                .username(user.getUserName())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole())
                .disabled(false)
                .accountLocked(false)
                .build();
    }
}
