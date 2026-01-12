// Configuration
const CONFIG = {
    themeColors: [
        { name: 'primary', value: '#6366f1' }, // Indigo
        { name: 'secondary', value: '#8b5cf6' }, // Violet
        { name: 'accent', value: '#ec4899' }, // Pink
        { name: 'emerald', value: '#10b981' }, // Emerald
        { name: 'amber', value: '#f59e0b' }, // Amber
        { name: 'cyan', value: '#06b6d4' }, // Cyan
        { name: 'rose', value: '#f43f5e' }, // Rose
        { name: 'teal', value: '#14b8a6' }  // Teal
    ],
    fonts: [
        { name: 'alexandria', className: 'font-alexandria' },
        { name: 'tajawal', className: 'font-tajawal' },
        { name: 'cairo', className: 'font-cairo' }
    ]
};

// ============================================
// 1️⃣ Active Link on Scroll
// ============================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const headerHeight = document.querySelector('nav').offsetHeight;
    
    // Initial active link
    // updateActiveLink();
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + headerHeight + 100;
        
        // Find current section
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });
        
        // Update active link
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.fontWeight = 'normal';
            
            const href = link.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                link.classList.add('active');
                link.style.fontWeight = 'bold';
                link.style.color = 'var(--primary-color)';
            }
        });
    });
}

// ============================================
// 2️⃣ Dark/Light Theme Toggle
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle-button');
    const htmlElement = document.documentElement;
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        htmlElement.classList.add('dark');
        themeToggle.setAttribute('aria-pressed', 'true');
        updateToggleButton(true);
    } else {
        htmlElement.classList.remove('dark');
        themeToggle.setAttribute('aria-pressed', 'false');
        updateToggleButton(false);
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.contains('dark');
        
        if (isDark) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeToggle.setAttribute('aria-pressed', 'false');
            updateToggleButton(false);
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.setAttribute('aria-pressed', 'true');
            updateToggleButton(true);
        }
    });
    
    function updateToggleButton(isDark) {
        const toggleCircle = themeToggle.querySelector('.theme-toggle-circle');
        if (isDark) {
            toggleCircle.style.transform = 'translateX(32px)';
        } else {
            toggleCircle.style.transform = 'translateX(4px)';
        }
    }
}

// ============================================
// 3️⃣ Portfolio Tabs (Custom Implementation)
// ============================================

function initPortfolioTabs() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Set active state for first button
    filterButtons[0].classList.add('active');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            // Filter items
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

// ============================================
// 4️⃣ Testimonials Carousel
// ============================================

function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const items = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    const itemsPerView = getItemsPerView();
    const totalItems = items.length;
    
    // Initialize carousel
    updateCarousel();
    
    // Navigation
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });
    
    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto slide (optional)
    let autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, 5000);
    });
    
    // Responsive handling
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    function updateCarousel() {
        const translateX = -currentIndex * (100 / itemsPerView);
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('bg-accent');
                indicator.classList.remove('bg-slate-400', 'dark:bg-slate-600');
                indicator.setAttribute('aria-selected', 'true');
            } else {
                indicator.classList.remove('bg-accent');
                indicator.classList.add('bg-slate-400', 'dark:bg-slate-600');
                indicator.setAttribute('aria-selected', 'false');
            }
        });
        
        // Update ARIA live region
        carousel.setAttribute('aria-label', `عرض التوصية ${currentIndex + 1} من ${totalItems}`);
    }
    
    function getItemsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }
}

// ============================================
// 5️⃣ Settings Sidebar & Customization
// ============================================

