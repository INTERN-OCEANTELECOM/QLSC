package com.ocena.qlsc.podetail.status;

import java.util.*;

public final class RegexConstants {
    public static final String regexRepairCategory = "(?i)\\s*H(?:[ẠA]|\\p{L})NG\\s*M(?:[ỤU]|\\p{L})C\\s*SC\\s*";

    public static final String regexSerialNumber = "(?i)\\s*S(?:[ỐÔÔ]|\\p{L})\\s*SERIAL\\s*";

    public static final String regexProduct = "(?i)\\s*M(?:[ÃA]|\\p{L})\\s*H(?:[ÀA]|\\p{L})NG\\s*H(?:[Ó]|\\p{L})A\\s*";

    public static final String regexPo = "(?i)\\s*S(?:[ỐÔO]|\\p{L})\\s*PO\\s*";

    public static final String regexBbbgNumberImport = "(?i)\\s*S(?:[ỐÔO]|\\p{L})\\s*BBNK\\s*";

    public static final String regexImportDate = "(?i)\\s*NG(?:[ÀA]|\\p{L})Y\\s*NH(?:[ÂAẬ]|\\p{L})P\\s*KH(?:[OÔ]|\\p{L})\\s*";

    public static final String regexRepairStatus = "(?i)\\s*C(?:[ẬAÂ]|\\p{L})P\\s*NH(?:[ÂAẬ]|\\p{L})T\\s*SC\\s*";

    public static final String regexProductName = "(?i)\\s*T(?:[ÊE]|\\p{L})N\\s*THI(?:[ÊEẾ]|\\p{L})T\\s*B(?:[ỊI]|\\p{L})\\s*";

    public static final String regexExportPartner = "(?i)\\s*C(?:[ẬAÂ]|\\p{L})P\\s*NH(?:[ÂAẬ]|\\p{L})T\\s*XK\\s*";

    public static final String regexKcsVT = "(?i)\\s*C(?:[ẬAÂ]|\\p{L})P\\s*NH(?:[ÂAẬ]|\\p{L})T\\s*KCS\\s*";

    public static final String regexWarrantyPeriod = "(?i)\\s*C(?:[ẬAÂ]|\\p{L})P\\s*NH(?:[ÂAẬ]|\\p{L})T\\s*BH\\s*";

    public static final String regexPriority = "(?i)\\s*(?:ƯU]|\\p{L})U\\s*TI(?:[EÊ]|\\p{L})N\\s*SC\\s*";

    public static final String regexBbbgNumberExport = "(?i)\\s*S(?:[ỐÔO]|\\p{L})\\s*BBXK\\s*";

    public static final HashMap<Integer, String> importPOHeader = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
        }
    };

    public static final HashMap<Integer, String> repairStatusMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexRepairStatus);
        }
    };

    public static final HashMap<Integer, String> exportPartnerMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexExportPartner);
            put(4, regexBbbgNumberExport);
        }
    };

    public static final HashMap<Integer, String> kcsVTMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexKcsVT);
        }
    };

    public static final HashMap<Integer, String> warrantyPeriodMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexWarrantyPeriod);
        }
    };

    public static final HashMap<Integer, String> priorityMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexPriority);
        }
    };

    public static final HashMap<Integer, String> repairCategoryMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexRepairCategory);
        }
    };

    public static final HashMap<Integer, String> importDateMap = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexSerialNumber);
            put(2, regexPo);
            put(3, regexImportDate);
        }
    };

//    public static final HashMap<Integer, String> bbbgNumberImportMap = new HashMap<>() {
//        {
//            put(0, regexProduct);
//            put(1, regexSerialNumber);
//            put(2, regexPo);
//            put(3, regexBbbgNumberImport);
//        }
//    };

//    public static final HashMap<Integer, String> bbbgNumberExportMap = new HashMap<>() {
//        {
//            put(0, regexProduct);
//            put(1, regexSerialNumber);
//            put(2, regexPo);
//            put(3, regexBbbgNumberExport);
//        }
//    };

    public static final HashMap<Integer, String> importProduct = new HashMap<>() {
        {
            put(0, regexProduct);
            put(1, regexProductName);
        }
    };

    public static final HashMap<Integer, String> searchSerialNumbers = new HashMap<>() {
        {
            put(0, regexSerialNumber);
        }
    };
}
