package com.ocena.qlsc.user_history.controller;

import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.user_history.dto.HistoryDTO;
import com.ocena.qlsc.user_history.model.History;
import com.ocena.qlsc.user_history.service.HistoryService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/history")
public class HistoryController {
    @Autowired
    HistoryService historyService;
    @GetMapping("/get-all")
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    public ListResponse<HistoryDTO> getAll(){
        return historyService.getAll();
    }

    @GetMapping("/get-by-created")
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    public ListResponse<HistoryDTO> getHistoryByCreatedBetween(@RequestParam Long start, @RequestParam Long end){
        return historyService.getHistoryByCreatedBetween(start, end);
    }
}
