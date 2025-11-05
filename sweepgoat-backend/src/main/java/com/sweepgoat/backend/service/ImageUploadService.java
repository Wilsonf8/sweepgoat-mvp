package com.sweepgoat.backend.service;

import com.sweepgoat.backend.exception.FileUploadException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ImageUploadService {

    private static final Logger logger = LoggerFactory.getLogger(ImageUploadService.class);

    // File validation constants
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg",
        "image/png",
        "image/webp"
    );

    @Value("${cloudflare.account.id}")
    private String cloudflareAccountId;

    @Value("${cloudflare.api.token}")
    private String cloudflareApiToken;

    /**
     * Upload image to Cloudflare Images
     *
     * @param file The image file to upload
     * @return The public URL of the uploaded image
     * @throws FileUploadException if validation fails or upload fails
     */
    public String uploadImage(MultipartFile file) {
        // Validate file
        validateFile(file);

        try {
            // Prepare Cloudflare Images API request
            String uploadUrl = String.format(
                "https://api.cloudflare.com/client/v4/accounts/%s/images/v1",
                cloudflareAccountId
            );

            // Create multipart request
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(cloudflareApiToken);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send request to Cloudflare
            ResponseEntity<Map> response = restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            // Parse response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // Check if upload was successful
                Boolean success = (Boolean) responseBody.get("success");
                if (Boolean.TRUE.equals(success)) {
                    // Extract image URL from response
                    @SuppressWarnings("unchecked")
                    Map<String, Object> result = (Map<String, Object>) responseBody.get("result");

                    // Cloudflare returns variants as an array of URLs
                    @SuppressWarnings("unchecked")
                    List<String> variants = (List<String>) result.get("variants");

                    // Find the "public" variant, or fall back to the first one
                    if (variants != null && !variants.isEmpty()) {
                        String imageUrl = variants.stream()
                            .filter(url -> url.endsWith("/public"))
                            .findFirst()
                            .orElse(variants.get(0));

                        logger.info("Successfully uploaded image to Cloudflare: {}", imageUrl);
                        return imageUrl;
                    }
                }

                // If we get here, the upload failed
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> errors = (List<Map<String, Object>>) responseBody.get("errors");
                String errorMessage = errors != null && !errors.isEmpty()
                    ? (String) errors.get(0).get("message")
                    : "Unknown error";

                logger.error("Cloudflare API error: {}", errorMessage);
                throw new FileUploadException("Failed to upload image: " + errorMessage);
            }

            throw new FileUploadException("Failed to upload image to Cloudflare");

        } catch (FileUploadException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error uploading image to Cloudflare: {}", e.getMessage(), e);
            throw new FileUploadException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    /**
     * Validate uploaded file
     * Checks file size and content type
     */
    private void validateFile(MultipartFile file) {
        // Check if file is empty
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("No file provided");
        }

        // Check file size (max 5MB)
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileUploadException("File too large (max 5MB)");
        }

        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new FileUploadException("Invalid file type. Only JPEG, PNG, and WebP images are allowed");
        }

        logger.info("File validation passed: {} ({} bytes, {})",
            file.getOriginalFilename(), file.getSize(), contentType);
    }
}