function activeInScroll() {
    const sections = document.querySelectorAll("section");
    const navHeight = document.querySelector("nav").offsetHeight; // navbar height

    window.addEventListener("scroll", function () {
        let currentSection = "";
        let scrollPosition = window.scrollY + navHeight; //scrollY المسافة اللي الصفحة اتحركتها

        // لتحديد السكشن الحالي
        for (var i = 0; i < sections.length; i++) {
            let sectionTop = sections[i].offsetTop;//
            let sectionHeight = sections[i].clientHeight; // section height

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sections[i].id;// current section
            }
        }

        // to update navbar
        updateNavbar(currentSection)
    })
}
function updateNavbar(sectionId) {
    const navLinks = document.querySelectorAll(".nav-links a");

    for (var i = 0; i < navLinks.length; i++) {
        let link = navLinks[i];
        link.classList.remove('active');

        let targetLink = link.getAttribute('href').replace('#', '')
        if (targetLink == sectionId) {
            link.classList.add('active');
        }
    }
}

// ==========================================================

function darkMode() {
    const toggleBtn = document.querySelector("#theme-toggle-button");
    const html = document.documentElement;

    let currentTheme = localStorage.getItem("theme")
    currentTheme === 'dark' ? html.classList.add('dark') : html.classList.remove('dark')

    toggleBtn.addEventListener("click", function () {
        let isDark = html.classList.toggle("dark");
        updateLocalStorage(isDark);
    })
}
function updateLocalStorage(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ==========================================================
function portfolioTabs() {
    let filterBtns = document.querySelectorAll('.portfolio-filter');

    filterBtns[0].classList.add('gradient-btn');

    for (var i = 0; i < filterBtns.length; i++) {
        let filter = filterBtns[i];
        filter.addEventListener('click', function () {

            removeActive(filterBtns);
            filter.classList.add('gradient-btn');

            let filterValue = filter.getAttribute('data-filter');
            filterItems(filterValue);
        })
    }
}

function removeActive(btnList) {
    for (var i = 0; i < btnList.length; i++) {
        btnList[i].classList.remove('gradient-btn');
    }
}

function filterItems(value) {
    let portfolioItems = document.querySelectorAll('.portfolio-item');

    for (let i = 0; i < portfolioItems.length; i++) {
        let item = portfolioItems[i];

        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        let category = item.getAttribute('data-category')

        if (value === 'all' || category === value) {
            item.style.display = 'block';

            setTimeout(function () {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300);

        } else {
            item.style.display = 'none';
        }
    }
}
// ==========================================================

function carousel() {
    const cards = document.querySelectorAll('.testimonial-card');
    const carousel = document.querySelector('#testimonials-carousel');
    const nextBtn = document.querySelector('#next-testimonial');
    const prevBtn = document.querySelector('#prev-testimonial');
    const indicators = document.querySelectorAll('.carousel-indicator');

    const cardsToShow = 3;
    let currentSlide = 0;
    let totalSlides = cards.length - cardsToShow + 1;

    function updateCarousel() {
        const card = cards[0];
        const style = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth + (parseInt(style.marginLeft) || 0) + (parseInt(style.marginRight) || 0);
        carousel.style.transform = `translateX(${currentSlide * cardWidth}px)`;
    }

    function updateIndicators() {
        for (let i = 0; i < indicators.length; i++) {
            indicators[i].classList.toggle('bg-accent', i === currentSlide);
            indicators[i].classList.toggle('bg-slate-400', i !== currentSlide);
            indicators[i].classList.toggle('dark:bg-slate-600', i !== currentSlide);
        }
    }

    // Next Button
    nextBtn.addEventListener('click', function () {
        if (currentSlide < totalSlides - 1)
            currentSlide++
        else
            currentSlide = 0;

        updateCarousel();
        updateIndicators();
    });

    // Previous
    prevBtn.addEventListener('click', function () {
        if (currentSlide > 0)
            currentSlide--
        else
            currentSlide = totalSlides - 1;

        updateCarousel();
        updateIndicators();
    });

    for (let i = 0; i < indicators.length; i++) {
        indicators[i].addEventListener('click', function () {
            currentSlide = i;
            updateCarousel();
            updateIndicators();
        });
    }


    function handleResponsive() {
        const screenWidth = window.innerWidth;
        let newCards = screenWidth < 640 ? 1 : screenWidth < 1024 ? 2 : 3;

        if (newCards !== cardsToShow) {
            let newTotal = cards.length - newCards + 1;
            currentSlide = Math.min(currentSlide, newTotal - 1);
            updateCarousel();
            updateIndicators();
        }
    }

    updateCarousel();
    updateIndicators();
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
}
// ==========================================================

const colorTheme = [
    { name: 'indigo', colors: { primary: 'rgb(99, 102, 241)', secondary: 'rgb(139, 92, 246)', accent: 'rgb(99, 102, 241)' } },
    { name: 'pink-orange', colors: { primary: 'rgb(236, 72, 153)', secondary: 'rgb(249, 115, 22)', accent: 'rgb(236, 72, 153)' } },
    { name: 'emerald', colors: { primary: 'rgb(16, 185, 129)', secondary: 'rgb(5, 150, 105)', accent: 'rgb(16, 185, 129)' } },
    { name: 'blue-cyan', colors: { primary: 'rgb(59, 130, 246)', secondary: 'rgb(6, 182, 212)', accent: 'rgb(59, 130, 246)' } },
    { name: 'red-rose', colors: { primary: 'rgb(239, 68, 68)', secondary: 'rgb(244, 63, 94)', accent: 'rgb(239, 68, 68)' } },
    { name: 'amber-orange', colors: { primary: 'rgb(245, 158, 11)', secondary: 'rgb(234, 88, 12)', accent: 'rgb(245, 158, 11)' } }
];

const fonts = ['alexandria', 'tajawal', 'cairo'];

const settingsBtn = document.querySelector('#settings-toggle');
const settingsSidebar = document.querySelector('#settings-sidebar');
const closeBtn = document.querySelector('#close-settings');
const resetBtn = document.querySelector('#reset-settings');
const colorsGrid = document.querySelector('#theme-colors-grid');
const fontButtons = document.querySelectorAll('.font-option');

function createColorBtns() {
    for (let i = 0; i < colorTheme.length; i++) {
        const item = colorTheme[i];
        const btn = document.createElement('button');
        btn.className = 'w-12 h-12 rounded-full border-2 border-white';
        btn.style.backgroundImage = `linear-gradient(${item.colors.primary}, ${item.colors.secondary})`;
        btn.dataset.primary = item.colors.primary;
        btn.dataset.secondary = item.colors.secondary;
        btn.dataset.accent = item.colors.accent;

        btn.addEventListener('click', function () {
            applyThemeColors(item.colors.primary, item.colors.secondary, item.colors.accent);
        });

        colorsGrid.appendChild(btn);
    }
}

function applyThemeColors(primary, secondary, accent) {
    localStorage.setItem('theme-colors', JSON.stringify({ primary, secondary, accent }));

    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-accent', accent);

    updateElements(primary, secondary, accent);
}

function updateElements(primary, secondary, accent) {
    const scrollBtn = document.getElementById('scroll-to-top');
    const emailDivs = document.querySelectorAll('.bg-gradient-to-br.from-primary.to-secondary');
    const phoneDivs = document.querySelectorAll('.bg-gradient-to-br.from-secondary.to-accent');
    const locationDivs = document.querySelectorAll('.bg-gradient-to-br.from-accent.to-primary');
    const gradientTexts = document.querySelectorAll('.bg-clip-text');


    const gradientElements = [
        { selector: '.bg-linear-to-br', gradient: `linear-gradient(to bottom right, ${primary}, ${secondary})` },
        { selector: '.bg-linear-to-r', gradient: `linear-gradient(to right, ${primary}, ${secondary})` },
        { selector: '.bg-gradient-to-tr', gradient: `linear-gradient(to top right, ${primary}, ${accent})` },
        { selector: '.bg-gradient-to-l', gradient: `linear-gradient(to left, ${primary}, ${secondary})` },
        { selector: '.gradient-btn', gradient: `linear-gradient(to right, ${primary}, ${secondary})` },
    ];
    const textColors = [
        { selector: '.text-primary', color: primary },
        { selector: '.text-secondary', color: secondary },
        { selector: '.text-accent', color: accent }
    ];
    const bgColors = [
        { selector: '.bg-primary', color: primary },
        { selector: '.bg-secondary', color: secondary },
        { selector: '.bg-accent', color: accent }
    ];
    const borderColors = [
        { selector: '.border-primary', color: primary },
        { selector: '.border-secondary', color: secondary },
        { selector: '.border-accent', color: accent }
    ];

    for (let i = 0; i < gradientElements.length; i++) {
        let elements = document.querySelectorAll(gradientElements[i].selector);
        for (let j = 0; j < elements.length; j++) {
            elements[j].style.backgroundImage = gradientElements[i].gradient;
        }
    }

    scrollBtn.style.backgroundImage = `linear-gradient(to top right, ${primary}, ${accent})`;

    for (let i = 0; i < emailDivs.length; i++) {
        emailDivs[i].style.backgroundImage = `linear-gradient(to bottom right, ${primary}, ${secondary})`;
    }

    for (let i = 0; i < phoneDivs.length; i++) {
        phoneDivs[i].style.backgroundImage = `linear-gradient(to bottom right, ${secondary}, ${accent})`;
    }

    for (let i = 0; i < locationDivs.length; i++) {
        locationDivs[i].style.backgroundImage = `linear-gradient(to bottom right, ${accent}, ${primary})`;
    }

    for (let j = 0; j < textColors.length; j++) {
        let elements = document.querySelectorAll(textColors[j].selector);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.color = textColors[j].color;
        }
    }

    for (let j = 0; j < bgColors.length; j++) {
        let elements = document.querySelectorAll(bgColors[j].selector);
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].classList.contains('bg-gradient') &&
                !elements[i].classList.contains('bg-linear')) {
                elements[i].style.backgroundColor = bgColors[j].color;
            }
        }
    }

    for (let j = 0; j < borderColors.length; j++) {
        let elements = document.querySelectorAll(borderColors[j].selector);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.borderColor = borderColors[j].color;
        }
    }

    for (let i = 0; i < gradientTexts.length; i++) {
        if (gradientTexts[i].classList.contains('from-primary') ||
            gradientTexts[i].classList.contains('to-secondary')) {
            gradientTexts[i].style.backgroundImage = 'linear-gradient(to left, ' + primary + ', ' + secondary + ')';
        }
    }
}

