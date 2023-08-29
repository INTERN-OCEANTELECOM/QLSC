package com.ocena.qlsc.user.controller;


import com.ocena.qlsc.common.annotation.ApiShow;
import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.error.exception.NotPermissionException;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.common.util.SystemUtils;
import com.ocena.qlsc.user.dto.user.LoginRequest;
import com.ocena.qlsc.user.dto.user.UserRequest;
import com.ocena.qlsc.user.dto.user.UserResponse;
import com.ocena.qlsc.user.model.User;
import com.ocena.qlsc.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/user")
//@CrossOrigin(value = "*")
@RequiredArgsConstructor
public class UserController extends BaseApiImpl<User, UserRequest, UserResponse> {
    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    protected BaseService<User, UserRequest, UserResponse> getBaseService() {
        return userService;
    }

    @PostMapping ("/login")
    @ApiShow
    public DataResponse<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        return userService.login(loginRequest, request);
    }

    @Override
    @ApiShow
    @CacheEvict(value = {"getAllUser", "getUserRole", "validateUser"}, allEntries = true)
    public DataResponse<UserResponse> update(@Valid UserRequest userRequest, String key) {
        return userService.updateUser(key, userRequest);
    }

    @Override
    @ApiShow
    @Cacheable(value = "getAllUser")
    public ListResponse<UserResponse> getAll() {
        return super.getAll();
    }

    @Override
    @ApiShow
    @CacheEvict(value = {"getAllUser", "getUserRole", "validateUser"}, allEntries = true)
    public DataResponse<UserResponse> add(@Valid UserRequest userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return super.add(userDto);
    }

    @Override
    @ApiShow
    public DataResponse<UserResponse> getById(String id) {
        return super.getById(id);
    }

    @PostMapping("/forgot-password/sent-otp")
    @ApiShow
    public DataResponse<String> SentOTP(@RequestParam String email, HttpServletRequest request) {
        return userService.sentOTP(email, request);
    }

    @PostMapping("/forgot-password/verify")
    @ApiShow
    public DataResponse<String> forgetPasswordOTP(@RequestParam String email, @RequestParam Integer OTP, @RequestParam String newPassword) {
        return userService.validateOTP(email, OTP, newPassword);
    }

    @PostMapping ("/reset-password")
    @ApiShow
    @CacheEvict(value = {"getAllUser"}, allEntries = true)
    public DataResponse<String> resetPassword(@RequestParam String oldPassword,
                                            @RequestParam String newPassword,
                                            HttpServletRequest request) {
        String email = request.getHeader("email");
        return userService.resetPassword(email, oldPassword, newPassword);
    }

    @Override
    @ApiShow
    @CacheEvict(value = {"getAllUser", "getUserRole", "validateUser"}, allEntries = true)
    public DataResponse<UserResponse> delete(String email) {
        String emailModify = SystemUtils.getCurrentEmail();
        if(!userService.hasDeleteUserPermission(email, emailModify)) {
            throw new NotPermissionException();
        }
        return super.delete(email);
    }

    @Override
    @ApiShow
    public ListResponse<User> getAllByKeyword(String keyword) {
        return super.getAllByKeyword(keyword);
    }
}
