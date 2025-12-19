document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const root = document.documentElement;
    const current = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', current);
    toggle.checked = current === 'light';
    toggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'light' : 'dark';
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
});
