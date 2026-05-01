# ARCHITECT.LOG // Engineering Portfolio

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A high-performance, multidisciplinary engineering portfolio designed to showcase the intersection of physical hardware builds and full-stack digital architectures. 

Built for speed, fluid interactivity, and a highly technical "system terminal" aesthetic.

## 🚀 Core System Features

* **Interactive PCB Design Studio:** A custom-built gallery component allowing users to visually toggle through individual PCB manufacturing layers (Top Copper, Solder Mask, Silkscreen, etc.) exported from EasyEDA.
* **Seamless Auto-Glide Carousels:** Custom mathematical hooks that create perfectly infinite, smooth-scrolling project and review tracks that elegantly yield control when a user hovers or interacts.
* **Dynamic Modals & Routing:** Deep-dive modal windows for project architectures and system skills, locking background scrolling and utilizing Framer Motion's `AnimatePresence` for fluid mounting/unmounting.
* **Responsive "System" Aesthetic:** A carefully crafted UI utilizing custom SVG backgrounds, dynamic glowing cursors, glowing data nodes, and terminal-inspired typography.
* **Secret System Override:** Contains a hidden admin authentication terminal triggered via specific keyboard events.

## 🛠️ The Engineering Stack

**Framework:** Next.js (App Router)
**Core Library:** React 18
**Styling:** Tailwind CSS
**Animation Engine:** Framer Motion
**Language:** Strict TypeScript

## ⚙️ Local Initialization

To run this system locally, ensure you have Node.js installed, then execute the following commands in your terminal:
```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)

# 2. Navigate into the directory
cd YOUR_REPO_NAME

# 3. Install core dependencies
npm install

# 4. Boot the development server
npm run dev


/
├── app/
│   ├── layout.tsx         # Root HTML layout and global metadata
│   └── page.tsx           # Main monolithic portfolio architecture
├── public/
│   ├── resume.html        # Downloadable/Viewable CV
│   ├── images/            # Standard project thumbnails and profile photo
│   └── pcb/               # Specific interactive PCB layer exports and gerbers
├── tailwind.config.ts     # System color palettes and UI theme constraints
└── globals.css            # Custom animations and scrollbar hiding logic
