package com.ocena.qlsc.common.response;

import com.ocena.qlsc.common.constants.message.StatusCode;
import com.ocena.qlsc.common.constants.message.StatusMessage;
import org.springframework.data.domain.Page;

import java.util.List;

public class ResponseMapper {
    @SuppressWarnings("unchecked")
    public static DataResponse toDataResponse(Object data, int statusCode, String statusMessage) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setTimestamp(System.currentTimeMillis());
        dataResponse.setStatusCode(statusCode);
        dataResponse.setStatusMessage(statusMessage);
        dataResponse.setData(data);
        return dataResponse;
    }

    @SuppressWarnings("unchecked")
    public static ListResponse toListResponse(List list, long totalRecords, int totalPages, int statusCode, String statusMessage) {
        ListResponse listResponse = new ListResponse();
        listResponse.setTimestamp(System.currentTimeMillis());
        listResponse.setData(list);
        listResponse.setTotalRecords(totalRecords);
        listResponse.setStatusCode(statusCode);
        listResponse.setTotalPages(totalPages);
        listResponse.setStatusMessage(statusMessage);
        return listResponse;
    }

    public static ListResponse toPagingResponse(Page page, int statusCode, String statusMessage) {
        if (page != null && !page.isEmpty()) {
            long totalRecords = page.getTotalElements();
            int totalPages = page.getTotalPages();
            List list = page.getContent();
            return toListResponse(list, totalRecords, totalPages, statusCode, statusMessage);
        }
        return toListResponse(null, 0, 0, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    }

    public static DataResponse toDataResponseSuccess(Object data) {
        if (data == null) {
            return toDataResponse(null, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
        }
        return toDataResponse(data, StatusCode.REQUEST_SUCCESS, StatusMessage.REQUEST_SUCCESS);
    }

    public static ListResponse toListResponseSuccess(List list) {
        if (list == null || list.isEmpty()) {
            return toListResponse(null, 0, 0, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
        }
        return toListResponse(list, list.size(), 1, StatusCode.REQUEST_SUCCESS, StatusMessage.REQUEST_SUCCESS);
    }

    public static ListResponse toPagingResponseSuccess(Page page) {
        if (page.hasContent()) {
            return toPagingResponse(page, StatusCode.REQUEST_SUCCESS, StatusMessage.REQUEST_SUCCESS);
        }
        return toPagingResponse(null, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    }
}
