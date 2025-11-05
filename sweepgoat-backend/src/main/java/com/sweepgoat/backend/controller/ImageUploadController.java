package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.ImageUploadResponse;
import com.sweepgoat.backend.service.ImageUploadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/host")
public class ImageUploadController {

    @Autowired
    private ImageUploadService imageUploadService;

    /**
     * Upload image to Cloudflare Images
     * Endpoint: POST /api/host/upload-image
     * Requires: HOST authentication
     *
     * Request:
     * - Content-Type: multipart/form-data
     * - image: File (max 5MB, types: image/jpeg, image/png, image/webp)
     *
     * Response (success):
     * {
     *   "imageUrl": "https://imagedelivery.net/<account-hash>/<image-id>/public"
     * }
     *
     * Response (error):
     * {
     *   "error": "File too large (max 5MB)"
     * }
     */
    @PostMapping("/upload-image")
    public ResponseEntity<ImageUploadResponse> uploadImage(
            @RequestParam("image") MultipartFile file,
            HttpServletRequest request) {

        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) request.getAttribute("hostId");

        // Upload image to Cloudflare
        String imageUrl = imageUploadService.uploadImage(file);

        // Return response
        return ResponseEntity.ok(new ImageUploadResponse(imageUrl));
    }
}