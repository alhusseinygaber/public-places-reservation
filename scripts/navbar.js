// scripts/navbar.js

document.addEventListener('DOMContentLoaded', () => {
    // Determine authentication state
    const token = typeof API !== 'undefined' ? API.getToken() : localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.firstName || 'User';

    // Build navigation HTML for logged‑in and logged‑out states
    const userImage = user.profileImage
        ? `<img src="http://localhost:3000${user.profileImage}" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:5px; border:2px solid var(--color-primary);">`
        : '';

    // Add logic to display user name and image
    const profileLabel = `${userImage} Profile (${userName})`;

    const loggedInNav = `
    <a href="dashboard.html" class="button">Home</a>
    <a href="all_places.html" class="button">Browse</a>
    <a href="my_bookings.html" class="button">My Bookings</a>
    <a href="profile.html" class="button" style="display:inline-flex; align-items:center;">${profileLabel}</a>
    <a href="about.html" class="button">About</a>
    <a href="privacy.html" class="button">Privacy</a>
    <a href="terms.html" class="button">Terms</a>
    <a href="faq.html" class="button">FAQ</a>
    <a href="#" class="button" id="logout-btn">Log Out</a>
  `;
    const loggedOutNav = `
    <a href="landing.html" class="button">Home</a>
    <a href="register.html" class="button">Register</a>
    <a href="login.html" class="button">Log In</a>
    <a href="all_places.html" class="button">Browse</a>
  `;

    // Insert navigation into the placeholder element or create one
    let navContainer = document.getElementById('dynamic-nav');
    if (!navContainer) {
        // Try to find an existing <nav> element
        navContainer = document.querySelector('nav');
        if (!navContainer) {
            // Create a new nav element after the header
            const header = document.querySelector('header');
            if (header) {
                navContainer = document.createElement('nav');
                navContainer.id = 'dynamic-nav';
                navContainer.className = 'glass';
                navContainer.style.cssText = 'display:flex; justify-content:center; gap:1rem; margin:1rem 0; padding:0.5rem;';
                header.parentNode.insertBefore(navContainer, header.nextSibling);
            }
        }
    }

    if (navContainer) {
        navContainer.innerHTML = token ? loggedInNav : loggedOutNav;
    }

    // Logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof API !== 'undefined') API.logout();
        });
    }

    // Welcome emoji modal – show only once after first successful login
    if (token && !localStorage.getItem('welcomeShown')) {
        const modal = document.createElement('div');
        modal.id = 'welcome-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.innerHTML = `
      <div style="background:#fff;padding:2rem;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        <div style="font-size:4rem;">👋</div>
        <h2 style="margin:0.5rem 0;">Welcome, ${userName}!</h2>
        <button id="close-welcome" style="margin-top:1rem;padding:0.5rem 1rem;background:${'var(--color-primary)'};color:#fff;border:none;border-radius:6px;cursor:pointer;">Close</button>
      </div>`;
        document.body.appendChild(modal);
        document.getElementById('close-welcome').addEventListener('click', () => {
            modal.remove();
            localStorage.setItem('welcomeShown', 'true');
        });
    }
});
