package com.ocena.qlsc.user.service;

import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.user.dto.*;
import com.ocena.qlsc.user.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

public interface IUserService extends BaseService<User, UserDTO> {

//    boolean createUser(RegisterRequest registerRequest);

    DataResponse<UserDTO> create(UserDTO dto);


//    ListResponse<UserDTO> getAllUser();

    DataResponse<User> login(LoginRequest loginRequest, HttpServletRequest request);

    DataResponse<User> sentOTP(String email, HttpServletRequest request);

    DataResponse<User> validateOTP(String email, Integer OTP, String newPassword);


    boolean hasDeleteUserPermission(String emailUser, String emailModifier);

    DataResponse<User> resetPassword(String email, String oldPassword, String newPassword);
}
