/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/notes.js
   All aggregated notes hub rendering and interactions.
   ═══════════════════════════════════════════════════════════════ */

const Notes = (() => {

  /* ─── Render Notes Hub Overview (all courses) ─── */
  const renderNotesOverview = (courses = []) => {
    const el = document.getElementById('notesOverview');
    if (!el) return;

    // Filter courses that have at least one note
    const coursesWithNotes = courses.filter(c => c.notes && c.notes.length > 0);

    if (!coursesWithNotes.length) {
      el.innerHTML = UI.emptyState({
        icon: '📝',
        title: 'No notes yet',
        desc: 'Lecture notes and cheatsheets will appear here when added to your courses.'
      });
      return;
    }

    el.innerHTML = `
      <div class="resources-overview">
        ${coursesWithNotes.map(c => renderCourseNotesBlock(c)).join('')}
      </div>`;
  };

  /* ─── Render Notes Block for a Single Course ─── */
  const renderCourseNotesBlock = (course) => {
    if (!course) return '';
    const notes = course.notes || [];

    return `
      <div class="resource-course-block">
        <div class="resource-course-header" style="margin-bottom: 20px;">
          <div>
            <div class="resource-course-title">${UI.esc(course.title)}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px">
              ${notes.length} notes & summaries
            </div>
          </div>
          <span class="level-badge ${UI.esc(course.level)}">${UI.esc(course.level)}</span>
        </div>
        <div class="notes-grid">
          ${notes.map(n => renderNoteCard(n)).join('')}
        </div>
      </div>`;
  };

  /* ─── Render Single Note Card ─── */
  const renderNoteCard = (note) => {
    if (!note) return '';
    const type = (note.type || 'other').toLowerCase();
    
    return `
      <div class="note-card glass-shine" 
           data-note-file="${UI.esc(note.file || '')}"
           role="button" tabindex="0"
           aria-label="Open note: ${UI.esc(note.title)}">
        <div class="note-type-icon note-type-${type}">${UI.noteTypeIcon(type)}</div>
        <div class="note-title">${UI.esc(note.title)}</div>
        <div class="note-desc">${UI.esc(note.description || '')}</div>
        <div class="note-footer">
          <span class="note-size">${UI.esc(note.size || '')}</span>
          <span class="btn btn-ghost btn-sm">Open →</span>
        </div>
      </div>`;
  };

  /* ─── Bind Note Events (open notes on click or keydown) ─── */
  const bindEvents = () => {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.note-card');
      if (card && card.dataset.noteFile) {
        // Prevent action inside course detail page if we are double-binding, though event delegation is safe
        const file = card.dataset.noteFile;
        if (file) {
          window.open(file, '_blank', 'noopener noreferrer');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.note-card');
        if (card && card.dataset.noteFile) {
          e.preventDefault();
          const file = card.dataset.noteFile;
          if (file) {
            window.open(file, '_blank', 'noopener noreferrer');
          }
        }
      }
    });
  };

  return {
    renderNotesOverview,
    renderCourseNotesBlock,
    renderNoteCard,
    bindEvents,
  };

})();
