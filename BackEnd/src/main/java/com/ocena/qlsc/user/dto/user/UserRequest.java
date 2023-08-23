package com.ocena.qlsc.user.dto.user;

import com.ocena.qlsc.user.dto.role.RoleRequest;
import jakarta.validation.constraints.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 536418718908170000L;
    private String id;
    private String fullName;
    @Email(message = "Email không đúng định dạng")
    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    private String email;
    @Pattern(regexp = "^0\\d{9}$", message = "SĐT không đúng định dạng")
    private String phoneNumber;
    @Size(min = 8, message = "Password phải có ít nhất 8 ký tự")
    @Pattern(regexp = "^\\S*$", message = "Password phải không chứa khoảng trắng")
    private String password;
    private String status;
    private List<RoleRequest> roles;
}
