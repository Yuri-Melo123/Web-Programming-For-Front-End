/****************************************************************************************
 * Objetivo: Implementar a lógica para um slider de imagens com navegação por botões 
 * "próximo" e "anterior".
 * Data: 27/06/2024
 * Autor: Yuri de Oliveira Melo
 * Versão: 1.0
 ****************************************************************************************/

// script.js
// Carrega personagens da API de Rick and Morty
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#container-personagens");

  // Limpa o conteúdo inicial (livros)
  container.innerHTML = "<p>Carregando personagens...</p>";

  // Função para buscar personagens da API
  async function carregarPersonagens() {
    try {
      const resposta = await fetch("https://rickandmortyapi.com/api/character");
      if (!resposta.ok) {
        throw new Error("Erro ao buscar dados da API");
      }

      const dados = await resposta.json();
      const personagens = dados.results.slice(0, 12); // Limita a 12 personagens

      // Limpa o container
      container.innerHTML = "";

      // Cria os cards dinamicamente
      personagens.forEach((personagem) => {
        const card = document.createElement("div");
        card.classList.add("card-personagem");

        const nome = document.createElement("h3");
        nome.textContent = personagem.name;

        const imagem = document.createElement("img");
        imagem.src = personagem.image;
        imagem.alt = `Imagem de ${personagem.name}`;

        const descricao = document.createElement("p");
        descricao.textContent = `Espécie: ${personagem.species} | Status: ${personagem.status}`;

        const botao = document.createElement("button");
        botao.textContent = "Saiba Mais";
        botao.addEventListener("click", () => {
          alert(`🧠 ${personagem.name}\n\nOrigem: ${personagem.origin.name}\nLocal atual: ${personagem.location.name}`);
        });

        // Monta o card
        card.appendChild(nome);
        card.appendChild(imagem);
        card.appendChild(descricao);
        card.appendChild(botao);

        container.appendChild(card);
      });
    } catch (erro) {
      console.error(erro);
      container.innerHTML = "<p>Não foi possível carregar os personagens.</p>";
    }
  }

  carregarPersonagens();
});
