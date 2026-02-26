/* ========================================
   RISE 2026 — Main Script (jQuery)
   ======================================== */

$(document).ready(function () {

    // ===== CURSOR GLOW =====
    const $glow = $('#cursorGlow');

    $(document).on('mousemove', function (e) {
        $glow.css({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        });
        if (!$glow.hasClass('visible')) {
            $glow.addClass('visible');
        }
    });

    $(document).on('mouseleave', function () {
        $glow.removeClass('visible');
    });

    // ===== COUNTDOWN TIMER =====
    function updateCountdown() {
        const eventDate = new Date('March 14, 2026 09:00:00').getTime();
        const now = new Date().getTime();
        const gap = eventDate - now;

        if (gap <= 0) {
            $('#countdown-days').text('0');
            $('#countdown-hours').text('0');
            $('#countdown-minutes').text('0');
            $('#countdown-seconds').text('0');
            return;
        }

        const days = Math.floor(gap / (1000 * 60 * 60 * 24));
        const hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((gap % (1000 * 60)) / 1000);

        $('#countdown-days').text(days);
        $('#countdown-hours').text(hours);
        $('#countdown-minutes').text(minutes);
        $('#countdown-seconds').text(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== NAVBAR SCROLL EFFECT =====
    $(window).on('scroll', function () {
        const scrollTop = $(window).scrollTop();

        // Navbar
        if (scrollTop > 80) {
            $('#navbar').addClass('scrolled');
        } else {
            $('#navbar').removeClass('scrolled');
        }
    });

    // ===== SIDE MENU TOGGLE =====
    $('#navToggle').on('click', function () {
        $('#navLinks').toggleClass('open');
        $('#navOverlay').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Close side menu on overlay click
    $('#navOverlay').on('click', function () {
        $('#navLinks').removeClass('open');
        $('#navOverlay').removeClass('active');
        $('#navToggle').removeClass('active');
    });

    // Close side menu on link click
    $('.nav-links a').on('click', function () {
        $('#navLinks').removeClass('open');
        $('#navOverlay').removeClass('active');
        $('#navToggle').removeClass('active');
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    $(window).on('scroll', function () {
        const scrollPos = $(window).scrollTop() + 100;

        $('section[id]').each(function () {
            const top = $(this).offset().top;
            const bottom = top + $(this).outerHeight();
            const id = $(this).attr('id');

            if (scrollPos >= top && scrollPos < bottom) {
                $('.nav-links a').removeClass('active');
                $('.nav-links a[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // ===== SMOOTH SCROLL =====
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 64
            }, 600, 'swing');
        }
    });

    // ===== LOAD SCHEDULE FROM JSON =====
    $.getJSON('schedule.json', function (data) {
        const $timeline = $('#timeline');
        $timeline.empty(); // Remove loading spinner

        if (data.schedule && data.schedule.length > 0) {
            $.each(data.schedule, function (index, item) {
                const card = `
                    <div class="timeline-item fade-in">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <div class="timeline-time">${item.time}</div>
                            <h3 class="timeline-title">
                                <span class="emoji">${item.icon || ''}</span>
                                ${item.title}
                            </h3>
                            <p class="timeline-desc">${item.description}</p>
                            <span class="timeline-location">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                ${item.location}
                            </span>
                        </div>
                    </div>
                `;
                $timeline.append(card);
            });

            // Trigger fade-in animations for schedule items
            observeElements('.timeline-item.fade-in');
        }
    }).fail(function () {
        $('#timeline').html(`
            <div style="text-align:center; padding: 40px; color: #94a3b8;">
                <p>Unable to load schedule. Please try refreshing the page.</p>
            </div>
        `);
    });

    // ===== FAQ ACCORDION =====
    $('.faq-question').on('click', function () {
        const $item = $(this).parent('.faq-item');
        const $answer = $item.find('.faq-answer');
        const isActive = $item.hasClass('active');

        // Close all
        $('.faq-item').removeClass('active');
        $('.faq-answer').css('max-height', '0');

        // Open clicked if it wasn't active
        if (!isActive) {
            $item.addClass('active');
            $answer.css('max-height', $answer[0].scrollHeight + 'px');
        }
    });

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    function observeElements(selector) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $(selector).each(function () {
            observer.observe(this);
        });
    }

    // Add fade-in class to elements
    $('.stat-card, .workshop-card, .gallery-item, .faq-item, .keynote-card, .sponsor-item').addClass('fade-in');

    // Observe all fade-in elements
    observeElements('.fade-in');

});
