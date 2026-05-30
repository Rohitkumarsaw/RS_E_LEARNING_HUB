/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/courses.js (REDESIGNED ULTRA-PREMIUM SIDEBAR EDITION)
   ═══════════════════════════════════════════════════════════════ */

const Courses = (() => {

  const getDynamicAvatarStyle = (title) => {
    const getInitials = (name) => {
      if (!name) return '?';
      return name.split(' ')
          .map(word => word[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
    };
    const stringToHue = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash) % 360;
    };
    
    const initials = getInitials(title);
    const hue = stringToHue(title);
    
    const style = `background: linear-gradient(135deg, hsl(${hue}, 70%, 20%), hsl(${hue}, 90%, 10%)); color: hsl(${hue}, 100%, 80%); border: 1px solid hsl(${hue}, 70%, 40%); box-shadow: 0 0 10px hsl(${hue}, 70%, 20%);`;
    return { initials, style, hue };
  };

  const normalizeVideoSource = (src) => {
    if (!src) return '';
    let videoUrl = src.trim();
    const isLocalAbsolute = /^[a-zA-Z]:[/\\]/.test(videoUrl);
    if (isLocalAbsolute) {
      videoUrl = videoUrl.replace(/\\/g, '/');
      if (!videoUrl.startsWith('file:///')) {
        videoUrl = 'file:///' + videoUrl;
      }
    }
    return videoUrl;
  };

  /* ─── Render Courses Grid ─── */
  const renderCoursesGrid = (courses = [], containerId = 'coursesGrid') => {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!courses.length) {
      el.innerHTML = `<div class="no-results">
        <h3>No courses found</h3>
        <p>Try adjusting your search or filter.</p>
      </div>`;
      return;
    }

    const frag = document.createDocumentFragment();

    courses.forEach(course => {
      const card = createCourseCardElement(course);
      frag.appendChild(card);
    });

    el.innerHTML = '';
    el.appendChild(frag);

    const countEl = document.getElementById('courseCount');
    if (countEl) countEl.textContent = `${courses.length} courses`;
  };

  const createCourseCardElement = (course) => {
    const div = document.createElement('div');
    div.className = 'course-card glass-shine';
    div.dataset.courseId = course.id;
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', `Open course: ${course.title}`);
    div.innerHTML = renderCourseCard(course);
    return div;
  };

  /* ─── REDESIGNED ULTRA-SLIM COURSE CARD ─── */
  const renderCourseCard = (course) => {
    const videoCount = course.videos ? course.videos.length : 0;
    const noteCount = course.notes ? course.notes.length : 0;
    const resourceCount = (course.resources || []).reduce((acc, r) => acc + (r.files ? r.files.length : 0), 0);
    const pct = course.progress || 0;

    const avatarData = getDynamicAvatarStyle(course.title);
    const placeholderHTML = `<div class="course-thumb-placeholder" style="${avatarData.style} width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:2rem;">${avatarData.initials}</div>`;

    const thumbHTML = course.thumbnail && course.thumbnail !== '#'
      ? `<img src="${UI.esc(course.thumbnail)}" alt="${UI.esc(course.title)} thumbnail" loading="lazy" onerror="this.parentElement.innerHTML='${placeholderHTML.replace(/'/g, "\\'")}'">`
      : placeholderHTML;

    return `
      <div class="course-thumb">
        ${thumbHTML}
        <span class="course-category-badge">${UI.esc(course.category)}</span>
      </div>
      <div class="course-body">
        <div class="course-header-row">
          <h3 class="course-title" title="${UI.esc(course.title)}">${UI.esc(course.title)}</h3>
          ${UI.badge(course.level, course.level)}
        </div>
        <div class="course-subtitle">${UI.esc(course.subtitle)}</div>
        
        <!-- Premium Capsules for stats -->
        <div class="course-stats">
          <span class="course-stat-pill">🎬 <strong>${videoCount}</strong> vids</span>
          <span class="course-stat-pill">📝 <strong>${noteCount}</strong> notes</span>
          <span class="course-stat-pill">📦 <strong>${resourceCount}</strong> files</span>
        </div>
        
        <div class="course-progress-wrap">
          <div class="progress-row">
            <span class="progress-label">Progress</span>
            <span class="progress-pct">${pct}%</span>
          </div>
          ${UI.progressBar(pct)}
        </div>
      </div>`;
  };

  const renderFeaturedCourse = (courses = []) => {
    const el = document.getElementById('featuredBlock');
    if (!el) return;

    const featured = courses.find(c => c.featured === true);

    if (!featured) {
      el.innerHTML = '';
      el.style.display = 'none';
      return;
    }

    el.style.display = 'block';

    const videoCount = featured.videos ? featured.videos.length : 0;
    const pct = featured.progress || 0;

    const avatarData = getDynamicAvatarStyle(featured.title || '');
    const placeholderHTML = `<div class="course-thumb-placeholder" style="${avatarData.style} width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:3rem;">${avatarData.initials}</div>`;

    const imgHTML = (featured.banner || featured.thumbnail) && featured.thumbnail !== '#'
      ? `<img src="${UI.esc(featured.banner || featured.thumbnail)}" alt="${UI.esc(featured.title)} banner" loading="lazy" onerror="this.parentElement.innerHTML='${placeholderHTML.replace(/'/g, "\\'")}'">`
      : placeholderHTML;

    el.innerHTML = `
      <div class="section-header" style="margin-bottom:12px">
        <h2 class="section-title" style="font-size:1.05rem;color:var(--text-muted)">⭐ Featured Course</h2>
      </div>
      <div class="featured-card glass-shine neon-border" data-course-id="${UI.esc(featured.id)}" role="button" tabindex="0" aria-label="Open featured course: ${UI.esc(featured.title)}">
        <div class="featured-body">
          <div class="featured-eyebrow">
            <span>⭐ Spotlight</span>
            <span class="featured-badge">${UI.esc(featured.category || '')}</span>
          </div>
          <h2 class="featured-title">${UI.esc(featured.title || '')}</h2>
          <p class="featured-desc">${UI.esc(UI.truncate(featured.description || '', 140))}</p>
          <div class="featured-meta">
            <div class="featured-meta-item">
              <span class="featured-meta-value">${videoCount}</span>
              <span class="featured-meta-label">Videos</span>
            </div>
            <div class="featured-meta-item">
              <span class="featured-meta-value">${featured.duration || '—'}</span>
              <span class="featured-meta-label">Duration</span>
            </div>
            <div class="featured-meta-item">
              <span class="featured-meta-value">${pct}%</span>
              <span class="featured-meta-label">Progress</span>
            </div>
          </div>
          <button class="btn btn-primary btn-glow btn-sm">Open Course →</button>
        </div>
        <div class="featured-img">${imgHTML}</div>
      </div>`;
  };


  /* ─── REDESIGNED CINEMATIC COURSE DETAIL PAGE ─── */
  const renderCourseDetails = (course) => {
    const el = document.getElementById('courseDetailContent');
    if (!el || !course) return;

    const videoCount = course.videos ? course.videos.length : 0;
    const noteCount = course.notes ? course.notes.length : 0;
    const resourceCount = (course.resources || []).reduce((acc, r) => acc + (r.files ? r.files.length : 0), 0);
    const pct = course.progress || 0;

    const avatarData = getDynamicAvatarStyle(course.title || '');

    // Premium blurred backdrop header styling using HSL fallback
    const bannerStyle = (course.banner || course.thumbnail) && course.thumbnail !== '#'
      ? `background-image: linear-gradient(180deg, rgba(4,7,20,0.3) 0%, rgba(4,7,20,0.85) 100%), url('${UI.esc(course.banner || course.thumbnail)}');`
      : `background: linear-gradient(135deg, hsl(${avatarData.hue}, 70%, 20%), hsl(${avatarData.hue}, 90%, 10%)); border: 1px solid hsl(${avatarData.hue}, 70%, 40%);`;

    el.innerHTML = `
      <!-- Cinematic Glass Header Banner -->
      <div class="course-detail-hero glass-shine neon-border" style="${bannerStyle}">
        <div class="course-detail-hero-content">
          <div class="course-detail-eyebrow">${UI.esc(course.category)}</div>
          <h1 class="course-detail-title">${UI.esc(course.title)}</h1>
          <p class="course-detail-subtitle">${UI.esc(course.subtitle)}</p>
          <div class="course-detail-info">
            ${UI.badge(course.level, course.level)}
            ${UI.infoPill(`⏱ ${UI.esc(course.duration || '—')}`)}
            ${UI.infoPill(`🎬 ${videoCount} videos`)}
            ${UI.infoPill(`📝 ${noteCount} notes`)}
            ${UI.infoPill(`📦 ${resourceCount} files`)}
          </div>
          <div class="course-detail-tags">
            ${(course.tags || []).map(t => UI.tag(t)).join('')}
          </div>
          
          <div class="course-detail-progress-section">
            <div class="progress-row">
              <span class="progress-label">Course Progress</span>
              <span class="progress-pct">${pct}%</span>
            </div>
            ${UI.progressBar(pct, { height: 4 })}
          </div>
        </div>
      </div>

      <!-- Modern 2-Column Split Workspace Layout -->
      <div class="course-workspace-layout">
        
        <!-- Left Main Panel: Tab Content -->
        <div class="course-main-panel">
          <div class="course-tabs" role="tablist">
            <button class="course-tab active" data-tab="overview" role="tab">Overview</button>
            <button class="course-tab" data-tab="videos" role="tab">Videos <span>${videoCount}</span></button>
            <button class="course-tab" data-tab="notes" role="tab">Notes <span>${noteCount}</span></button>
            <button class="course-tab" data-tab="resources" role="tab">Resources <span>${resourceCount}</span></button>
            <button class="course-tab" data-tab="progress" role="tab">Progress</button>
          </div>

          <div id="tabOverview" class="tab-panel active">${renderCourseOverview(course)}</div>
          <div id="tabVideos" class="tab-panel">${renderCourseVideos(course)}</div>
          <div id="tabNotes" class="tab-panel">${renderCourseNotes(course)}</div>
          <div id="tabResources" class="tab-panel">${Resources.renderCourseResources(course)}</div>
          <div id="tabProgress" class="tab-panel">${renderCourseProgressTab(course)}</div>
        </div>

        <!-- Right Sidebar Panel: Companion & Syllabus Details -->
        <div class="course-sidebar-panel">
          <div class="sidebar-help-card neon-border">
            <h4>💡 Learning Assistant</h4>
            <p>Click on any video in the videos tab to open the high-end Cinematic Modal Player. Your progress is dynamically synced and saved to localStorage.</p>
            <div class="quick-meta-list">
              <div class="quick-meta-item"><span>Status</span><span>${pct >= 100 ? '✅ Completed' : pct > 0 ? '🔄 In Progress' : '⏸ Not Started'}</span></div>
              <div class="quick-meta-item"><span>Level</span><span style="text-transform: capitalize;">${course.level}</span></div>
              <div class="quick-meta-item"><span>Category</span><span>${course.category}</span></div>
              <div class="quick-meta-item"><span>Tags</span><span>${(course.tags || []).slice(0,3).join(', ') || 'None'}</span></div>
            </div>
          </div>
        </div>

      </div>
    `;

    bindTabEvents(el, course);
  };

  const renderCourseOverview = (course) => {
    return `
      <div class="course-overview-wrapper">
        <h3>About this Course</h3>
        <p class="course-overview-desc">${UI.esc(course.description || 'No description available for this course.')}</p>
      </div>`;
  };

  const renderCourseVideos = (course) => {
    const videos = course.videos || [];
    if (!videos.length) return UI.emptyState({ icon: '🎬', title: 'No videos yet', desc: 'No videos have been added to this course.' });

    return `<div class="video-list">
      ${videos.map((v, i) => renderVideoItem(v, i + 1, course.id)).join('')}
    </div>`;
  };

  const renderVideoItem = (video, num = 1, courseId = null) => {
    const thumbHTML = video.thumbnail && video.thumbnail !== '#'
      ? `<img src="${UI.esc(video.thumbnail)}" alt="${UI.esc(video.title)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div style="width:100%;height:100%;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:var(--tx-xs)">${String(num).padStart(2, '0')}</div>`;

    return `
      <div class="video-item"
           data-video-src="${UI.esc(video.source || '')}"
           data-video-title="${UI.esc(video.title)}"
           data-video-description="${UI.esc(video.description || '')}"
           data-video-duration="${UI.esc(video.duration || '—')}"
           data-course-id="${UI.esc(courseId || '')}"
           data-video-watched="${video.watched || false}">
        <div class="video-thumb">
          ${thumbHTML}
          <div class="video-play-overlay"><div class="play-icon">▶</div></div>
        </div>
        <div class="video-info">
          <div class="video-title">${UI.esc(video.title)}</div>
        </div>
        <span class="video-duration">${UI.esc(video.duration || '—')}</span>
        <span class="video-watched ${video.watched ? 'done' : 'pending'}">${video.watched ? '✓' : '○'}</span>
      </div>`;
  };

  const renderCourseNotes = (course) => {
    const notes = course.notes || [];
    if (!notes.length) return UI.emptyState({ icon: '📝', title: 'No notes yet', desc: 'No notes have been added to this course.' });

    return `<div class="notes-grid">${notes.map(n => renderNoteCard(n)).join('')}</div>`;
  };

  const renderNoteCard = (note) => {
    const type = (note.type || 'other').toLowerCase();
    return `
      <div class="note-card glass-shine" data-note-file="${UI.esc(note.file || '')}">
        <div class="note-type-icon note-type-${type}">${UI.noteTypeIcon(type)}</div>
        <div class="note-title">${UI.esc(note.title)}</div>
        <div class="note-desc">${UI.esc(note.description || '')}</div>
        <div class="note-footer">
          <span class="note-size">${UI.esc(note.size || '')}</span>
          <span class="btn btn-ghost btn-sm">Open →</span>
        </div>
      </div>`;
  };

  const renderCourseProgressTab = (course) => {
    const pct = course.progress || 0;
    const videos = course.videos || [];
    const watched = videos.filter(v => v.watched).length;

    return `
      <div style="max-width:600px">
        <div class="course-stats-sidebar" style="margin-bottom:24px; background:rgba(255,255,255,0.02)">
          <div class="sidebar-stat"><span>Overall Progress</span><span>${pct}%</span></div>
          <div class="sidebar-stat"><span>Videos Watched</span><span>${watched} / ${videos.length}</span></div>
          <div class="sidebar-stat"><span>Status</span><span>${pct >= 100 ? '✅ Completed' : pct > 0 ? '🔄 In Progress' : '⏸ Not Started'}</span></div>
        </div>
        <div style="margin-bottom:16px">
          <div class="progress-row"><span>Course Completion</span><span>${pct}%</span></div>
          ${UI.progressBar(pct, { height: 4 })}
        </div>
        <div style="margin-top:24px">
          <button class="btn btn-secondary btn-sm btn-glow" id="markAllWatched">Mark All Videos Watched</button>
        </div>
      </div>`;
  };


  /* ─── REDESIGNED DYNAMIC CINEMA VIDEO MODAL PLAYER ─── */
  
  const openVideoPlayer = (videoData, courseId) => {
    let modal = document.getElementById('videoPlayerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'videoPlayerModal';
      modal.className = 'video-player-modal';
      document.body.appendChild(modal);
    }

    if (videoData.source) {
      videoData.source = normalizeVideoSource(videoData.source);
    }

    document.body.style.overflow = 'hidden';
    modal.innerHTML = renderVideoPlayerModal(videoData, courseId);
    setTimeout(() => modal.classList.add('active'), 10);
    bindVideoPlayerEvents(modal, videoData, courseId);
  };

  const renderVideoPlayerModal = (videoData, courseId) => {
    const src = normalizeVideoSource(videoData.source || '');
    const title = videoData.title || 'Video Player';
    const desc = videoData.description || '';
    const duration = videoData.duration || '—';
    const isWatched = videoData.watched || false;

    // Fetch dynamic course videos playlist
    const course = AppData.courses.find(c => c.id === courseId);
    const videosList = course ? course.videos || [] : [];

    const isYouTube = src.includes('youtube.com/watch') || src.includes('youtu.be');
    const isVimeo = src.includes('vimeo.com');
    
    let embedUrl = src;
    if (isYouTube) {
      const id = extractYouTubeId(src);
      if (id) embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (isVimeo) {
      const id = extractVimeoId(src);
      if (id) embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    return `
      <div class="video-player-overlay" data-close></div>
      <div class="video-player-container neon-border glass-shine">
        
        <!-- Video Modal Header -->
        <div class="video-player-header">
          <div class="video-player-title-section">
            <h2 class="video-player-title">${escapeHtml(title)}</h2>
            <span class="video-player-duration">⏱ ${escapeHtml(duration)}</span>
          </div>
          <button class="video-player-close" data-close>✕</button>
        </div>
        
        <!-- Main Media Frame + Playlist Grid split -->
        <div class="video-player-main">
          
          <!-- Wide Left: Embedded Media Frame -->
          <div class="video-player-wrapper" style="position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            ${isYouTube || isVimeo ? 
              `<iframe id="videoPlayer" src="${escapeHtml(embedUrl)}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen class="video-iframe"></iframe>` :
              `<div class="video-player-frame" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <video id="videoPlayer" class="video-element" src="${escapeHtml(src)}" controls preload="metadata" autoplay style="width: 100%; height: 100%; object-fit: contain;">
                  Your browser does not support video playback.
                </video>
                <!-- Sleek premium sandbox overlay bypass -->
                <div class="sandbox-bypass-overlay" id="sandboxBypassOverlay" style="display: none; position: absolute; inset: 0; background: rgba(5, 5, 8, 0.95); backdrop-filter: blur(15px); flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; z-index: 10;">
                  <div class="lock-icon" style="font-size: 2.5rem; margin-bottom: 12px; filter: drop-shadow(0 0 8px var(--accent-a));">🔒</div>
                  <h3 style="font-family: var(--font-display); color: #fff; margin-bottom: 6px; font-size: 1rem; letter-spacing: 0.05em;">BROWSER SANDBOX RESTRICTION</h3>
                  <p style="color: var(--text-muted); font-size: 0.75rem; max-width: 380px; margin-bottom: 18px; line-height: 1.5;">Modern browsers block loading video files directly from other drives (like <code>D:</code>) due to security sandboxing rules.</p>
                  
                  <label class="btn btn-primary btn-glow" style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; font-size: 0.8rem; border-radius: var(--r-pill);">
                    📁 Select Local Video File
                    <input type="file" id="localFilePicker" accept="video/*" style="display: none;" />
                  </label>
                  
                  <span style="font-size: 0.68rem; color: var(--text-muted); margin-top: 12px; display: block; max-width: 320px; line-height: 1.3;">
                    Please select the corresponding video file from your disk to play it instantly.
                  </span>
                </div>
              </div>`
            }
          </div>
          
          <!-- Narrow Right: Info Panel & dynamic Playlist -->
          <div class="video-player-sidebar">
            <div class="video-info-panel">
              <div class="video-info-section">
                <h3>About this video</h3>
                <p>${escapeHtml(desc) || 'No description available.'}</p>
              </div>
              ${/^[a-zA-Z]:[/\\]|file:\/\/\//.test(videoData.source || '') ? `
                <div class="local-resource-warning neon-border" style="margin-top: var(--sp-3); padding: var(--sp-3); background: rgba(0, 243, 255, 0.05); border: 1px solid rgba(0, 243, 255, 0.2); border-radius: var(--r-md); font-size: var(--tx-2xs); line-height: 1.4; color: var(--accent-b); margin-bottom: var(--sp-3);">
                  <strong>💡 Sandbox Note:</strong> If this video fails to load automatically, click the "Select Local Video File" inside the player, or click "Open Local File" below to choose it.
                </div>
              ` : ''}
              <div class="video-actions">
                <button class="btn btn-primary btn-glow" id="markWatchedBtn" style="width: 100%; margin-bottom: var(--sp-2);">
                  <span class="mark-icon">${isWatched ? '✓' : '○'}</span>
                  ${isWatched ? 'Marked as Watched' : 'Mark as Watched'}
                </button>
                ${!isYouTube && !isVimeo ? `
                  <label class="btn btn-secondary btn-glow" style="width: 100%; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.55rem 1rem; font-size: 0.8rem; border-radius: var(--r-md); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
                    📁 Open Local File
                    <input type="file" id="manualFilePicker" accept="video/*" style="display: none;" />
                  </label>
                ` : ''}
              </div>
            </div>

            <!-- Dynamic Interactive Course Playlist Sidebar -->
            <div class="video-player-playlist">
              <h3>Course Playlist</h3>
              <div class="playlist-items">
                ${videosList.map((v, i) => `
                  <div class="playlist-item ${v.title === title ? 'active' : ''}" 
                       data-video-idx="${i}" 
                       data-video-src="${escapeHtml(normalizeVideoSource(v.source))}"
                       data-video-title="${escapeHtml(v.title)}"
                       data-video-desc="${escapeHtml(v.description || '')}"
                       data-video-duration="${escapeHtml(v.duration || '')}"
                       data-video-watched="${v.watched || false}">
                    <span class="playlist-idx">${String(i + 1).padStart(2, '0')}</span>
                    <div class="playlist-info">
                      <div class="playlist-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
                      <div class="playlist-meta">${escapeHtml(v.duration || '—')}</div>
                    </div>
                    <span class="playlist-status ${v.watched ? 'done' : 'pending'}">${v.watched ? '✓' : '○'}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    `;
  };

  const bindVideoPlayerEvents = (container, videoData, courseId) => {
    container.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeVideoPlayer());
    });

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeVideoPlayer();
        document.removeEventListener('keydown', escHandler);
      }
    });

    // Sandbox bypass local file pickers
    const videoEl = container.querySelector('#videoPlayer');
    const bypassOverlay = container.querySelector('#sandboxBypassOverlay');
    const localFilePicker = container.querySelector('#localFilePicker');
    const manualFilePicker = container.querySelector('#manualFilePicker');

    const handleFileSelection = (file) => {
      if (file && videoEl) {
        const objectUrl = URL.createObjectURL(file);
        videoEl.src = objectUrl;
        videoEl.load();
        if (bypassOverlay) {
          bypassOverlay.style.display = 'none';
        }
        const playPromise = videoEl.play();
        if (playPromise !== undefined && typeof playPromise.then === 'function') {
          playPromise.catch(err => console.log('Error playing selected file:', err));
        }
      }
    };

    if (localFilePicker) {
      localFilePicker.addEventListener('change', (e) => {
        handleFileSelection(e.target.files[0]);
      });
    }

    if (manualFilePicker) {
      manualFilePicker.addEventListener('change', (e) => {
        handleFileSelection(e.target.files[0]);
      });
    }

    if (videoEl && bypassOverlay) {
      const handleLoadError = () => {
        const src = videoEl.src;
        if ((src.startsWith('file://') || src.includes(':/')) && !src.startsWith('blob:')) {
          bypassOverlay.style.display = 'flex';
        }
      };

      videoEl.addEventListener('error', handleLoadError, true);
      
      // Keep checking if the video failed to load immediately
      setTimeout(() => {
        if (videoEl.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
          handleLoadError();
        }
      }, 600);
    }

    // Mark as watched state button listener inside player
    const markWatchedBtn = container.querySelector('#markWatchedBtn');
    if (markWatchedBtn) {
      markWatchedBtn.addEventListener('click', () => {
        const isWatched = markWatchedBtn.querySelector('.mark-icon').textContent === '✓';
        if (!isWatched) {
          markWatchedBtn.querySelector('.mark-icon').textContent = '✓';
          markWatchedBtn.innerHTML = '<span class="mark-icon">✓</span> Marked as Watched';
          videoData.watched = true;
          
          // Find current active playlist item status and update it to ✓
          const activePlaylistItem = container.querySelector('.playlist-item.active');
          if (activePlaylistItem) {
            activePlaylistItem.dataset.videoWatched = 'true';
            const statusSpan = activePlaylistItem.querySelector('.playlist-status');
            if (statusSpan) {
              statusSpan.textContent = '✓';
              statusSpan.className = 'playlist-status done';
            }
          }

          if (typeof window.updateVideoProgress === 'function') {
            window.updateVideoProgress(courseId, videoData);
          }
        }
      });
    }

    // PLAYLIST DYNAMIC INTERACTION - Clicking item swaps the video inside modal player instantly!
    container.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = normalizeVideoSource(item.dataset.videoSrc);
        const title = item.dataset.videoTitle;
        const desc = item.dataset.videoDesc;
        const duration = item.dataset.videoDuration;
        const isWatched = item.dataset.videoWatched === 'true';
        
        // Skip re-load if clicking currently active video
        if (item.classList.contains('active')) return;

        // Update active markers in the playlist DOM
        container.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Update titles and stats in sidebar
        container.querySelector('.video-player-title').textContent = title;
        container.querySelector('.video-player-duration').textContent = '⏱ ' + duration;
        container.querySelector('.video-info-section p').textContent = desc || 'No description available.';

        // Swap out video source data inside object
        videoData.source = src;
        videoData.title = title;
        videoData.description = desc;
        videoData.duration = duration;
        videoData.watched = isWatched;

        // Re-render button state
        const btn = container.querySelector('#markWatchedBtn');
        if (btn) {
          btn.querySelector('.mark-icon').textContent = isWatched ? '✓' : '○';
          btn.innerHTML = `<span class="mark-icon">${isWatched ? '✓' : '○'}</span> ${isWatched ? 'Marked as Watched' : 'Mark as Watched'}`;
        }

        const videoEl = container.querySelector('video');
        const iframeEl = container.querySelector('iframe');
        
        const isYouTube = src.includes('youtube.com/watch') || src.includes('youtu.be');
        const isVimeo = src.includes('vimeo.com');
        
        let embedUrl = src;
        if (isYouTube) {
          const id = extractYouTubeId(src);
          if (id) embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
        } else if (isVimeo) {
          const id = extractVimeoId(src);
          if (id) embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1`;
        }

        // Hot-swap player elements or fully redraw nodes if switching element types
        if (iframeEl && (isYouTube || isVimeo)) {
          iframeEl.src = embedUrl;
        } else if (videoEl && !isYouTube && !isVimeo) {
          videoEl.src = src;
          videoEl.load();
          const playPromise = videoEl.play();
          if (playPromise !== undefined && typeof playPromise.then === 'function') {
            playPromise.catch(err => console.log('Auto-play blocked by browser:', err));
          }
        } else {
          // Re-draw whole interior to handle switching between standard video tags & IFRAMES
          const modal = document.getElementById('videoPlayerModal');
          if (modal) {
            modal.innerHTML = renderVideoPlayerModal(videoData, courseId);
            bindVideoPlayerEvents(modal, videoData, courseId);
          }
        }
      });
    });
  };

  const closeVideoPlayer = () => {
    const modal = document.getElementById('videoPlayerModal');
    if (modal) {
      modal.classList.remove('active');
      const iframe = modal.querySelector('iframe');
      const video = modal.querySelector('video');
      if (iframe) iframe.src = '';
      if (video) { video.pause(); video.src = ''; }
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const extractVimeoId = (url) => {
    const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  };

  /* ─── CLEAN VIDEO PLAYER ─── */
  const launchPlayer = (src, title) => {
    const isYouTube = src.includes('youtube.com/watch') || src.includes('youtu.be');
    const isVimeo = src.includes('vimeo.com');

    let embedUrl = src;
    if (isYouTube) {
      const m = src.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      if (m && m[2] && m[2].length === 11) embedUrl = 'https://www.youtube.com/embed/' + m[2] + '?autoplay=1';
    } else if (isVimeo) {
      const m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (m) embedUrl = 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1';
    }

    document.querySelectorAll('#cvp').forEach(function(el) { el.remove(); });

    var ov = document.createElement('div');
    ov.id = 'cvp';
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.94);display:none;align-items:center;justify-content:center;flex-direction:column;font-family:system-ui,sans-serif;';

    var box = document.createElement('div');
    box.style.cssText = 'width:90vw;max-width:1100px;border-radius:14px;overflow:hidden;background:#000;box-shadow:0 0 0 1px rgba(255,255,255,0.06),0 25px 70px rgba(0,0,0,0.7);position:relative;';

    var bar = document.createElement('div');
    bar.style.cssText = 'position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:linear-gradient(180deg,rgba(0,0,0,0.7),transparent);z-index:2;';

    var lbl = document.createElement('span');
    lbl.style.cssText = 'color:#e0e0e0;font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:calc(100% - 50px);';
    lbl.textContent = title;

    var cls = document.createElement('button');
    cls.style.cssText = 'background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s;';
    cls.textContent = '\u2715';
    cls.onmouseenter = function() { cls.style.background = 'rgba(188,19,254,0.4)'; };
    cls.onmouseleave = function() { cls.style.background = 'rgba(255,255,255,0.1)'; };

    bar.appendChild(lbl);
    bar.appendChild(cls);

    var wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;aspect-ratio:16/9;background:#000;display:flex;align-items:center;justify-content:center;position:relative;';

    function doClose() {
      var v = ov.querySelector('video');
      var f = ov.querySelector('iframe');
      if (v) { v.pause(); v.src = ''; }
      if (f) { f.src = ''; }
      ov.style.display = 'none';
      ov.remove();
      document.body.style.overflow = '';
    }

    cls.onclick = doClose;
    ov.onclick = function(e) { if (e.target === ov) doClose(); };
    document.addEventListener('keydown', function h(e) {
      if (e.key === 'Escape') { doClose(); document.removeEventListener('keydown', h); }
    });

    if (isYouTube || isVimeo) {
      var ifr = document.createElement('iframe');
      ifr.src = embedUrl;
      ifr.allow = 'autoplay; fullscreen';
      ifr.allowFullscreen = true;
      ifr.style.cssText = 'width:100%;height:100%;border:none;';
      wrap.appendChild(ifr);
    } else {
      var vid = document.createElement('video');
      vid.controls = true;
      vid.autoplay = true;
      vid.preload = 'auto';
      vid.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000;';

      var picked = false;

      vid.onloadeddata = function() {
        vid.play().catch(function() {});
      };

      vid.onerror = function() {
        if (picked) return;
        picked = true;
        showPicker();
      };

      function showPicker() {
        wrap.innerHTML = '';
        var pickDiv = document.createElement('div');
        pickDiv.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px;color:#aaa;font-family:system-ui,sans-serif;';
        pickDiv.innerHTML = '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(188,19,254,0.5)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
          + '<label style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:10px;font-size:15px;font-weight:600;color:#fff;background:linear-gradient(135deg,#bc13fe,#00f3ff);cursor:pointer;box-shadow:0 8px 30px rgba(188,19,254,0.3);border:none;">'
          + 'Select Video File<input type="file" accept="video/*" style="display:none;" />'
          + '</label>'
          + '<span style="font-size:12px;color:#555;">Choose the video file from your computer</span>';
        wrap.appendChild(pickDiv);

        var fileInp = pickDiv.querySelector('input[type=file]');
        fileInp.onchange = function(ev) {
          var file = ev.target.files[0];
          if (!file) return;
          vid.src = URL.createObjectURL(file);
          wrap.innerHTML = '';
          wrap.appendChild(vid);
          vid.play().catch(function() {});
        };

        setTimeout(function() { fileInp.click(); }, 300);
      }

      wrap.appendChild(vid);
      vid.src = src;
    }

    box.appendChild(bar);
    box.appendChild(wrap);

    var info = document.createElement('div');
    info.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:14px;color:#555;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;';
    info.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#bc13fe;box-shadow:0 0 8px rgba(188,19,254,0.6);"></span> Now Playing';

    ov.appendChild(box);
    ov.appendChild(info);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    ov.style.display = 'flex';
  };

  /* ─── Tab Event binding inside Details ─── */
  const bindTabEvents = (container, course) => {
    const tabs = container.querySelectorAll('.course-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        if (!target) return;
        tabs.forEach(t => { t.classList.remove('active'); });
        tab.classList.add('active');
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = container.querySelector(`#tab${UI.capitalize(target)}`);
        if (panel) panel.classList.add('active');
      });
    });

    // VIDEO ITEM CLICK - Opens clean video player
    container.addEventListener('click', (e) => {
      const videoItem = e.target.closest('.video-item');
      if (videoItem) {
        e.preventDefault();
        e.stopPropagation();
        
        const src = normalizeVideoSource(videoItem.dataset.videoSrc);
        const title = videoItem.dataset.videoTitle || 'Video';
        
        if (src && src !== '') {
          launchPlayer(src, title);
        }
        return false;
      }

      // Handle opening note cards
      const noteCard = e.target.closest('.note-card');
      if (noteCard) {
        const file = noteCard.dataset.noteFile;
        if (file) { window.open(file, '_blank'); }
      }

      // Mark all watched click
      if (e.target.id === 'markAllWatched') {
        container.querySelectorAll('.video-watched').forEach(el => {
          el.classList.remove('pending'); 
          el.classList.add('done'); 
          el.textContent = '✓';
        });
      }
    });
  };

  const filterCourses = (courses = [], { search = '', filter = 'All' } = {}) => {
    const q = search.trim().toLowerCase();
    return courses.filter(course => {
      if (filter === 'Completed' && (course.progress || 0) < 100) return false;
      if (filter === 'In Progress' && ((course.progress || 0) === 0 || (course.progress || 0) >= 100)) return false;
      if (!['All', 'Completed', 'In Progress'].includes(filter) && course.category !== filter) return false;
      if (!q) return true;
      return (
        (course.title || '').toLowerCase().includes(q) ||
        (course.subtitle || '').toLowerCase().includes(q) ||
        (course.category || '').toLowerCase().includes(q) ||
        (course.tags || []).some(t => t.toLowerCase().includes(q))
      );
    });
  };

  return {
    renderCoursesGrid,
    renderCourseCard,
    renderFeaturedCourse,
    renderCourseDetails,
    renderCourseOverview,
    renderCourseVideos,
    renderCourseNotes,
    renderCourseProgressTab,
    filterCourses,
    openVideoPlayer,
    closeVideoPlayer,
  };

})();