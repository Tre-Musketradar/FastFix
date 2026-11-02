package se.felanmalan.auth;

public record LoginResponse(String token, UserResponse user) {
}
