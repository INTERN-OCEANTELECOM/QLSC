package com.ocena.qlsc.user_history.model;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class SpecificationDesc {
    private String fields = "";
    private String amount = "";
    private String record = "";
    private String description = "";


    // Set Description to edit data
    public String setDesc(List<String> fields, List<String> oldDatas, List<String> newDatas) {
        String result = fields.size() > 0 ? "- " : "";
        for(int i = 0; i < fields.size(); i++) {
            result += fields.get(i) + ": từ <" + oldDatas.get(i) + "> thành <" + newDatas.get(i) + ">; ";
        }
        return result;
    }

    // Set description to add data
    public String setDesc(List<String> fields, List<String> newDatas) {
        String result = fields.size() > 0 ? "- " : "";
        for(int i = 0; i < fields.size(); i++) {
            result += fields.get(i) + ": <" + newDatas.get(i) + ">; ";
        }
        return result;
    }

    // Set description to import data excel
    public String setDesc(String data) {
        return data != "" ? "Số S/N: " + data : "";
    }

//    // Set description to update data excel
//    public void setDescription(List<String> fields, List<String> oldDatas, List<String> newDatas, String key) {
//        String result = fields.size() > 0 ? "- " + keyUpdate : "";
//        for(int i = 0; i < fields.size(); i++) {
//            result += fields.get(i) + ": từ <" + oldDatas.get(i) + "> thành <" + newDatas.get(i) + ">; ";
//        }
//        this.description = result;
//    }

    public String getSpecification() {
        return amount + record + fields + description ;
    }

    public void setAmount(String amount) {
        this.amount = "Số lượng: " + amount + "//n";
    }

    public void setRecord(String record) {
        this.record = "Key: " + record + "//n";
    }

    public void setFields(String fields) {
        this.fields = "Trường cập nhật: " + fields + "//n";
    }

    public void setDescription(String description) {
        this.description = "Mô tả chi tiết: //n" + description;
    }
}
