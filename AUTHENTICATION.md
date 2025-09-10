# Authentication Setup

## Backend Integration

The frontend now connects to your Spring Boot backend for authentication.

### Configuration

1. **Environment Variables**: The API URL is configured in `.env.local`
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9001
   ```

2. **Default Test Account**: 
   - Email: `admin@gmail.com`
   - Password: `password`

### API Integration

- **Login Endpoint**: `POST /api/auth/login`
- **Request Format**: `{ email: string, password: string }`
- **Response Format**: `{ token: string, user: UserResponse }`

### Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token + user data
4. Frontend stores token and user data in localStorage
5. Token is included in subsequent API requests via Authorization header

### Usage

```typescript
// Using the auth context
const { user, login, logout, token } = useAuth()

// Making authenticated API calls
const { makeRequest } = useApi()
const data = await makeRequest('/api/students')
```

### User Roles

Backend roles are mapped to frontend roles:
- `ADMIN` → `admin`
- `STUDENT` → `student` 
- `TEACHER` → `teacher`