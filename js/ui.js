/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/ui.js
   Shared UI helpers, DOM utilities, and reusable component renderers.
   Loaded before all other modules.
═══════════════════════════════════════════════════════════════ */

const UI = (() => {

  /* ─── DOM Query Helpers ─── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ─── Safe innerHTML — avoids XSS via text nodes where possible ─── */
  const esc = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  /* ─── Format Duration ─── */
  const formatDuration = (str) => str || '—';

  /* ─── Truncate Text ─── */
  const truncate = (str, max = 80) => {
    if (!str) return '';
    return str.length <= max ? str : str.slice(0, max).trimEnd() + '…';
  };

  /* ─── Get Initials ─── */
  const initials = (name = '') =>
    name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);

  /* ─── File Type → Display Label ─── */
  const fileTypeLabel = (type = '') => {
    const map = {
      pdf: 'PDF', zip: 'ZIP', doc: 'DOC', docx: 'DOC',
      mp4: 'MP4', link: '↗', txt: 'TXT', md: 'MD', other: '…',
    };
    return map[type.toLowerCase()] || type.toUpperCase().slice(0, 3);
  };

  /* ─── File Type → CSS class key ─── */
  const fileTypeClass = (type = '') => {
    const t = type.toLowerCase();
    if (t === 'docx') return 'doc';
    if (['mp4', 'avi', 'mov', 'webm'].includes(t)) return 'video';
    return t;
  };

  /* ─── Note Type → Icon ─── */
  const noteTypeIcon = (type = '') => {
    const map = { pdf: '📄', doc: '📝', docx: '📝', md: '✏', txt: '📃', other: '📎' };
    return map[type.toLowerCase()] || '📎';
  };

  /* ─── Empty State HTML ─── */
  const emptyState = ({ icon = '📭', title = 'Nothing here yet', desc = '' } = {}) => `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <div class="empty-state-title">${esc(title)}</div>
      ${desc ? `<div class="empty-state-desc">${esc(desc)}</div>` : ''}
    </div>`;

  /* ─── Progress Bar HTML ─── */
  const progressBar = (pct = 0, { height = 4 } = {}) => {
    const p = Math.min(100, Math.max(0, pct));
    return `
      <div class="progress-bar-track" style="height:${height}px">
        <div class="progress-bar-fill" style="width:${p}%"></div>
      </div>`;
  };

  /* ─── Stat Card HTML ─── */
  const statCard = ({ icon, value, label }) => `
    <div class="stat-card">
      <span class="stat-icon">${icon}</span>
      <div class="stat-value">${esc(String(value))}</div>
      <div class="stat-label">${esc(label)}</div>
    </div>`;

  /* ─── Badge HTML ─── */
  const badge = (text, cls = '') =>
    `<span class="level-badge ${esc(cls)}">${esc(text)}</span>`;

  /* ─── Tag HTML ─── */
  const tag = (text) => `<span class="tag">${esc(text)}</span>`;

  /* ─── Info Pill ─── */
  const infoPill = (text) => `<span class="info-pill">${esc(text)}</span>`;

  /* ─── SVG Circle Ring for Progress ─── */
  const progressRing = (pct, size = 120, stroke = 8) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
        <circle cx="${size/2}" cy="${size/2}" r="${r}"
          stroke="var(--border)" stroke-width="${stroke}" fill="none"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}"
          stroke="url(#ringGrad)" stroke-width="${stroke}" fill="none"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"/>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--accent)"/>
            <stop offset="100%" stop-color="var(--accent-alt)"/>
          </linearGradient>
        </defs>
      </svg>`;
  };

  /* ─── Mobile Menu ─── */
  const initMobileMenu = () => {
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobileNav');
    const overlay = $('#mobileNavOverlay');
    const closeBtn = $('#mobileNavClose');

    if (!hamburger || !mobileNav || !overlay) return;

    const open = () => {
      mobileNav.classList.add('open');
      overlay.classList.add('open');
      overlay.style.display = 'block';
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      mobileNav.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // hide overlay after transition
      setTimeout(() => { if (!overlay.classList.contains('open')) overlay.style.display = 'none'; }, 400);
    };

    hamburger.addEventListener('click', open);
    overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Close on nav link click
    $$('.mobile-nav-links .nav-link').forEach(btn => btn.addEventListener('click', close));
  };

  /* ─── Section Switcher ─── */
  const showSection = (sectionId) => {
    $$('.section').forEach(s => s.classList.remove('active'));
    $$('.nav-link').forEach(n => n.classList.remove('active'));

    const target = $(`#section${capitalize(sectionId)}`);
    if (target) target.classList.add('active');

    $$(`[data-section="${sectionId}"]`).forEach(n => n.classList.add('active'));
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  /* ─── Smooth scroll to element ─── */
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return {
    $, $$, esc, formatDuration, truncate, initials,
    fileTypeLabel, fileTypeClass, noteTypeIcon,
    emptyState, progressBar, statCard, badge, tag, infoPill,
    progressRing, initMobileMenu, showSection, scrollToTop,
    capitalize,
  };

})();
