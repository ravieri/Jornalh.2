document.addEventListener('DOMContentLoaded', () => {
    const matchesContainer = document.querySelector('.matches-container');
    const matchesWeeks = document.querySelectorAll('.matches-week');
    const matchesPrev = document.querySelector('.matches-prev');
    const matchesNext = document.querySelector('.matches-next');
    const matchesCurrent = document.querySelector('.matches-current');
    let currentWeekIndex = 1; // Índice da semana atual (0 = passada, 1 = atual, 2 = próxima)
    let currentMatchIndices = [0, 0, 0]; // Índices das partidas para cada semana
    const matchesPerPage = 5; // Limite de 5 partidas por vez

    // Função para atualizar a exibição das partidas e o texto da semana
    function updateMatches() {
        // Atualizar a exibição da semana
        matchesWeeks.forEach((week, index) => {
            week.style.display = (index === currentWeekIndex) ? 'flex' : 'none';
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

        const currentWeek = matchesWeeks[currentWeekIndex];
        const matchItems = currentWeek.querySelectorAll('.match-item');
        const totalMatches = matchItems.length;
        const currentMatchIndex = currentMatchIndices[currentWeekIndex];

        // Calcular o deslocamento para a animação
        const itemWidth = matchItems[0]?.offsetWidth || 200; // Largura do item (200px como fallback)
        const gap = 15; // Espaçamento entre itens (definido no CSS)
        const totalItemWidth = itemWidth + gap; // Largura total de cada item incluindo o gap
        const offset = -(currentMatchIndex * matchesPerPage * totalItemWidth); // Deslocamento para a esquerda

        // Aplicar a transformação para deslizar
        currentWeek.style.transform = `translateX(${offset}px)`;

        // Atualizar botões de navegação lateral
        updateMatchNavigation();
    }

    // Função para atualizar ou criar botões de navegação lateral
    function updateMatchNavigation() {
        const currentWeek = matchesWeeks[currentWeekIndex];
        const matchItems = currentWeek.querySelectorAll('.match-item');
        const totalPages = Math.ceil(matchItems.length / matchesPerPage);
        const existingPrev = document.querySelector('.match-prev');
        const existingNext = document.querySelector('.match-next');

        // Remover botões antigos, se existirem
        if (existingPrev) existingPrev.remove();
        if (existingNext) existingNext.remove();

        if (totalPages > 1) {
            // Criar botões de navegação lateral
            const prevMatchButton = document.createElement('button');
            prevMatchButton.textContent = '◄';
            prevMatchButton.className = 'match-prev';
            prevMatchButton.style.cssText = 'position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: #3A005A; border: 1px solid #E0A0E0; border-radius: 20px; padding: 5px 10px; cursor: pointer; color: #ffffff; z-index: 10;';

            const nextMatchButton = document.createElement('button');
            nextMatchButton.textContent = '►';
            nextMatchButton.className = 'match-next';
            nextMatchButton.style.cssText = 'position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #3A005A; border: 1px solid #E0A0E0; border-radius: 20px; padding: 5px 10px; cursor: pointer; color: #ffffff; z-index: 10;';

            matchesContainer.appendChild(prevMatchButton);
            matchesContainer.appendChild(nextMatchButton);

            // Evento para o botão "Anterior" das partidas
            prevMatchButton.addEventListener('click', () => {
                if (currentMatchIndices[currentWeekIndex] > 0) {
                    currentMatchIndices[currentWeekIndex]--;
                    updateMatches();
                }
            });

            // Evento para o botão "Próximo" das partidas
            nextMatchButton.addEventListener('click', () => {
                const maxIndex = Math.ceil(matchItems.length / matchesPerPage) - 1;
                if (currentMatchIndices[currentWeekIndex] < maxIndex) {
                    currentMatchIndices[currentWeekIndex]++;
                    updateMatches();
                }
            });

            // Desativar botões se não houver mais itens para navegar
            prevMatchButton.disabled = (currentMatchIndices[currentWeekIndex] === 0);
            nextMatchButton.disabled = (currentMatchIndices[currentWeekIndex] >= totalPages - 1);
        }
    }

    // Evento para o botão "Semana Passada"
    matchesPrev.addEventListener('click', () => {
        if (currentWeekIndex > 0) {
            currentWeekIndex--;
            currentMatchIndices[currentWeekIndex] = 0; // Reinicia o índice da página ao mudar de semana
            updateMatches();
        }
    });

    // Evento para o botão "Próxima Semana"
    matchesNext.addEventListener('click', () => {
        if (currentWeekIndex < matchesWeeks.length - 1) {
            currentWeekIndex++;
            currentMatchIndices[currentWeekIndex] = 0; // Reinicia o índice da página ao mudar de semana
            updateMatches();
        }
    });

    // Inicializar a exibição
    updateMatches();
});



