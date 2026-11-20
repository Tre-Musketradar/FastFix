package se.felanmalan;

public enum UserRole {
    TENANT("Hyresgäst"),
    MANAGER("Förvaltare"),
    TECHNICIAN("Tekniker");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

