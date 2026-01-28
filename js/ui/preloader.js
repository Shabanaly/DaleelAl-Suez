/**
 * Preloader UI Module
 * يحتوي على وظائف عرض وإخفاء شاشة التحميل
 */

/**
 * Injects a high-fidelity animated Suez Governorate logo preloader
 */
function injectPreloader() {
    const preloaderHtml = `
        <div id="site-preloader">
            <div class="loader-logo-wrapper">
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <!-- Rotating Gear (8 Teeth) -->
                    <path class="loader-gear" fill="#005a9c" d="M472.6,211.4l-42.6-7c-3.1-13-7.9-25.2-14.1-36.6l25.3-35.1c4.5-6.2,3.3-14.9-2.8-19.6L395.1,76.4 c-6.2-4.5-14.8-3.3-19.5,2.9l-25.3,35.1c-11.4-6.3-23.7-11.1-36.7-14.2l-7-42.6c-1.3-7.6-7.8-13.1-15.5-13.1H220.9 c-7.7,0-14.2,5.5-15.5,13.1l-7,42.6c-13,3.1-25.2,7.9-36.6,14.2l-35.1-25.3c-6.2-4.5-14.9-3.3-19.6,2.8l-36.7,43.3 c-4.5,6.2-3.3,14.8,2.9,19.5l35.1,25.3c-6.3,11.4-11.1,23.7-14.2,36.7l-42.6,7C39.5,212.7,34,219.2,34,226.9v70.2 c0,7.7,5.5,14.2,13.1,15.5l42.6,7c3.1,13,7.9,25.2,14.2,36.6l-25.3,35.1c-4.5,6.2-3.3,14.9,2.8,19.6l43.3,36.7 c6.2,4.5,14.8,3.3,19.5-2.9l25.3-35.1c11.4,6.3,23.7,11.1,36.7,14.2l7,42.6c1.3,7.6,7.8,13.1,15.5,13.1h70.2 c7.7,0,14.2-5.5,15.5-13.1l7-42.6c13-3.1,25.2-7.9,36.6-14.2l35.1,25.3c6.2,4.5,14.9,3.3,19.6-2.8l36.7-43.3 c4.5-6.2,3.3-14.8-2.9-19.5l-35.1-25.3c6.3-11.4,11.1-23.7,14.2-36.7l42.6-7c7.6-1.3,13.1-7.8,13.1-15.5V226.9 C485.7,219.2,480.2,212.7,472.6,211.4z M256,380.7c-68.9,0-124.7-55.8-124.7-124.7S187.1,131.3,256,131.3 S380.7,187.1,380.7,256S324.9,380.7,256,380.7z" />
                    
                    <!-- Static House & Identity Center -->
                    <g fill="#fff">
                        <path d="M256,170l-80,66v94h160v-94L256,170z M216,280h80v20h-80V280z M296,250v20h-80v-20H296z" />
                        <path d="M256,190l30,25v5h-60v-5L256,190z" />
                        <!-- Wrench Detail -->
                        <rect x="246" y="220" width="20" height="40" transform="rotate(45 256 240)" />
                    </g>

                    <!-- Flowing Waves (Bottom half of inner circle) -->
                    <path class="loader-waves" fill="#0091ff" d="M141.3,310c30-10,60,10,90,0c30-10,60,10,90,0c30-10,20,10,50,0v40H141.3V310z" />
                </svg>
            </div>
            <div class="loader-text" data-i18n="app_name">دليل السويس</div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', preloaderHtml);
}

/**
 * Hides and removes the preloader
 */
function hidePreloader() {
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 600);
        }, 800); // Small delay to let the animation be seen
    }
}

// Fade out preloader when everything is ready
window.addEventListener('load', hidePreloader);

// Make functions globally accessible
window.injectPreloader = injectPreloader;
window.hidePreloader = hidePreloader;
