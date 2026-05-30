<div align="center">

# RS E-LEARNING HUB

### Personal Learning Portal — Cyber Neon Edition

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/Zero%20Dependencies-22c55e?style=for-the-badge)

<br>

A premium, fully responsive personal learning portal built with **vanilla HTML, CSS & JavaScript** — no frameworks, no libraries, no compromises.

[**Live Demo**](https://rohitkumarsaw.github.io/RS_E_LEARNING_HUB/) · [**Report Bug**](https://github.com/Rohitkumarsaw/RS_E_LEARNING_HUB/issues) · [**Request Feature**](https://github.com/Rohitkumarsaw/RS_E_LEARNING_HUB/issues)

</div>

---

## ✨ Features

<details>
<summary><strong>🎨 UI & Design</strong></summary>

- Cinematic dark theme with neon purple & cyan accents
- Animated space nebula background with CSS-only effects
- Glassmorphism UI with backdrop blur and gradient borders
- Shooting star animations
- Smooth page transitions and hover micro-interactions
- Fully responsive — desktop, tablet & mobile

</details>

<details>
<summary><strong>📚 Course Management</strong></summary>

- Dynamic course cards with progress tracking
- Featured course spotlight section
- Category-based filtering (All, AI Tricker, Design, Data Science, etc.)
- Status filters (Completed, In Progress)
- Global search across titles, subtitles, tags & categories
- Course detail pages with overview, videos, notes, resources & progress tabs

</details>

<details>
<summary><strong>🎬 Video Player</strong></summary>

- Built-in cinematic video player modal
- YouTube & Vimeo embed support
- Local file playback with auto file picker fallback
- Course playlist sidebar with navigation
- Watched/unwatched status tracking
- Keyboard shortcuts (Escape to close)

</details>

<details>
<summary><strong>📊 Progress Tracking</strong></summary>

- Per-course progress percentage
- Video watched/unwatched indicators
- Overall dashboard stats
- Progress persistence via localStorage

</details>

<details>
<summary><strong>📝 Notes & Resources</strong></summary>

- Course-wise notes hub
- File resources management
- Download indicators

</details>

<details>
<summary><strong>⚙️ Extras</strong></summary>

- Dark/Light theme toggle
- Global keyboard shortcut (`/` for search)
- Mobile bottom navigation
- Sidebar navigation (desktop)
- PWA-ready manifest & meta tags

</details>

---

## 🗂️ Project Structure

```
RS_E_LEARNING_HUB/
├── index.html                    # Main entry point
├── template.html                 # Dev template
├── sample.md                     # Developer guide
│
├── css/
│   └── style.css                 # All styles (5200+ lines)
│
├── js/
│   ├── app.js                    # Core app logic & routing
│   ├── ui.js                     # UI utilities & helpers
│   ├── courses.js                # Course rendering & video player
│   ├── progress.js               # Progress tracking system
│   ├── resources.js              # Resources management
│   ├── notes.js                  # Notes management
│   ├── theme.js                  # Dark/Light theme toggle
│   ├── category.js               # Centralized category database
│   ├── data.js                   # Data aggregator
│   └── data/
│       ├── course_c1.js          # Course: Ads
│       ├── course_c2.js          # Course: App Publish
│       ├── course_c3.js          # Course: UI Design
│       ├── course_c4.js          # Course: Python Data Science
│       ├── course_c5.js          # Course: Productivity
│       └── course_c6.js          # Course: AI Engineering
│
└── assets/
    └── favicon/                  # Favicons & PWA icons
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Rohitkumarsaw/RS_E_LEARNING_HUB.git
cd RS_E_LEARNING_HUB
```

### 2. Open in browser

Simply open `index.html` in your browser. No server required.

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 3. Or use a local server (recommended)

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

---

## 📖 How to Add Content

### Add a New Category

Edit `js/category.js`:

```javascript
window.AppCategories = {
  c1: 'AI Tricker',
  c2: 'AI Tricker',
  c3: 'Design',
  // ... add more
  c7: 'Your New Category'   // ← new entry
};
```

### Add a New Course

Create a new file `js/data/course_c7.js`:

```javascript
(function() {
  window.CourseList = window.CourseList || [];
  window.CourseList.push({
    id: 'c7',
    slug: 'your-course-slug',
    title: 'Your Course Title',
    subtitle: 'Short description',
    description: 'Detailed course description',
    category: window.AppCategories.c7,
    level: 'beginner',          // beginner | intermediate | advanced
    duration: '2h 30m',
    thumbnail: '#',
    banner: '#',
    tags: ['Tag1', 'Tag2'],
    featured: false,
    progress: 0,
    videos: [
      {
        id: 'v7-1',
        title: 'Lesson 1 Title',
        description: 'Lesson description',
        duration: '15:30',
        source: 'https://youtube.com/watch?v=XXXXX',
        thumbnail: '#',
        watched: false
      }
    ],
    notes: [],
    resources: []
  });
})();
```

Then add the script tag in `index.html`:

```html
<script src="js/data/course_c7.js"></script>
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|:-----------|:--------|
| HTML5 | Semantic markup, PWA meta tags |
| CSS3 | Custom properties, Grid, Flexbox, animations, glassmorphism |
| Vanilla JS | ES6+ modules, localStorage, dynamic DOM rendering |
| Font Awesome | Icon library (CDN) |
| Google Fonts | Orbitron + Roboto + JetBrains Mono |

**Zero dependencies.** No React, no Vue, no jQuery, no build tools.

---

## 📱 Responsive Breakpoints

| Device | Breakpoint | Layout |
|:-------|:-----------|:-------|
| Desktop | > 1024px | Sidebar + full grid |
| Tablet | 768px - 1024px | Collapsed sidebar, 2-column grid |
| Mobile | < 768px | Bottom nav, single column |

---

## 🎨 Theme

The app uses a **cyber neon dark theme** with:

- **Primary:** `#bc13fe` (Neon Purple)
- **Secondary:** `#00f3ff` (Neon Cyan)
- **Background:** `#050505` (Deep Black)
- **Surface:** `rgba(20, 20, 20, 0.70)` (Glass)

Light theme support is available via the theme toggle.

---

## 👨‍💻 Author

**Rohit Kumar**
- GitHub: [@Rohitkumarsaw](https://github.com/Rohitkumarsaw)
- Email: dellofficial795@gmail.com

---

## 📄 License

This project is for **personal use**. All rights reserved.

---

<div align="center">

**Built with ❤️ using pure HTML, CSS & JavaScript**

</div>
