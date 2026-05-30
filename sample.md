# RS E-LEARNING HUB — Developer & Content Creator Guide

Welcome to the **RS E-LEARNING HUB** content management manual. Since we separated categories, courses, and resources into individual, modular databases, adding new learning content is extremely clean and straightforward.

This guide provides 1-1 copy-pasteable sample code and exact step-by-step instructions to add:
1. **New Categories**
2. **New Courses**
3. **New Videos**
4. **New Resources**
5. **New Notes**

---

## 🏷️ 1. How to Add a New Category

To introduce a new category taxonomy, you do **not** need to touch any course code files. You only need to add a single line inside the centralized category database.

### Step-by-Step Instructions:
1. Open [**`js/category.js`**](file:///c:/Users/RS/Downloads/deploy-6a0bdf9094a2e7cd8cc6d7df%20%282%29/js/category.js).
2. Append a new key-value pair inside the `window.AppCategories` dictionary.
3. Use the course key (e.g. `c7`, `c8`, etc.) as the property name and your category string as the value.

### Sample Code (`js/category.js`):
```javascript
window.AppCategories = {
  c1: 'AI Tricker',
  c2: 'AI Tricker',
  c3: 'Design',
  c4: 'Data Science',
  c5: 'Productivity',
  c6: 'AI Engineering',
  
  // ADD YOUR NEW CATEGORIES HERE:
  c7: 'Cyber Security',      // Single line addition for course c7
  c8: 'Web Development'      // Single line addition for course c8
};
```

---

## 📚 2. How to Add a New Course

Each course is stored inside its own dedicated JavaScript file within the `js/data/` folder. This keeps the application modular and prevents load crashes.

### Step-by-Step Instructions:
1. Add your new category mapping inside [**`js/category.js`**](file:///c:/Users/RS/Downloads/deploy-6a0bdf9094a2e7cd8cc6d7df%20%282%29/js/category.js) (as shown in Section 1).
2. Create a new JavaScript file in `js/data/`, e.g., `js/data/course_c7.js`.
3. Paste the Course Boilerplate Structure below, substituting your own course metadata, videos, resources, and notes.
4. Open [**`index.html`**](file:///c:/Users/RS/Downloads/deploy-6a0bdf9094a2e7cd8cc6d7df%20%282%29/index.html) and [**`template.html`**](file:///c:/Users/RS/Downloads/deploy-6a0bdf9094a2e7cd8cc6d7df%20%282%29/template.html).
5. Load your new script tag sequentially right after the other course nodes:
   ```html
   <script src="js/data/course_c6.js"></script>
   <script src="js/data/course_c7.js"></script> <!-- Load your new course database -->
   ```

### Sample Code (`js/data/course_c7.js`):
```javascript
(function() {
  window.CourseList = window.CourseList || [];
  window.CourseList.push({
    id: 'c7',                                         // Unique Course ID (matches key in category.js)
    slug: 'ethical-hacking-basics',                  // URL/Slug friendly identifier
    title: 'Ethical Hacking Fundamentals',           // Display Title
    subtitle: 'Learn Penetration Testing & Networks', // Short Subtitle
    description: 'A comprehensive beginner guide to cyber security, mapping out Linux operations, scanning networks, writing exploits, and protecting applications.',
    category: window.AppCategories.c7,                // Central Dynamic Category Lookup (binds to category.js)
    level: 'beginner',                                // Level: 'beginner', 'intermediate', or 'advanced'
    duration: '12h 45m',                              // Total course run-time
    thumbnail: 'assets/thumbnails/hacking.jpg',       // Path to card image (leave '#' or '' for custom gradient glow generator)
    banner: '',                                       // Large backdrop cover (leave blank for dynamic defaults)
    tags: ['Cyber', 'Security', 'Hacking', 'Linux'],  // Filters and search indexes
    featured: true,                                   // 'true' displays this course on the Dashboard Bento Hero Block
    progress: 0,                                      // Initial study progress percentage
    
    // Arrays for nested components:
    videos: [],
    notes: [],
    resources: []
  });
})();
```

---

## 🎥 3. How to Add a New Video to a Course

Videos are contained inside the `videos` array of each course file.

### Step-by-Step Instructions:
1. Open your target course database file (e.g. `js/data/course_c7.js`).
2. Add a new object inside the `videos: [...]` array.
3. Make sure to specify the absolute file path or web streaming link inside the `source` field.

### Sample Code (Insert inside `videos` array):
```javascript
    videos: [
      {
        id: 'v7-1',                                  // Format: v[courseId]-[videoIndex]
        title: '01. Introduction to Cyber Warfare',  // Video Title shown in Playlist & Player
        description: 'Understand the landscape of hacking, system vulnerabilities, and ethical frameworks.',
        duration: '14:25',                           // Video length (MM:SS)
        source: 'D:/My Courses And Imp data/Security/01-intro.mp4', // Local MP4 path or YouTube Stream Link
        thumbnail: '',                               // Video cover thumbnail (optional)
        watched: false                               // 'true' if already watched, 'false' for new studies
      },
      {
        id: 'v7-2',
        title: '02. Linux Command Line Basics',
        description: 'Master essential terminal utilities and security structures.',
        duration: '22:15',
        source: 'D:/My Courses And Imp data/Security/02-linux.mp4',
        thumbnail: '',
        watched: false
      }
    ],
```

---

## 📁 4. How to Add a New Resource (Downloads/Links)

Resources are files or links clustered into modular categories (e.g. "Software Tools", "Documentation") inside the `resources` array.

### Step-by-Step Instructions:
1. Open your target course database file (e.g. `js/data/course_c7.js`).
2. Add a new resource cluster object inside the `resources: [...]` array.
3. Define the nested `files` array inside it, detailing each download.

### Sample Code (Insert inside `resources` array):
```javascript
    resources: [
      {
        id: 'r7-1',                                      // Format: r[courseId]-[resourceIndex]
        title: 'Pentesting Tools & Software',            // Heading of the Resource block
        description: 'Recommended frameworks and installation payloads.',
        files: [
          { 
            id: 'f7-1-1',                                // Format: f[courseId]-[resourceIndex]-[fileIndex]
            name: 'Wireshark Network Scanner',          // Name shown in Resource Hub cards
            type: 'apk',                                 // Icon identifier: 'apk', 'zip', 'pdf', 'txt', 'doc', or 'link'
            path: 'https://www.wireshark.org/download',  // Local disk absolute path or download URL
            size: '52.4 MB',                             // File size metadata
            label: 'Download'                            // Button action text: 'Download', 'Open', or 'Visit'
          },
          { 
            id: 'f7-1-2', 
            name: 'Kali Linux VM Starter Pack', 
            type: 'zip', 
            path: 'D:/My Courses And Imp data/Security/VM-Kali.zip', 
            size: '3.2 GB', 
            label: 'Download' 
          }
        ]
      }
    ],
```

---

## 📝 5. How to Add New Notes (Hub Documents)

Notes are lecture summaries, cheat sheets, or PDFs that aggregate automatically inside the unified **Notes Hub**.

### Step-by-Step Instructions:
1. Open your target course database file (e.g. `js/data/course_c7.js`).
2. Add a new document object inside the `notes: [...]` array.
3. Make sure to specify the correct document extension (`type`) so the system renders the appropriate file icon dynamically.

### Sample Code (Insert inside `notes` array):
```javascript
    notes: [
      {
        id: 'n7-1',                                                 // Format: n[courseId]-[notesIndex]
        title: 'Port Scanning & Nmap Cheat Sheet',                  // Notes Title shown in Notes Hub
        type: 'pdf',                                                // Extension: 'pdf', 'md', 'doc', 'docx', or 'txt'
        file: 'D:/My Courses And Imp data/Security/nmap-cheatsheet.pdf', // Path to the file on local storage
        size: '145 KB',                                             // Notes file size
        description: 'Complete synthesis of Nmap target syntax, ports, scans, and security flags.'
      },
      {
        id: 'n7-2',
        title: 'Linux Privilege Escalation Notes',
        type: 'md',
        file: 'D:/My Courses And Imp data/Security/linux-privesc.md',
        size: '42 KB',
        description: 'Markdown summaries of Linux kernel bypass exploits.'
      }
    ],
```

---

## 🔍 How to Verify Your Content:
1. Save your changes and open **`index.html`** in your browser.
2. Go to the **Dashboard** — your course count will increase and categories will auto-populate as interactive filter chips!
3. Click on **Courses** — your new course card will display with a custom, glowing neon gradient matching its title automatically.
4. Click on **Notes** — your new lecture notes will appear aggregated inside the Bento layout, complete with their file-type badges.
5. Click on **Resources** — your download cards will be compiled inside the resource block indices.
6. Click your course and open a video — the built-in cinema playlist sidebar will load your custom videos, letting you watch and record progress persistently!
