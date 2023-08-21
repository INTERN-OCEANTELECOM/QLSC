package com.ocena.qlsc.user.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    /**
     * Method for sending simple e-mail message.
     */
    public String  sendSimpleMessage(String email, Integer OTP)
    {
        // Create a message to return the status
        String message;

        /*Create OTP expTime 5 minutes*/
        ZonedDateTime expTime = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).plusMinutes(5);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = expTime.format(formatter);
        System.out.println(formattedTime);

        /* Create email message*/
        String messageOTP = MessageFormat.format(
                "We have received a request to reset the password for your account.\nYour OTP is: {0}\n\nPlease enter this code on the password reset page to proceed. This code will be valid until {1}\nIf you did not request a password reset, please ignore this message and take appropriate measures to secure your account.\n\nThank you for using our service.\n\nBest regards\nOceanTelecom"
                , OTP.toString() , formattedTime);

        /* Create simpleMail*/
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject("Password Reset ");
        mailMessage.setText(messageOTP);

        try
        {
            emailSender.send(mailMessage);
            message = "OTP Has Been Sent!!!";
        }
        catch (Exception e) {
            System.out.print("Error:  "+ e);
            message = "Wrong When Sent OTP!!!";
        }
        return message;
    }
}
