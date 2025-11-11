/****************************************************************************************
 * Objetivo: Criar um módulo de barra de pesquisa com navegação por botões "próximo" 
 * e "anterior".
 * Data: 11/11/2025
 * Autor: Yuri de Oliveira Melo
 * Versão: 2.0
 ****************************************************************************************/

// js/personagens.js
// Consome a API de personagens de Rick and Morty com paginação e busca
import { criarBarraDeBusca, criarPaginacao } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const secaoPersonagens = document.querySelector("#personagens");
  let paginaAtual = 1;
  let termoBusca = "";

  const container = document.createElement("div");
  container.id = "container-personagens";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
  container.style.gap = "20px";
  container.style.padding = "20px";
  secaoPersonagens.appendChild(container);

  const barra = criarBarraDeBusca("🔍 Buscar personagem...", (termo) => {
    termoBusca = termo;
    paginaAtual = 1;
    carregarPersonagens(paginaAtual, termoBusca);
  });
  secaoPersonagens.prepend(barra);

  const { paginacao, btnAnterior, btnProximo } = criarPaginacao(
    () => carregarPersonagens(paginaAtual - 1, termoBusca),
    () => carregarPersonagens(paginaAtual + 1, termoBusca)
  );
  secaoPersonagens.appendChild(paginacao);

  async function carregarPersonagens(pagina = 1, nome = "") {
    container.innerHTML = "<p style='text-align:center;'>Carregando personagens...</p>";
    try {
      const urlBase = "https://rickandmortyapi.com/api/character";
      const endpoint = nome ? `${urlBase}/?name=${encodeURIComponent(nome)}&page=${pagina}` : `${urlBase}/?page=${pagina}`;
      const resposta = await fetch(endpoint);
      if (!resposta.ok) throw new Error("Erro ao buscar personagens.");
      const dados = await resposta.json();
      container.innerHTML = "";
      dados.results.forEach((p) => {
        const card = document.createElement("div");
        card.classList.add("card-personagem");
        card.style.backgroundColor = "rgba(2, 91, 170, 0.8)";
        card.style.color = "white";
        card.style.borderRadius = "10px";
        card.style.padding = "15px";
        card.style.textAlign = "center";
        card.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        card.style.transition = "0.3s";

        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name;
        img.style.width = "100%";
        img.style.height = "220px";
        img.style.objectFit = "cover";

        const nome = document.createElement("h3");
        nome.textContent = p.name;
        const especie = document.createElement("p");
        especie.textContent = `Espécie: ${p.species}`;
        const status = document.createElement("p");
        status.textContent = `Status: ${p.status}`;

        card.appendChild(img);
        card.appendChild(nome);
        card.appendChild(especie);
        card.appendChild(status);
        container.appendChild(card);
      });
      btnAnterior.disabled = !dados.info.prev;
      btnProximo.disabled = !dados.info.next;
      paginaAtual = pagina;
    } catch (erro) {
      container.innerHTML = "<p style='text-align:center;'>Nenhum personagem encontrado.</p>";
      btnAnterior.disabled = true;
      btnProximo.disabled = true;
    }
  }

  carregarPersonagens();
});
