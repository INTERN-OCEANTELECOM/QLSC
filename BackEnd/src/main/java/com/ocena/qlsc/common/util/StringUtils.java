package com.ocena.qlsc.common.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class StringUtils {
    public static String cutSubString(String str, String subStr) {
        return str.replace(subStr, "");
    }

    public static String replaceChar(String str, String oldChar, String newChar) {
        return str == null ? null : str.replace(oldChar, newChar);
    }
    public static List<String> splitWhiteSpaceToList(String input) {
        return input != null && !input.trim().equals("")
                ? Arrays.stream(input.trim().split("\\s+")).toList()
                : new ArrayList<>();
    }

    public static List<String> splitDashToList(String input) {
        List<String> resultList = new ArrayList<>();

        if (input != null) {
            String[] parts = input.trim().split("-");
            if (parts.length > 1) {
                resultList.add(parts[0] + "-" + parts[1]);
                for (int i = 2; i < parts.length; i++) {
                    resultList.add(parts[i]);
                }
            }
        }

        return resultList;
    }

    public static List<String> convertStringToList(String input) {
        List<String> stringList = new ArrayList<>();
        stringList.add(input);
        return stringList;
    }

    public static String convertValueToFormattedString(Object obj, String name) {
        if(obj == null)
            return "NOT_AVAILABLE";
        if(obj instanceof Long)
            return DateUtils.convertObjectToDateFormat(obj);
        if(obj instanceof Short)
            return EnumUtils.getEnumNameByValue(obj, name);
        return obj.toString();
    }

    public static String extractUserNameFromEmail(String email) {
        return email.substring(0, email.indexOf("@"));
    }

    public static boolean containsAlphabeticCharacters(String str) {
        return str.matches(".*[a-zA-Z].*");
    }

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }
}
