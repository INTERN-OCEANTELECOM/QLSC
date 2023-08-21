package com.ocena.qlsc.common.constants;

import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@NoArgsConstructor
public class FieldsNameConstants {
    public static final HashMap<String, String> PODETAIL_FIELDS_MAP = new HashMap<>() {{
        put("importDate", "Ngày nhập kho");
        put("repairCategory", "Hạng mục SC");
        put("repairStatus", "Cập nhật SC");
        put("exportPartner", "Cập nhật XK");
        put("kcsVT", "Cập nhật KCS");
        put("warrantyPeriod", "Cập nhật BH");
        put("priority", "Ưu tiên SC");
        put("bbbgNumberExport", "Số BBXK");
        put("note", "Ghi chú");
    }};

    public static final HashMap<String, String> PO_FIELDS_MAP = new HashMap<>() {{
        put("contractNumber", "Số HĐ");
        put("poNumber", "Số PO");
        put("quantity", "Số Lượng");
        put("beginAt", "Bắt Đầu");
        put("endAt", "Kết Thúc");
        put("note", "Ghi Chú");
        put("warrantyExpirationDate", "Ngày HH Bảo Lãnh Bảo Hành");
        put("contractWarrantyExpirationDate", "Ngày HH Bảo Lãnh THHĐ");
    }};

    public static final HashMap<String, String> PRODUCT_FIELDS_MAP = new HashMap<>() {{
        put("productId", "Mã Thiết Bị");
        put("productName", "Tên Thiết Bị");
    }};

    public static final HashMap<String, String> USER_FIELDS_MAP = new HashMap<>() {{
        put("fullName", "Tên");
        put("phoneNumber", "SĐT");
        put("email", "Email");
        put("status", "Trạng Thái");
    }};

    public static final HashMap<String, String> REPAIRHISTORY_FIELDS_MAP = new HashMap<>() {{
        put("module", "Module SC");
        put("accessory", "Linh Kiện SC");
        put("repairError", "Lỗi Chính Trước SC");
        put("repairResults", "KQ SC");
        put("repairDate", "Ngày Tiếp Nhận");
    }};

    public static final List<String> FIELD_TO_EXCLUDE = new ArrayList<>(Arrays.asList("password", "status"));
}
