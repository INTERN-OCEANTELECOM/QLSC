package com.ocena.qlsc.user.util;

import com.ocena.qlsc.user.repository.UserRepository;
import com.ocena.qlsc.user.util.EmailService;
import com.ocena.qlsc.user.util.OTPGenerator;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OTPService {
    private OTPGenerator otpGenerator;
    private EmailService emailService;
    private UserRepository userRepository;

    /**
     * Constructor dependency injector
     *
     * @param otpGenerator - otpGenerator dependency
     * @param emailService - email service dependency
     * @param userRepository  - user repository dependency
     */
    public OTPService(OTPGenerator otpGenerator, EmailService emailService, UserRepository userRepository) {
        this.otpGenerator = otpGenerator;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    /**
     * Method for generate OTP number
     *
     * @param email - provided key (username in this case)
     * @return String message
     */
    public String generateOtp(String email) {

        // Create a message to return the status
        String message;

        try {
            // fetch user e-mail from database
            List<Object[]> listUser = userRepository.existsByEmail(email);

            if (!listUser.isEmpty()) {
                // generate otp
                Integer otpValue = otpGenerator.generateOTP(email);

                // send generated e-mail
                message = emailService.sendSimpleMessage(email, otpValue);
            } else {
                message = "Email not Found";
            }
        } catch (Exception e) {
            message = "An error occurred while generating and sending OTP";
        }
        return message;
    }

    /**
     * Method for validating provided OTP
     *
     * @param key       - provided key
     * @param otpNumber - provided OTP number
     * @return String message
     */
    public boolean validateOTP(String key, Integer otpNumber) {
        // Create a message to return the status
        String message = "Invalid OTP";
        boolean isValid = false;

        try {
            // get OTP from cache
            Integer cacheOTP = otpGenerator.getOPTByKey(key);
            if (cacheOTP != null && cacheOTP.equals(otpNumber)) {
                otpGenerator.clearOTPFromCache(key);
                isValid = true;
            }
        } catch (Exception e) {
            isValid = false;
        }
        return isValid;
    }
}
