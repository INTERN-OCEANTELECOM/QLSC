package com.ocena.qlsc.user.service.user;

import com.ocena.qlsc.common.constants.message.StatusCode;
import com.ocena.qlsc.common.constants.message.StatusMessage;
import com.ocena.qlsc.common.error.exception.LockAccessException;
import com.ocena.qlsc.common.error.exception.ResourceNotFoundException;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseServiceAdapter;
import com.ocena.qlsc.common.util.SystemUtils;
import com.ocena.qlsc.user.dto.role.RoleResponse;
import com.ocena.qlsc.user.dto.user.UserRequest;
import com.ocena.qlsc.user.dto.user.UserResponse;
import com.ocena.qlsc.user.model.RoleUser;
import com.ocena.qlsc.common.constants.TimeConstants;
import com.ocena.qlsc.user.mapper.RoleMapper;
import com.ocena.qlsc.user.mapper.UserMapper;
import com.ocena.qlsc.user.dto.user.LoginRequest;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.model.User;
import com.ocena.qlsc.user.repository.RoleRepository;
import com.ocena.qlsc.user.repository.UserRepository;
import com.ocena.qlsc.user.util.OTPService;
import com.ocena.qlsc.user_history.service.HistoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserService extends BaseServiceAdapter<User, UserRequest, UserResponse> implements IUserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    OTPService otpService;
    @Autowired
    UserMapper userMapper;
    @Autowired
    RoleMapper roleMapper;
    @Autowired
    HistoryService historyService;
    @Override
    protected BaseRepository<User> getBaseRepository() {
        return userRepository;
    }
    @Override
    protected BaseMapper<User, UserRequest, UserResponse> getBaseMapper() {
        return userMapper;
    }

    @Override
    protected Function<String, Optional<User>> getFindByFunction() {
        return userRepository::findByEmail;
    }

    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }

    @Override
    public Logger getLogger() {
        return super.getLogger();
    }

    /**
     * Authenticates the user by checking if the provided email and password match an existing user in the database.
     * @param email
     * @param password
     * @return A UserResponse object containing the authenticated user's information,
     * or an empty UserResponse object if authentication fails.
     */
    private UserResponse isAuthenticate(String email, String password) {
        // Check if the user exists in the database based on the email
        Optional<User> isExistUser = userRepository.findByEmail(email);
        UserResponse userResponse = new UserResponse();

        // If the user exists in the database
        if(isExistUser.isPresent()) {
            User user = isExistUser.get();
            if (user.getStatus() != 2 && passwordEncoder.matches(password, user.getPassword())) {
                userResponse.setEmail(user.getEmail());
                userResponse.setStatus(user.getStatus());
                List<RoleResponse> roles = user.getRoles().stream()
                        .map(role -> roleMapper.entityToDto(role))
                        .collect(Collectors.toList());
                System.out.println(user.getRoles());
                System.out.println(roles);
                userResponse.setRemoved(user.getRemoved());
                userResponse.setRoles(roles);

                // Write History of Login
                historyService.loginHistory(email);
            }
        }
        return userResponse;
    }

    /**
     * A function that handles limiting the number of failed login attempts
     * and handling login result
     * @param session HttpSession to store session information
     * @param loginRequest
     * @return The ResponseEntity object contains the login result information
     */
    public DataResponse<UserResponse> handleLoginAttempts(HttpSession session, LoginRequest loginRequest) {
        Long lockedTime;

        // Increase the number of false logins
        Integer loginAttempts = (Integer) session.getAttribute("loginAttempts");
        if(loginAttempts == null) {
            loginAttempts = 0;
        }
        loginAttempts++;

        session.setAttribute("loginAttempts", loginAttempts);

        if(loginAttempts >= TimeConstants.LOGIN_ATTEMPTS) {
            // Set time out is 60s
            lockedTime = System.currentTimeMillis() / 1000 + TimeConstants.LOCK_TIME;
            session.setAttribute("lockedTimeLogin", lockedTime);

            // Reset false login attempts to 0
            session.setAttribute("loginAttempts", 0);

            throw new LockAccessException(lockedTime.toString());
        }

        return ResponseMapper.toDataResponseSuccess(null);
    }

    /**
     * Validates the login credentials provided by the user.
     * @return A ResponseEntity containing the validation result and response object.
     */
    public DataResponse<UserResponse> login(LoginRequest loginRequest, HttpServletRequest request) {
        HttpSession session = request.getSession();

        if (userRepository.existsByEmailAndRemoved(loginRequest.getEmail(), true)){
            return ResponseMapper.toDataResponse("", StatusCode.LOCK_ACCESS,
                    StatusMessage.LOCK_ACCESS);

        }

        // Check if the account is temporarily locked
        Long lockedTime = (Long) session.getAttribute("lockedTimeLogin");

        if (lockedTime != null) {
            /*account lockout log*/
            historyService.lockHistory(loginRequest.getEmail());
            throw new LockAccessException(lockedTime.toString());
        }
        // Authenticate the email and password
        UserResponse userResponse = isAuthenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (userResponse.getEmail() != null) {
            if (session.getAttribute("loginAttempts") != null) {
                session.setAttribute("loginAttempts", 0);
            }
            return ResponseMapper.toDataResponseSuccess(userResponse);
        } else {
            // Handle login attempts for wrong login
            return handleLoginAttempts(session, loginRequest);
        }
    }

    /**
     * Sent Email OTP
     * @param email: User's email
     * @param request: Request to be blocked when sending OTP.
     * @return ResponseEntity UserResponse
     */
    public DataResponse<String> sentOTP(String email, HttpServletRequest request) {
        HttpSession session = request.getSession();

        Long lockedTimeOTP = (Long) session.getAttribute("lockedTimeOTP");

        // Check if the lock timeout has expired
        if(lockedTimeOTP != null)  {
            if(System.currentTimeMillis() / 1000 < lockedTimeOTP) {
                return ResponseMapper.toDataResponse(lockedTimeOTP, StatusCode.LOCK_ACCESS, "Please wait for "+
                        (lockedTimeOTP - (System.currentTimeMillis() / 1000)) + " seconds and try again");
            }
            session.setAttribute("lockedTimeOTP", 0L);
        }
        // GenerateOTP and sent mail OTP
        String messageOTP = otpService.generateOtp(email);

        if (!messageOTP.equals("OTP Has Been Sent!!!")){
            return ResponseMapper.toDataResponse(messageOTP, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
        }

        // Set time out send OTP is 60s
        lockedTimeOTP = System.currentTimeMillis() / 1000 + TimeConstants.LOCK_TIME;
        session.setAttribute("lockedTimeOTP", lockedTimeOTP);

        return ResponseMapper.toDataResponseSuccess(messageOTP);

    }

    /**
     * Validate OTP When User ResetPassword
     * @param email: User's email
     * @param OTP: The OTP received by the user in the email
     * @return ResponseEntity UserResponse
     */
    public DataResponse<String> validateOTP(String email, Integer OTP, String newPassword) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user = optionalUser.get();
            if (otpService.validateOTP(email, OTP)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setStatus((short) 1);
                if (userRepository.save(user) != null) {
                    /*reset password logs*/
                    historyService.resetPassword(user.getEmail());
                    return ResponseMapper.toDataResponseSuccess(StatusMessage.REQUEST_SUCCESS);
                }
            }
            return ResponseMapper.toDataResponseSuccess(null);
        } catch (NoSuchElementException e) {
            throw new ResourceNotFoundException("Email is not correct");
        }
    }

    /**
     * Validates when delete user, A user can be deleted by an admin user, but not by a non-admin user or by themselves.
     * @param emailUser the email of the user to be deleted
     * @param emailModifier the email of the user attempting to delete the user
     * @return true if the user can be deleted by the modifier, false otherwise
     */
    public boolean hasDeleteUserPermission(String emailUser, String emailModifier) {
        // Get the list of roles associated with the user attempting to delete the user
        List<Role> listRoles = roleRepository.getRoleByEmail(emailModifier);

        // Check if the user attempting to delete the user is an admin user
        boolean isAdmin = listRoles.stream().anyMatch(role -> role.getRoleName().equals(RoleUser.ROLE_ADMIN.toString()));

        // If the modifier is an admin user and is not the same as the user to be deleted, return true
        if (isAdmin && !emailModifier.equals(emailUser)){
            /* delete user logs */
            return true;
        }

        return false;
    }

    /**
     * Resets the password of the user with the given email to the given new password, if the old password is correct.
     * @param email
     * @param oldPassword
     * @param newPassword
     * @return a DataResponse containing the updated User object and a success status code and message, or an error status
     * code and message if the user or old password is not found
     */
    public DataResponse<String> resetPassword(String email, String oldPassword, String newPassword) {
        // Check if a User object with the given email exists in the repository
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // If a User object with the given email exists, and the old password matches the User's current password,
        // update the User's password and status
        if(optionalUser.isPresent() && passwordEncoder.matches(oldPassword, optionalUser.get().getPassword())) {
            User user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setStatus((short) 1);
            if(userRepository.save(user) != null) {
                /*change password logs*/
                historyService.resetPassword(user.getEmail());
                return ResponseMapper.toDataResponseSuccess("");
            }
        }

        throw new ResourceNotFoundException("Not Found");
    }

    @Transactional
    public DataResponse<UserResponse> updateUser(String key, UserRequest userRequestDto) {
        List<User> listUser = userRepository.findAll();

        // Find the User object with the given email in the list of User objects using a stream
        // and the filter and findFirst methods
        User user = listUser.stream()
                .filter(users -> users.getEmail().equals(key))
                .findFirst()
                .orElse(null);

        // Check if the logged-in user is authorized to update the user by checking
        // if they are an admin user or the same user being updated
        boolean isUpdatedAdmin = listUser.stream()
                .filter(users -> users.getEmail().equals(SystemUtils.getCurrentEmail()))
                .findFirst()
                .map(User::getRoles)
                .orElse(Collections.emptyList())
                .stream()
                .anyMatch(role -> role.getRoleName().equals(RoleUser.ROLE_ADMIN.toString()));

        if (user != null) {
            User userRequest = getBaseMapper().dtoToEntity(userRequestDto);

            // If the logged-in user is an admin user, also update the User object's email and roles
            historyService.updateHistory(getEntityClass(), key ,user, userRequest);

            if (isUpdatedAdmin) {
                user.setEmail(userRequest.getEmail());
                user.setRoles(userRequest.getRoles());
            }
            user.setPhoneNumber(userRequest.getPhoneNumber());
            user.setFullName(userRequest.getFullName());

            return ResponseMapper.toDataResponseSuccess("Success");
        }
        throw new ResourceNotFoundException(key + " doesn't exist");
    }
}

