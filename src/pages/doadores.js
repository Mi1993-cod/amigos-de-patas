import { listarDoadores, cadastrarDoador, atualizarDoador, excluirDoador } from "../api.js";

import { el, mostrarMensagem, esconderMensagem, estado } from "../ui.js";

export function renderDoadores(container) {
  let doadores = [];
  let doadorEditando = null;

  container.replaceChildren();

  const titulo = el("h2", {
    textContent: "Gerenciar doadores",
  });

  const mensagem = el("p", {
    className: "mensagem",
    hidden: true,
    "aria-live": "polite",
  });

  const formulario = el("form", {
    id: "form-doador",
  });

  const campoNome = el("input", {
    id: "nome-doador",
    name: "nome",
    type: "text",
    required: true,
    maxlength: "120",
    autocomplete: "name",
    placeholder: "Nome completo",
  });

  const campoEmail = el("input", {
    id: "email-doador",
    name: "email",
    type: "email",
    maxlength: "150",
    autocomplete: "email",
    placeholder: "E-mail",
  });

  const campoTelefone = el("input", {
    id: "telefone-doador",
    name: "telefone",
    type: "tel",
    maxlength: "20",
    autocomplete: "tel",
    placeholder: "Telefone",
  });

  const campoTipo = el("select", {
    id: "tipo-doador",
    name: "tipo_doador",
    required: true,
  });

  campoTipo.append(
    el("option", {
      value: "",
      textContent: "Selecione o tipo",
    }),
    el("option", {
      value: "Pessoa física",
      textContent: "Pessoa física",
    }),
    el("option", {
      value: "Empresa",
      textContent: "Empresa",
    }),
  );

  const botaoSalvar = el("button", {
    type: "submit",
    textContent: "Cadastrar doador",
  });

  const botaoCancelar = el("button", {
    type: "button",
    textContent: "Cancelar edição",
    hidden: true,
  });

  formulario.append(
    el("label", {
      htmlFor: "nome-doador",
      textContent: "Nome completo",
    }),
    campoNome,
    el("label", {
      htmlFor: "email-doador",
      textContent: "E-mail",
    }),
    campoEmail,
    el("label", {
      htmlFor: "telefone-doador",
      textContent: "Telefone",
    }),
    campoTelefone,
    el("label", {
      htmlFor: "tipo-doador",
      textContent: "Tipo de doador",
    }),
    campoTipo,
    botaoSalvar,
    botaoCancelar,
  );

  const lista = el("div", {
    id: "lista-doadores",
    "aria-live": "polite",
  });

  container.append(titulo, mensagem, formulario, lista);

  function limparFormulario() {
    formulario.reset();
    doadorEditando = null;
    botaoSalvar.textContent = "Cadastrar doador";
    botaoCancelar.hidden = true;
  }

  function mostrarDoadores() {
    lista.replaceChildren();

    if (doadores.length === 0) {
      estado(lista, "Nenhum doador cadastrado.");
      return;
    }

    for (const doador of doadores) {
      const cartao = el("article", {
        className: "card-doador",
      });

      cartao.append(
        el("h3", {
          textContent: doador.nome,
        }),
        el("p", {
          textContent: `E-mail: ${doador.email || "Não informado"}`,
        }),
        el("p", {
          textContent: `Telefone: ${doador.telefone || "Não informado"}`,
        }),
        el("p", {
          textContent: `Tipo: ${doador.tipo_doador}`,
        }),
      );

      const botaoEditar = el("button", {
        type: "button",
        textContent: "Editar",
      });

      botaoEditar.addEventListener("click", () => {
        doadorEditando = doador.id_doador;

        campoNome.value = doador.nome || "";
        campoEmail.value = doador.email || "";
        campoTelefone.value = doador.telefone || "";
        campoTipo.value = doador.tipo_doador || "";

        botaoSalvar.textContent = "Salvar alterações";
        botaoCancelar.hidden = false;

        esconderMensagem(mensagem);

        formulario.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      const botaoExcluir = el("button", {
        type: "button",
        textContent: "Excluir",
      });

      botaoExcluir.addEventListener("click", async () => {
        const confirmar = window.confirm(`Deseja realmente excluir o doador ${doador.nome}?`);

        if (!confirmar) return;

        botaoExcluir.disabled = true;

        try {
          await excluirDoador(doador.id_doador);

          mostrarMensagem(mensagem, "Doador excluído com sucesso!");

          void carregarDoadores();
        } catch (erro) {
          mostrarMensagem(mensagem, erro.message, "erro");
          botaoExcluir.disabled = false;
        }
      });

      cartao.append(botaoEditar, botaoExcluir);
      lista.appendChild(cartao);
    }
  }

  async function carregarDoadores() {
    estado(lista, "Carregando doadores...");

    try {
      doadores = await listarDoadores();
      mostrarDoadores();
    } catch (erro) {
      estado(lista, "Não foi possível carregar os doadores.");
      mostrarMensagem(mensagem, erro.message, "erro");
    }
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const dados = {
      nome: campoNome.value.trim(),
      email: campoEmail.value.trim(),
      telefone: campoTelefone.value.trim(),
      tipo_doador: campoTipo.value,
    };

    botaoSalvar.disabled = true;
    esconderMensagem(mensagem);

    try {
      if (doadorEditando !== null) {
        await atualizarDoador(doadorEditando, dados);

        mostrarMensagem(mensagem, "Doador atualizado com sucesso!");
      } else {
        await cadastrarDoador(dados);

        mostrarMensagem(mensagem, "Doador cadastrado com sucesso!");
      }

      limparFormulario();
      await carregarDoadores();
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    esconderMensagem(mensagem);
  });

  void carregarDoadores();
}
