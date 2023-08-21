package com.ocena.qlsc.product.utils;

import com.ocena.qlsc.common.error.exception.FileUploadException;
import com.ocena.qlsc.common.error.exception.ResourceNotFoundException;
import com.ocena.qlsc.common.util.DateUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;

@Service
public class FileUtil {
    private static final String IMAGES_DIR = "D:/images";

    private Path createDirectoryByProductId(String productId) {
        final String UPLOAD_DIR = IMAGES_DIR + "/" + productId;
        Path uploadPath = Paths.get(UPLOAD_DIR);
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return uploadPath;
    }

    public byte[] getBytesFromFilePath(String filePath) {
        try {
            return Files.readAllBytes(Path.of(filePath));
        } catch (IOException e) {
            throw new ResourceNotFoundException("File doesn't exist");
        }

    }

    public boolean compareEqualBytes(byte[] byteArray1, byte[] byteArray2) {
        return Arrays.equals(byteArray1, byteArray2);
    }

    public boolean isImage(InputStream inputStream) {
        try {
            return ImageIO.read(inputStream) != null;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] getFileBytes(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new FileUploadException("Not Found");
        }
    }

    public String saveProductImages(MultipartFile file, String productId) {
        try {
            Path uploadPath = createDirectoryByProductId(productId);
            String fileName = DateUtils.getCurrentDateByDDMMYYYYhhmm() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = filePath.toString();
            return fileUrl;
        } catch (IOException e) {
            throw new FileUploadException("File bị trùng tên");
        }
    }
    public byte[] convertBase64ToByteArray(String base64String) {
        return Base64.getDecoder().decode(base64String);
    }
}
