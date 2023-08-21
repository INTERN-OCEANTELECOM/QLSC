package com.ocena.qlsc.common.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Calendar;
import java.util.TimeZone;

public class SystemUtils {
    public static String getCurrentEmail() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (requestAttributes != null) {
            HttpServletRequest request = requestAttributes.getRequest();
            return request.getHeader("email");
        }
        return null;
    }

    public static Long getCurrentTime(){
        return Calendar.getInstance(TimeZone.getTimeZone("GMT+7")).getTimeInMillis();
    }
}
