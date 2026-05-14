package com.teamf.college0.domain.user.account.service;

import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import com.teamf.college0.domain.user.account.entity.UserAccount.Status;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AccountApprovalService {
    @Autowired
    private UserAccountRepository accountRepository;


    public List<UserAccount> getPendingAccounts() {
        return accountRepository.findByStatus(Status.PENDING_APPLICATION);
    }

    public Optional<UserAccount> getPendingAccount(Integer id) {
        return accountRepository.findById(id);
    }





}
