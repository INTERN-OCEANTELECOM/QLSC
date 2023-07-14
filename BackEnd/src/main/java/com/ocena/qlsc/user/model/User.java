package com.ocena.qlsc.user.model;

import com.ocena.qlsc.common.model.BaseModel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
public class User extends BaseModel {

    @Column(length = 250)
    private String password;

    @Column(length = 140, nullable = false, unique = true)
    private String email;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    /*  0. new user
        1. updated user
        2. delete user  */
    private Short status;

    /**
     * A many-to-many relationship between the User and Role entities.
     relationship, which is mapped to the "user_role" table in the database.
     * The "joinColumns" attribute references the "user_id" column in the "user" table.
     * The "inverseJoinColumns" attribute references the "role_id" column in the "role" table.
     */
    @ManyToMany
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles;

    @Override
    public String toString() {
        return "User{" +
                "password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", status=" + status +
                ", roles=" + roles +
                '}';
    }
}
