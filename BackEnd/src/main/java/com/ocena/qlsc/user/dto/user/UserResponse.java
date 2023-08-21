package com.ocena.qlsc.user.dto.user;

import com.ocena.qlsc.user.dto.role.RoleResponse;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 555518718908L;
    private String id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String password;
    private Short status;
    private Boolean removed;
    private List<RoleResponse> roles;
}
