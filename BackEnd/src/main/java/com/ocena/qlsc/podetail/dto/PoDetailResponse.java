package com.ocena.qlsc.podetail.dto;

import com.ocena.qlsc.po.dto.PoDTO;
import com.ocena.qlsc.podetail.enums.*;
import com.ocena.qlsc.product.dto.ProductDTO;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PoDetailResponse {
    private String poDetailId;
    private ProductDTO product;
    @Size(min = 1, message = "SerialNumber không được để trống")
    @Pattern(regexp = "[^\\s]+", message = "Số S/N không được chứa khoảng trắng")
    private String serialNumber;
    private PoDTO po;
    private String bbbgNumberImport;

    @Min(value = 946684800000L, message = "Giá trị ngày nhâp kho không hợp lệ")
    // Min value is date 01/01/2000
    private Long importDate;
    @Min(value = 0, message = "Giá trị hạng muc không hợp lệ")
    @Max(value = RepairCategory.LENGTH - 1, message = "Giá trị hạng mục không hợp lệ")
    private Short repairCategory;
    @Min(value = 0, message = "Giá trị trạng thái SC không hợp lệ")
    @Max(value = RepairStatus.LENGTH - 1, message = "Giá trị trạng thái SC không hợp lệ")
    private Short repairStatus;

    @Min(value = 946684800000L, message = "Giá trị ngày xuất kho không hợp lệ")
    private Long exportPartner;
    @Min(value = 0, message = "Giá trị KSC không hợp lệ")
    @Max(value = KSCVT.LENGTH - 1, message = "Giá trị KSC không hợp lệ")
    private Short kcsVT;
    @Min(value = 946684800000L, message = "Giá trị bảo hành không hợp lệ")
    private Long warrantyPeriod;
    @Min(value = 0, message = "Giá trị ưu tiên không hợp lệ")
    @Max(value = Priority.LENGTH - 1, message = "Giá trị ưu tiên không hợp lệ")
    private Short priority;

    @Size(min = 1, message = "BBBG XK không được để trống")
    private String bbbgNumberExport;

    @Size(max = 400, message = "Ghi chú phải bé hơn 400 ký tự")
    private String note;
}
