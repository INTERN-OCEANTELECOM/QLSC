package com.ocena.qlsc.user.model;

import com.ocena.qlsc.common.model.BaseModel;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "role")
public class Role extends BaseModel implements Serializable {

    private static final long serialVersionUID = 1234567891L;

    @Column(name = "role_name", length = 30, nullable = false)
    private String roleName;

    /*  0. new user
        1. updated user
        2. delete user  */
    /** mapped to the "user_role" table in the database.
     * The "joinColumns" attribute specifies the foreign key column in the "user_role" table
     that references the "role_id" column in the "role" table.
     * The "inverseJoinColumns" attribute specifies the foreign key column in the "user_role" table
     that references the "user_id" column in the "user" table.
     */
    @ManyToMany
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"))
    private List<User> users;
}