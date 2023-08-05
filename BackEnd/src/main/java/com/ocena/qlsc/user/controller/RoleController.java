package com.ocena.qlsc.user.controller;

import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.user.dto.RoleDTO;
import com.ocena.qlsc.user.dto.UserDTO;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.model.User;
import com.ocena.qlsc.user.service.RoleService;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@RestController
@RequestMapping(value = "/role")
//@CrossOrigin(value = "*")
public class RoleController extends BaseApiImpl<Role, RoleDTO> {
    @Autowired
    RoleService roleService;

    @Override
    protected BaseService<Role, RoleDTO> getBaseService() {
        return roleService;
    }

    @Override
    public ListResponse<RoleDTO> getAll() {
        return super.getAll();
    }

    /* User for Swagger*/

    @Override
    public DataResponse<RoleDTO> add(RoleDTO objectDTO) {
        return super.add(objectDTO);
    }

    @Hidden
    @Override
    public DataResponse<RoleDTO> update(RoleDTO objectDTO, String key) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<RoleDTO> getById(String id) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<RoleDTO> delete(String id) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<RoleDTO> getByIds(String ids) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<Role> getAllByKeyword(String keyword) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<RoleDTO> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<RoleDTO> getAllByPage(int page, int size) {
        return null;
    }
}
