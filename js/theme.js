/* RS E-LEARNING HUB — js/theme.js */
const Theme = (() => {
  const apply = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    try {
      localStorage.setItem('rs-elearning-hub-theme', 'dark');
    } catch (_) {}
  };

  const current = () => 'dark';
  const toggle = () => 'dark';

  const init = () => {
    apply();
  };

  return { init, toggle, current, apply };
})();

window.Theme = Theme;