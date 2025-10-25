package com.sweepgoat.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    /**
     * Send verification code email to user
     * TODO: Integrate with SendGrid or AWS SES for production
     * For MVP, we'll just log to console
     */
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        logger.info("==================================================");
        logger.info("SENDING VERIFICATION EMAIL");
        logger.info("To: " + toEmail);
        logger.info("Verification Code: " + verificationCode);
        logger.info("==================================================");

        // TODO: Implement actual email sending
        // Example with SendGrid:
        // Mail mail = new Mail(from, subject, to, content);
        // sendGrid.api(request);
    }

    /**
     * Send welcome email after successful registration
     */
    public void sendWelcomeEmail(String toEmail, String username) {
        logger.info("==================================================");
        logger.info("SENDING WELCOME EMAIL");
        logger.info("To: " + toEmail);
        logger.info("Username: " + username);
        logger.info("==================================================");

        // TODO: Implement actual email sending
    }
}