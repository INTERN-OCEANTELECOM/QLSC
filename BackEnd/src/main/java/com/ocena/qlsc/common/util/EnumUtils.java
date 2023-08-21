package com.ocena.qlsc.common.util;

import com.ocena.qlsc.podetail.enumrate.KcsVT;
import com.ocena.qlsc.podetail.enumrate.Priority;
import com.ocena.qlsc.podetail.enumrate.RepairCategory;
import com.ocena.qlsc.podetail.enumrate.RepairStatus;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class EnumUtils {
    public static String getEnumValueNameByIndex(Object obj, String name) {
        Map<String, Enum[]> enumMap = new HashMap<>();
        enumMap.put("repairCategory", RepairCategory.values());
        enumMap.put("repairStatus", RepairStatus.values());
        enumMap.put("kcsVT", KcsVT.values());
        enumMap.put("priority", Priority.values());

        if (enumMap.containsKey(name)) {
            Enum[] values = enumMap.get(name);
            if (obj instanceof Short) {
                short index = (Short) obj;
                if (index >= 0 && index < values.length) {
                    System.out.println("Index: " + index);
                    System.out.println("Enum: " + values[index].name());
                    return values[index].name();
                }
            }
        }
        return obj.toString();
    }

    public static String getEnumNameByValue(Object obj, String fieldName) {
        String enumName = fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
        System.out.println(enumName);
        try {
            Class<?> enumClass = Class.forName("com.ocena.qlsc.podetail.enumrate." + enumName);
            Method valuesMethod = enumClass.getMethod("values");
            Enum<?>[] enumValues = (Enum<?>[]) valuesMethod.invoke(null);

            for (Enum<?> enumValue : enumValues) {
                System.out.println("Vao day");
                Method getValueMethod = enumValue.getClass().getMethod("getValue");
                int enumValueValue = (int) getValueMethod.invoke(enumValue);
                System.out.println("Value: " + enumValueValue);
                if (enumValueValue == (short) obj) {
                    System.out.println("EnumValue: " + enumValue.name());;
                    return enumValue.name();
                }
            }
        } catch (ClassNotFoundException | InvocationTargetException | NoSuchMethodException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public static <T extends Enum<T>> int getIndexFromEnum(Class<T> enumClass, String value) {
        T[] values = enumClass.getEnumConstants();
        for(int i = 0; i < values.length; i++) {
            if(values[i].name().equals(value)) {
                return i;
            }
        }

        return -1;
    }
}
