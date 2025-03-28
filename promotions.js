document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.promo-tab-button');
    const weekButtons = document.querySelectorAll('.week-tab-button');
    const weekTabs = document.getElementById('week-tabs');
    const promotionsContainer = document.getElementById('promotions-container');
    let promotionsData = null;
    let currentTab = null; // Nenhuma aba selecionada inicialmente
    let currentWeek = 'past'; // Semana inicial (quando uma aba for selecionada)

    // Função para carregar os dados do JSON
    async function loadPromotionsData() {
        try {
            const response = await fetch('promocoes-data.json');
            const data = await response.json();
            promotionsData = data.promotionsData;
            // Não renderiza nada até que uma aba seja selecionada
        } catch (error) {
            console.error('Erro ao carregar os dados das promoções:', error);
            promotionsContainer.innerHTML = '<p>Erro ao carregar as promoções. Tente novamente mais tarde.</p>';
        }
    }

    // Função para renderizar as promoções com base na aba e semana selecionadas
    function renderPromotions() {
        if (!promotionsData || !currentTab) {
            promotionsContainer.innerHTML = ''; // Remove a mensagem inicial
            return;
        }

        const promotions = promotionsData[currentTab][currentWeek];
        promotionsContainer.innerHTML = ''; // Limpa o container

        if (promotions.length === 0) {
            promotionsContainer.innerHTML = ''; // Não exibe nada se não houver promoções
            return;
        }

        promotions.forEach(promo => {
            const promoElement = document.createElement('div');
            promoElement.classList.add('promo-content');

            // Divide a descrição em linhas
            const lines = promo.description.split('\n');

            // Aplica a formatação de evento, partida e data/hora para todas as semanas
            let hasMatches = false;
            lines.forEach(line => {
                // Remove espaços extras e verifica se a linha está vazia
                line = line.trim();
                if (!line) return;

                // Usa uma expressão regular ajustada para dividir a linha em três partes
                // Captura o evento até o primeiro time, considerando espaços no nome do evento
                const match = line.match(/(.*?)\s+(.+?)\s+x\s+(.+?)\s+(\d{2}:\d{2}\s+\d{2}\/\d{2})$/);
                if (match) {
                    hasMatches = true;
                    const event = match[1].trim(); // Ex.: "Super Lig Turquia"
                    const team1 = match[2].trim(); // Ex.: "Eyupspor"
                    const team2 = match[3].trim(); // Ex.: "Istanbul Basaksehir"
                    const matchDetails = `${team1} x ${team2}`; // Ex.: "Eyupspor x Istanbul Basaksehir"
                    const dateTime = match[4].trim(); // Ex.: "14:00 31/03"

                    const lineElement = document.createElement('div');
                    lineElement.classList.add('promo-line');
                    lineElement.innerHTML = `
                        <span class="promo-event">${event}</span>
                        <span class="promo-match">${matchDetails}</span>
                        <span class="promo-datetime">${dateTime}</span>
                    `;
                    promoElement.appendChild(lineElement);
                } else {
                    // Fallback: se a regex não corresponder, exibe a linha como texto simples
                    const lineElement = document.createElement('div');
                    lineElement.classList.add('promo-line');
                    lineElement.innerHTML = `<p>${line}</p>`;
                    promoElement.appendChild(lineElement);
                }
            });

            // Se não houver partidas no formato esperado, renderiza a descrição como texto simples
            if (!hasMatches) {
                const descriptionElement = document.createElement('p');
                descriptionElement.innerHTML = promo.description.replace(/\n/g, '<br>');
                promoElement.appendChild(descriptionElement);
            }

            promotionsContainer.appendChild(promoElement);
        });
    }

    // Evento para os botões de abas (M12, 100X, Super Odds)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'selected' de todos os botões de aba
            tabButtons.forEach(btn => btn.classList.remove('selected'));
            // Adiciona a classe 'selected' ao botão clicado
            button.classList.add('selected');

            // Atualiza a aba atual
            currentTab = button.getAttribute('data-tab');

            // Mostra os botões de semana
            weekTabs.classList.remove('hidden');
            weekTabs.style.opacity = '1'; // Para a transição suave

            // Garante que a semana "past" esteja selecionada ao mudar de aba
            currentWeek = 'past';
            weekButtons.forEach(btn => btn.classList.remove('selected'));
            document.querySelector('.week-tab-button[data-week="past"]').classList.add('selected');

            // Renderiza as promoções
            renderPromotions();
        });
    });

    // Evento para os botões de semana (Passada, Atual, Próxima)
    weekButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'selected' de todos os botões de semana
            weekButtons.forEach(btn => btn.classList.remove('selected'));
            // Adiciona a classe 'selected' ao botão clicado
            button.classList.add('selected');

            // Atualiza a semana atual
            currentWeek = button.getAttribute('data-week');
            renderPromotions();
        });
    });

    // Inicialmente, esconde os botões de semana e limpa o container de promoções
    weekTabs.classList.add('hidden');
    promotionsContainer.innerHTML = ''; // Remove a mensagem inicial

    // Carrega os dados ao iniciar
    loadPromotionsData();
});