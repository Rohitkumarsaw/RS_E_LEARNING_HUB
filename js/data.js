/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/data.js
   Single source of truth for all application data.
   Dynamically aggregates individual course scripts on startup.
   ═══════════════════════════════════════════════════════════════ */

const AppData = (() => {

  /* ─── App Meta ─── */
  const meta = {
    appName: 'RS E-LEARNING HUB',
    version: '1.0.0',
    description: 'Personal Learning Portal',
  };

  /* ─── User / Profile ─── */
  const user = {
    name: 'Rohit Kumar',
    initials: 'RK',
    email: 'dellofficial795@gmail.com',
    role: 'Self-learner',
    joined: '2024-01-01',
    goal: 'Master full-stack development in 12 months',
  };

  /* ─── Courses aggregated from course files ─── */
  const courses = window.CourseList || [];

  /* ─── Filter Categories derived from courses ─── */
  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const statusFilters = ['Completed', 'In Progress'];

  /* ─── Public API ─── */
  return {
    meta,
    user,
    courses,
    categories,
    statusFilters,
    allFilters: [...categories, ...statusFilters],
  };

})();
