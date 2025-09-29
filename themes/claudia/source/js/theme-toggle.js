// Theme toggle functionality
(function() {
    'use strict';
    
    // Get the current theme from localStorage or default to 'auto'
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 'auto';
    }
    
    // Set theme and update UI
    function setTheme(theme) {
        const html = document.documentElement;
        const themeIcon = document.getElementById('theme-icon');
        const themeIconMobile = document.getElementById('theme-icon-mobile');
        
        // Remove all theme classes
        html.classList.remove('appearance-light', 'appearance-dark', 'appearance-auto');
        
        // Add the new theme class
        html.classList.add(`appearance-${theme}`);
        
        // Update icons based on theme
        function updateIcon(icon) {
            if (!icon) return;
            icon.className = '';
            switch(theme) {
                case 'light':
                    icon.className = 'fas fa-sun';
                    break;
                case 'dark':
                    icon.className = 'fas fa-moon';
                    break;
                case 'auto':
                default:
                    // For auto mode, show icon based on system preference
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        icon.className = 'fas fa-moon';
                    } else {
                        icon.className = 'fas fa-sun';
                    }
                    break;
            }
        }
        
        updateIcon(themeIcon);
        updateIcon(themeIconMobile);
        
        // Save to localStorage only for manual themes
        if (theme === 'auto') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', theme);
        }
    }
    
    // Cycle through themes: auto -> light -> dark -> auto
    function cycleTheme() {
        const currentTheme = getCurrentTheme();

        if (currentTheme === 'auto') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'light' : 'dark');
            return;
        }

        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
    
    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getCurrentTheme();
        setTheme(savedTheme);
        
        // Add click event listeners to toggle buttons (desktop and mobile)
        const toggleButton = document.getElementById('theme-toggle');
        const toggleButtonMobile = document.getElementById('theme-toggle-mobile');
        
        if (toggleButton) {
            toggleButton.addEventListener('click', cycleTheme);
        }
        
        if (toggleButtonMobile) {
            toggleButtonMobile.addEventListener('click', cycleTheme);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Listen for system theme changes when in auto mode
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
            if (getCurrentTheme() === 'auto') {
                setTheme('auto'); // Re-apply auto theme to update icon
            }
        });
    }
})();
