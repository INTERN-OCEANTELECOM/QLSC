package com.ocena.qlsc.podetail.dto;

import com.ocena.qlsc.po.dto.PoRequest;
import com.ocena.qlsc.podetail.enumrate.KcsVT;
import com.ocena.qlsc.podetail.enumrate.Priority;
import com.ocena.qlsc.podetail.enumrate.RepairCategory;
import com.ocena.qlsc.podetail.enumrate.RepairStatus;
import com.ocena.qlsc.product.dto.product.ProductRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PoDetailRequest {
    private String id;
    private String poDetailId;
    private ProductRequest product;
    @Size(min = 1, message = "Số S/N không được để trống")
    @Pattern(regexp = "[^\\s]+", message = "Số S/N không được chứa khoảng trắng")
    private String serialNumber;
    private PoRequest po;
    @Min(value = 946684800000L, message = "Giá trị ngày nhâp kho không hợp lệ")
    // Min value is date 01/01/2000
    private Long importDate;
    @Min(value = -1, message = "Giá trị hạng muc không hợp lệ")
    @Max(value = RepairCategory.LENGTH - 1, message = "Giá trị hạng mục không hợp lệ")
    private Short repairCategory;
    @Min(value = -1, message = "Giá trị trạng thái SC không hợp lệ")
    @Max(value = RepairStatus.LENGTH - 1, message = "Giá trị trạng thái SC không hợp lệ")
    private Short repairStatus;
    @Min(value = 946684800000L, message = "Giá trị ngày xuất kho không hợp lệ")
    private Long exportPartner;
    @Min(value = -1, message = "Giá trị KSC không hợp lệ")
    @Max(value = KcsVT.LENGTH - 1, message = "Giá trị KSC không hợp lệ")
    private Short kcsVT;
    @Min(value = 946684800000L, message = "Giá trị bảo hành không hợp lệ")
    private Long warrantyPeriod;
    @Min(value = -1, message = "Giá trị ưu tiên không hợp lệ")
    @Max(value = Priority.LENGTH - 1, message = "Giá trị ưu tiên không hợp lệ")
    private Short priority;
    @Size(min = 1, message = "BBBG XK không được để trống")
    private String bbbgNumberExport;
    @Size(max = 400, message = "Ghi chú phải bé hơn 400 ký tự")
    private String note;
}
