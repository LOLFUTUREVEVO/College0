package com.teamf.college0.utils.dtos;

import com.teamf.college0.domain.user.account.entity.UserAccount.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

public class WebDTOs {




    public static class AccountAuthFlow {

        @Data
        @NoArgsConstructor
        public static class ApprovalRequestDTO {
            private Integer id;
            private boolean approve;
            private Status status;
        }
    }
}
