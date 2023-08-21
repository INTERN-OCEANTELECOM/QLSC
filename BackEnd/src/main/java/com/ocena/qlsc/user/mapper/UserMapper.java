package com.ocena.qlsc.user.mapper;

import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.user.dto.user.UserRequest;
import com.ocena.qlsc.user.dto.user.UserResponse;
import com.ocena.qlsc.user.model.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class UserMapper extends BaseMapperImpl<User, UserRequest, UserResponse> {
    public UserMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }


    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }

    @Override
    protected Class<UserRequest> getRequestClass() {
        return UserRequest.class;
    }

    @Override
    protected Class<UserResponse> getResponseClass() {
        return UserResponse.class;
    }
}