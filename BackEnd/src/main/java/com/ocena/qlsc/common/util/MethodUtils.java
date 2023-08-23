package com.ocena.qlsc.common.util;

import com.ocena.qlsc.common.controller.BaseApiImpl;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

public class MethodUtils {
    public static boolean isMethodOverridden(Object object, String methodName, Class<?>... parameterTypes) {
        try {
            Method method = object.getClass().getMethod(methodName, parameterTypes);
            return method.getDeclaringClass() == object.getClass();
        } catch (NoSuchMethodException e) {
            return false;
        }
    }
}
