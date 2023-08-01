package com.ocena.qlsc.podetail.constants;

@FunctionalInterface
public interface CellExcelOperation {
    Object apply(Object row, Object colIndex);
}
