/* ═══════════════════════════════════════════════════════════════
   RS E-LEARNING HUB — js/progress.js
   Progress calculation, stats computation, and progress UI rendering.
═══════════════════════════════════════════════════════════════ */

const Progress = (() => {

  /* ─── Compute Dashboard Stats from Courses ─── */
  const computeStats = (courses = []) => {
    const totalCourses = courses.length;
    const totalVideos = courses.reduce((acc, c) => acc + (c.videos ? c.videos.length : 0), 0);
    const totalNotes = courses.reduce((acc, c) => acc + (c.notes ? c.notes.length : 0), 0);
    const totalFiles = courses.reduce((acc, c) =>
      acc + (c.resources ? c.resources.reduce((ra, r) => ra + (r.files ? r.files.length : 0), 0) : 0), 0);
    const completedCourses = courses.filter(c => (c.progress || 0) >= 100).length;
    const overallProgress = totalCourses > 0
      ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / totalCourses)
      : 0;
    const watchedVideos = courses.reduce((acc, c) => {
      const vids = c.videos ? c.videos.filter(v => v.watched) : [];
      return acc + vids.length;
    }, 0);

    return {
      totalCourses,
      totalVideos,
      totalNotes,
      totalFiles,
      completedCourses,
      overallProgress,
      watchedVideos,
    };
  };

  /* ─── Render Dashboard Stats Grid ─── */
  const renderStatsGrid = (courses = []) => {
    const el = document.getElementById('statsGrid');
    if (!el) return;

    const stats = computeStats(courses);

    const cards = [
      { icon: '📚', value: stats.totalCourses, label: 'Total Courses' },
      { icon: '🎬', value: stats.totalVideos, label: 'Total Videos' },
      { icon: '📝', value: stats.totalNotes, label: 'Notes & Docs' },
      { icon: '📦', value: stats.totalFiles, label: 'Resource Files' },
      { icon: '✅', value: stats.completedCourses, label: 'Completed' },
      { icon: '📊', value: `${stats.overallProgress}%`, label: 'Overall Progress' },
    ];

    el.innerHTML = cards.map(c => UI.statCard(c)).join('');
  };

  /* ─── Render Full Progress Section ─── */
  const renderProgressSection = (courses = []) => {
    const el = document.getElementById('progressContent');
    if (!el) return;

    if (!courses.length) {
      el.innerHTML = UI.emptyState({ icon: '📊', title: 'No courses yet', desc: 'Add courses to track your progress.' });
      return;
    }

    const stats = computeStats(courses);

    el.innerHTML = `
      <div class="progress-section">

        <!-- Overall Ring -->
        <div class="progress-overall">
          <div class="progress-ring-wrap">
            ${UI.progressRing(stats.overallProgress, 120, 10)}
            <div class="progress-ring-label">
              <span class="progress-ring-pct">${stats.overallProgress}%</span>
              <span class="progress-ring-sub">Complete</span>
            </div>
          </div>
          <div class="progress-overall-text">
            <h3>Overall Learning Progress</h3>
            <p>
              ${stats.completedCourses} of ${stats.totalCourses} courses completed ·
              ${stats.watchedVideos} of ${stats.totalVideos} videos watched
            </p>
            <div style="margin-top:16px">
              ${UI.progressBar(stats.overallProgress, { height: 6 })}
            </div>
          </div>
        </div>

        <!-- Per Course Bars -->
        <div>
          <h3 style="margin-bottom:16px;font-family:Syne,sans-serif">Course Breakdown</h3>
          <div class="course-progress-list">
            ${courses.map(c => renderCourseProgressItem(c)).join('')}
          </div>
        </div>

      </div>`;
  };

  /* ─── Single Course Progress Row ─── */
  const renderCourseProgressItem = (course) => {
    const pct = course.progress || 0;
    const videos = course.videos ? course.videos.length : 0;
    const watched = course.videos ? course.videos.filter(v => v.watched).length : 0;

    return `
      <div class="course-progress-item">
        <div class="course-progress-name" title="${UI.esc(course.title)}">${UI.esc(course.title)}</div>
        <div class="course-progress-bar-wrap">
          ${UI.progressBar(pct, { height: 6 })}
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">
            ${watched}/${videos} videos watched
          </div>
        </div>
        <span class="course-progress-pct-label">${pct}%</span>
      </div>`;
  };

  return { computeStats, renderStatsGrid, renderProgressSection };

})();
