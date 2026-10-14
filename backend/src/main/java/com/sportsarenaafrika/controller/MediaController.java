package com.sportsarenaafrika.controller;

import com.sportsarenaafrika.service.R2StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import java.util.Map;

@RestController @RequestMapping("/api/media") @RequiredArgsConstructor
public class MediaController {
    private final R2StorageService storage;
    @PostMapping("/image")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN','ROLE_EDITOR','ROLE_JOURNALIST')")
    public ResponseEntity<Map<String,String>> uploadImage(@RequestPart("file") MultipartFile file) {
        String url = storage.uploadImage(file);
        if (url.startsWith("LOCAL:")) {
            String filename = url.substring("LOCAL:".length());
            url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/media/files/{filename}")
                    .buildAndExpand(filename)
                    .toUriString();
        }
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getLocalImage(@PathVariable String filename) {
        Path path = storage.getLocalImage(filename);
        if (path == null) return ResponseEntity.notFound().build();
        MediaType mediaType = MediaTypeFactory.getMediaType(path.getFileName().toString()).orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                .body(new PathResource(path));
    }
}
