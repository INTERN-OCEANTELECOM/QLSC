package com.ocena.qlsc.podetail.enumrate;

public enum RepairCategory {
    NHAP_KHO_SC(0),
    NHAP_KHO_BH(1),
    NOT_AVAILABLE(-1);
    private int value;
    private RepairCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
    public static final int LENGTH = 2;
}
