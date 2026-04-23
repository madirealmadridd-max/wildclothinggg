        // ================= CAROUSEL LOGIC =================
        const slider = document.getElementById('bsSlider');
        const sliderContainer = document.getElementById('bsSliderContainer');
        const dotsContainer = document.getElementById('bsDots');
        const prevBtn = document.querySelector('.bs-prev');
        const nextBtn = document.querySelector('.bs-next');
        
        let currentSlide = 0;
        const slides = document.querySelectorAll('.bs-slide-page');
        const totalSlides = slides.length;

        function initDots() {
            dotsContainer.innerHTML = '';
            for(let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'bs-dot ' + (i === 0 ? 'active' : '');
                dot.onclick = () => bsGo(i);
                dotsContainer.appendChild(dot);
            }
        }

        function updateSlider() {
            slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
            const dots = document.querySelectorAll('.bs-dot');
            dots.forEach((d, i) => {
                if (i === currentSlide) d.classList.add('active');
                else d.classList.remove('active');
            });
            prevBtn.classList.toggle('disabled', currentSlide === 0);
            nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);
        }

        window.bsMove = function(dir) {
            currentSlide += dir;
            if(currentSlide < 0) currentSlide = 0;
            if(currentSlide >= totalSlides) currentSlide = totalSlides - 1;
            updateSlider();
        };

        window.bsGo = function(index) {
            currentSlide = index;
            updateSlider();
        };

        initDots();
        updateSlider();

        // ================= TOUCH SWIPE FOR CAROUSEL =================
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            // If scrolling vertically more than horizontally, let the page scroll
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isSwiping = false;
                return;
            }
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50; // minimum swipe distance in pixels

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swiped left -> next slide
                    bsMove(1);
                } else {
                    // Swiped right -> previous slide
                    bsMove(-1);
                }
            }
            isSwiping = false;
        }, { passive: true });
