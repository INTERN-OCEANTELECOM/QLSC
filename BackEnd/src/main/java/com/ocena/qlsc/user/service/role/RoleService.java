package com.ocena.qlsc.user.service.role;

import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.service.BaseServiceAdapter;
import com.ocena.qlsc.user.dto.role.RoleRequest;
import com.ocena.qlsc.user.dto.role.RoleResponse;
import com.ocena.qlsc.user.mapper.RoleMapper;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.repository.RoleRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService extends BaseServiceAdapter<Role, RoleRequest, RoleResponse> implements IRoleService {

    @Autowired
    RoleMapper roleMapper;

    @Autowired
    RoleRepository roleRepository;

    @Override
    protected BaseRepository<Role> getBaseRepository() {
        return roleRepository;
    }

    @Override
    protected BaseMapper<Role, RoleRequest, RoleResponse> getBaseMapper() {
        return roleMapper;
    }

    @Override
    protected Class<Role> getEntityClass() {
        return Role.class;
    }
    @Override
    public Logger getLogger() {
        return super.getLogger();
    }
}
