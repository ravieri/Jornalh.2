// Função para renderizar o carrossel
function renderCarouselItems(data) {
    const carouselContainer = document.getElementById("carousel-container");
    data.forEach(item => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        const img = document.createElement("img");
        img.classList.add("carousel-image");
        img.src = item.imgSrc;
        img.alt = item.alt || "Imagem de Esporte";

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("carousel-content");

        const spanCategory = document.createElement("span");
        spanCategory.classList.add("category-tag");
        spanCategory.textContent = item.categoryTag;

        const title = document.createElement("h2");
        title.textContent = item.title;

        const desc = document.createElement("p");
        desc.textContent = item.description;

        contentDiv.appendChild(spanCategory);
        contentDiv.appendChild(title);
        contentDiv.appendChild(desc);

        carouselItem.appendChild(img);
        carouselItem.appendChild(contentDiv);

        carouselContainer.appendChild(carouselItem);
    });
}

// Função para renderizar as partidas
function renderMatches(weeks) {
    const matchesContainer = document.getElementById("matches-container");
    weeks.forEach(weekObj => {
        const weekDiv = document.createElement("div");
        weekDiv.classList.add("matches-week");
        weekDiv.setAttribute("data-week", weekObj.weekLabel);

        weekObj.matches.forEach(match => {
            const matchItem = document.createElement("div");
            matchItem.classList.add("match-item");

            const championshipDiv = document.createElement("div");
            championshipDiv.classList.add("match-championship");
            championshipDiv.textContent = match.championship;

            const matchTeamsDiv = document.createElement("div");
            matchTeamsDiv.classList.add("match-teams");

            // Time A
            const teamADiv = document.createElement("div");
            teamADiv.classList.add("team");
            const teamAImg = document.createElement("img");
            teamAImg.classList.add("team-emblem");
            teamAImg.src = match.teamA.emblem;
            teamAImg.alt = match.teamA.name;
            const teamAName = document.createElement("span");
            teamAName.classList.add("team-name");
            teamAName.textContent = match.teamA.name;
            teamADiv.appendChild(teamAImg);
            teamADiv.appendChild(teamAName);

            // Placar
            const matchScore = document.createElement("span");
            matchScore.classList.add("match-score");
            matchScore.textContent = match.score;

            // Time B
            const teamBDiv = document.createElement("div");
            teamBDiv.classList.add("team");
            const teamBImg = document.createElement("img");
            teamBImg.classList.add("team-emblem");
            teamBImg.src = match.teamB.emblem;
            teamBImg.alt = match.teamB.name;
            const teamBName = document.createElement("span");
            teamBName.classList.add("team-name");
            teamBName.textContent = match.teamB.name;
            teamBDiv.appendChild(teamBImg);
            teamBDiv.appendChild(teamBName);

            // Monta times e placar
            matchTeamsDiv.appendChild(teamADiv);
            matchTeamsDiv.appendChild(matchScore);
            matchTeamsDiv.appendChild(teamBDiv);

            // Data e descrição
            const matchDate = document.createElement("div");
            matchDate.classList.add("match-date");
            matchDate.textContent = match.date;

            const matchDesc = document.createElement("span");
            matchDesc.classList.add("match-description");
            matchDesc.textContent = match.description || "";

            // Monta o item
            matchItem.appendChild(championshipDiv);
            matchItem.appendChild(matchTeamsDiv);
            matchItem.appendChild(matchDate);
            matchItem.appendChild(matchDesc);

            weekDiv.appendChild(matchItem);
        });

        matchesContainer.appendChild(weekDiv);
    });
}

// Determina qual arquivo de dados carregar com base na página atual
function getDataFile() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    switch (currentPage) {
        case 'index.html':
            return 'futebol-data.json';
        case 'basquete.html':   
            return 'basquete-data.json';
        case 'tenis.html':
            return 'tenis-data.json';
        case 'ufc.html':
            return 'ufc-data.json';
        default:
            return 'futebol-data.json'; // Padrão para index.html ou erro
    }
}

// Carrega os dados e inicializa tudo
document.addEventListener("DOMContentLoaded", () => {
    const dataFile = getDataFile();
    fetch(dataFile)
        .then(response => response.json())
        .then(data => {
            renderCarouselItems(data.carouselData);
            renderMatches(data.matchesData);

            // Dispara eventos para inicializar carousel.js e matches.js
            document.dispatchEvent(new Event("carouselReady"));
            document.dispatchEvent(new Event("matchesReady"));
        })
        .catch(error => console.error(`Erro ao carregar ${dataFile}:`, error));
});