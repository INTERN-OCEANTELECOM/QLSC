package com.ocena.qlsc.podetail.enumrate;

public enum Priority {
    KHONG_UU_TIEN(0),
    UU_TIEN(1),
    NOT_AVAILABLE(-1);
    private int value;
    private Priority(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
    public static final int LENGTH = 2;
}
