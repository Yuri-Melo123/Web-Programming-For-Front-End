/****************************************************************************************
 * Objetivo: Criar um módulo de barra de pesquisa com navegação por botões "próximo" 
 * e "anterior".
 * Data: 11/11/2025
 * Autor: Yuri de Oliveira Melo
 * Versão: 2.0
 ****************************************************************************************/

// js/ui.js
// Módulo de interface reutilizável (paginação + barra de busca)
export function criarBarraDeBusca(placeholder, onBuscar) {
  const barra = document.createElement("div");
  barra.classList.add("barra-busca");
  barra.style.textAlign = "center";
  barra.style.margin = "20px 0";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder || "Digite para buscar...";
  input.classList.add("campo-busca");

  const botao = document.createElement("button");
  botao.textContent = "Buscar";
  botao.classList.add("btn-buscar");

  botao.addEventListener("click", () => {
    const termo = input.value.trim();
    onBuscar(termo);
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const termo = input.value.trim();
      onBuscar(termo);
    }
  });

  barra.appendChild(input);
  barra.appendChild(botao);
  return barra;
}

export function criarPaginacao(onAnterior, onProximo) {
  const paginacao = document.createElement("div");
  paginacao.classList.add("paginacao");
  paginacao.style.textAlign = "center";
  paginacao.style.margin = "20px";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "⬅️ Anterior";
  btnAnterior.classList.add("btn-paginacao");
  btnAnterior.disabled = true;

  const btnProximo = document.createElement("button");
  btnProximo.textContent = "Próximo ➡️";
  btnProximo.classList.add("btn-paginacao");

  paginacao.appendChild(btnAnterior);
  paginacao.appendChild(btnProximo);

  btnAnterior.addEventListener("click", onAnterior);
  btnProximo.addEventListener("click", onProximo);

  return { paginacao, btnAnterior, btnProximo };
}
