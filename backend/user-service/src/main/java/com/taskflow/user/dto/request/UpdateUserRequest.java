package com.taskflow.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Size(max = 100)
    private String fullName;

    private String role;

    private Boolean active;
}
