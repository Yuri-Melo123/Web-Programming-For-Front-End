// js/episodios.js
// Consome a API de episódios de Rick and Morty com paginação, busca e imagens ilustrativas

document.addEventListener("DOMContentLoaded", () => {
  const secaoEpisodios = document.querySelector("#episodios");

  // === BARRA DE BUSCA ===
  const barraBusca = document.createElement("div");
  barraBusca.id = "barra-busca-episodios";
  barraBusca.style.textAlign = "center";
  barraBusca.style.margin = "20px 0";

  const inputBusca = document.createElement("input");
  inputBusca.type = "text";
  inputBusca.placeholder = "🔍 Buscar episódio...";
  inputBusca.id = "campo-busca-episodios";

  const botaoBusca = document.createElement("button");
  botaoBusca.textContent = "Buscar";

  barraBusca.appendChild(inputBusca);
  barraBusca.appendChild(botaoBusca);
  secaoEpisodios.appendChild(barraBusca);

  // === CONTAINER DE EPISÓDIOS ===
  const containerEpisodios = document.createElement("div");
  containerEpisodios.id = "container-episodios";
  containerEpisodios.style.display = "grid";
  containerEpisodios.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
  containerEpisodios.style.gap = "20px";
  containerEpisodios.style.padding = "20px";
  secaoEpisodios.appendChild(containerEpisodios);

  // === PAGINAÇÃO ===
  const paginacao = document.createElement("div");
  paginacao.id = "paginacao-episodios";
  paginacao.style.textAlign = "center";
  paginacao.style.margin = "20px";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "⬅️ Anterior";
  btnAnterior.disabled = true;

  const btnProximo = document.createElement("button");
  btnProximo.textContent = "Próximo ➡️";

  paginacao.appendChild(btnAnterior);
  paginacao.appendChild(btnProximo);
  secaoEpisodios.appendChild(paginacao);

  // === ESTADO ===
  let paginaAtual = 1;
  let termoBusca = "";

  // === LISTA DE IMAGENS ILUSTRATIVAS ===
  const imagensEpisodios = [
    "./image/portal1.jpg",
    "./image/portal2.jpg",
    "./image/rick-morty-lab.jpg",
    "./image/morty-scared.jpg",
    "./image/rick-portal-gun.jpg",
    "./image/space-adventure.jpg",
    "./image/rick-and-summer.jpg",
    "./image/morty-face.jpg",
    "./image/space-craft.jpg",
    "./image/rick-toast.jpg"
  ];

  // === FUNÇÃO PRINCIPAL ===
  async function carregarEpisodios(pagina = 1, nome = "") {
    containerEpisodios.innerHTML =
      "<p style='grid-column: 1 / -1; text-align:center;'>Carregando episódios...</p>";

    try {
      const urlBase = "https://rickandmortyapi.com/api/episode";
      const endpoint = nome
        ? `${urlBase}/?name=${encodeURIComponent(nome)}&page=${pagina}`
        : `${urlBase}/?page=${pagina}`;

      const resposta = await fetch(endpoint);
      if (!resposta.ok) throw new Error("Episódio não encontrado ou erro na API.");
      const dados = await resposta.json();

      containerEpisodios.innerHTML = "";

      dados.results.forEach((episodio, index) => {
        const card = document.createElement("div");
        card.classList.add("card-episodio");
        card.style.backgroundColor = "rgba(2, 91, 170, 0.8)";
        card.style.color = "white";
        card.style.borderRadius = "10px";
        card.style.textAlign = "center";
        card.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        card.style.transition = "0.3s";
        card.style.overflow = "hidden";

        // Seleciona imagem aleatória do array
        const imagem = document.createElement("img");
        const imgSrc = imagensEpisodios[index % imagensEpisodios.length];
        imagem.src = imgSrc;
        imagem.alt = `Imagem ilustrativa do episódio ${episodio.name}`;
        imagem.style.width = "100%";
        imagem.style.height = "200px";
        imagem.style.objectFit = "cover";

        const titulo = document.createElement("h3");
        titulo.textContent = episodio.name;

        const info = document.createElement("p");
        info.textContent = `Episódio: ${episodio.episode}`;

        const data = document.createElement("p");
        data.textContent = `Data de lançamento: ${episodio.air_date}`;

        const botao = document.createElement("button");
        botao.textContent = "Ver detalhes";
        botao.style.marginTop = "10px";
        botao.style.padding = "10px 15px";
        botao.style.border = "none";
        botao.style.borderRadius = "6px";
        botao.style.cursor = "pointer";
        botao.style.backgroundColor = "#1A3666";
        botao.style.color = "white";
        botao.style.marginBottom = "20px";
        botao.addEventListener("click", () => {
          alert(`🎬 ${episodio.name}\n\nEpisódio: ${episodio.episode}\nData: ${episodio.air_date}\n\nPersonagens neste episódio: ${episodio.characters.length}`);
        });

        card.appendChild(imagem);
        card.appendChild(titulo);
        card.appendChild(info);
        card.appendChild(data);
        card.appendChild(botao);
        containerEpisodios.appendChild(card);

        // Efeito hover
        card.addEventListener("mouseenter", () => {
          card.style.transform = "scale(1.05)";
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "scale(1)";
        });
      });

      // Atualiza botões
      btnAnterior.disabled = !dados.info.prev;
      btnProximo.disabled = !dados.info.next;
      paginaAtual = pagina;
    } catch (erro) {
      console.error(erro);
      containerEpisodios.innerHTML =
        "<p style='grid-column: 1 / -1; text-align:center;'>Nenhum episódio encontrado.</p>";
      btnAnterior.disabled = true;
      btnProximo.disabled = true;
    }
  }

  // === EVENTOS ===
  botaoBusca.addEventListener("click", () => {
    termoBusca = inputBusca.value.trim();
    paginaAtual = 1;
    carregarEpisodios(paginaAtual, termoBusca);
  });

  inputBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      termoBusca = inputBusca.value.trim();
      paginaAtual = 1;
      carregarEpisodios(paginaAtual, termoBusca);
    }
  });

  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) carregarEpisodios(paginaAtual - 1, termoBusca);
  });

  btnProximo.addEventListener("click", () => {
    carregarEpisodios(paginaAtual + 1, termoBusca);
  });

  // === INICIALIZA ===
  carregarEpisodios();
});
