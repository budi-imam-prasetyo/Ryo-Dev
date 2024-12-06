# Ryo Dev VSCode Extension

## Overview

Ryo Dev adalah VSCode extension yang memudahkan pengembangan aplikasi menggunakan framework JavaScript (seperti Vue, React dan lainnya) dengan Laravel. Extension ini memungkinkan Anda menjalankan server development frontend dan backend secara bersamaan dengan satu klik.

## Features

- 🚀 Quick start untuk frontend berbasis framework JavaScript dan Laravel backend
- 💻 Menjalankan dua terminal secara otomatis dengan custom command
- 🔄 Toggle start/stop dengan mudah melalui status bar
- ⚡ Mendukung dua mode: Dev Serve dan Javascript Laravel
- 📁 Konfigurasi folder frontend dan backend yang fleksibel melalui file `ryosetup`

## Requirements

- Visual Studio Code v1.60.0 atau lebih tinggi
- Node.js dan npm terinstall
- PHP dan Composer terinstall
- Project berbasis framework JavaScript
- Project Laravel

## Installation

### Dari VSCode Marketplace

1. Buka VSCode
2. Klik icon Extensions di sidebar (atau tekan `Ctrl+Shift+X`)
3. Cari "Ryo Dev"
4. Klik Install

### Manual Installation

1. Download file extension `.vsix`
2. Buka VSCode
3. Tekan `Ctrl+Shift+P` dan ketik "Install from VSIX"
4. Pilih file `.vsix` yang sudah didownload
5. Restart VSCode

## Setup Project

### 1. Struktur Folder

Pastikan struktur folder project Anda seperti ini:

```
your-project/
  ├── frontend/         # Folder framework JavaScript
  │   ├── package.json
  │   └── ...
  ├── backend/          # Folder Laravel project
  │   ├── artisan
  │   └── ...
  └── ryosetup          # File konfigurasi
```

### 2. Konfigurasi ryosetup

1. Buat file bernama `ryosetup` (tanpa extension) di root folder project
2. Isi file dengan path folder frontend, backend, dan perintah custom (relatif terhadap root project):

```
frontend
backend
npm run dev
php artisan serve
```

Note:

- Baris 1: path ke folder frontend
- Baris 2: path ke folder backend
- Baris 3: perintah untuk menjalankan frontend
- Baris 4: perintah untuk menjalankan backend

### 3. Persiapan Project

#### Frontend (Framework JS)

1. Masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

#### Backend (Laravel)

1. Masuk ke folder backend:

```bash
cd backend
```

2. Install dependencies:

```bash
composer install
```

3. Setup environment:

```bash
cp .env.example .env
php artisan key:generate
```

## Usage

### 1. Starting the Development Server

1. Buka project Anda di VSCode
2. Klik tombol "Start Ryo Dev" di status bar (pojok kanan bawah)
3. Pilih mode yang diinginkan:
   - **Ryo: Dev Serve** - untuk project sederhana
   - **Ryo: Javascript Laravel** - untuk project yang menggunakan struktur frontend/backend terpisah

### 2. Stopping the Server

- Klik tombol "Stop Ryo Dev" di status bar
- Atau tutup terminal yang terbuka secara manual

## Mode Development

### Ryo: Dev Serve

Mode ini cocok untuk:

- Project sederhana tanpa pemisahan frontend/backend
- Development cepat dan prototype
- Project yang menggunakan struktur monolith

### Ryo: Javascript Laravel

Mode ini cocok untuk:

- Project dengan frontend dan backend terpisah
- Arsitektur microservice
- Project skala besar dengan tim terpisah untuk frontend dan backend

## Troubleshooting

### Frontend/Backend Folder Not Found

1. Pastikan file `ryosetup` ada di root project
2. Periksa isi file `ryosetup`:
   - Harus berisi empat baris
   - Path dan command harus relatif terhadap root project
   - Tidak boleh ada spasi di awal atau akhir baris

### Command Error (npm run dev atau php artisan serve)

1. Pastikan command di `ryosetup` sesuai dengan kebutuhan project
2. Periksa apakah dependencies frontend/backend sudah terinstall
3. Pastikan Node.js, PHP, dan Composer terinstall dengan benar

## Contributing

Jika Anda menemukan bug atau ingin menambahkan fitur, silakan buat issue atau pull request di repository GitHub kami.

## License

MIT License - lihat file LICENSE untuk detail lengkap.

```

```
