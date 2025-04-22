package com.cesarschool.portalcientifico.domain.upload;

import com.cesarschool.portalcientifico.config.S3Config;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

@Service
public class S3Service {

    private final S3Client s3Client;

    public S3Service() {
        this.s3Client = S3Config.createS3Client();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        byte[] fileContent = file.getBytes();
        S3Config.uploadFile(s3Client, fileName, fileContent);
        return fileName;
    }

    public String generatePresignedUrl(String fileName) {
        return S3Config.generatePresignedUrl(fileName);
    }
}