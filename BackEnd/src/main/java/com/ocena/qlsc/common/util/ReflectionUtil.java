package com.ocena.qlsc.common.util;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

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
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
