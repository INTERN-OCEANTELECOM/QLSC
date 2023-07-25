package com.ocena.qlsc.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO implements Serializable {
    private String fullName;

    // must have email format using @Email
    @Email(message = "Email không đúng định dạng")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^0\\d{9}$", message = "SĐT không đúng định dạng")
    private String phoneNumber;

    /* length must larger than 8 character */
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^\\S*$", message = "Password must no whitespace")
    private String password;

    private Short status;

    private Boolean removed;

    private List<RoleDTO> roles;

    public UserDTO(String fullName, String email, String phoneNumber, String password) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}
