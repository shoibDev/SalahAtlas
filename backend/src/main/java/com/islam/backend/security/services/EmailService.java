package com.islam.backend.security.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${frontend.verification-url}")
    private String frontendVerificationUrl;

    public void sendVerificationEmail(String to, String token, String code) {
        String subject = "Verify your email - SalahAtlas";
        String verificationUrl = frontendVerificationUrl + "?token=" + token;
        System.out.println("Verification URL: " + verificationUrl);
        System.out.println("Verification Code: " + code);
        System.out.println("Sending verification email to: " + to);

        Context context = new Context();
        context.setVariable("name", "there"); // Replace with user's name if available
        context.setVariable("verificationUrl", verificationUrl);
        context.setVariable("verificationCode", code);

        String htmlContent = templateEngine.process("verify-email-with-code.html", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = isHtml
            helper.setFrom("no-reply@SalahAtlas.com");

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}
