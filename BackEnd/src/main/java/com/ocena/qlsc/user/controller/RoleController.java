package com.ocena.qlsc.user.controller;

import com.ocena.qlsc.common.annotation.ApiShow;
import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.user.dto.role.RoleRequest;
import com.ocena.qlsc.user.dto.role.RoleResponse;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/role")
//@CrossOrigin(value = "*")
public class RoleController extends BaseApiImpl<Role, RoleRequest, RoleResponse> {
    @Autowired
    RoleService roleService;

    @Override
    protected BaseService<Role, RoleRequest, RoleResponse> getBaseService() {
        return roleService;
    }

    @Override
    @ApiShow
    public ListResponse<RoleResponse> getAll() {
        return super.getAll();
    }

    @Override
    @ApiShow
    public DataResponse<RoleResponse> add(RoleRequest roleRequest) {
        return super.add(roleRequest);
    }
}
