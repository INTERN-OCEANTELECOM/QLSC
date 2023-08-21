package com.ocena.qlsc.podetail.enumrate;

public enum KcsVT {
    FAIL(0),
    PASS(1),
    NOT_AVAILABLE(-1);

    private int value;

    private KcsVT(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static final int LENGTH = 2;
}
