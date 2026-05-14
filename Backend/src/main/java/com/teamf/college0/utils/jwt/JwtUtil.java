package com.teamf.college0.utils.jwt;

import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import com.teamf.college0.domain.user.account.entity.UserAccount.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.function.Function;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.security.Key;

@Component
public class JwtUtil {
    @Autowired
    private UserAccountRepository accountRepository;

    @Value("${jwt.secret:myVerySecretKeyThatShouldBeAtLeast256BitsLongForHS256Algorithm}")
    private String secret;

    @Value("${jwt.expiration:15000000}")
    private int jwtExpiry;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(UserAccount account) {
        Map<String, Object>  claims = new HashMap<>();
        claims.put("id", account.getUserId());
        claims.put("username",account.getUserName());
        claims.put("role",account.getRole().toString());
        claims.put("isMember",account.isMember());

        return Jwts.builder()
                .claims(claims)
                .subject(account.getUserName())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiry))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public <T> T extractClaim( String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractAndValidateToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("No valid token");
        }

        String token = authHeader.substring(7);

        if (isTokenExpired(token)) {
            throw new RuntimeException("token is expired");
        }

        return token;
    }

    public UserAccount extractUserFromToken(String token) {
        String username = extractUsername(token);
        return accountRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean isCurrentUserRegistrar(HttpServletRequest request) {
        try {
            String token = extractAndValidateToken(request);
            return extractRole(token) == Role.REGISTRAR;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if current user can access a resource (owns it or is admin)
     */
    public boolean canAccessResource(HttpServletRequest request, Integer resourceOwnerId) {
        try {
            String token = extractAndValidateToken(request);
            Integer currentUserId = extractUserId(token);
            boolean isAdmin = isCurrentUserRegistrar(request);
            return isAdmin || currentUserId.equals(resourceOwnerId);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token,Claims::getExpiration);
    }

    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("id", Integer.class));
    }

    public Role extractRole(String token) {
        String role = extractClaim(token, claims -> claims.get("role", String.class));
        return Role.valueOf(role);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


}
