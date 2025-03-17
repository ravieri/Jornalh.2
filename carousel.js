document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;
    let autoSlideInterval; // Variável para controlar o intervalo de rotação automática

    // Função para ajustar a altura do carrossel com base na imagem ativa
    function adjustCarouselHeight() {
        const activeItem = carouselItems[currentIndex];
        const activeImage = activeItem.querySelector('.carousel-image');

        // Certifique-se de que a imagem está carregada antes de ajustar
        if (activeImage.complete) {
            const naturalWidth = activeImage.naturalWidth;
            const naturalHeight = activeImage.naturalHeight;
            const containerWidth = carouselContainer.offsetWidth;

            // Calcule a altura proporcional com base na largura do contêiner e na proporção da imagem
            const aspectRatio = naturalWidth / naturalHeight;
            const newHeight = containerWidth / aspectRatio;

            // Ajuste a altura do carousel-container
            carouselContainer.style.height = `${newHeight}px`;
        } else {
            // Se a imagem ainda não estiver carregada, adicione um listener
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

    // Função para atualizar o carrossel
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselContainer.style.transform = `translateX(${offset}%)`;
        adjustCarouselHeight(); // Ajusta a altura sempre que o slide muda
    }

    // Função para avançar para o próximo slide
    function nextSlide() {
        currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    }

    // Função para iniciar a rotação automática
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    // Função para pausar a rotação automática
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Evento para o botão "anterior"
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        updateCarousel();
        stopAutoSlide(); // Para a rotação ao interagir manualmente
        startAutoSlide(); // Reinicia a rotação automática
    });

    // Evento para o botão "próximo"
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide(); // Para a rotação ao interagir manualmente
        startAutoSlide(); // Reinicia a rotação automática
    });

    // Pausar a rotação ao passar o mouse sobre o carrossel
    carouselContainer.addEventListener('mouseover', stopAutoSlide);

    // Retomar a rotação ao tirar o mouse do carrossel
    carouselContainer.addEventListener('mouseout', startAutoSlide);

    // Ajusta a altura ao carregar a página
    adjustCarouselHeight();

    // Ajusta a altura ao redimensionar a janela
    window.addEventListener('resize', adjustCarouselHeight);

    // Inicia a rotação automática ao carregar a página
    startAutoSlide();
});