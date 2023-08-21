package com.ocena.qlsc.common.util;

public class ObjectUtils {
    public static boolean notEqual(Object obj1, Object obj2) {
        if(obj1 == null && obj2 == null)
            return false;
        if(obj2 == null)
            return !obj1.equals(obj2);
        return !obj2.equals(obj1);
    }

    public static boolean equal(Object obj1, Object obj2) {
        if(obj1 == null && obj2 == null)
            return true;
        if(obj2 == null)
            return obj1.equals(obj2);
        return obj2.equals(obj1);
    }
}