function fontEvents(){
    for (let i = 0; i < fontButtons.length; i++) {
        fontButtons[i].addEventListener('click', function () {
            const font = fontButtons[i].dataset.font;
            applyFont(font);
            setActiveFont(fontButtons[i]);
        });
    }


}

function applyFont(font) {
    for (let i = 0; i < fonts.length; i++) {
        document.body.classList.remove('font-' + fonts[i]);
    }

    document.body.classList.add('font-' + font);
    localStorage.setItem('selected-font', font);
}

function setActiveFont(activeBtn) {
    for (let i = 0; i < fontButtons.length; i++) {
        fontButtons[i].classList.remove('active');
    }
    activeBtn.classList.add('active');
}

function resetValues() {
    resetBtn.addEventListener('click', function () {
        const defaultColors = colorTheme[0].colors;
        applyThemeColors(defaultColors.primary, defaultColors.secondary, defaultColors.accent);
        applyFont('tajawal');
        localStorage.clear();
        toggleSettings();
    });
}

function loadSavedSettings() {
    const savedColors = localStorage.getItem('theme-colors');
    if (savedColors) {
        const colors = JSON.parse(savedColors);
        applyThemeColors(colors.primary, colors.secondary, colors.accent);
    }

    const savedFont = localStorage.getItem('selected-font');
    if (savedFont) {
        applyFont(savedFont);

        for (let i = 0; i < fontButtons.length; i++) {
            if (fontButtons[i].dataset.font === savedFont) {
                setActiveFont(fontButtons[i]);
                break;
            }
        }
    }
}

function toggleSettings() {
    settingsSidebar.classList.toggle('translate-x-full');
}

function sideBarEvents() {

    settingsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleSettings();
    });

    closeBtn.addEventListener('click', toggleSettings);

    settingsSidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    document.addEventListener('click', function () {
        if (!settingsSidebar.classList.contains('translate-x-full')) {
            toggleSettings();
        }
    });

}


function initSettings() {
    createColorBtns();
    loadSavedSettings();
    fontEvents();
    sideBarEvents();
    resetValues();
}
// ==========================================================

function scrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================================

document.addEventListener('DOMContentLoaded', function () {
    activeInScroll()
    darkMode()
    portfolioTabs()
    carousel()
    initSettings();
    scrollToTop();
})