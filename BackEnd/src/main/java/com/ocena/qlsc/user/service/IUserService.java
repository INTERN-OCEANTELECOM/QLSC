package com.ocena.qlsc.user.service;

import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.user.dto.*;
import com.ocena.qlsc.user.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface IUserService extends BaseService<User, UserDTO> {

//    boolean createUser(RegisterRequest registerRequest);

    DataResponse<UserDTO> create(UserDTO dto);

    DataResponse<UserDTO> validateRegister(UserDTO dto);

//    ListResponse<UserDTO> getAllUser();

    DataResponse<User> validateLogin(LoginRequest loginRequest, HttpServletRequest request);

    DataResponse<User> sentOTP(String email, HttpServletRequest request);

    DataResponse<User> validateOTP(String email, Integer OTP, String newPassword);


    boolean validateDeleteUser(String emailUser, String emailModifier);

    DataResponse<User> resetPassword(String email, String oldPassword, String newPassword);

    @Transactional
    DataResponse<User> updateUser(String emailUser, UserDTO userDTO);
}
