import { listarDoadores, listarInsumos, listarDoacoes, cadastrarDoacao } from "../api.js";

import { el, mostrarMensagem, esconderMensagem, estado, formatarData, hoje } from "../ui.js";

export function renderNovaDoacao(container) {
  container.replaceChildren();

  const titulo = el("h2", {
    textContent: "Registrar nova doação",
  });

  const mensagem = el("p", {
    className: "mensagem",
    hidden: true,
    "aria-live": "polite",
  });

  const formulario = el("form", {
    id: "form-doacao",
  });

  const campoDoador = el("select", {
    id: "doador-doacao",
    name: "id_doador",
    required: true,
  });

  const campoData = el("input", {
    id: "data-doacao",
    name: "data_doacao",
    type: "date",
    required: true,
    max: hoje(),
    value: hoje(),
  });

  const campoObservacao = el("textarea", {
    id: "observacao-doacao",
    name: "observacao",
    maxlength: "500",
    placeholder: "Observações sobre a doação (opcional)",
    rows: "3",
  });

  const secaoInsumos = el("section", {
    className: "itens-doacao",
  });

  const tituloInsumos = el("h3", {
    textContent: "Insumos recebidos",
  });

  const listaItens = el("div", {
    id: "itens-doacao",
  });

  const botaoAdicionar = el("button", {
    type: "button",
    textContent: "Adicionar insumo",
  });

  const botaoSalvar = el("button", {
    type: "submit",
    textContent: "Registrar doação",
  });

  secaoInsumos.append(tituloInsumos, listaItens, botaoAdicionar);

  formulario.append(
    el("label", {
      htmlFor: "doador-doacao",
      textContent: "Doador",
    }),
    campoDoador,
    el("label", {
      htmlFor: "data-doacao",
      textContent: "Data da doação",
    }),
    campoData,
    el("label", {
      htmlFor: "observacao-doacao",
      textContent: "Observação",
    }),
    campoObservacao,
    secaoInsumos,
    botaoSalvar,
  );

  container.append(titulo, mensagem, formulario);

  let doadores = [];
  let insumos = [];

  function criarLinhaInsumo() {
    const linha = el("div", {
      className: "item-doacao",
    });

    const campoInsumo = el("select", {
      name: "id_insumo",
      required: true,
    });

    campoInsumo.append(
      el("option", {
        value: "",
        textContent: "Selecione um insumo",
      }),
    );

    for (const insumo of insumos) {
      campoInsumo.append(
        el("option", {
          value: String(insumo.id_insumo),
          textContent: `${insumo.nome} (${insumo.unidade})`,
        }),
      );
    }

    const campoQuantidade = el("input", {
      type: "number",
      name: "quantidade",
      min: "1",
      step: "1",
      required: true,
      placeholder: "Quantidade",
    });

    const botaoRemover = el("button", {
      type: "button",
      textContent: "Remover",
    });

    botaoRemover.addEventListener("click", () => {
      if (listaItens.children.length <= 1) {
        mostrarMensagem(mensagem, "A doação precisa ter pelo menos um insumo.", "erro");

        mensagem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        return;
      }

      linha.remove();
      esconderMensagem(mensagem);
    });

    linha.append(
      el("label", {
        textContent: "Insumo",
      }),
      campoInsumo,
      el("label", {
        textContent: "Quantidade",
      }),
      campoQuantidade,
      botaoRemover,
    );

    listaItens.appendChild(linha);
  }

  botaoAdicionar.addEventListener("click", () => {
    criarLinhaInsumo();
  });

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const linhas = [...listaItens.children];

    const itens = linhas.map((linha) => {
      const idInsumo = Number(linha.querySelector('[name="id_insumo"]').value);

      const quantidade = Number(linha.querySelector('[name="quantidade"]').value);

      return {
        id_insumo: idInsumo,
        quantidade,
      };
    });

    const quantidadeInvalida = itens.some(
      (item) =>
        !Number.isInteger(item.id_insumo) ||
        item.id_insumo <= 0 ||
        !Number.isInteger(item.quantidade) ||
        item.quantidade <= 0,
    );

    if (quantidadeInvalida) {
      mostrarMensagem(
        mensagem,
        "Informe um insumo e uma quantidade inteira positiva em cada linha.",
        "erro",
      );

      mensagem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    const dados = {
      id_doador: Number(campoDoador.value),
      data_doacao: campoData.value,
      observacao: campoObservacao.value.trim(),
      insumos: itens,
    };

    botaoSalvar.disabled = true;
    esconderMensagem(mensagem);

    try {
      await cadastrarDoacao(dados);

      formulario.reset();
      campoData.value = hoje();
      listaItens.replaceChildren();
      criarLinhaInsumo();

      mostrarMensagem(mensagem, "Doação registrada com sucesso!");

      mensagem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");

      mensagem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  async function carregarFormulario() {
    botaoSalvar.disabled = true;
    botaoAdicionar.disabled = true;

    try {
      const resultados = await Promise.all([listarDoadores(), listarInsumos()]);

      doadores = resultados[0];
      insumos = resultados[1];

      campoDoador.replaceChildren(
        el("option", {
          value: "",
          textContent: "Selecione um doador",
        }),
      );

      for (const doador of doadores) {
        campoDoador.append(
          el("option", {
            value: String(doador.id_doador),
            textContent: doador.nome,
          }),
        );
      }

      if (doadores.length === 0) {
        mostrarMensagem(
          mensagem,
          "Cadastre pelo menos um doador antes de registrar uma doação.",
          "erro",
        );
        return;
      }

      if (insumos.length === 0) {
        mostrarMensagem(
          mensagem,
          "Cadastre pelo menos um insumo antes de registrar uma doação.",
          "erro",
        );
        return;
      }

      criarLinhaInsumo();
      botaoSalvar.disabled = false;
      botaoAdicionar.disabled = false;
    } catch (erro) {
      mostrarMensagem(mensagem, `Não foi possível carregar os dados: ${erro.message}`, "erro");
    }
  }

  void carregarFormulario();
}

export async function renderHistoricoDoacoes(container) {
  container.replaceChildren();

  const titulo = el("h2", {
    textContent: "Histórico de doações",
  });

  const mensagem = el("p", {
    className: "mensagem",
    hidden: true,
    "aria-live": "polite",
  });

  const lista = el("div", {
    id: "lista-doacoes",
    "aria-live": "polite",
  });

  container.append(titulo, mensagem, lista);

  estado(lista, "Carregando histórico de doações...");

  try {
    const doacoes = await listarDoacoes();

    lista.replaceChildren();

    if (doacoes.length === 0) {
      estado(lista, "Nenhuma doação registrada.");
      return;
    }

    for (const doacao of doacoes) {
      const cartao = el("article", {
        className: "card-doacao",
      });

      cartao.append(
        el("h3", {
          textContent: `Doação nº ${doacao.id_doacao}`,
        }),
        el("p", {
          textContent: `Doador: ${doacao.nome_doador}`,
        }),
        el("p", {
          textContent: `Data: ${formatarData(doacao.data_doacao)}`,
        }),
      );

      const tituloItens = el("h4", {
        textContent: "Insumos",
      });

      const listaInsumos = el("ul");

      for (const insumo of doacao.insumos || []) {
        listaInsumos.append(
          el("li", {
            textContent: `${insumo.nome_insumo}: ${insumo.quantidade} ${insumo.unidade}`,
          }),
        );
      }

      cartao.append(tituloItens, listaInsumos);

      if (doacao.observacao) {
        cartao.append(
          el("p", {
            textContent: `Observação: ${doacao.observacao}`,
          }),
        );
      }

      lista.appendChild(cartao);
    }
  } catch (erro) {
    estado(lista, "Não foi possível carregar o histórico.");
    mostrarMensagem(mensagem, erro.message, "erro");
  }
}
