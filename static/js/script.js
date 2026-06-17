// Smooth scroll to form
function scrollToForm() {
    document.getElementById('form-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Update slider values
function updateSliderValue(slider, valueId) {
    document.getElementById(valueId).textContent = slider.value;
}

// Form submission with loading state
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    form.addEventListener('submit', function(e) {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading mr-3"></div>
            Memproses Prediksi...
        `;

        // Optional: Add form validation here
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
            } else {
                field.classList.remove('border-red-500');
            }
        });

        if (!isValid) {
            e.preventDefault();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            alert('Mohon lengkapi semua field yang diperlukan!');
        }
    });

    // Initialize slider values
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueId = slider.getAttribute('oninput').match(/'([^']+)'/)[1];
        document.getElementById(valueId).textContent = slider.value;
    });
});

 // ===== LOGIKA UNTUK CUSTOM SELECT =====
    function setupCustomSelects() {
        // Tutup semua select jika klik di luar
        window.addEventListener('click', function(e) {
            document.querySelectorAll('.custom-select-wrapper').forEach(function(wrapper) {
                if (!wrapper.contains(e.target)) {
                    wrapper.querySelector('.custom-select-options').classList.remove('open');
                    wrapper.querySelector('.custom-select-trigger svg').style.transform = 'rotate(0deg)';
                }
            });
        });

        document.querySelectorAll('.custom-select-wrapper').forEach(setupSelect);
    }

    function setupSelect(wrapper) {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const optionsContainer = wrapper.querySelector('.custom-select-options');
        const options = wrapper.querySelectorAll('.custom-select-option');
        const hiddenInput = wrapper.querySelector('input[type="hidden"]');
        const displaySpan = trigger.querySelector('.select-display-text');

        // Buka/tutup dropdown saat trigger diklik
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = optionsContainer.classList.toggle('open');
            trigger.querySelector('svg').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        // Pilih opsi
        options.forEach(function(option) {
            option.addEventListener('click', function() {
                const selectedValue = this.getAttribute('data-value');
                const selectedText = this.textContent;

                // Update tampilan dan nilai input
                displaySpan.textContent = selectedText;
                hiddenInput.value = selectedValue;

                // Tandai mana yang aktif
                options.forEach(opt => opt.classList.remove('bg-purple-100', 'font-semibold'));
                this.classList.add('bg-purple-100', 'font-semibold');

                // Tutup dropdown
                optionsContainer.classList.remove('open');
                trigger.querySelector('svg').style.transform = 'rotate(0deg)';
            });
        });
    }

    // Panggil fungsi setup saat halaman selesai dimuat
    document.addEventListener('DOMContentLoaded', setupCustomSelects);

document.addEventListener('DOMContentLoaded', function () {
    // Logika untuk Custom Dropdown (Select)
    // Asumsi: Anda sudah memiliki logika ini, jika belum, ini adalah contohnya
    const customSelects = document.querySelectorAll('.custom-select-wrapper');
    customSelects.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const options = wrapper.querySelector('.custom-select-options');
        const hiddenInput = wrapper.querySelector('input[type="hidden"]');
        const display = trigger.querySelector('.select-display-text');

        trigger.addEventListener('click', () => {
            options.classList.toggle('hidden'); // Ganti 'hidden' dengan class display Anda
            trigger.querySelector('svg').classList.toggle('rotate-180');
        });

        options.querySelectorAll('.custom-select-option').forEach(option => {
            option.addEventListener('click', () => {
                hiddenInput.value = option.getAttribute('data-value');
                display.textContent = option.textContent;
                
                // Reset style pilihan
                options.querySelectorAll('.custom-select-option').forEach(o => {
                    o.classList.remove('bg-purple-100', 'font-semibold');
                });
                // Terapkan style pada pilihan baru
                option.classList.add('bg-purple-100', 'font-semibold');

                options.classList.add('hidden');
                trigger.querySelector('svg').classList.remove('rotate-180');
            });
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                options.classList.add('hidden');
                trigger.querySelector('svg').classList.remove('rotate-180');
            }
        });
    });


    // --- BARU: Logika untuk Rating Bintang ---
    const starRatings = document.querySelectorAll('.star-rating');

    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        const hiddenInput = rating.previousElementSibling; // Mengambil input 'hidden' tepat sebelum div rating

        stars.forEach(star => {
            // Event saat mouse berada di atas bintang
            star.addEventListener('mouseover', function() {
                resetStars(stars); // Hapus warna hover sebelumnya
                const currentValue = this.getAttribute('data-value');
                highlightStars(stars, currentValue, 'text-yellow-400'); // Warna saat hover
            });

            // Event saat mouse meninggalkan area rating
            rating.addEventListener('mouseleave', function() {
                resetStars(stars);
                const selectedValue = hiddenInput.value;
                if (selectedValue > 0) {
                    highlightStars(stars, selectedValue, 'text-yellow-500'); // Kembalikan ke warna pilihan terakhir
                }
            });

            // Event saat bintang di-klik
            star.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                hiddenInput.value = value; // Set nilai pada hidden input
                highlightStars(stars, value, 'text-yellow-500'); // Warna saat dipilih
            });
        });
    });

    function highlightStars(stars, value, colorClass) {
        for (let i = 0; i < value; i++) {
            stars[i].classList.remove('text-gray-300');
            stars[i].classList.add(colorClass);
        }
    }

    function resetStars(stars) {
        stars.forEach(star => {
            star.classList.remove('text-yellow-400', 'text-yellow-500');
            star.classList.add('text-gray-300');
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    
    // Fungsi untuk meng-update tampilan slider (WARNA + ANGKA)
    function updateSlider(slider) {
        const display = slider.nextElementSibling; // div .slider-value-display
        const hiddenInput = slider.parentElement.previousElementSibling; // input hidden

        const value = slider.value;
        const min = slider.min;
        const max = slider.max;

        // 1. Perbarui angka yang ditampilkan
        display.textContent = value;
        
        // 2. Perbarui nilai di input yang tersembunyi
        hiddenInput.value = value;
        
        // --- BARU: Logika untuk mengisi warna pada track slider ---
        const percentage = ((value - min) / (max - min)) * 100;
        const colorFill = `linear-gradient(to right, #8b5cf6 ${percentage}%, #e5e7eb ${percentage}%)`;
        
        slider.style.background = colorFill;
    }

    // Terapkan pada semua slider kustom di halaman
    document.querySelectorAll('.custom-slider').forEach(slider => {
        // Panggil fungsi sekali saat halaman dimuat untuk set tampilan awal
        updateSlider(slider);

        // Tambahkan event listener untuk setiap kali slider digeser
        slider.addEventListener('input', (event) => {
            updateSlider(event.target);
        });

        // (Opsional) Efek "pop" saat angka berubah
        slider.addEventListener('input', () => {
            const display = slider.nextElementSibling;
            display.style.transform = 'scale(1.15)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ... (kode JavaScript lain yang sudah Anda miliki) ...

});