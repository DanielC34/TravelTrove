# User Preferences API Documentation

## GET /api/user/preferences

Retrieves user preferences for the authenticated user.

### Authentication
- Required: Bearer token

### Response
```typescript
200 OK
{
  preferences: UserPreferences;
}

404 Not Found
{
  message: "No preferences found for user"
}

401 Unauthorized
{
  message: "Authentication required"
}
```

## POST /api/user/preferences

Updates or creates user preferences.

### Authentication
- Required: Bearer token

### Request Body
```typescript
{
  preferences: Partial<UserPreferences>;
}
```

### Response
```typescript
200 OK
{
  message: "Preferences updated successfully",
  preferences: UserPreferences
}

400 Bad Request
{
  message: "Invalid preferences data",
  errors: ValidationError[]
}

401 Unauthorized
{
  message: "Authentication required"
}
```