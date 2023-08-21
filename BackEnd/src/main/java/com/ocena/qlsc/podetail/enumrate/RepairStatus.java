package com.ocena.qlsc.podetail.enumrate;

public enum RepairStatus {
    SC_KHONG_DUOC(0),
    SC_XONG(1),
    CHAY_NO(2),
    NOT_AVAILABLE(-1);
    private int value;
    private RepairStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
    public static final int LENGTH = 3;
}
