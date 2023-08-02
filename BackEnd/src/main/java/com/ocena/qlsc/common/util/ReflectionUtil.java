package com.ocena.qlsc.common.util;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class ReflectionUtil {
    public static String getFieldValueByReflection(String fieldName, String classPath) {
        try {
            Class<?> clazz = Class.forName(classPath);
            Object getClass = clazz.getDeclaredConstructor().newInstance();
            Field field = clazz.getDeclaredField(fieldName);
            return (String) field.get(getClass);
        } catch (NoSuchFieldException | InvocationTargetException | InstantiationException | IllegalAccessException |
                 NoSuchMethodException | ClassNotFoundException e){
            throw new RuntimeException(e);
        }
    }

    public static Object getFieldValueByReflection(String fieldName, Object obj) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    public static Class<?> getFieldType(String fieldName, Object obj) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            return field.getType();
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
    }

    public static Method setterMethod(Class<?> clazz, String field, Class<?> parameters) {
        try {
            String setterMethod = "set" + field.substring(0, 1).toUpperCase()
                    + field.substring(1);
            Method method = clazz.getMethod(setterMethod, parameters);
            return method;
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }
}
