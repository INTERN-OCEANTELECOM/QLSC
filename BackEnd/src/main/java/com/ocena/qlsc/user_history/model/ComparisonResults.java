package com.ocena.qlsc.user_history.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@AllArgsConstructor
@Getter
@ToString
public class ComparisonResults {
    private List<String> fieldNames;
    private List<String> oldValues;
    private List<String> newValues;
}
