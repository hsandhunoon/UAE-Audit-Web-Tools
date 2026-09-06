/**
 * AUDIT CENTER - CONFIGURATION & CONTROLLER
 */

// ==========================================
// 1. TOOL URL CONFIGURATION (PASTE URLS HERE)
// ==========================================
const TOOLS = {
    outbound: "https://script.google.com/a/macros/noon.com/s/AKfycbybGMLrVEh4EDhH-Tu_EY167YJdH4Lf_L03f4bcy5369fBKOmdCawrGE2fwmSUTUnfq/exec",
    inventory: "https://script.google.com/a/macros/noon.com/s/AKfycbylIvK7yshYobzSVNg8TUxM-bgctxvahdpOnncdn3lxofiDJYqu38MLj6qSzEV3H_7p/exec",
    inbound: "https://script.google.com/a/macros/noon.com/s/AKfycbxxGwiup_tedECpYTTPSmDi0jPnf7EqNdj_G6qKAX_3OQiPBj1olET39nf1dVMtbpi8/exec",
    afs: "https://script.google.com/a/macros/noon.com/s/AKfycbzlSshiWjTcu6kZB8_msvMMQ6cV7basQx5ws5UxRSRmt4vTwZm4Fk9HNm0d-lW7A37O/exec",
    freshPutaway: "https://script.google.com/a/macros/noon.com/s/AKfycbzUAueV3bukblVyEYCCv6IUVZZbzMoXhyqlXbmSnpl7aQJPUbwVH2P7deMJAxsmt5LBGA/exec",
    rtv: "https://script.google.com/a/macros/noon.com/s/AKfycbxdABMozqhkCmjls187IbXiutwdAaaL73kKF0kmlkxUzuBDJB30c9mlwBJu4CCeDmvz/exec"
};

// ==========================================
// 2. TOOL LAUNCHER FUNCTION
// ==========================================
function openAuditTool(toolKey) {
    const targetUrl = TOOLS[toolKey];

    // Safety checks
    if (!targetUrl || targetUrl.includes("PASTE_")) {
        alert(`Configuration Pending:\n\nPlease paste the valid Google Apps Script Web App URL for [${toolKey}] inside the app.js file.`);
        return;
    }

    // Opens directly in a new browser tab/window to completely bypass CORS / X-Frame restriction issues
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
}

// ==========================================
// 3. UI CONTROLLER & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Mobile Drawer Controls
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // Theme Switcher (Dark / Light)
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    
    // Check saved local theme preferences
    const savedTheme = localStorage.getItem('audit_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeLabel(savedTheme);

    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('audit_theme', newTheme);
        updateThemeLabel(newTheme);
    });

    function updateThemeLabel(theme) {
        if (themeLabel) {
            themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
});

// ==========================================
// 4. PROGRESSIVE WEB APP (PWA) REGISTRATION
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Register Service Worker for PWA compliance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker Registered Successfully:', reg.scope))
            .catch(err => console.error('Service Worker Registration Failed:', err));
    });
}

// Handle PWA Installation Banner
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.classList.remove('hidden');
    }
});

if (installBtn) {
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted PWA installation');
                }
                deferredPrompt = null;
                installBtn.classList.add('hidden');
            });
        }
    });
}

window.addEventListener('appinstalled', () => {
    console.log('Audit Center PWA Installed');
    if (installBtn) installBtn.classList.add('hidden');
});
