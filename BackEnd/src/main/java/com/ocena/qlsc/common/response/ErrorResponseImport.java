package com.ocena.qlsc.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponseImport {

    String type;

    String position;

    String errorDescription;

    public ErrorResponseImport(String type, Integer position, String errorDescription) {
        this.type = type;
        this.position = "Hàng: " + position;
        this.errorDescription = errorDescription;
    }

    public ErrorResponseImport(String type, String errorDescription) {
        this.type = type;
        this.errorDescription = errorDescription;
    }

    @Override
    public String toString() {
        return "ErrorResponseImport{" +
                "type='" + type + '\'' +
                ", position='" + position + '\'' +
                ", errorDescription='" + errorDescription + '\'' +
                '}';
    }
}
