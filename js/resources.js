/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/resources.js
   All resource/topic/file rendering and interaction logic.
═══════════════════════════════════════════════════════════════ */

const Resources = (() => {

  /* ─── Render Resources Overview (all courses) ─── */
  const renderResourcesOverview = (courses = []) => {
    const el = document.getElementById('resourcesOverview');
    if (!el) return;

    const coursesWithResources = courses.filter(c => c.resources && c.resources.length > 0);

    if (!coursesWithResources.length) {
      el.innerHTML = UI.emptyState({ icon: '📁', title: 'No resources yet', desc: 'Add resource topics and files to your courses.' });
      return;
    }

    el.innerHTML = `<div class="resources-overview">
      ${coursesWithResources.map(c => renderCourseResourceBlock(c)).join('')}
    </div>`;
  };

  /* ─── Render Resource Block for a Single Course ─── */
  const renderCourseResourceBlock = (course) => {
    if (!course) return '';
    const totalFiles = (course.resources || []).reduce((acc, r) => acc + (r.files ? r.files.length : 0), 0);

    return `
      <div class="resource-course-block">
        <div class="resource-course-header">
          <div>
            <div class="resource-course-title">${UI.esc(course.title)}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px">
              ${course.resources ? course.resources.length : 0} topics · ${totalFiles} files
            </div>
          </div>
          <span class="level-badge ${UI.esc(course.level)}">${UI.esc(course.level)}</span>
        </div>
        <div class="resource-topics">
          ${renderResourceTopics(course)}
        </div>
      </div>`;
  };

  /* ─── Render All Topics for a Course ─── */
  const renderResourceTopics = (course) => {
    const topics = course.resources || [];
    if (!topics.length) {
      return `<div class="empty-state" style="padding:24px"><div class="empty-state-desc">No resources available for this course.</div></div>`;
    }
    return topics.map(topic => renderResourceTopic(topic, course.id)).join('');
  };

  /* ─── Render Single Topic ─── */
  const renderResourceTopic = (topic, courseId = '') => {
    if (!topic) return '';
    const files = topic.files || [];

    return `
      <div class="resource-topic" data-topic-id="${UI.esc(topic.id)}" data-course-id="${UI.esc(courseId)}">
        <div class="resource-topic-title">${UI.esc(topic.title)}</div>
        ${topic.description ? `<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px">${UI.esc(topic.description)}</div>` : ''}
        ${files.length
          ? `<div class="resource-files">${files.map(f => renderFileCard(f)).join('')}</div>`
          : `<div style="font-size:0.82rem;color:var(--text-muted)">No files in this topic.</div>`
        }
      </div>`;
  };

  /* ─── Render File Card ─── */
  const renderFileCard = (file) => {
    if (!file) return '';
    const typeClass = UI.fileTypeClass(file.type || 'other');
    const typeLabel = UI.fileTypeLabel(file.type || 'other');
    const isLink = (file.type || '').toLowerCase() === 'link';

    return `
      <div class="resource-file-card"
           data-file-path="${UI.esc(file.path || '')}"
           data-file-type="${UI.esc(file.type || '')}"
           title="${UI.esc(file.name)}"
           role="button" tabindex="0"
           aria-label="Open ${UI.esc(file.name)}">
        <div class="file-type-icon file-type-${typeClass}">${typeLabel}</div>
        <div class="file-info">
          <div class="file-name">${UI.esc(file.name || 'Untitled')}</div>
          <div class="file-size">${UI.esc(file.size || '')}</div>
        </div>
        <div class="file-action">${UI.esc(file.label || (isLink ? '↗' : '↓'))}</div>
      </div>`;
  };

  /* ─── Handle File Card Click ─── */
  const handleFileAction = (fileCard) => {
    const path = fileCard.dataset.filePath || '';
    const type = (fileCard.dataset.fileType || '').toLowerCase();
    if (!path) return;

    if (type === 'link') {
      window.open(path, '_blank', 'noopener noreferrer');
    } else {
      // For local files — open/download (works when served, graceful when not)
      const a = document.createElement('a');
      a.href = path;
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
    }
  };

  /* ─── Bind Events (event delegation) ─── */
  const bindEvents = () => {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.resource-file-card');
      if (card) handleFileAction(card);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.resource-file-card');
        if (card) { e.preventDefault(); handleFileAction(card); }
      }
    });
  };

  /* ─── Render inline Resources Tab (inside course detail) ─── */
  const renderCourseResources = (course) => {
    if (!course) return UI.emptyState({ icon: '📁', title: 'No resources', desc: 'No resources found for this course.' });
    const topics = course.resources || [];
    if (!topics.length) return UI.emptyState({ icon: '📁', title: 'No resources', desc: 'No resource topics have been added yet.' });

    return `<div class="resource-topics" style="padding:0">
      ${topics.map(topic => renderResourceTopic(topic, course.id)).join('')}
    </div>`;
  };

  return {
    renderResourcesOverview,
    renderCourseResourceBlock,
    renderResourceTopics,
    renderResourceTopic,
    renderFileCard,
    renderCourseResources,
    bindEvents,
  };

})();
