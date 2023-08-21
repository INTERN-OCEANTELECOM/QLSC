package com.ocena.qlsc.user_history.controller;

import com.ocena.qlsc.common.annotation.ApiShow;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.user_history.dto.HistoryResponse;
import com.ocena.qlsc.user_history.service.HistoryService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/history")
public class HistoryController {
    @Autowired
    HistoryService historyService;

    @GetMapping("/get-all")
    @ApiShow
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    public ListResponse<HistoryResponse> getAll(){
        return historyService.getAll();
    }

    @GetMapping("/get-by-created")
    @ApiShow
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    public ListResponse<HistoryResponse> getHistoryByCreatedBetween(@RequestParam Long start, @RequestParam Long end){
        return historyService.getByCreatedBetween(start, end);
    }

    @GetMapping("/download")
    @ApiShow
    public ResponseEntity<byte[]> downloadExcelFile(@RequestParam("filePath") String filePath) {
        return historyService.downloadFile(filePath);
    }
}
