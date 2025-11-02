/****************************************************************************************
 * Objetivo: Implementar a lógica para um slider de imagens com navegação por botões 
 * "próximo" e "anterior".
 * Data: 27/06/2024
 * Autor: Yuri de Oliveira Melo
 * Versão: 1.0
 ****************************************************************************************/

// script.js
// Consome a API de Rick and Morty com paginação e busca por nome
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#container-personagens");

  // Cria barra de busca
  const barraBusca = document.createElement("div");
  barraBusca.id = "barra-busca";
  barraBusca.style.textAlign = "center";
  barraBusca.style.margin = "20px 0";

  const inputBusca = document.createElement("input");
  inputBusca.type = "text";
  inputBusca.placeholder = "🔍 Buscar personagem...";
  inputBusca.id = "campo-busca";

  const botaoBusca = document.createElement("button");
  botaoBusca.textContent = "Buscar";

  barraBusca.appendChild(inputBusca);
  barraBusca.appendChild(botaoBusca);

  // Insere a barra antes dos personagens
  container.insertAdjacentElement("beforebegin", barraBusca);

  // Cria botões de paginação
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

  // Estado atual
  let paginaAtual = 1;
  let termoBusca = "";

  // Função principal de carregamento
  async function carregarPersonagens(pagina = 1, nome = "") {
    container.innerHTML = "<p>Carregando personagens...</p>";

    try {
      const urlBase = "https://rickandmortyapi.com/api/character";
      const endpoint = nome
        ? `${urlBase}/?name=${encodeURIComponent(nome)}&page=${pagina}`
        : `${urlBase}/?page=${pagina}`;

      const resposta = await fetch(endpoint);
      if (!resposta.ok) throw new Error("Personagem não encontrado ou erro na API.");

      const dados = await resposta.json();
      const personagens = dados.results;

      // Limpa o container
      container.innerHTML = "";

      // Cria cards
      personagens.forEach((personagem) => {
        const card = document.createElement("div");
        card.classList.add("card-personagem");

        const nomeElem = document.createElement("h3");
        nomeElem.textContent = personagem.name;

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

        card.appendChild(nomeElem);
        card.appendChild(imagem);
        card.appendChild(descricao);
        card.appendChild(botao);

        container.appendChild(card);
      });

      // Atualiza estado
      paginaAtual = pagina;
      btnAnterior.disabled = !dados.info.prev;
      btnProximo.disabled = !dados.info.next;
    } catch (erro) {
      console.error(erro);
      container.innerHTML = "<p>Nenhum personagem encontrado.</p>";
      btnAnterior.disabled = true;
      btnProximo.disabled = true;
    }
  }

  // Eventos de busca
  botaoBusca.addEventListener("click", () => {
    termoBusca = inputBusca.value.trim();
    paginaAtual = 1;
    carregarPersonagens(paginaAtual, termoBusca);
  });

  inputBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      termoBusca = inputBusca.value.trim();
      paginaAtual = 1;
      carregarPersonagens(paginaAtual, termoBusca);
    }
  });

  // Eventos de paginação
  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) carregarPersonagens(paginaAtual - 1, termoBusca);
  });

  btnProximo.addEventListener("click", () => {
    carregarPersonagens(paginaAtual + 1, termoBusca);
  });

  // Carrega a primeira página ao iniciar
  carregarPersonagens();
});
