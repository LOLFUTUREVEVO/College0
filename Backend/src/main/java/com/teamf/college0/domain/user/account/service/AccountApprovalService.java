package com.teamf.college0.domain.user.account.service;

import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import com.teamf.college0.domain.user.account.entity.UserAccount.Role;
import com.teamf.college0.domain.user.account.entity.UserAccount.Status;
import com.teamf.college0.utils.dtos.WebDTOs.AccountAuthFlow.ApprovalRequestDTO;
import com.teamf.college0.utils.dtos.WebDTOs.AccountAuthFlow.ApprovedResultDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public ApprovedResultDTO processApprovalRequest(ApprovalRequestDTO  request, String adminUsername) {
        UserAccount acc = accountRepository.findById(request.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account Not Found!"));

        if(acc.getRole() == UserAccount.Role.REGISTRAR)  {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot Process admins"
            );
        }
        if(acc.getStatus() != Status.PENDING_APPLICATION) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot process an account not pending approval!"
            );
        }


        ApprovedResultDTO result = new ApprovedResultDTO();
        if(request.isApprove()) {
            acc.setStatus(Status.APPROVED);
            acc.setMember(true);

            accountRepository.save(acc);
            result.setApprove(true);
            result.setId(acc.getUserId());
            result.setNewStatus(Status.APPROVED);

        } else {
            acc.setStatus(Status.REJECTED);
            acc.setMember(false);
            accountRepository.save(acc);

            result.setApprove(false);
            result.setId(acc.getUserId());
            result.setNewStatus(Status.REJECTED);
        }

        return result;

    }



}
