package com.ocena.qlsc.user_history.enumrate;

public enum Action {

    LOGIN("Đăng Nhập"),
    IMPORT("Import File Excel"),
    EDIT("Chỉnh Sửa Bản Ghi"),
    UPDATE("Update File Excel"),
    CREATE("Thêm Bản Ghi"),
    DELETE("Xóa Bản Ghi"),
    RESET_PASSWORD("Đổi Mật Khẩu"),
    RECEPTION("Tiếp Nhận SC")
    ;
    private final String value;
    Action(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
