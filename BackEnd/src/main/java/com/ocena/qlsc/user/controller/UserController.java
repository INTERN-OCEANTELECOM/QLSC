package com.ocena.qlsc.user.controller;


import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.user.dto.*;
import com.ocena.qlsc.user.model.User;
import com.ocena.qlsc.user.service.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@RestController
@RequestMapping(value = "/user")
//@CrossOrigin(value = "*")
@RequiredArgsConstructor
public class UserController extends BaseApiImpl<User, UserDTO> {
    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    protected BaseService<User, UserDTO> getBaseService() {
        return userService;
    }

    @PostMapping ("/login")
    public DataResponse<User> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        return userService.validateLogin(loginRequest, request);
    }

    @PutMapping ("/update")
    @CacheEvict(value = {"getAllUser", "getUserRole", "validateUser"}, allEntries = true)
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    public DataResponse<User> updateUser(@RequestParam String email,
                                         @RequestBody UserDTO userDTO) {
        return userService.updateUser(email, userDTO);
    }

    @Override
    @Cacheable(value = "getAllUser")
    public ListResponse<UserDTO> getAll() {
        System.out.println("Save entry");
        return super.getAll();
    }

    @Override
    @CacheEvict(value = {"getAllUser", "getUserRole", "validateUser"}, allEntries = true)
    public DataResponse<UserDTO> add(UserDTO objectDTO) {
        objectDTO.setPassword(passwordEncoder.encode(objectDTO.getPassword()));
        return super.add(objectDTO);
    }

    @Override
    public DataResponse<UserDTO> getById(String id) {
        return super.getById(id);
    }

    @PostMapping("/forgot-password/sent-otp")
    public DataResponse<User> SentOTP(@RequestParam String email, HttpServletRequest request) {
        return userService.sentOTP(email, request);
    }

    @PostMapping("/forgot-password/verify")
    public DataResponse<User> forgetPasswordOTP(@RequestParam String email, @RequestParam Integer OTP, @RequestParam String newPassword) {
        return userService.validateOTP(email, OTP, newPassword);
    }

    @PostMapping ("/reset-password")
    @CacheEvict(value = {"getAllUser"}, allEntries = true)
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    public DataResponse<User> resetPassword(@RequestParam String oldPassword,
                                            @RequestParam String newPassword,
                                            HttpServletRequest request) {
        String email = request.getHeader("email");
        return userService.resetPassword(email, oldPassword, newPassword);
    }

    @Override
    @CacheEvict(value = {"getAllUser", "getUserRole", "validateUser"}, allEntries = true)
    public DataResponse<UserDTO> delete(String email) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String emailHeader = request.getHeader("email");
        System.out.println(emailHeader);
        return userService.validateDeleteUser(email, emailHeader) ? super.delete(email) :
                ResponseMapper.toDataResponse("", StatusCode.NOT_IMPLEMENTED, StatusMessage.NOT_IMPLEMENTED);
    }

    @Override
    public ListResponse<User> getAllByKeyword(String keyword) {
        return super.getAllByKeyword(keyword);
    }
}
