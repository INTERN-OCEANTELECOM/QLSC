package com.ocena.qlsc.user.dto.role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 444418718908L;
    private String id;
    private String roleName;
    @Override
    public String toString() {
        return "RoleResponse{" +
                "id='" + id + '\'' +
                ", roleName='" + roleName + '\'' +
                '}';
    }
}
