package com.sportsarenaafrika.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class R2StorageService {
    private final ObjectProvider<S3Client> s3;
    @Value("${app.storage.bucket}") private String bucket;
    @Value("${app.storage.enabled:false}") private boolean enabled;
    @Value("${app.storage.public-base-url}") private String publicBaseUrl;
    @Value("${app.storage.local-directory:./uploads}") private String localDirectory;

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Image file is required");
        String contentType = file.getContentType();
        if (contentType == null || !java.util.Set.of("image/jpeg", "image/png", "image/webp", "image/gif").contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Choose a JPG, PNG, WebP, or GIF image");
        }
        if (file.getSize() > 10L * 1024 * 1024) throw new IllegalArgumentException("Image exceeds the 10 MB limit");
        String extension = switch (contentType.toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> throw new IllegalArgumentException("Unsupported image format");
        };
        String filename = UUID.randomUUID() + extension;
        String key = "articles/" + filename;
        if (!enabled) {
            try {
                Path directory = Path.of(localDirectory).toAbsolutePath().normalize();
                Files.createDirectories(directory);
                try (var input = file.getInputStream()) {
                    Files.copy(input, directory.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
                }
                return "LOCAL:" + filename;
            } catch (IOException exception) {
                throw new IllegalStateException("Could not save the uploaded image to local media storage", exception);
            }
        }
        try {
            s3.getObject().putObject(PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(), RequestBody.fromBytes(file.getBytes()));
            if (publicBaseUrl.isBlank()) throw new IllegalStateException("R2_PUBLIC_BASE_URL is not configured");
            return publicBaseUrl.replaceAll("/$", "") + "/" + key;
        } catch (Exception e) { throw new IllegalStateException("Media upload failed", e); }
    }

    public Path getLocalImage(String filename) {
        if (enabled || filename == null || !filename.matches("[a-fA-F0-9-]{36}\\.(jpg|png|webp|gif)")) return null;
        Path directory = Path.of(localDirectory).toAbsolutePath().normalize();
        Path image = directory.resolve(filename).normalize();
        return image.startsWith(directory) && Files.isRegularFile(image) ? image : null;
    }
}
