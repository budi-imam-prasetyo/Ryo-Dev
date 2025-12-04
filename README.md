<div align="center">

# 🚀 Ryo-Dev

### Modern Development Server Manager for VS Code

[![VS Code](https://img.shields.io/badge/VS%20Code-1.60+-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/budi-imam-prasetyo/RyoDev)

**Run multiple development servers with one click!**

*Perfect for Laravel, React, Vue, Next.js, and more*

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Configuration](#-configuration) • [Presets](#-presets)

</div>

---

## 🎯 Overview

Ryo-Dev is a powerful VS Code extension that simplifies full-stack development by managing multiple development servers simultaneously. Whether you're building with Laravel + Vue, React + Express, or any modern stack, start everything with a single click.

### Why Ryo-Dev?

- ⚡ **Instant Setup** - One click to start all your servers
- 🎨 **Visual Management** - Color-coded terminals for easy tracking
- 📋 **Smart Presets** - Pre-configured templates for popular stacks
- 🔧 **Flexible** - Customize everything via JSON configuration
- 🚀 **Productive** - Save time, focus on coding

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🖥️ **Multi-Terminal Management**
Run unlimited development servers simultaneously with color-coded tabs for easy identification.

### 📋 **Smart Presets**
Built-in templates for Laravel, Next.js, React, Vue, MERN stack, microservices, and more.

### 🔧 **Flexible Configuration**
JSON-based config with auto-complete support and validation.

</td>
<td width="50%">

### 🎯 **One-Click Start**
Start all servers instantly from the status bar or command palette.

### 🔄 **Auto-Detection**
Automatically detects your project structure and suggests optimal setup.

### ⚡ **Quick Access**
Status bar integration for instant control without interrupting your flow.

</td>
</tr>
</table>

---

## 📦 Installation

### Method 1: VS Code Marketplace (Recommended)

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for **"Ryo-Dev"**
4. Click **Install**

### Method 2: Manual Installation

```bash
# Download the .vsix file, then in VS Code:
# Press Ctrl+Shift+P → Type "Install from VSIX" → Select the file
```

---

## 🚀 Quick Start

### Step 1: Prepare Your Project

Ensure your project structure follows this pattern:

```
your-project/
├── frontend/           # Your JavaScript framework
│   ├── package.json
│   └── ...
├── backend/            # Your Laravel/Express/Django backend
│   ├── artisan
│   └── ...
└── ryosetup.json       # Configuration file (auto-created)
```

### Step 2: Start Development

**Option A: Status Bar** (Fastest)

Click **"▶ Ryo Dev"** in the status bar → Choose:
- **Quick Start** - Auto-detect and run
- **From ryosetup.json** - Use your config
- **Choose Preset** - Select template

**Option B: Command Palette**

Press `Ctrl+Shift+P` and type:
- `Ryo: Quick Start`
- `Ryo: Start Development`
- `Ryo: Choose Preset`

### Step 3: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend (Laravel):**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

---

## 📝 Configuration

### Creating ryosetup.json

Create a `ryosetup.json` file in your project root:

```json
{
  "name": "My Full-Stack App",
  "description": "React frontend with Laravel backend",
  "version": "1.0",
  "terminals": [
    {
      "name": "Frontend Dev Server",
      "directory": "./frontend",
      "command": "npm run dev",
      "color": "terminal.ansiGreen",
      "icon": "browser"
    },
    {
      "name": "Laravel API",
      "directory": "./backend",
      "command": "php artisan serve",
      "color": "terminal.ansiBlue",
      "icon": "server"
    },
    {
      "name": "Database",
      "directory": ".",
      "command": "docker-compose up db",
      "autoStart": false
    }
  ]
}
```

### Configuration Options

| Property | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `name` | string | ✅ | Terminal display name | - |
| `directory` | string | ❌ | Working directory | `.` |
| `command` | string | ✅ | Command to execute | - |
| `color` | string | ❌ | Terminal tab color | - |
| `icon` | string | ❌ | VS Code icon | - |
| `autoStart` | boolean | ❌ | Auto-start on run | `true` |
| `delay` | number | ❌ | Startup delay (ms) | `0` |

### Available Colors

| Color | Badge | Usage |
|-------|-------|-------|
| `terminal.ansiRed` | 🔴 | Errors, critical services |
| `terminal.ansiGreen` | 🟢 | Frontend, success |
| `terminal.ansiYellow` | 🟡 | Warnings, build tools |
| `terminal.ansiBlue` | 🔵 | Backend, API |
| `terminal.ansiMagenta` | 🟣 | Database, storage |
| `terminal.ansiCyan` | 🔵 | Cache, queue workers |

### Available Icons

`terminal` • `server` • `browser` • `database` • `globe` • `package` • `key` • `person` • `output` • `gear`

---

## 🎨 Presets

Choose from built-in templates for instant setup:

### Laravel Fullstack
Laravel with Vite/Mix frontend
```
✓ npm run dev
✓ php artisan serve
```

### React + Laravel
React SPA with Laravel API
```
✓ npm start (React)
✓ php artisan serve (Laravel)
```

### Next.js + Express
Next.js frontend with Express backend
```
✓ npm run dev (Next.js)
✓ npm run dev (Express)
```

### Vue + Django
Vue frontend with Django REST API
```
✓ npm run serve (Vue)
✓ python manage.py runserver (Django)
```

### MERN Stack
MongoDB, Express, React, Node.js
```
✓ MongoDB server
✓ Express API
✓ React frontend
```

### Microservices
Multiple service architecture
```
✓ API Gateway
✓ Auth Service
✓ User Service
✓ Main API
```

---

## ⌨️ Commands

| Command | Description |
|---------|-------------|
| `Ryo: Toggle Dev Server` | Start/Stop all servers |
| `Ryo: Start Development` | Show start menu |
| `Ryo: Quick Start` | Fast start with auto-detect |
| `Ryo: Choose Preset` | Browse preset templates |
| `Ryo: Create Configuration` | Interactive setup wizard |
| `Ryo: Edit Configuration` | Open ryosetup.json |
| `Ryo: Stop All Terminals` | Stop all running terminals |
| `Ryo: Show Active Terminals` | Manage running terminals |
| `Ryo: Restart Terminal` | Restart specific terminal |

---

## 📂 Example Structures

### Laravel Fullstack (Monolith)

```
my-project/
├── ryosetup.json
├── app/
├── resources/
│   ├── js/
│   └── views/
├── package.json
└── artisan
```

### Separated Frontend/Backend

```
my-project/
├── ryosetup.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── app/
    ├── routes/
    └── artisan
```

### Microservices Architecture

```
my-project/
├── ryosetup.json
├── gateway/
│   └── package.json
├── auth-service/
│   └── package.json
├── user-service/
│   └── package.json
└── api-service/
    └── package.json
```

---

## 🔧 Troubleshooting

### ❌ "Folder not found" Error

**Solution:**
1. Verify `ryosetup.json` exists in project root
2. Check paths are relative to root: `./frontend`, `./backend`
3. Ensure no leading/trailing spaces in paths

### ❌ Command Execution Failed

**Solution:**
1. Verify dependencies are installed:
   - Frontend: `npm install`
   - Backend: `composer install`
2. Check Node.js, PHP, and Composer are installed:
   ```bash
   node --version
   php --version
   composer --version
   ```
3. Test commands manually in terminal

### ❌ Port Already in Use

**Solution:**
1. Check for running processes on default ports
2. Modify commands in `ryosetup.json`:
   ```json
   "command": "php artisan serve --port=8001"
   ```

---

## 🔄 Migration Guide

### From Legacy ryosetup Format

Old format (plain text):
```
./frontend
./backend
npm run dev
php artisan serve
```

New format (JSON):
```json
{
  "terminals": [
    {
      "name": "Frontend",
      "directory": "./frontend",
      "command": "npm run dev"
    },
    {
      "name": "Backend",
      "directory": "./backend",
      "command": "php artisan serve"
    }
  ]
}
```

> **Note:** Legacy format still works, but JSON is recommended for advanced features.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs** - Open an issue with details
2. **Suggest Features** - Share your ideas
3. **Submit PRs** - Fix bugs or add features
4. **Improve Docs** - Help others understand

[Contributing Guidelines](CONTRIBUTING.md)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Budi Imam Prasetyo**

[![GitHub](https://img.shields.io/badge/GitHub-@budi--imam--prasetyo-181717?logo=github)](https://github.com/budi-imam-prasetyo)

---

<div align="center">

### Made with ❤️ for developers who value efficiency

**[⬆ Back to Top](#-ryo-dev)**

*Star ⭐ this repo if you find it helpful!*

</div>