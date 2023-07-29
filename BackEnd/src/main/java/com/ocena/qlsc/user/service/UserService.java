package com.ocena.qlsc.user.service;

import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseServiceImpl;
import com.ocena.qlsc.user.model.RoleUser;
import com.ocena.qlsc.user.util.TimeConstants;
import com.ocena.qlsc.user.mapper.RoleMapper;
import com.ocena.qlsc.user.mapper.UserMapper;
import com.ocena.qlsc.user.dto.LoginRequest;
import com.ocena.qlsc.user.dto.RoleDTO;
import com.ocena.qlsc.user.dto.UserDTO;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.model.User;
import com.ocena.qlsc.user.repository.RoleRepository;
import com.ocena.qlsc.user.repository.UserRepository;
import com.ocena.qlsc.user.util.OTPService;
import com.ocena.qlsc.user_history.enums.Action;
import com.ocena.qlsc.user_history.enums.ObjectName;
import com.ocena.qlsc.user_history.model.History;
import com.ocena.qlsc.user_history.model.HistoryDescription;
import com.ocena.qlsc.user_history.service.HistoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserService extends BaseServiceImpl<User, UserDTO> implements IUserService {
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
    History history;
    @Override
    protected BaseRepository<User> getBaseRepository() {
        return userRepository;
    }
    @Override
    protected BaseMapper<User, UserDTO> getBaseMapper() {
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
    protected Page<User> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        return null;
    }
    @Override
    protected List<User> getListSearchResults(String keyword) {
        return null;
    }

    /**
     * Authenticates the user by checking if the provided email and password match an existing user in the database.
     * @param email
     * @param password
     * @return A UserResponse object containing the authenticated user's information,
     * or an empty UserResponse object if authentication fails.
     */
    private UserDTO isAuthenticate(String email, String password) {
        // Check if the user exists in the database based on the email
        Optional<User> isExistUser = userRepository.findByEmail(email);
        UserDTO userResponse = new UserDTO();

        // If the user exists in the database
        if(isExistUser.isPresent()) {
            User user = isExistUser.get();
            if (user.getStatus() != 2 && passwordEncoder.matches(password, user.getPassword())) {
                userResponse.setEmail(user.getEmail());
                userResponse.setStatus(user.getStatus());
                List<RoleDTO> roles = user.getRoles().stream()
                        .map(role -> roleMapper.entityToDto(role))
                        .collect(Collectors.toList());
                userResponse.setRemoved(user.getRemoved());
                userResponse.setRoles(roles);

                /*account login success logs*/
                historyService.save(Action.LOGIN.getValue(), null, "Đăng Nhập Thành Công", email);
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
    public DataResponse<User> handleLoginAttempts(HttpSession session, LoginRequest loginRequest) {
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

            return ResponseMapper.toDataResponse(lockedTime, StatusCode.DATA_NOT_FOUND,
                    StatusMessage.LOCK_ACCESS);
        }

        return ResponseMapper.toDataResponse("", StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    }

    /**
     * Validates the login credentials provided by the user.
     * @return A ResponseEntity containing the validation result and response object.
     */
    @Override
    public DataResponse<User> login(LoginRequest loginRequest, HttpServletRequest request) {
        HttpSession session = request.getSession();

        if (userRepository.existsByEmailAndRemoved(loginRequest.getEmail(), true)){
            return ResponseMapper.toDataResponse("", StatusCode.LOCK_ACCESS,
                    StatusMessage.LOCK_ACCESS);
        }

        // Check if the account is temporarily locked
        Long lockedTime = (Long) session.getAttribute("lockedTimeLogin");

        if (lockedTime != null) {
            /*account lockout log*/
            historyService.save(Action.LOGIN.getValue(), null, "Tài Khoản Bị Tạm Khóa 60s", loginRequest.getEmail());

            return ResponseMapper.toDataResponse(lockedTime, StatusCode.LOCK_ACCESS,
                    StatusMessage.LOCK_ACCESS);
        }
        // Authenticate the email and password
        UserDTO userDTO = isAuthenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (userDTO.getEmail() != null) {
            if (session.getAttribute("loginAttempts") != null) {
                session.setAttribute("loginAttempts", 0);
            }
            return ResponseMapper.toDataResponseSuccess(userDTO);
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
    @Override
    public DataResponse<User> sentOTP(String email, HttpServletRequest request) {
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

        if (messageOTP.equals("OTP Has Been Sent!!!")){
            // Set time out send OTP is 60s
            lockedTimeOTP = System.currentTimeMillis() / 1000 + TimeConstants.LOCK_TIME;
            session.setAttribute("lockedTimeOTP", lockedTimeOTP);

            return ResponseMapper.toDataResponseSuccess(messageOTP);
        }

        return ResponseMapper.toDataResponse(messageOTP, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    }

    /**
     * Validate OTP When User ResetPassword
     * @param email: User's email
     * @param OTP: The OTP received by the user in the email
     * @return ResponseEntity UserResponse
     */
    @Override
    public DataResponse<User> validateOTP(String email, Integer OTP, String newPassword) {
        String message = "An error occurred while validating OTP";

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (otpService.validateOTP(email, OTP)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setStatus((short) 1);
                if (userRepository.save(user) != null) {
                    /*reset password logs*/
                    historyService.save(Action.RESET_PASSWORD.getValue(), ObjectName.User, "", user.getEmail());

                    return ResponseMapper.toDataResponseSuccess(StatusMessage.REQUEST_SUCCESS);
                }
            }
        } else {
            message = "Email is not correct";
        }

        return ResponseMapper.toDataResponse(null, StatusCode.DATA_NOT_MAP, message);
    }

    /**
     * Validates when delete user, A user can be deleted by an admin user, but not by a non-admin user or by themselves.
     * @param emailUser the email of the user to be deleted
     * @param emailModifier the email of the user attempting to delete the user
     * @return true if the user can be deleted by the modifier, false otherwise
     */
    @Override
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
    @Override
    public DataResponse<User> resetPassword(String email, String oldPassword, String newPassword) {
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
                historyService.save(Action.RESET_PASSWORD.getValue(), ObjectName.User, "", user.getEmail());

                return ResponseMapper.toDataResponseSuccess("");
            }
        }

        return ResponseMapper.toDataResponse(null, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    /**
     * Updates the user with the given email with the information provided in the given UserDTO object,
     * if the logged-in user is an admin user
     * @param emailUser the email of the user to update
     * @param userDTO a UserDTO object containing the updated user information
     * @return
     */
    @Transactional
    public DataResponse<User> updateUser(String emailUser, UserDTO userDTO) {
        List<User> listUser = userRepository.findAll();

        // Find the User object with the given email in the list of User objects using a stream
        // and the filter and findFirst methods
        User user = listUser.stream()
                .filter(users -> users.getEmail().equals(emailUser))
                .findFirst()
                .orElse(null);

        // Get the email of the logged-in user using the ServletRequestAttributes and HttpServletRequest objects
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        String email = request.getHeader("email");

        // Check if the logged-in user is authorized to update the user by checking
        // if they are an admin user or the same user being updated
        boolean isUpdatedAdmin = listUser.stream()
                .filter(users -> users.getEmail().equals(email))
                .findFirst()
                .map(User::getRoles)
                .orElse(Collections.emptyList())
                .stream()
                .anyMatch(role -> role.getRoleName().equals(RoleUser.ROLE_ADMIN.toString()));

        if (user != null) {
            User userRequest = getBaseMapper().dtoToEntity(userDTO);

            // If the logged-in user is an admin user, also update the User object's email and roles
            HistoryDescription description = new HistoryDescription();
            String descriptionDetails = user.compare(userRequest, Action.EDIT, description);
            if(!descriptionDetails.equals("")) {
                description.setKey(userDTO.getEmail());
                description.setDetails(descriptionDetails);
            }
            historyService.save(Action.EDIT.getValue(), ObjectName.User, description.getDescription(), "");

            if (isUpdatedAdmin) {
                user.setEmail(userRequest.getEmail());
                user.setRoles(userRequest.getRoles());
            }
            user.setPhoneNumber(userRequest.getPhoneNumber());
            user.setFullName(userRequest.getFullName());

            return ResponseMapper.toDataResponseSuccess("");
        }

        return ResponseMapper.toDataResponse(null, StatusCode.NOT_IMPLEMENTED, StatusMessage.NOT_IMPLEMENTED);
    }
}

