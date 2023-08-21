package com.ocena.qlsc.user_history.model;

import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
public class HistoryDescription {
    private String fields = "";
    private String importAmount = "";
    private String key = "";
    private String details = "";


    // Set Description to edit data
    public String getDetailsDescription(List<String> fields, List<String> oldDatas, List<String> newDatas) {
        String result = fields.size() > 0 ? "- " : "";
        if(oldDatas == null) {
            for(int i = 0; i < fields.size(); i++) {
                result += fields.get(i) + ": <" + newDatas.get(i) + ">; ";
            }
        } else {
            for(int i = 0; i < fields.size(); i++) {
                result += fields.get(i) + ": từ <" + oldDatas.get(i) + "> thành <" + newDatas.get(i) + ">; ";
            }
        }
        return result;
    }

    // Set description to import data excel
    public String getDetailsDescription(String data) {
        return !data.equals("") ? "- Số S/N: " + data : "";
    }

    public String getDescription() {
        return importAmount + key + fields + details;
    }

    public void setImportAmount(String importAmount) {
        this.importAmount = "Số lượng: " + importAmount + "//n";
    }

    public void setKey(String key) {
        this.key = "Key: " + key + "//n";
    }

    public void setFields(String fields) {
        this.fields = "Trường cập nhật: " + fields + "//n";
    }

    public void setDetails(String details) {
        this.details = "Mô tả chi tiết: //n" + details;
    }
}