function initSettingsSidebar() {
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsSidebar = document.getElementById('settings-sidebar');
    const closeSettings = document.getElementById('close-settings');
    const resetSettings = document.getElementById('reset-settings');
    const themeColorsGrid = document.getElementById('theme-colors-grid');
    const fontOptions = document.querySelectorAll('.font-option');
    
    // Generate theme colors grid
    CONFIG.themeColors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.className = 'theme-color w-12 h-12 rounded-full hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current';
        colorButton.style.backgroundColor = color.value;
        colorButton.setAttribute('data-color-name', color.name);
        colorButton.setAttribute('data-color-value', color.value);
        colorButton.setAttribute('aria-label', `تغيير اللون إلى ${color.name}`);
        
        // Add check icon for current color
        const checkIcon = document.createElement('div');
        checkIcon.className = 'w-full h-full flex items-center justify-center opacity-0';
        checkIcon.innerHTML = '<i class="fa-solid fa-check text-white"></i>';
        colorButton.appendChild(checkIcon);
        
        // Check if this is the current color
        const rootStyles = getComputedStyle(document.documentElement);
        const currentPrimary = rootStyles.getPropertyValue('--primary-color').trim();
        if (currentPrimary === color.value) {
            checkIcon.classList.remove('opacity-0');
            checkIcon.classList.add('opacity-100');
        }
        
        colorButton.addEventListener('click', () => applyThemeColor(color));
        themeColorsGrid.appendChild(colorButton);
    });
    
    // Font selection
    fontOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all
            fontOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.setAttribute('aria-checked', 'false');
            });
            
            // Add active class to selected
            option.classList.add('active');
            option.setAttribute('aria-checked', 'true');
            
            // Apply font
            const fontName = option.getAttribute('data-font');
            applyFont(fontName);
        });
    });
    
    // Toggle sidebar
    settingsToggle.addEventListener('click', () => {
        const isExpanded = settingsToggle.getAttribute('aria-expanded') === 'true';
        settingsToggle.setAttribute('aria-expanded', !isExpanded);
        settingsSidebar.classList.toggle('translate-x-full');
        settingsSidebar.setAttribute('aria-hidden', isExpanded);
    });
    
    closeSettings.addEventListener('click', () => {
        settingsToggle.setAttribute('aria-expanded', 'false');
        settingsSidebar.classList.add('translate-x-full');
        settingsSidebar.setAttribute('aria-hidden', 'true');
    });
    
    // Reset settings
    resetSettings.addEventListener('click', () => {
        resetAllSettings();
    });
    
    function applyThemeColor(color) {
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', color.value);
        
        // Generate secondary and accent colors
        const secondary = adjustColor(color.value, 20);
        const accent = adjustColor(color.value, -20);
        
        document.documentElement.style.setProperty('--secondary-color', secondary);
        document.documentElement.style.setProperty('--accent-color', accent);
        
        // Update check icons
        document.querySelectorAll('.theme-color').forEach(btn => {
            const icon = btn.querySelector('div');
            if (btn.getAttribute('data-color-name') === color.name) {
                icon.classList.remove('opacity-0');
                icon.classList.add('opacity-100');
            } else {
                icon.classList.remove('opacity-100');
                icon.classList.add('opacity-0');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('theme-color', JSON.stringify(color));
    }
    
    function applyFont(fontName) {
        const body = document.body;
        
        // Remove all font classes
        CONFIG.fonts.forEach(font => {
            body.classList.remove(font.className);
        });
        
        // Add selected font
        const selectedFont = CONFIG.fonts.find(f => f.name === fontName);
        if (selectedFont) {
            body.classList.add(selectedFont.className);
            localStorage.setItem('selected-font', fontName);
        }
    }
    
    function resetAllSettings() {
        // Reset theme
        localStorage.removeItem('theme');
        localStorage.removeItem('theme-color');
        localStorage.removeItem('selected-font');
        
        // Reset to default
        document.documentElement.classList.remove('dark');
        document.documentElement.style.removeProperty('--primary-color');
        document.documentElement.style.removeProperty('--secondary-color');
        document.documentElement.style.removeProperty('--accent-color');
        
        // Reset font
        CONFIG.fonts.forEach(font => {
            document.body.classList.remove(font.className);
        });
        document.body.classList.add('font-tajawal');
        
        // Update UI
        document.getElementById('theme-toggle-button').setAttribute('aria-pressed', 'false');
        document.querySelector('.theme-toggle-circle').style.transform = 'translateX(4px)';
        
        // Close sidebar
        settingsToggle.setAttribute('aria-expanded', 'false');
        settingsSidebar.classList.add('translate-x-full');
        settingsSidebar.setAttribute('aria-hidden', 'true');
        
        // Show success message
        showToast('تمت إعادة التعيين بنجاح!');
    }
    
    function adjustColor(hex, percent) {
        let R = parseInt(hex.substring(1,3), 16);
        let G = parseInt(hex.substring(3,5), 16);
        let B = parseInt(hex.substring(5,7), 16);
        
        R = Math.min(255, Math.floor(R * (1 + percent/100)));
        G = Math.min(255, Math.floor(G * (1 + percent/100)));
        B = Math.min(255, Math.floor(B * (1 + percent/100)));
        
        const RR = R.toString(16).padStart(2, '0');
        const GG = G.toString(16).padStart(2, '0');
        const BB = B.toString(16).padStart(2, '0');
        
        return `#${RR}${GG}${BB}`;
    }
}

// ============================================
// 6️⃣ Scroll to Top Button
// ============================================

function initScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Utility Functions
// ============================================

function initFormSelects() {
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const wrapper = select.parentElement;
        const options = wrapper.querySelector('.custom-options');
        const selectedText = select.querySelector('.selected-text');
        const arrow = select.querySelector('i');
        
        select.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close all other selects
            document.querySelectorAll('.custom-options').forEach(opt => {
                if (opt !== options) opt.classList.add('hidden');
            });
            
            // Toggle current select
            options.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
            select.setAttribute('aria-expanded', options.classList.contains('hidden') ? 'false' : 'true');
        });
        
        // Handle option selection
        wrapper.querySelectorAll('.custom-option').forEach(option => {
            option.addEventListener('click', () => {
                selectedText.textContent = option.textContent;
                selectedText.classList.remove('text-slate-500', 'dark:text-slate-400');
                selectedText.classList.add('text-slate-800', 'dark:text-white');
                
                // Update hidden input if exists
                const hiddenInput = wrapper.querySelector('input[type="hidden"]');
                if (hiddenInput) {
                    hiddenInput.value = option.getAttribute('data-value');
                }
                
                options.classList.add('hidden');
                arrow.classList.remove('rotate-180');
                select.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close select when clicking outside
        document.addEventListener('click', () => {
            options.classList.add('hidden');
            arrow.classList.remove('rotate-180');
            select.setAttribute('aria-expanded', 'false');
        });
    });
}

function initContactForm() {
    const form = document.querySelector('form[aria-label="نموذج التواصل"]');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('full-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                projectType: document.querySelector('[data-name="project-type"] .selected-text').textContent,
                budget: document.querySelector('[data-name="budget"] .selected-text').textContent,
                details: document.getElementById('project-details').value
            };
            
            // Basic validation
            if (!formData.name || !formData.email || !formData.details) {
                showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>جارٍ الإرسال...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Success message
                showToast('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.', 'success');
                
                // Reset form
                form.reset();
                
                // Reset custom selects
                document.querySelectorAll('.selected-text').forEach(text => {
                    text.textContent = 'اختر...';
                    text.classList.add('text-slate-500', 'dark:text-slate-400');
                    text.classList.remove('text-slate-800', 'dark:text-white');
                });
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `custom-toast fixed top-6 right-6 z-[1000] px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md transform transition-all duration-300 ${
        type === 'success' 
            ? 'bg-emerald-500/90 text-white border border-emerald-400' 
            : 'bg-red-500/90 text-white border border-red-400'
    }`;
    toast.textContent = message;
    
    // Add icon
    const icon = document.createElement('i');
    icon.className = `fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} ml-2`;
    toast.prepend(icon);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mr-auto text-white/80 hover:text-white transition-colors';
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    const toastContent = document.createElement('div');
    toastContent.className = 'flex items-center justify-between';
    toastContent.appendChild(icon);
    toastContent.appendChild(document.createTextNode(message));
    toastContent.appendChild(closeBtn);
    
    toast.innerHTML = '';
    toast.appendChild(toastContent);
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initCSSVariables() {
    // Initialize CSS custom properties
    if (!document.documentElement.style.getPropertyValue('--primary-color')) {
        document.documentElement.style.setProperty('--primary-color', '#6366f1');
        document.documentElement.style.setProperty('--secondary-color', '#8b5cf6');
        document.documentElement.style.setProperty('--accent-color', '#ec4899');
    }
}

// ============================================
// Initialize Everything
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CSS variables
    initCSSVariables();
    
    // Initialize all features
    initScrollSpy();
    initThemeToggle();
    initPortfolioTabs();
    initTestimonialsCarousel();
    initSettingsSidebar();
    initScrollToTop();
    
    // Initialize utility functions
    initFormSelects();
    initContactForm();
    initSmoothScrolling();
    
    // Add CSS for active states
    const style = document.createElement('style');
    style.textContent = `
        /* Active link styles */

        
        /* Custom select styles */
        .custom-options {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .custom-options::-webkit-scrollbar {
            width: 8px;
        }
        
        .custom-options::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
        }
        
        .custom-options::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        
        .dark .custom-options::-webkit-scrollbar-track {
            background: #1e293b;
        }
        
        .dark .custom-options::-webkit-scrollbar-thumb {
            background: #475569;
        }
        
        /* Animation classes */
        .rotate-180 {
            transform: rotate(180deg);
        }
        
        /* Toast animation */
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .custom-toast {
            animation: slideIn 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ All features initialized successfully!');
});

















































// const THEME_GRADIENTS = [
//     { name: 'indigo', colors: { primary: 'rgb(99, 102, 241)', secondary: 'rgb(139, 92, 246)', accent: 'rgb(99, 102, 241)' } },
//     { name: 'pink-orange', colors: { primary: 'rgb(236, 72, 153)', secondary: 'rgb(249, 115, 22)', accent: 'rgb(236, 72, 153)' } },
//     { name: 'emerald', colors: { primary: 'rgb(16, 185, 129)', secondary: 'rgb(5, 150, 105)', accent: 'rgb(16, 185, 129)' } },
//     { name: 'blue-cyan', colors: { primary: 'rgb(59, 130, 246)', secondary: 'rgb(6, 182, 212)', accent: 'rgb(59, 130, 246)' } },
//     { name: 'red-rose', colors: { primary: 'rgb(239, 68, 68)', secondary: 'rgb(244, 63, 94)', accent: 'rgb(239, 68, 68)' } },
//     { name: 'amber-orange', colors: { primary: 'rgb(245, 158, 11)', secondary: 'rgb(234, 88, 12)', accent: 'rgb(245, 158, 11)' } }
// ];

// const fonts = ['alexandria', 'tajawal', 'cairo'];

// const settingsBtn = document.querySelector('#settings-toggle');
// const settingsSidebar = document.querySelector('#settings-sidebar');
// const closeBtn = document.querySelector('#close-settings');
// const resetBtn = document.querySelector('#reset-settings');
// const colorsGrid = document.querySelector('#theme-colors-grid');
// const fontButtons = document.querySelectorAll('.font-option');

// createColorBtnSettings();
// loadSavedSettings();

// /* ================== COLORS ================== */
// function createColorBtnSettings() {
//     THEME_GRADIENTS.forEach(item => {
//         const btn = document.createElement('button');
//         btn.className = 'w-12 h-12 rounded-full border-2 border-white';
//         btn.style.backgroundImage = `linear-gradient(${item.colors.primary}, ${item.colors.secondary})`;
//         btn.dataset.primary = item.colors.primary;

//         btn.addEventListener('click', () => applyThemeColors(item.colors.primary, item.colors.secondary, item.colors.accent));

//         colorsGrid.appendChild(btn);
//     });
// }

// function applyThemeColors(primary, secondary, accent) {
//     // تغيير المتغيرات في :root
//     const root = document.documentElement;
//     root.style.setProperty('--color-primary', primary);
//     root.style.setProperty('--color-secondary', secondary);
//     root.style.setProperty('--color-accent', accent);

//     // تغيير كل العناصر اللي فيها gradient
//     document.querySelectorAll('.bg-linear-to-br').forEach(el => {
//         el.style.backgroundImage = `linear-gradient(to bottom right, ${primary}, ${secondary})`;
//     });

//     document.querySelectorAll('.bg-linear-to-r').forEach(el => {
//         el.style.backgroundImage = `linear-gradient(to right, ${primary}, ${secondary})`;
//     });

//     // تغيير النصوص الملونة
//     document.querySelectorAll('.text-primary').forEach(el => el.style.color = primary);
//     document.querySelectorAll('.text-secondary').forEach(el => el.style.color = secondary);
//     document.querySelectorAll('.text-accent').forEach(el => el.style.color = accent);

//     localStorage.setItem('theme-colors', JSON.stringify({ primary, secondary, accent }));

//     // تفعيل زر اللون المختار
//     colorsGrid.querySelectorAll('button').forEach(btn => btn.classList.remove('ring-4'));
//     const activeBtn = colorsGrid.querySelector(`button[data-primary="${primary}"]`);
//     if (activeBtn) activeBtn.classList.add('ring-4');
// }

// /* ================== FONTS ================== */
// fontButtons.forEach(btn => {
//     btn.addEventListener('click', function () {
//         const font = this.dataset.font;
//         applyFont(font);
//         setActiveFont(this);
//     });
// });

// function applyFont(font) {
//     fonts.forEach(f => document.body.classList.remove(`font-${f}`));
//     document.body.classList.add(`font-${font}`);
//     localStorage.setItem('selected-font', font);
// }

// function setActiveFont(activeBtn) {
//     fontButtons.forEach(btn => btn.classList.remove('active'));
//     activeBtn.classList.add('active');
// }

// /* ================== RESET ================== */
// function resetSettings() {
//     const def = THEME_GRADIENTS[0].colors;
//     applyThemeColors(def.primary, def.secondary, def.accent);
//     applyFont('tajawal');
//     localStorage.clear();
//     toggleSettings();
// }

// resetBtn.addEventListener('click', resetSettings);

// /* ================== LOAD SAVED ================== */
// function loadSavedSettings() {
//     const savedColors = localStorage.getItem('theme-colors');
//     if (savedColors) {
//         const { primary, secondary, accent } = JSON.parse(savedColors);
//         applyThemeColors(primary, secondary, accent);
//     }

//     const savedFont = localStorage.getItem('selected-font');
//     if (savedFont) {
//         applyFont(savedFont);
//     }
// }

// /* ================== SIDEBAR ================== */
// function toggleSettings() {
//     settingsSidebar.classList.toggle('translate-x-full');
// }

// settingsBtn.addEventListener('click', e => {
//     e.stopPropagation();
//     toggleSettings();
// });
// closeBtn.addEventListener('click', toggleSettings);
// settingsSidebar.addEventListener('click', e => e.stopPropagation());
// document.addEventListener('click', () => {
//     if (!settingsSidebar.classList.contains('translate-x-full')) toggleSettings();
// });











const fonts = ['alexandria', 'tajawal', 'cairo'];

const settingsBtn = document.querySelector('#settings-toggle');
const settingsSidebar = document.querySelector('#settings-sidebar');
const closeBtn = document.querySelector('#close-settings');
const resetBtn = document.querySelector('#reset-settings');
const colorsGrid = document.querySelector('#theme-colors-grid');
const fontButtons = document.querySelectorAll('.font-option');

createColorBtnSettings();
loadSavedSettings();



function applyThemeColors(primary, secondary, accent) {
    const root = document.documentElement;
    
    // تحويل RGB إلى HEX لأستخدامه في CSS Variables
    const primaryHex = rgbToHex(primary);
    const secondaryHex = rgbToHex(secondary);
    const accentHex = rgbToHex(accent);
    
    // تطبيق CSS Variables
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-hex', primaryHex);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-secondary-hex', secondaryHex);
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-accent-hex', accentHex);
    
    // إنشاء وتطبيق gradient classes ديناميكياً
    updateAllGradients(primary, secondary, accent);
    
    // حفظ الإعدادات
    localStorage.setItem('theme-colors', JSON.stringify({ primary, secondary, accent }));
    
    // تفعيل زر اللون المختار
    colorsGrid.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('ring-4', 'ring-primary', 'ring-offset-2');
    });
    const activeBtn = colorsGrid.querySelector(`button[data-primary="${primary}"]`);
    if (activeBtn) {
        activeBtn.classList.add('ring-4', 'ring-primary', 'ring-offset-2');
    }
}

function updateAllGradients(primary, secondary, accent) {
    // تحديث جميع العناصر ذات التدرجات اللونية
    document.querySelectorAll('[class*="from-primary"], [class*="to-primary"]').forEach(el => {
        el.classList.forEach(className => {
            if (className.includes('from-primary')) {
                el.classList.remove(className);
                el.classList.add(className.replace('from-primary', 'from-[var(--color-primary)]'));
            }
            if (className.includes('to-primary')) {
                el.classList.remove(className);
                el.classList.add(className.replace('to-primary', 'to-[var(--color-primary)]'));
            }
        });
    });

    document.querySelectorAll('[class*="from-secondary"], [class*="to-secondary"]').forEach(el => {
        el.classList.forEach(className => {
            if (className.includes('from-secondary')) {
                el.classList.remove(className);
                el.classList.add(className.replace('from-secondary', 'from-[var(--color-secondary)]'));
            }
            if (className.includes('to-secondary')) {
                el.classList.remove(className);
                el.classList.add(className.replace('to-secondary', 'to-[var(--color-secondary)]'));
            }
        });
    });

    document.querySelectorAll('[class*="from-accent"], [class*="to-accent"]').forEach(el => {
        el.classList.forEach(className => {
            if (className.includes('from-accent')) {
                el.classList.remove(className);
                el.classList.add(className.replace('from-accent', 'from-[var(--color-accent)]'));
            }
            if (className.includes('to-accent')) {
                el.classList.remove(className);
                el.classList.add(className.replace('to-accent', 'to-[var(--color-accent)]'));
            }
        });
    });

    // تحديث العناصر المحددة في HTML
    const gradients = [
        { selector: 'bg-linear-to-br', gradient: `linear-gradient(to bottom right, ${primary}, ${secondary})` },
        { selector: 'bg-linear-to-r', gradient: `linear-gradient(to right, ${primary}, ${secondary})` },
        { selector: 'bg-linear-to-tr', gradient: `linear-gradient(to top right, ${primary}, ${accent})` }
    ];

    gradients.forEach(({ selector, gradient }) => {
        document.querySelectorAll(`.${selector}`).forEach(el => {
            el.style.backgroundImage = gradient;
        });
    });

    // تحديث الألوان للنصوص
    document.querySelectorAll('.text-primary').forEach(el => {
        el.style.color = primary;
    });
    document.querySelectorAll('.text-secondary').forEach(el => {
        el.style.color = secondary;
    });
    document.querySelectorAll('.text-accent').forEach(el => {
        el.style.color = accent;
    });

    // تحديل الظلال
    document.querySelectorAll('[class*="shadow-primary"]').forEach(el => {
        el.classList.forEach(className => {
            if (className.includes('shadow-primary')) {
                el.classList.remove(className);
                el.classList.add(className.replace('shadow-primary', `shadow-[${primary}]`));
            }
        });
    });

    document.querySelectorAll('[class*="shadow-secondary"]').forEach(el => {
        el.classList.forEach(className => {
            if (className.includes('shadow-secondary')) {
                el.classList.remove(className);
                el.classList.add(className.replace('shadow-secondary', `shadow-[${secondary}]`));
            }
        });
    });
}

function rgbToHex(rgb) {
    // تحويل rgb(r, g, b) إلى hex
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000';
    
    const [r, g, b] = result.map(num => parseInt(num));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ================== FONTS ================== */
fontButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        const font = this.dataset.font;
        applyFont(font);
        setActiveFont(this);
    });
});

function applyFont(font) {
    fonts.forEach(f => document.body.classList.remove(`font-${f}`));
    document.body.classList.add(`font-${font}`);
    localStorage.setItem('selected-font', font);
}

function setActiveFont(activeBtn) {
    fontButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

/* ================== RESET ================== */
function resetSettings() {
    const def = THEME_GRADIENTS[0].colors;
    applyThemeColors(def.primary, def.secondary, def.accent);
    applyFont('tajawal');
    
    // إعادة تعيين CSS Variables إلى القيم الافتراضية
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-primary-hex');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--color-secondary-hex');
    root.style.removeProperty('--color-accent');
    root.style.removeProperty('--color-accent-hex');
    
    localStorage.clear();
    toggleSettings();
}

resetBtn.addEventListener('click', resetSettings);

/* ================== LOAD SAVED ================== */
function loadSavedSettings() {
    const savedColors = localStorage.getItem('theme-colors');
    if (savedColors) {
        const { primary, secondary, accent } = JSON.parse(savedColors);
        applyThemeColors(primary, secondary, accent);
    }

    const savedFont = localStorage.getItem('selected-font');
    if (savedFont) {
        applyFont(savedFont);
    }
}

/* ================== SIDEBAR ================== */
function toggleSettings() {
    settingsSidebar.classList.toggle('translate-x-full');
}

settingsBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleSettings();
});
closeBtn.addEventListener('click', toggleSettings);
settingsSidebar.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => {
    if (!settingsSidebar.classList.contains('translate-x-full')) toggleSettings();
});

// إضافة MutationObserver لتطبيق الألوان على العناصر الجديدة
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            const savedColors = localStorage.getItem('theme-colors');
            if (savedColors) {
                const { primary, secondary, accent } = JSON.parse(savedColors);
                setTimeout(() => updateAllGradients(primary, secondary, accent), 100);
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });










