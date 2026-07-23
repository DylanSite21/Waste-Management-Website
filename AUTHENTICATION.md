# 🔐 Authentication Documentation

## Waste Management System

Authentication pada aplikasi ini menggunakan **JWT (JSON Web Token)** dengan **Auth.js (NextAuth v5)** dan **Credentials Provider**.

Tujuan autentikasi adalah memastikan hanya pengguna yang memiliki akun yang dapat mengakses sistem sesuai dengan hak aksesnya.

---

# Authentication Flow

```text
User
 │
 │ Login
 ▼
Login Form
 │
 ▼
POST Credentials
 │
 ▼
Auth.js
 │
 ▼
Prisma
 │
 ▼
PostgreSQL
 │
 ▼
Password Verification
 │
 ▼
JWT Session
 │
 ▼
Cookie
 │
 ▼
Middleware
 │
 ├─────────────┐
 │             │
 ▼             ▼
Admin      User
Dashboard  Dashboard
```

---

# Authentication Method

Authentication menggunakan:

- Email
- Password
- JWT Session
- HTTP Only Cookie

Password akan disimpan dalam bentuk **hash menggunakan bcrypt**.

---

# User Schema

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)

  reports   WasteReport[]

  createdAt DateTime @default(now())
}
```

---

# User Role

Terdapat dua role pada sistem.

| Role  | Access         |
| ----- | -------------- |
| ADMIN | Full Access    |
| USER  | User Dashboard |

---

# Login Flow

1. User membuka halaman Login.
2. User memasukkan email dan password.
3. Sistem melakukan validasi.
4. Prisma mencari user berdasarkan email.
5. Password dibandingkan menggunakan bcrypt.
6. Jika berhasil, Auth.js membuat JWT.
7. JWT disimpan pada Cookie.
8. User diarahkan ke dashboard sesuai role.

---

# Register Flow

1. User mengisi form register.
2. Validasi input.
3. Password di-hash menggunakan bcrypt.
4. Data disimpan ke PostgreSQL.
5. Redirect ke Login.

---

# Logout Flow

1. User menekan tombol Logout.
2. Session JWT dihapus.
3. Cookie dihapus.
4. Redirect ke halaman Login.

---

# Session

Session menggunakan JWT.

JWT akan menyimpan informasi berikut:

```json
{
  "id": "...",
  "name": "...",
  "email": "...",
  "role": "ADMIN"
}
```

---

# Authorization

## Public Routes

- /
- /login
- /register

---

## Protected Routes

### User

- /dashboard
- /reports
- /profile

---

### Admin

- /admin/dashboard
- /admin/users
- /admin/reports
- /admin/waste-types
- /admin/regions

---

# Middleware Flow

```text
Request
    │
    ▼
Ada Session?
    │
 ┌──┴───┐
 │      │
Tidak   Ya
 │      │
 ▼      ▼
Login   Cek Role
            │
      ┌─────┴─────┐
      ▼           ▼
   ADMIN       USER
      │           │
      ▼           ▼
Admin Page   User Page
```

---

# Redirect

## Belum Login

```text
/admin/dashboard
        │
        ▼
Tidak Ada Session
        │
        ▼
Redirect
        │
        ▼
/login
```

---

## Sudah Login

```text
/login
    │
    ▼
Session Ada
    │
    ▼
Redirect Dashboard
```

---

## Role Salah

```text
Role = USER

Akses

/admin/dashboard

↓

403 Forbidden
```

---

# Forbidden

Jika user telah login tetapi tidak memiliki izin mengakses halaman tertentu, maka sistem akan menampilkan halaman:

```
403 Forbidden
```

---

# Unauthorized

Jika user belum login maka:

```
Redirect ke Login
```

---

# JWT Payload

JWT akan membawa data berikut.

```typescript
{
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}
```

---

# Password Security

Register

```
bcrypt.hash(password, 10)
```

Login

```
bcrypt.compare(password, hashedPassword)
```

Password asli tidak pernah disimpan ke database.

---

# Folder Structure

```text
src/

app/
│
├── (auth)
│   ├── login
│   └── register
│
├── dashboard
│
├── admin
│
├── api
│   └── auth
│
├── unauthorized
│
middleware.ts

lib/
│
├── auth.ts
├── db.ts
└── password.ts
```

---

# Authentication Components

- Login Page
- Register Page
- Logout Button
- Auth Configuration
- Middleware
- Route Protection
- Role Protection

---

# Future Improvements

- Forgot Password
- Reset Password
- Email Verification
- Remember Me
- Refresh Token
- Two Factor Authentication (2FA)
- Login History
- Session Expiration
- Account Lockout setelah beberapa kali gagal login

---

# Summary

Authentication menggunakan JWT dipilih karena:

- Tidak memerlukan tabel Session di database.
- Implementasi lebih sederhana.
- Performa lebih baik karena session tidak disimpan di database.
- Cocok untuk aplikasi dengan role Admin dan User.
- Mudah diintegrasikan dengan Auth.js dan Next.js App Router.
