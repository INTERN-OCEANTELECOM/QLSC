package com.ocena.qlsc.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleDTO implements Serializable {
    private static final long serialVersionUID = 401418718908170000L;

    @NotBlank(message = "RoleId is required")
    private String id;

    private String roleName;
}
