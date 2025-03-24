document.addEventListener('matchesReady', () => {
    const matchesContainer = document.querySelector('.matches-container');
    const matchesWeeks = document.querySelectorAll('.matches-week');
    const matchesPrev = document.querySelector('.matches-prev');
    const matchesNext = document.querySelector('.matches-next');
    const matchesCurrent = document.querySelector('.matches-current');
    let currentWeekIndex = 1; // Índice da semana atual (0 = passada, 1 = atual, 2 = próxima)
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Função para atualizar a exibição das partidas e o texto da semana
    function updateMatches() {
        matchesWeeks.forEach((week, index) => {
            week.style.display = (index === currentWeekIndex) ? 'flex' : 'none';
            week.style.transform = `translateX(0px)`; // Reseta o deslocamento ao mudar de semana
        });

        // Atualizar o texto da semana atual
        switch (currentWeekIndex) {
            case 0:
                matchesCurrent.textContent = 'Semana Passada';
                break;
            case 1:
                matchesCurrent.textContent = 'Semana Atual';
                break;
            case 2:
                matchesCurrent.textContent = 'Próxima Semana';
                break;
        }
    }

    // Função para iniciar o arrastar
    matchesContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - matchesContainer.offsetLeft;
        scrollLeft = getCurrentTranslateX();
        matchesContainer.style.cursor = 'grabbing';
        matchesWeeks[currentWeekIndex].style.transition = 'none'; // Remove transição durante o arrastar
    });

    // Função para arrastar
    matchesContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - matchesContainer.offsetLeft;
        const walk = (x - startX) * 1; // Ajuste a sensibilidade do arrastar aqui (1 = normal)
        const currentWeek = matchesWeeks[currentWeekIndex];
        currentWeek.style.transform = `translateX(${scrollLeft + walk}px)`;
    });

    // Função para finalizar o arrastar
    matchesContainer.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        matchesContainer.style.cursor = 'grab';
        matchesWeeks[currentWeekIndex].style.transition = 'transform 0.5s ease-in-out'; // Restaura a transição
        snapToNearest(); // Opcional: ajustar para o item mais próximo
    });

    // Função para quando o mouse sai do contêiner
    matchesContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            matchesContainer.style.cursor = 'grab';
            matchesWeeks[currentWeekIndex].style.transition = 'transform 0.5s ease-in-out';
            snapToNearest(); // Opcional: ajustar para o item mais próximo
        }
    });

    // Função auxiliar para obter o valor atual de translateX
    function getCurrentTranslateX() {
        const currentWeek = matchesWeeks[currentWeekIndex];
        const transform = window.getComputedStyle(currentWeek).getPropertyValue('transform');
        if (transform === 'none') return 0;
        const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
        return parseFloat(matrix[4]); // O valor de translateX está na posição 4 da matriz
    }

    // Função para ajustar o carrossel ao item mais próximo (opcional)
    function snapToNearest() {
        const currentWeek = matchesWeeks[currentWeekIndex];
        const matchItems = currentWeek.querySelectorAll('.match-item');
        const itemWidth = matchItems[0]?.offsetWidth || 200; // Largura do item
        const gap = 15; // Espaçamento entre itens (conforme CSS)
        const totalItemWidth = itemWidth + gap;
        const currentTranslateX = getCurrentTranslateX();
        const nearestIndex = Math.round(-currentTranslateX / totalItemWidth);
        const newTranslateX = -nearestIndex * totalItemWidth;

        // Limita o deslocamento para não ultrapassar os itens
        const maxTranslateX = 0;
        const minTranslateX = -(matchItems.length - 1) * totalItemWidth;
        const boundedTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
        currentWeek.style.transform = `translateX(${boundedTranslateX}px)`;
    }

    // Evento para o botão "Semana Passada"
    matchesPrev.addEventListener('click', () => {
        if (currentWeekIndex > 0) {
            currentWeekIndex--;
            updateMatches();
        }
    });

    // Evento para o botão "Próxima Semana"
    matchesNext.addEventListener('click', () => {
        if (currentWeekIndex < matchesWeeks.length - 1) {
            currentWeekIndex++;
            updateMatches();
        }
    });

    // Tornar o contêiner arrastável visualmente
    matchesContainer.style.cursor = 'grab';

    // Inicializar a exibição
    updateMatches();
});