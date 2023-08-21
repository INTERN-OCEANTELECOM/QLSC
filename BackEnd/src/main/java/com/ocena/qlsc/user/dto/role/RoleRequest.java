package com.ocena.qlsc.user.dto.role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleRequest implements Serializable {
    private static final long serialVersionUID = 401418718908170000L;
    @NotBlank(message = "RoleId is required")
    @NotNull(message = "RoleId is required")
    private String id;
}
