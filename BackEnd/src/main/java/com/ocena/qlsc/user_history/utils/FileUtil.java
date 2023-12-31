package com.ocena.qlsc.user_history.utils;

import com.ocena.qlsc.common.util.DateUtils;
import com.ocena.qlsc.common.util.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtil {

    public static final String EXCEL_DIRECTORY = "/mnt/d/data-qlsc";
//    public static final String EXCEL_DIRECTORY = "D:/data-qlsc";

    public static byte[] getBytesDataFromFilePath(String filePath) {
        Path excelFilePath = Paths.get(EXCEL_DIRECTORY, filePath);
        try {
            InputStream excelFileStream = new FileInputStream(excelFilePath.toFile());
            Workbook workbook = new XSSFWorkbook(excelFileStream);
            byte[] excelBytes = workbookToByteArray(workbook);
            return excelBytes;
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public static byte[] workbookToByteArray(Workbook workbook) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        workbook.write(byteArrayOutputStream);
        workbook.close();
        return byteArrayOutputStream.toByteArray();
    }

    private static Path createDirectoryByMMYYYY() {
        String formattedDate = DateUtils.getCurrentDateByMMYYYY();

        // Create path to upload folder
        final String UPLOAD_DIR = EXCEL_DIRECTORY + "/" + formattedDate;
        Path uploadPath = Paths.get(UPLOAD_DIR);

        // Create a folder if folder doesn't exist
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return uploadPath;
    }

    public static String saveUploadedFile(MultipartFile file, String action) {
        try {
            Path uploadPath = createDirectoryByMMYYYY();
            String fileName = "";
            if(action.contains("Import")) {
                fileName = "import " + DateUtils.getCurrentDateByDDMMYYYYhhmm() + ".xlsx";
            } else if(action.contains("Update")) {
                fileName = "update " + DateUtils.getCurrentDateByDDMMYYYYhhmm() + ".xlsx";
            }
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());

            // Save Path to History
            String filePathString = filePath.toString();
            System.out.println("path " + filePathString);
            return URLEncoder.encode(StringUtils.cutSubString(filePathString, "/mnt/d/data-qlsc/"), StandardCharsets.UTF_8);
//            return URLEncoder.encode(StringUtils.cutSubString(filePathString, "D:/data-qlsc/"), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
