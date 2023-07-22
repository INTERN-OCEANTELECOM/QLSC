package com.ocena.qlsc.podetail.service;

import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.podetail.status.ErrorType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

@Service
public class ProcessExcelFile {

    /**
     * Checks whether a given cell value matches a specified regular expression.
     * @param cellValue the value of the cell to be checked
     * @param regex the regular expression to be matched against the cell value
     * @return true if the cell value matches the regular expression, false otherwise
     */
    public boolean isValidHeader(String cellValue, String regex) {
        return cellValue != null && cellValue.toLowerCase().matches(regex);
    }

    /**
     * Validates the header values in a given row against a map of expected header values.
     * @param map a map containing the expected header values, where the keys are the column indices and the values are the expected header values
     * @return an ErrorResponseImport object with an error message if the header values are invalid,
     * or null if the header values are valid
     */
    public ErrorResponseImport validateHeaderValue(Iterator<Row> rowIterator, HashMap<Integer, String> map) {
        try {
            if (rowIterator.hasNext()) {
                Row row = rowIterator.next();

                for (Integer key : map.keySet()) {
                    System.out.println(row.getCell(key).getStringCellValue());
                    System.out.println(map.get(key));
                    if (!isValidHeader(row.getCell(key).getStringCellValue(), map.get(key))) {
                        return new ErrorResponseImport(ErrorType.HEADER_DATA_WRONG, "Cột Header thứ " + (key + 1) + " sai");
                    }
                }

                if (row.getLastCellNum() > map.size()){
                    return new ErrorResponseImport(ErrorType.HEADER_DATA_WRONG, "Header không đúng! Hãy kiểm tra lại");
                }
            }
        } catch (Exception e) {
            return new ErrorResponseImport(ErrorType.HEADER_DATA_WRONG, "Header không đúng! Hãy kiểm tra lại");
        }
        return null;
    }

    /**
     * Checks whether a given cell contains a numeric value.
     * @param cell the cell to be checked
     * @return true if the cell contains a numeric value, false otherwise
     */
    private boolean isNumericCell(Cell cell) {
        return cell != null && cell.getCellType() == CellType.NUMERIC;
    }

    private boolean isTextCell(Cell cell) {
        return cell != null && cell.getCellType() == CellType.STRING;
    }

    /**
     * Validates whether the cells in a given row and specified columns contain numeric values.
     * @param row the row containing the cells to be validated
     * @param rowIndex the index of the row in the import file
     * @param columnIndexes an array of column indices to be validated
     * @return an ErrorResponseImport object with an error message if any of the cells do not contain numeric values,
     * or null if all the cells contain numeric values
     */
    public Object validateNumbericColumns(Row row, int rowIndex, int... columnIndexes) {
        for (int columnIndex : columnIndexes) {
            Cell cell = row.getCell(columnIndex);
            if (!isNumericCell(cell)) {
                return new ErrorResponseImport(ErrorType.DATA_NOT_MAP, rowIndex,
                        "Hàng " + rowIndex + " Cột " + (columnIndex + 1) + " không phải dạng Numberic");
            }
        }
        return null;
    }


    public Object validateTextColumns(Row row, int rowIndex, int... columnIndexes) {
        for (int columnIndex : columnIndexes) {
            Cell cell = row.getCell(columnIndex);
            if (!isTextCell(cell)) {
                return new ErrorResponseImport(ErrorType.DATA_NOT_MAP, rowIndex,
                        "Hàng " + rowIndex + " Cột " + (columnIndex + 1) + " không phải dạng Text");
            }
        }
        return null;
    }

    /**
     * Processes an Excel file uploaded by the user.
     * @param file the Excel file to be processed
     * @return an iterator over the rows in the Excel file if the file is valid,
     * or an ErrorResponseImport object with an error message if the file is invalid
     */
    public Object getSheetIteratorFromExcelFile(MultipartFile file) {
        List<ErrorResponseImport> listError = new ArrayList<>();

        // Check whether the file has the correct format
        if (!file.getOriginalFilename().endsWith(".xlsx")) {
            listError.add(new ErrorResponseImport(ErrorType.FILE_NOT_FORMAT, "File không đúng định dạng"));
            return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }

        try {
            // Read the Excel file and get the first sheet
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên
            Iterator<Row> rowIterator = sheet.iterator();

            // Return the iterator over the rows in the sheet
            return rowIterator;
        } catch (IOException e) {
            // Handle any exceptions that occur while reading the file
            listError.add(new ErrorResponseImport(ErrorType.FILE_NOT_FORMAT, "File không đúng định dạng"));
            return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }
    }

    public boolean isLastedRow(Row row) {
        if ((row.getCell(0) == null || row.getCell(0).getCellType() == CellType.BLANK) &&
                (row.getCell(1) == null || row.getCell(1).getCellType() == CellType.BLANK) &&
                (row.getCell(2) == null || row.getCell(2).getCellType() == CellType.BLANK)) {
            return true;
        }
        return false;
    }

    public String getCellValueIsNumberOrString(Row row, int col) {
        CellType cellType = row.getCell(col).getCellType();
        if(cellType == CellType.STRING) {
            return row.getCell(col).getStringCellValue();
        }
        return String.format("%.0f", row.getCell(col).getNumericCellValue());
    }
}
