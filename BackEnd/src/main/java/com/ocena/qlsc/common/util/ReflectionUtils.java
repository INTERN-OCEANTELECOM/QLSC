package com.ocena.qlsc.common.util;

import com.ocena.qlsc.common.constants.FieldsNameConstants;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;

public class ReflectionUtils {
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

    public static boolean isComplexType(Class<?> clazz) {
        return (clazz.getTypeName().startsWith("com.") && !clazz.isEnum())
                || clazz.getTypeName().startsWith("java.util");
    }

    public static String getVietNameseFieldName(String fieldName, String className) {
        return ((HashMap<String, String>) ReflectionUtils
                .getFieldValueByReflection(className + "_FIELDS_MAP", new FieldsNameConstants()))
                .get(fieldName);

        // this.getClass().getSimpleName().toUpperCase()
    }
}
