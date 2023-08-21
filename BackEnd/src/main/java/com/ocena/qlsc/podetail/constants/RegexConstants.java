package com.ocena.qlsc.podetail.constants;

import com.ocena.qlsc.podetail.utils.FileExcelUtil;

import java.util.*;

public final class RegexConstants {
    public static final String REGEX_REPAIR_CATEGORY = "(?i)\\s*H(?:[ẠA]|\\p{L})NG\\s*M(?:[ỤU]|\\p{L})C\\s*SC\\s*";

    public static final String REGEX_SERIAL_NUMBER = "(?i)\\s*S(?:[ỐÔÔ]|\\p{L})\\s*SERIAL\\s*.*";

    public static final String REGEX_PRODUCTID = "(?i)\\s*M(?:[ÃA]|\\p{L})\\s*H(?:[ÀA]|\\p{L})NG\\s*H(?:[Ó]|\\p{L})A\\s*.*";

    public static final String REGEX_PO_NUMBER = "(?i)\\s*S(?:[ỐÔO]|\\p{L})\\s*PO\\s*.*";

    public static final String REGEX_IMPORT_DATE = "(?i)\\s*NG(?:[ÀA]|\\p{L})Y\\s*NH(?:[ÂAẬ]|\\p{L})P\\s*KH(?:[OÔ]|\\p{L})\\s*";

    public static final String REGEX_REPAIR_STATUS = "(?i)\\s*T(?:[IÌ]|\\p{L})NH\\s*TR(?:[AẠ]|\\p{L})NG\\s*SC\\s*";

    public static final String REGEX_PRODUCT_NAME = "(?i)\\s*T(?:[ÊE]|\\p{L})N\\s*THI(?:[ÊEẾ]|\\p{L})T\\s*B(?:[ỊI]|\\p{L})\\s*";

    public static final String REGEX_EXPORT_PARTNER = "(?i)\\s*NG(?:[AÀ]|\\p{L})Y\\s*XK\\s*";

    public static final String REGEX_KCSVT = "(?i)\\s*T(?:[ÌI]|\\p{L})NH\\s*TR(?:[ẠA]|\\p{L})NG\\s*KCS\\s*";

    public static final String REGEX_WARRANTY_PERIOD = "(?i)\\s*TH(?:[OỜƠ]|\\p{L})I\\s*H(?:[ẠA]|\\p{L})N\\s*BH\\s*";

    public static final String REGEX_PRIORITY = "(?i)\\s*(?:ƯU]|\\p{L})U\\s*TI(?:[EÊ]|\\p{L})N\\s*SC\\s*";

    public static final String REGEX_BBBGNUMBER_EXPORT = "(?i)\\s*S(?:[ỐÔO]|\\p{L})\\s*BBXK\\s*";

    public static final String REGEX_NOTE = "(?i)\\s*GHI\\s*CH(?:[UÚ]|\\p{L})\\s*";

    public static final Map<String, CellExcelOperation> functionGetDataFromCellExcel = new HashMap<>() {{
        put("productId", (row, colIndex) -> FileExcelUtil.getCellValueToString(row, colIndex));
        put("poNumber", (row, colIndex) -> FileExcelUtil.getCellValueToString(row, colIndex));
        put("serialNumber", (row, colIndex) -> FileExcelUtil.getCellValueToString(row, colIndex));
        put("repairCategory", (row, colIndex) -> FileExcelUtil.getCellValueToShort(row, colIndex));
        put("importDate", (row, colIndex) -> FileExcelUtil.getCellValueToDate(row, colIndex));
        put("repairStatus", (row, colIndex) -> FileExcelUtil.getCellValueToShort(row, colIndex));
        put("exportPartner", (row, colIndex) -> FileExcelUtil.getCellValueToDate(row, colIndex));
        put("kcsVT", (row, colIndex) -> FileExcelUtil.getCellValueToShort(row, colIndex));
        put("warrantyPeriod", (row, colIndex) -> FileExcelUtil.getCellValueToDate(row, colIndex));
        put("priority", (row, colIndex) -> FileExcelUtil.getCellValueToShort(row, colIndex));
        put("bbbgNumberExport", (row, colIndex) -> FileExcelUtil.getCellValueToString(row, colIndex));
        put("note", (row, colIndex) -> FileExcelUtil.getCellValueToString(row, colIndex));
    }};

    public static final Map<String, String> FIELDS_REGEX_MAP = new HashMap<>() {{
        put(REGEX_PRODUCTID, "productId");
        put(REGEX_PO_NUMBER, "poNumber");
        put(REGEX_SERIAL_NUMBER, "serialNumber");
        put(REGEX_REPAIR_CATEGORY, "repairCategory");
        put(REGEX_IMPORT_DATE, "importDate");
        put(REGEX_REPAIR_STATUS, "repairStatus");
        put(REGEX_EXPORT_PARTNER, "exportPartner");
        put(REGEX_KCSVT, "kcsVT");
        put(REGEX_WARRANTY_PERIOD, "warrantyPeriod");
        put(REGEX_PRIORITY, "priority");
        put(REGEX_BBBGNUMBER_EXPORT, "bbbgNumberExport");
        put(REGEX_PRODUCT_NAME, "productName");
        put(REGEX_NOTE, "note");
    }};

    public static final List<String> REQUIRED_FIELDS = new ArrayList<>(Arrays.asList("productId", "poNumber", "serialNumber"));

    public static final List<String> UNREQUIRED_FIELDS = new ArrayList<>(Arrays.asList("productName"));
    public static final HashMap<Integer, String> SEARCH_SERIAL_NUMBER = new HashMap<>() {
        {
            put(0, REGEX_SERIAL_NUMBER);
        }
    };
}
