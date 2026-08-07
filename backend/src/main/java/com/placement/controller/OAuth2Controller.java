package com.placement.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.controller.dto.JwtResponse;
import com.placement.controller.dto.MessageResponse;
import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import com.placement.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;

/**
 * OAuth2Controller — handles Google and GitHub OAuth2 sign-in.
 *
 * Flow:
 *   1. Frontend redirects user to provider consent page.
 *   2. Provider redirects back with ?code=xxx to /oauth2/callback (frontend).
 *   3. Frontend POSTs the code here.
 *   4. We exchange code → access token → user profile.
 *   5. We create/find the Student account and return a JWT.
 *
 * OAuth2 students are auto-approved (they've proved identity via provider).
 */
@CrossOrigin(origins = "https://jobytra.vercel.app", maxAge = 3600)
@RestController
@RequestMapping("/api/auth/oauth2")
public class OAuth2Controller {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${app.googleClientId:}")
    private String googleClientId;

    @Value("${app.googleClientSecret:}")
    private String googleClientSecret;

    @Value("${app.githubClientId:}")
    private String githubClientId;

    @Value("${app.githubClientSecret:}")
    private String githubClientSecret;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ─── Google OAuth2 ────────────────────────────────────────────────────────

    @PostMapping("/google")
    public ResponseEntity<?> googleOAuth2(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Missing authorization code."));
        }
        if (googleClientId.isBlank() || googleClientSecret.isBlank()) {
            return ResponseEntity.status(503).body(new MessageResponse("Google OAuth2 is not configured on this server."));
        }

        try {
            // Step 1: Exchange code for access token
            String tokenBody = "code=" + code
                    + "&client_id=" + googleClientId
                    + "&client_secret=" + googleClientSecret
                    + "&redirect_uri=" + redirectUri
                    + "&grant_type=authorization_code";

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(tokenBody))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> tokenResponse = httpClient.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode tokenNode = objectMapper.readTree(tokenResponse.body());

            if (tokenResponse.statusCode() != 200) {
                System.err.println("Google token error: " + tokenResponse.body());
                return ResponseEntity.status(502).body(new MessageResponse("Failed to exchange Google code: " + tokenNode.path("error_description").asText("Unknown error")));
            }

            String accessToken = tokenNode.path("access_token").asText();

            // Step 2: Get user profile
            HttpRequest profileRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v2/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .timeout(Duration.ofSeconds(10))
                    .build();

            HttpResponse<String> profileResponse = httpClient.send(profileRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode profile = objectMapper.readTree(profileResponse.body());

            String email = profile.path("email").asText();
            String name = profile.path("name").asText();

            if (email.isBlank()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Could not retrieve email from Google account."));
            }

            // Step 3: Find or create student
            return issueJwtForOAuthUser(email, name, "google");

        } catch (Exception e) {
            System.err.println("Google OAuth2 error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new MessageResponse("Google sign-in failed: " + e.getMessage()));
        }
    }

    // ─── GitHub OAuth2 ────────────────────────────────────────────────────────

    @PostMapping("/github")
    public ResponseEntity<?> githubOAuth2(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Missing authorization code."));
        }
        if (githubClientId.isBlank() || githubClientSecret.isBlank()) {
            return ResponseEntity.status(503).body(new MessageResponse("GitHub OAuth2 is not configured on this server."));
        }

        try {
            // Step 1: Exchange code for access token
            String tokenBody = "client_id=" + githubClientId
                    + "&client_secret=" + githubClientSecret
                    + "&code=" + code
                    + "&redirect_uri=" + redirectUri;

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://github.com/login/oauth/access_token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(tokenBody))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> tokenResponse = httpClient.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode tokenNode = objectMapper.readTree(tokenResponse.body());

            String accessToken = tokenNode.path("access_token").asText();
            if (accessToken.isBlank()) {
                System.err.println("GitHub token error: " + tokenResponse.body());
                return ResponseEntity.status(502).body(new MessageResponse("Failed to exchange GitHub code. " + tokenNode.path("error_description").asText("")));
            }

            // Step 2: Get user profile
            HttpRequest profileRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github+json")
                    .GET()
                    .timeout(Duration.ofSeconds(10))
                    .build();

            HttpResponse<String> profileResponse = httpClient.send(profileRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode profile = objectMapper.readTree(profileResponse.body());

            String email = profile.path("email").asText();
            String name = profile.path("name").asText();
            String login = profile.path("login").asText(); // fallback name

            // GitHub may not return email if it's private — fetch via /user/emails
            if (email.isBlank() || "null".equals(email)) {
                email = fetchGitHubPrimaryEmail(accessToken);
            }

            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(new MessageResponse(
                    "Could not retrieve email from GitHub. Please make your email public in GitHub settings, or add it manually."));
            }

            if (name == null || name.isBlank()) name = login;

            return issueJwtForOAuthUser(email, name, "github");

        } catch (Exception e) {
            System.err.println("GitHub OAuth2 error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new MessageResponse("GitHub sign-in failed: " + e.getMessage()));
        }
    }

    // ─── Shared helpers ───────────────────────────────────────────────────────

    private String fetchGitHubPrimaryEmail(String accessToken) {
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user/emails"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github+json")
                    .GET()
                    .timeout(Duration.ofSeconds(10))
                    .build();
            HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            JsonNode emails = objectMapper.readTree(res.body());
            if (emails.isArray()) {
                for (JsonNode emailNode : emails) {
                    if (emailNode.path("primary").asBoolean() && emailNode.path("verified").asBoolean()) {
                        return emailNode.path("email").asText();
                    }
                }
                // Fallback: return first verified email
                for (JsonNode emailNode : emails) {
                    if (emailNode.path("verified").asBoolean()) {
                        return emailNode.path("email").asText();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch GitHub emails: " + e.getMessage());
        }
        return null;
    }

    private ResponseEntity<?> issueJwtForOAuthUser(String email, String name, String provider) {
        Optional<Student> existing = studentRepository.findByEmail(email);

        Student student;
        if (existing.isPresent()) {
            student = existing.get();
            // Update name if it was blank before
            if (student.getName() == null || student.getName().isBlank()) {
                student.setName(name);
                studentRepository.save(student);
            }
        } else {
            // Create new auto-approved student
            student = new Student();
            student.setName(name != null && !name.isBlank() ? name : email.split("@")[0]);
            student.setEmail(email);
            student.setPassword(null); // No password for OAuth2 users
            student.setOauthProvider(provider);
            student.setIsApproved(true); // Auto-approve — identity verified by provider
            studentRepository.save(student);
        }

        // Issue JWT
        String jwt = jwtUtils.generateJwtTokenForUser(student.getEmail(), student.getRole(), student.getId());

        return ResponseEntity.ok(new JwtResponse(jwt, student.getId(), student.getEmail(), student.getRole()));
    }
}
