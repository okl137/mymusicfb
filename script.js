document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Slider Logic ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const navSlider = document.querySelector('.nav-slider');
    const navContainer = document.querySelector('.nav-links');

    function updateNavSlider(element) {
        if (!element || !navSlider || !navContainer) return;
        
        // Get precise positions relative to the viewport
        const linkRect = element.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        
        // Calculate relative position within the container
        const relativeLeft = linkRect.left - containerRect.left;
        
        // Apply styles
        navSlider.style.width = `${linkRect.width}px`;
        navSlider.style.transform = `translateX(${relativeLeft}px)`; // Use transform for smoother performance
        // Reset left to 0 since we use transform, but check if we need to offset for padding?
        // Actually, if we use relativeLeft, it includes the container's padding-left if the link is offset by it.
        // So we should set left: 0 in CSS or override here.
        navSlider.style.left = '0'; 
    }

    // Initialize
    function initSlider() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink) {
            updateNavSlider(activeLink);
            // Double check after a short delay for layout shifts
            setTimeout(() => updateNavSlider(activeLink), 50);
        }
    }

    initSlider();
    
    // Ensure position is correct after all resources (fonts) are loaded
    window.addEventListener('load', initSlider);

    // Event Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            // Add to clicked
            link.classList.add('active');
            // Update slider
            updateNavSlider(link);
        });
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-links a.active');
        if (currentActive) {
            updateNavSlider(currentActive);
        }
    });

    // --- Interactive UI Switching Logic ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const viewContents = document.querySelectorAll('.view-content');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');

            // Update Sidebar Active State
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Viewport Content with Transition
            viewContents.forEach(view => {
                if (view.id === targetId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // --- Hero UI 3D Tilt Effect ---
    const heroUI = document.querySelector('.hero-ui-container');
    const glassFrame = document.querySelector('.glass-player-frame');

    if (heroUI && glassFrame) {
        heroUI.addEventListener('mousemove', (e) => {
            const rect = heroUI.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (clamped)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            glassFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroUI.addEventListener('mouseleave', () => {
            glassFrame.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }

    // --- Auto Switch Demo (Optional) ---
    // Uncomment to let it cycle automatically if user doesn't interact
    /*
    let currentIndex = 0;
    setInterval(() => {
        sidebarItems[currentIndex].click();
        currentIndex = (currentIndex + 1) % sidebarItems.length;
    }, 5000);
    */

    // --- Mock Play Button Interaction ---
    const playBtns = document.querySelectorAll('.mini-play-btn, .cta-btn.secondary');
    playBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Only toggle icon for mini player button
            if (this.classList.contains('mini-play-btn')) {
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-play')) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                } else {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
        });
    });

    // --- Download Real File ---
    const downloadUrl = 'https://files.zohopublic.com.cn/public/workdrive-public/download/54hdq0c09c67f7e9a412ea50f81658bb523de?x-cli-msg=%7B%22linkId%22%3A%221HzkJmx6UGf-36yJl%22%2C%22isFileOwner%22%3Afalse%2C%22version%22%3A%221.0%22%2C%22isWDSupport%22%3Afalse%7D';
    const downloadBtns = document.querySelectorAll('#nav-download-btn, #hero-download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = downloadUrl;
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Can be used for additional CSS triggers
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .log-entry, .reveal').forEach(el => {
        observer.observe(el);
    });

    // --- Scroll Spy for Navigation ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Use a separate observer for sections to update nav
    const sectionObserverOptions = {
        threshold: 0.3 // Trigger when 30% of section is visible
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                // Remove active from all
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${currentId}`) {
                        item.classList.add('active');
                        updateNavSlider(item);
                    }
                });
            }
        });
    }, sectionObserverOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // === Liquid Glass Button Effect ===
    const liquidBtns = document.querySelectorAll('.liquid-glass-btn');
    liquidBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        });
    });

});
