// Initialize Animate On Scroll (AOS)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false, // animate every time you scroll up/down
    mirror: true
});

// Custom Dual Cursor Implementation
const cursorInner = document.getElementById("cursor-inner");
const cursorOuter = document.getElementById("cursor-outer");

// Check if device is not mobile to run cursor logic (perf improvement)
if (window.innerWidth > 768) {
    const links = document.querySelectorAll("a, button, .jello, .project-card, .skill-card");

    document.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Inner solid dot follows instantly
        cursorInner.style.left = `${posX}px`;
        cursorInner.style.top = `${posY}px`;

        // Outer circle follows with a slight smooth delay
        cursorOuter.animate(
            {
                left: `${posX}px`,
                top: `${posY}px`,
            },
            { duration: 400, fill: "forwards", easing: "ease" }
        );
    });

    // Handle Hover effects
    links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            cursorInner.classList.add("hover");
            cursorOuter.classList.add("hover");
        });
        link.addEventListener("mouseleave", () => {
            cursorInner.classList.remove("hover");
            cursorOuter.classList.remove("hover");
        });
    });

    // Jello Text Animation Logic
    // Allow the jello animation to replay when hovering over individual spans
    const jelloSpans = document.querySelectorAll('.jello');

    jelloSpans.forEach(span => {
        span.addEventListener('mouseenter', function () {
            // Remove the class and force a reflow before adding it back
            this.classList.remove('animate');
            void this.offsetWidth; // Trigger reflow
            this.classList.add('animate');
        });

        // Ensure animation finishes before letting it be triggered again instantly 
        // by listening to animationend (though CSS :hover handles most of the feel automatically)
        span.addEventListener('animationend', function () {
            this.classList.remove('animate');
        });
    });
}

// Avatar Eye Tracking Logic
document.addEventListener('mousemove', (e) => {
    const eyes = document.querySelectorAll('.footer-pupil');
    eyes.forEach(eye => {
        const rect = eye.parentElement.getBoundingClientRect();
        // Calculate center of the eye
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;

        // Calculate bounded translation
        const diffX = e.clientX - eyeX;
        const diffY = e.clientY - eyeY;
        const angle = Math.atan2(diffY, diffX);
        const dist = Math.min(Math.hypot(diffX, diffY) / 10, 6); // Max move 6px

        eye.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    });
});

// Mobile Hamburger Menu Logic
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links li a');
const menuCloseBtn = document.getElementById('menu-close-btn');

if (hamburgerBtn && mobileMenuOverlay) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.add('active');
        mobileMenuOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close dropdown when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    // Close when clicking directly on the blurred overlay (outside the drawer)
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            hamburgerBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// Settings Drawer Logic
const drawerBtn = document.getElementById('drawer-btn');
const settingDrawer = document.getElementById('setting-drawer');

if (drawerBtn && settingDrawer) {
    drawerBtn.addEventListener('click', () => {
        settingDrawer.classList.toggle('active');
    });
}

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-btn');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

// Apply local storage theme if present
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }
}

themeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }
});

// Music Toggle Logic
const musicBtn = document.getElementById('music-btn');
const musicOff = document.getElementById('music-off');
const musicOn = document.getElementById('music-on');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

// Auto lower volume for chill vibe
bgMusic.volume = 0.4;

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicOff.style.display = 'block';
        musicOn.style.display = 'none';
        isMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicOff.style.display = 'none';
            musicOn.style.display = 'block';
            isMusicPlaying = true;
        }).catch(err => {
            console.log("Audio play failed:", err);
        });
    }
});
