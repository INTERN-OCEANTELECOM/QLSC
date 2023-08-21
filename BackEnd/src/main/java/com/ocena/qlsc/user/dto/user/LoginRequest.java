package com.ocena.qlsc.user.dto.user;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must have size larger than 8 character")
    @Pattern(regexp = "^\\S*$", message = "Password must no whitespace")
    private String password;
}
