package com.teamf.college0.utils.dtos;

import com.teamf.college0.domain.user.account.entity.UserAccount;
import com.teamf.college0.domain.user.account.entity.UserAccount.Role;
import com.teamf.college0.domain.user.account.entity.UserAccount.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

public class WebDTOs {


    @Data
    @NoArgsConstructor
    public static class LoginDTO {
        private String username;
        private String password;
    }

    @Data
    @NoArgsConstructor
    public static class AuthResponseDTO {
        private String token;
        private String username;
        private UserAccount.Role role;
        private Integer userId;
        //Stuff for approval
        private Status status;
    }

    public static class AccountAuthFlow {

        @Data
        @NoArgsConstructor
        public static class ApprovalRequestDTO {
            private Integer id;
            private boolean approve;
            private Status status;
        }

        @Data
        @NoArgsConstructor
        public static class ApprovedResultDTO {
            private Integer id;
            private boolean approve;
            private Status newStatus;
        }

    }
}
