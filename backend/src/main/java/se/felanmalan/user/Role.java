package se.felanmalan.user;

/**
 * Rollerna i appen. Samma värden som PostgreSQL-enumen {@code user_role} (V1__init.sql)
 * och typen {@code Role} i frontend.
 */
public enum Role {
	TENANT,
	TECHNICIAN,
	MANAGER
}
