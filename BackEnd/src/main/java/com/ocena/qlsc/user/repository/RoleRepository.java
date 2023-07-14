package com.ocena.qlsc.user.repository;

import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.model.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoleRepository extends BaseRepository<Role> {
    @Cacheable(value = "getUserRole")
    @Query(value = "select u.roles from User u where u.email =:email")
    List<Role> getRoleByEmail(String email);

    @Query(value = "select r.id, r.roleName from Role r")
    List<Object[]> getAllRoles();

}
