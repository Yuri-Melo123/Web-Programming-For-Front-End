/****************************************************************************************
 * Objetivo: Implementar a lógica para um slider de imagens com navegação por botões 
 * "próximo" e "anterior".
 * Data: 27/06/2024
 * Autor: Yuri de Oliveira Melo
 * Versão: 1.0
 ****************************************************************************************/

// script.js
// Consome a API de Rick and Morty com paginação
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#container-personagens");

  // Cria elementos de navegação
  const paginacao = document.createElement("div");
  paginacao.id = "paginacao";
  paginacao.style.textAlign = "center";
  paginacao.style.margin = "20px";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "⬅️ Anterior";
  btnAnterior.disabled = true;

  const btnProximo = document.createElement("button");
  btnProximo.textContent = "Próximo ➡️";

  paginacao.appendChild(btnAnterior);
  paginacao.appendChild(btnProximo);

  container.insertAdjacentElement("afterend", paginacao);

  let paginaAtual = 1;

  // Função principal para carregar os personagens
  async function carregarPersonagens(pagina = 1) {
    container.innerHTML = "<p>Carregando personagens...</p>";

    try {
      const resposta = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
      if (!resposta.ok) throw new Error("Erro ao buscar dados da API.");

      const dados = await resposta.json();
      const personagens = dados.results;

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

        card.appendChild(nome);
        card.appendChild(imagem);
        card.appendChild(descricao);
        card.appendChild(botao);

        container.appendChild(card);
      });

      // Atualiza botões de navegação
      btnAnterior.disabled = !dados.info.prev;
      btnProximo.disabled = !dados.info.next;
      paginaAtual = pagina;
    } catch (erro) {
      console.error(erro);
      container.innerHTML = "<p>Não foi possível carregar os personagens.</p>";
    }
  }

  // Eventos dos botões
  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) carregarPersonagens(paginaAtual - 1);
  });

  btnProximo.addEventListener("click", () => {
    carregarPersonagens(paginaAtual + 1);
  });

  // Carrega a primeira página ao iniciar
  carregarPersonagens();
});
