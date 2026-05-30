/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/app.js
   Core Controller with persistence, validation, and real modules.
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── LOCALSTORAGE PERSISTENCE HELPERS ─── */
  
  // Load saved course & video progress
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('rs-elearning-hub-user-progress') || localStorage.getItem('luminary-user-progress');
      if (saved) {
        const progressData = JSON.parse(saved);
        AppData.courses.forEach(course => {
          const savedCourse = progressData[course.id];
          if (savedCourse) {
            course.progress = savedCourse.progress !== undefined ? savedCourse.progress : 0;
            if (course.videos && savedCourse.watchedVideos) {
              course.videos.forEach(video => {
                video.watched = savedCourse.watchedVideos.includes(video.id);
              });
            }
          }
        });
      }
    } catch (e) {
      console.error('Error loading progress state:', e);
    }
  };

  // Save course & video progress
  const saveStateToLocalStorage = () => {
    try {
      const progressData = {};
      AppData.courses.forEach(course => {
        progressData[course.id] = {
          progress: course.progress || 0,
          watchedVideos: course.videos ? course.videos.filter(v => v.watched).map(v => v.id) : []
        };
      });
      localStorage.setItem('rs-elearning-hub-user-progress', JSON.stringify(progressData));
    } catch (e) {
      console.error('Error saving progress state:', e);
    }
  };

  // Load custom profile
  const loadProfile = () => {
    try {
      const saved = localStorage.getItem('rs-elearning-hub-user-profile') || localStorage.getItem('luminary-user-profile');
      if (saved) {
        const profile = JSON.parse(saved);
        if (profile.name) AppData.user.name = profile.name;
        if (profile.goal) AppData.user.goal = profile.goal;
        if (profile.initials) AppData.user.initials = profile.initials;
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  };

  // Save profile info
  const saveProfileToLocalStorage = () => {
    try {
      localStorage.setItem('rs-elearning-hub-user-profile', JSON.stringify({
        name: AppData.user.name,
        goal: AppData.user.goal,
        initials: AppData.user.initials || UI.initials(AppData.user.name)
      }));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };


  /* ─── MAIN APPLICATION STATE ─── */
  
  const state = {
    courses: AppData.courses || [],
    selectedCourse: null,
    activeSection: 'dashboard',
    searchTerm: '',
    activeFilter: 'All',
  };


  /* ─── INITIALIZATION ─── */
  
  const init = () => {
    // 1. Load persistent data from localStorage
    loadProfile();
    loadSavedState();

    // 2. Initialize UI modules
    Theme.init();
    UI.initMobileMenu();
    setupProfile();
    setupFilterChips();
    
    // 3. Render all core UI components
    renderAll();
    bindGlobalEvents();
    renderSettings();

    // 4. Default selected course
    if (state.courses.length > 0) {
      state.selectedCourse = state.courses[0];
    }

    // 5. Sidebar Collapse Feature
    const isSidebarCollapsed = localStorage.getItem('rs-elearning-hub-sidebar-collapsed') === 'true' || localStorage.getItem('luminary-sidebar-collapsed') === 'true';
    const appShell = document.querySelector('.app-shell');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    
    if (appShell && isSidebarCollapsed) {
      appShell.classList.add('sidebar-collapsed');
      const iconPath = document.getElementById('toggleIconPath');
      if (iconPath) iconPath.setAttribute('d', 'M9 18l6-6-6-6'); // Point right
    }
    
    if (toggleBtn && appShell) {
      toggleBtn.addEventListener('click', () => {
        const currentlyCollapsed = appShell.classList.toggle('sidebar-collapsed');
        localStorage.setItem('rs-elearning-hub-sidebar-collapsed', currentlyCollapsed);
        
        const iconPath = document.getElementById('toggleIconPath');
        if (iconPath) {
          if (currentlyCollapsed) {
            iconPath.setAttribute('d', 'M9 18l6-6-6-6'); // Point right
          } else {
            iconPath.setAttribute('d', 'M15 18l-6-6 6-6'); // Point left
          }
        }
      });
    }

    // Shortcut search focus with '/'
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) searchInput.focus();
      }
    });

    console.log('🚀 RS E-LEARNING HUB: Initialized successfully using real modules!');
  };


  /* ─── RENDER CONTROLLER ─── */
  
  const renderAll = () => {
    renderHero();
    Progress.renderStatsGrid(state.courses);
    Courses.renderFeaturedCourse(state.courses);
    renderFilteredCourses();
    Courses.renderCoursesGrid(state.courses, 'coursesGridFull');
    Resources.renderResourcesOverview(state.courses);
    Notes.renderNotesOverview(state.courses);
    Progress.renderProgressSection(state.courses);
  };

  const renderHero = () => {
    const greetingEl = document.getElementById('heroGreeting');
    const nameEl = document.getElementById('heroName');
    const subEl = document.getElementById('heroSub');

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    if (greetingEl) greetingEl.textContent = greeting;
    if (nameEl) nameEl.textContent = AppData.user.name;
    
    // Sync Left Sidebar Username
    const sidebarUserEl = document.getElementById('sidebarUsername');
    if (sidebarUserEl) sidebarUserEl.textContent = AppData.user.name;

    if (subEl) {
      const stats = Progress.computeStats(state.courses);
      subEl.textContent = `${stats.overallProgress}% overall progress · ${stats.completedCourses} of ${stats.totalCourses} courses completed`;
    }
  };

  const setupProfile = () => {
    const initialsEl = document.getElementById('avatarInitials');
    if (initialsEl) initialsEl.textContent = AppData.user.initials || UI.initials(AppData.user.name);

    // Sync Left Sidebar Avatar
    const sidebarAvatarEl = document.getElementById('sidebarAvatarInitials');
    if (sidebarAvatarEl) sidebarAvatarEl.textContent = AppData.user.initials || UI.initials(AppData.user.name);

    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        showSection('settings');
      });
    }

    // Connect Sidebar Profile button click to show settings
    const sidebarProfileBtn = document.getElementById('sidebarProfileBtn');
    if (sidebarProfileBtn) {
      sidebarProfileBtn.addEventListener('click', () => {
        showSection('settings');
      });
    }
  };

  const setupFilterChips = () => {
    renderFilterChips('filterChips');
    renderFilterChips('courseFilterChips');
  };

  const renderFilterChips = (containerId) => {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = AppData.allFilters.map(f => `
      <button class="filter-chip ${f === state.activeFilter ? 'active' : ''}" data-filter="${UI.esc(f)}">
        ${UI.esc(f)}
      </button>`).join('');

    el.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      const filter = chip.dataset.filter;
      if (filter) {
        state.activeFilter = filter;
        document.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.filter === filter);
        });
        renderFilteredCourses();
      }
    });
  };

  const renderFilteredCourses = () => {
    const filtered = Courses.filterCourses(state.courses, {
      search: state.searchTerm,
      filter: state.activeFilter,
    });
    Courses.renderCoursesGrid(filtered, 'coursesGrid');
    Courses.renderCoursesGrid(filtered, 'coursesGridFull');
  };

  const showSection = (sectionId) => {
    state.activeSection = sectionId;
    UI.showSection(sectionId);
    UI.scrollToTop();
  };

  const openCourseDetail = (courseId) => {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;
    state.selectedCourse = course;
    Courses.renderCourseDetails(course);
    showSection('courseDetail');
  };


  /* ─── DYNAMIC VIDEO PROGRESS INTERFACE ─── */
  
  window.updateVideoProgress = (courseId, videoData) => {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    // Find target video by ID or title
    const video = course.videos ? course.videos.find(v => v.id === videoData.id || v.title === videoData.title) : null;
    if (video) {
      video.watched = true;

      // Recalculate progress for this course
      const totalVideos = course.videos ? course.videos.length : 0;
      const watchedVideos = course.videos ? course.videos.filter(v => v.watched).length : 0;
      course.progress = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;

      // Save state to localStorage & re-render UI
      saveStateToLocalStorage();
      renderAll();

      // Refresh details panel if currently open
      if (state.activeSection === 'courseDetail' && state.selectedCourse && state.selectedCourse.id === courseId) {
        Courses.renderCourseDetails(course);
      }
    }
  };


  /* ─── EVENT BINDINGS ─── */
  
  const bindGlobalEvents = () => {
    document.addEventListener('click', (e) => {
      // 1. Navigation links
      const navLink = e.target.closest('.nav-link');
      if (navLink && navLink.dataset.section) {
        e.preventDefault();
        showSection(navLink.dataset.section);
      }

      // 2. Course card clicks
      const card = e.target.closest('.course-card');
      if (card && card.dataset.courseId) {
        openCourseDetail(card.dataset.courseId);
      }

      // 3. Featured course card clicks
      const featured = e.target.closest('.featured-card');
      if (featured && featured.dataset.courseId) {
        openCourseDetail(featured.dataset.courseId);
      }

      // 4. Mark all videos watched click
      if (e.target.id === 'markAllWatched') {
        if (state.selectedCourse) {
          const course = state.courses.find(c => c.id === state.selectedCourse.id);
          if (course && course.videos) {
            course.videos.forEach(v => v.watched = true);
            course.progress = 100;
            saveStateToLocalStorage();
            renderAll();
            Courses.renderCourseDetails(course);
          }
        }
      }
    });

    // Support keyboard Enter key to open course details
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const card = e.target.closest('.course-card');
        if (card && card.dataset.courseId) openCourseDetail(card.dataset.courseId);
        const featured = e.target.closest('.featured-card');
        if (featured && featured.dataset.courseId) openCourseDetail(featured.dataset.courseId);
      }
    });

    const backBtn = document.getElementById('backFromDetail');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        showSection('courses');
      });
    }

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        const inProgress = state.courses.find(c => (c.progress || 0) > 0 && (c.progress || 0) < 100);
        const target = inProgress || state.courses[0];
        if (target) openCourseDetail(target.id);
      });
    }

    // Search bar logic
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.searchTerm = e.target.value || '';
          renderFilteredCourses();
        }, 200);
      });
    }

    // Bind resources & notes events
    Resources.bindEvents();
    Notes.bindEvents();
  };

  const renderSettings = () => {
    const el = document.getElementById('settingsContent');
    if (!el) return;

    const user = AppData.user;
    el.innerHTML = `
      <div class="settings-grid">
        <div class="settings-card">
          <h3>Profile</h3>
          <div class="settings-field">
            <label>Display Name</label>
            <input type="text" id="profileNameInput" class="settings-input" value="${UI.esc(user.name)}" placeholder="Enter your name" />
          </div>
          <div class="settings-field">
            <label>Learning Goal</label>
            <input type="text" id="profileGoalInput" class="settings-input" value="${UI.esc(user.goal)}" placeholder="Enter your goal" />
          </div>
          <button class="btn btn-primary btn-sm" id="saveProfile">Save Profile</button>
        </div>
        <div class="settings-card">
          <h3>System Info</h3>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">RS E-LEARNING HUB v1.0 · Cyber Neon RGB Edition</div>
          <div style="font-size:0.85rem;color:var(--text-muted)">Immersive Cyber Neon theme is compiled and strictly enforced.</div>
        </div>
      </div>`;

    const saveBtn = document.getElementById('saveProfile');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const nameEl = document.getElementById('profileNameInput');
        const goalEl = document.getElementById('profileGoalInput');
        const name = nameEl ? nameEl.value.trim() : '';
        const goal = goalEl ? goalEl.value.trim() : '';
      
      if (name) {
        AppData.user.name = name;
        AppData.user.initials = UI.initials(name);
        document.getElementById('avatarInitials').textContent = AppData.user.initials;
        
        const sidebarAvatar = document.getElementById('sidebarAvatarInitials');
        if (sidebarAvatar) sidebarAvatar.textContent = AppData.user.initials;
        
        document.getElementById('heroName').textContent = name;
        
        const sidebarUser = document.getElementById('sidebarUsername');
        if (sidebarUser) sidebarUser.textContent = name;
      }
      if (goal) {
        AppData.user.goal = goal;
      }
      
      saveProfileToLocalStorage();
      renderAll();
      
      // Show saved alert / visual feedback
      const saveBtn = document.getElementById('saveProfile');
      if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved Successfully!';
        saveBtn.style.background = 'var(--success)';
        saveBtn.style.color = '#fff';
        setTimeout(() => {
          saveBtn.textContent = originalText;
          saveBtn.style.background = '';
          saveBtn.style.color = '';
        }, 1500);
      }
    });
  }
};


  /* ─── INITIALIZE APP ─── */
  init();

});