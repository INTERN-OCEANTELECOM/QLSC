package com.ocena.qlsc.podetail.service;

import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.podetail.model.PoDetail;
import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

public interface IPoDetail extends BaseService<PoDetail, PoDetailResponse> {

}
