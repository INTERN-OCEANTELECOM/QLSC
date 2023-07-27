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
    private static final long serialVersionUID = 536418718908170000L;

    private String fullName;

    // must have email format using @Email
    @Email(message = "Email không đúng định dạng")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^0\\d{9}$", message = "SĐT không đúng định dạng")
    private String phoneNumber;

    /* length must larger than 8 character */
    @Size(min = 8, message = "Password phải có ít nhất 8 ký tự")
    @Pattern(regexp = "^\\S*$", message = "Password phải không chứa khoảng trắng")
    private String password;

    private Short status;

    private Boolean removed;

    private List<RoleDTO> roles;
}
