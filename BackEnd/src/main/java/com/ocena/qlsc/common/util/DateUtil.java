package com.ocena.qlsc.common.util;

import com.ocena.qlsc.podetail.enums.KSCVT;
import com.ocena.qlsc.podetail.enums.Priority;
import com.ocena.qlsc.podetail.enums.RepairCategory;
import com.ocena.qlsc.podetail.enums.RepairStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

public class DateUtil {
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    public static String convertObjectToDateFormat(Object obj, String name){
        if(obj == null)
            return "null";
        if(obj instanceof Long && (Long) obj > 900000000000L) {
            LocalDate date = Instant.ofEpochMilli((Long) obj).atZone(ZoneId.systemDefault()).toLocalDate();
            return date.format(formatter);
        }

        Map<String, Enum[]> enumMap = new HashMap<>();
        enumMap.put("repairCategory", RepairCategory.values());
        enumMap.put("repairStatus", RepairStatus.values());
        enumMap.put("kcsVT", KSCVT.values());
        enumMap.put("priority", Priority.values());

        if (enumMap.containsKey(name)) {
            Enum[] values = enumMap.get(name);
            if (obj instanceof Short) {
                short index = (Short) obj;
                if (index >= 0 && index < values.length) {
                    return values[index].name();
                }
            }
        }

        return obj.toString();
    }
}
