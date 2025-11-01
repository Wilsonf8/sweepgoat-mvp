package com.sweepgoat.backend.controller;

import com.sweepgoat.backend.dto.ChangePasswordRequest;
import com.sweepgoat.backend.dto.MessageResponse;
import com.sweepgoat.backend.service.HostAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/host")
public class HostAccountController {

    @Autowired
    private HostAuthService hostAuthService;

    /**
     * POST /api/host/change-password
     * Change the authenticated host's password
     */
    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {

        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) httpRequest.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        MessageResponse response = hostAuthService.changePassword(hostId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/host/account
     * Delete the authenticated host's account
     * WARNING: This will cascade delete all giveaways and users for this host!
     */
    @DeleteMapping("/account")
    public ResponseEntity<MessageResponse> deleteAccount(HttpServletRequest request) {
        // Extract hostId from JWT (set by JwtAuthenticationFilter)
        Long hostId = (Long) request.getAttribute("hostId");

        if (hostId == null) {
            throw new RuntimeException("Authentication required");
        }

        hostAuthService.deleteHost(hostId);

        return ResponseEntity.ok(new MessageResponse("Host account deleted successfully. All associated giveaways and users have been removed."));
    }
}