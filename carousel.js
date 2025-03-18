document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    let currentIndex = 0;
    let autoSlideInterval;

    // Cria os indicadores dinamicamente
    carouselItems.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            stopAutoSlide();
            startAutoSlide();
        });
        indicatorsContainer.appendChild(indicator);
    });

    // Função para ajustar a altura do carrossel
    function adjustCarouselHeight() {
        const activeItem = carouselItems[currentIndex];
        const activeImage = activeItem.querySelector('.carousel-image');
        if (activeImage.complete) {
            const naturalWidth = activeImage.naturalWidth;
            const naturalHeight = activeImage.naturalHeight;
            const containerWidth = carouselContainer.offsetWidth;
            const aspectRatio = naturalWidth / naturalHeight;
            const newHeight = containerWidth / aspectRatio;
            carouselContainer.style.height = `${newHeight}px`;
        } else {
            activeImage.addEventListener('load', () => {
                const naturalWidth = activeImage.naturalWidth;
                const naturalHeight = activeImage.naturalHeight;
                const containerWidth = carouselContainer.offsetWidth;
                const aspectRatio = naturalWidth / naturalHeight;
                const newHeight = containerWidth / aspectRatio;
                carouselContainer.style.height = `${newHeight}px`;
            });
        }
    }

    // Função para atualizar o carrossel e os indicadores
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselContainer.style.transform = `translateX(${offset}%)`;
        adjustCarouselHeight();

        // Atualiza o indicador ativo
        indicatorsContainer.querySelectorAll('span').forEach((span, i) => {
            span.classList.toggle('active', i === currentIndex);
        });
    }

    // Função para avançar para o próximo slide
    function nextSlide() {
        currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    }

    // Função para iniciar a rotação automática
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Função para pausar a rotação automática
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Evento para o botão "anterior"
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        updateCarousel();
        stopAutoSlide();
        startAutoSlide();
    });

    // Evento para o botão "próximo"
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    // Pausar a rotação ao passar o mouse
    carouselContainer.addEventListener('mouseover', stopAutoSlide);

    // Retomar a rotação ao tirar o mouse
    carouselContainer.addEventListener('mouseout', startAutoSlide);

    // Ajusta a altura ao carregar e ao redimensionar
    adjustCarouselHeight();
    window.addEventListener('resize', adjustCarouselHeight);

    // Inicia o carrossel e a rotação automática
    updateCarousel(); // Define o primeiro indicador como ativo
    startAutoSlide();
});