/****************************************************************************************
 * Objetivo: Criar um módulo de barra de pesquisa com navegação por botões "próximo" 
 * e "anterior".
 * Data: 11/11/2025
 * Autor: Yuri de Oliveira Melo
 * Versão: 2.0
 ****************************************************************************************/

// js/episodios.js
// Importa funções reutilizáveis para UI
import { criarBarraDeBusca, criarPaginacao } from "./ui.js";

// Consome a API de episódios de Rick and Morty com paginação, busca e imagens ilustrativas
document.addEventListener("DOMContentLoaded", () => {
  const secaoEpisodios = document.querySelector("#episodios");
  let paginaAtual = 1;
  let termoBusca = "";

  const container = document.createElement("div");
  container.id = "container-episodios";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
  container.style.gap = "20px";
  container.style.padding = "20px";
  secaoEpisodios.appendChild(container);

  const barra = criarBarraDeBusca("🔍 Buscar episódio...", (termo) => {
    termoBusca = termo;
    paginaAtual = 1;
    carregarEpisodios(paginaAtual, termoBusca);
  });
  secaoEpisodios.prepend(barra);

  const { paginacao, btnAnterior, btnProximo } = criarPaginacao(
    () => carregarEpisodios(paginaAtual - 1, termoBusca),
    () => carregarEpisodios(paginaAtual + 1, termoBusca)
  );
  secaoEpisodios.appendChild(paginacao);

  async function carregarEpisodios(pagina = 1, nome = "") {
    container.innerHTML = "<p style='text-align:center;'>Carregando episódios...</p>";
    try {
      const urlBase = "https://rickandmortyapi.com/api/episode";
      const endpoint = nome ? `${urlBase}/?name=${encodeURIComponent(nome)}&page=${pagina}` : `${urlBase}/?page=${pagina}`;
      const resposta = await fetch(endpoint);
      if (!resposta.ok) throw new Error("Erro na API.");
      const dados = await resposta.json();
      container.innerHTML = "";
      dados.results.forEach((ep, i) => {
        const card = document.createElement("div");
        card.classList.add("card-episodio");
        card.style.backgroundColor = "rgba(2, 228, 170, 0.4)";
        card.style.color = "white";
        card.style.borderRadius = "10px";
        card.style.padding = "15px";
        card.style.textAlign = "center";
        card.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        card.style.transition = "0.3s";

        const imagem = document.createElement("img");
        imagem.src = `./image/episodios/portal${(i % 10) + 1}.jpg`;
        imagem.alt = `Imagem do episódio ${ep.name}`;
        imagem.style.width = "100%";
        imagem.style.height = "200px";
        imagem.style.objectFit = "cover";

        const titulo = document.createElement("h3");
        titulo.textContent = ep.name;

        const info = document.createElement("p");
        info.textContent = `Episódio: ${ep.episode}`;
        
        const data = document.createElement("p");
        data.textContent = `Data: ${ep.air_date}`;

        card.appendChild(imagem);
        card.appendChild(titulo);
        card.appendChild(info);
        card.appendChild(data);
        container.appendChild(card);

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
      container.innerHTML = "<p style='text-align:center;'>Nenhum episódio encontrado.</p>";
      btnAnterior.disabled = true;
      btnProximo.disabled = true;
    }
  }

  // === Carrega a primeira página ao iniciar ===
  carregarEpisodios();
});
