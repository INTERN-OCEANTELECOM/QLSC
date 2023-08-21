package com.ocena.qlsc.repair_history.enumrate;

public enum RepairResults {
    FAIL,
    OK,
    DANG_SC,
    CHAY_NO;
    public static final int LENGTH = 4;

    public static int getIndex(RepairResults value) {
        return value.ordinal();
    }
}
