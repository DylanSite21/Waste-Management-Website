# 🗑️ Waste Management System

Website Manajemen Pengelolaan Sampah berbasis **Next.js**, **PostgreSQL**, dan **Prisma ORM** yang memungkinkan pengguna melaporkan data sampah berdasarkan jenis, wilayah, berat, dan gambar. Sistem ini juga menyediakan dashboard admin untuk mengelola data dan memantau statistik pengelolaan sampah.

---

## 📖 Overview

Waste Management System adalah aplikasi berbasis web yang bertujuan untuk membantu proses pendataan dan pengelolaan sampah secara digital. Pengguna dapat membuat laporan sampah dengan mengunggah gambar, memilih jenis sampah, menentukan wilayah, serta memasukkan berat sampah. Admin dapat memverifikasi, mengelola, dan melihat statistik laporan melalui dashboard.

---

## ✨ Features

### 👤 User

- Register & Login
- Dashboard
- Membuat laporan sampah
- Upload gambar sampah
- Memilih jenis sampah
- Memilih wilayah
- Mengisi berat sampah
- Melihat riwayat laporan
- Edit profil

### 👨‍💼 Admin

- Dashboard Admin
- Manajemen User
- CRUD Jenis Sampah
- CRUD Wilayah
- Melihat seluruh laporan
- Mengubah status laporan
- Statistik laporan
- Total berat sampah
- Grafik berdasarkan jenis dan wilayah

---

## 🛠 Tech Stack

| Technology     | Description          |
| -------------- | -------------------- |
| Next.js 16     | Fullstack Framework  |
| React 19       | Frontend Library     |
| TypeScript     | Programming Language |
| PostgreSQL     | Database             |
| Prisma ORM     | Database ORM         |
| Tailwind CSS   | Styling              |
| NextAuth / JWT | Authentication       |
| bcrypt         | Password Hashing     |

---

## 📁 Project Structure

```text
waste-management/
│
├── app/
│   ├── (auth)/
│   ├── admin/
│   ├── dashboard/
│   ├── reports/
│   ├── api/
│   └── page.tsx
│
├── components/
├── lib/
├── prisma/
├── public/
├── middleware.ts
└── package.json
```

---

## 🗄 Database Schema

### Tables

- Users
- Waste Types
- Regions
- Waste Reports

### Relationships

```text
Users
   │
   ├───────────┐
   │           │
Waste Reports
   │
   ├────────── Waste Types
   │
   └────────── Regions
```

---

## 📊 Dashboard

### Admin Dashboard

- Total Users
- Total Reports
- Total Waste (kg)
- Total Organic Waste
- Total Inorganic Waste
- Total B3 Waste
- Report Statistics
- Monthly Chart
- Region Chart

### User Dashboard

- Total Reports
- Total Weight
- Report History
- Report Status

---

## 🔐 Roles

### Admin

- Full Access
- CRUD User
- CRUD Waste Type
- CRUD Region
- Manage Reports
- View Statistics

### User

- Create Report
- View Personal Reports
- Edit Profile

---

## 📦 Future Features

- Google Maps Integration
- GPS Location
- QR Code
- Export PDF
- Export Excel
- Notification System
- Email Verification
- Dark Mode
- Progressive Web App (PWA)

---

## 📅 Development Roadmap

### Phase 1

- Authentication
- Database
- Prisma
- Layout

### Phase 2

- CRUD Waste Types
- CRUD Regions
- CRUD Reports

### Phase 3

- Dashboard
- Charts
- Statistics

### Phase 4

- Upload Image
- Search
- Filter
- Pagination

### Phase 5

- Deployment
- Testing
- Documentation

---

## 👨‍💻 Author

Developed with using **Next.js** and **PostgreSQL**.
