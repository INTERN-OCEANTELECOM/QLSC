package com.ocena.qlsc.common.constants;

public interface TimeConstants {
    public static final int LOGIN_ATTEMPTS = 4;
    public static final int LOCK_TIME = 60;
    public static final int PO_UPDATE_TIME = 86400000; // 24 hours
    public static final Long REPAIR_HISTORY_LIMIT_TIME = 7776000000L; // 90 Days
    public static final String MESSAGE_SUCCESS_OTP = "OTP Has Been Sent!!!";
}