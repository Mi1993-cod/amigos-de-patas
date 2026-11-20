import "./style.css";

import {
  verificarSaudeAPI,
  listarAnimais,
  cadastrarAnimal as enviarCadastroAnimal,
  solicitarAdocao as enviarSolicitacaoAdocao,
  atualizarStatusAdocao,
  listarCategorias,
  listarInsumos,
} from "./api.js";

import { renderDoadores } from "./pages/doadores.js";
import { renderNovaDoacao, renderHistoricoDoacoes } from "./pages/doacoes.js";

const CHAVE_TOKEN = "amigos_patas_token";

document.querySelector("#app").innerHTML = `
  <main class="pagina">
    <header>
      <h1>🐾 Amigos de Patas</h1>
      <p>Protegendo animais e construindo um futuro melhor.</p>
    </header>

    <div class="foto-animais">
      <img src="/cachorro-gato.jpg" alt="Um cachorro e um gato juntos" />
    </div>

    <section class="apresentacao">
      <h2>Bem-vindo à nossa ONG!</h2>
      <p>
        Nosso objetivo é proteger animais, incentivar a adoção responsável
        e oferecer carinho aos nossos amigos de quatro patas.
      </p>
      <h3>Nosso compromisso</h3>
      <ul>
        <li>Proteção e cuidado dos animais.</li>
        <li>Incentivo à adoção responsável.</li>
        <li>Conscientização sobre o bem-estar animal.</li>
      </ul>
    </section>

    <section class="administracao">
      <h2>Área Administrativa</h2>
      <p>Entre com seu e-mail e senha para acessar as funções administrativas.</p>

      <form id="form-login">
        <label for="email-admin">E-mail</label>
        <input type="email" id="email-admin" name="email"
          autocomplete="username" required />

        <label for="senha-admin">Senha</label>
        <input type="password" id="senha-admin" name="senha"
          autocomplete="current-password" required />

        <button type="submit" id="btn-login">Entrar</button>
        <p id="mensagem-login" role="status"></p>
      </form>

      <div id="painel-admin" hidden>
        <p>Você está conectado como administrador.</p>

        <button type="button" id="btn-sair">
          Sair da área administrativa
        </button>

        <hr />

        <h3>Solicitações de adoção</h3>
        <div id="lista-adocoes">
          <p>Carregando solicitações...</p>
        </div>

        <hr />

        <h3>Animais cadastrados</h3>
        <p>Consulte todos os animais e acompanhe suas situações.</p>
        <div id="lista-animais-admin">
          <p>Carregando animais cadastrados...</p>
        </div>

        <hr />

        <section class="cadastro">
          <h3>Gestão de doações</h3>
          <p>Gerencie doadores e registre as doações recebidas.</p>

          <nav class="menu-admin" aria-label="Menu de gestão de doações">
            <a href="#/doadores">Doadores</a>
            <a href="#/doacoes/nova">Registrar doação</a>
            <a href="#/doacoes">Histórico de doações</a>
          </nav>

          <div id="conteudo-rota" aria-live="polite">
            <p>Selecione uma opção do menu.</p>
          </div>

          <hr />

          <h3>Cadastro de categorias</h3>
          <form id="form-categoria">
            <label for="nome-categoria">Nome da categoria *</label>
            <input id="nome-categoria" name="nome" type="text"
              required maxlength="100" />
            <button type="submit">Cadastrar categoria</button>
            <p id="mensagem-categoria" role="status"></p>
          </form>

          <hr />

          <h3>Cadastro de insumos</h3>
          <form id="form-insumo">
            <label for="nome-insumo">Nome do insumo *</label>
            <input id="nome-insumo" name="nome" type="text"
              required maxlength="100" />

            <label for="unidade-insumo">Unidade *</label>
            <input id="unidade-insumo" name="unidade" type="text"
              required maxlength="30"
              placeholder="Ex.: kg, unidade, pacote" />

            <label for="categoria-insumo">Categoria</label>
            <select id="categoria-insumo" name="id_categoria">
              <option value="">Sem categoria</option>
            </select>

            <button type="submit">Cadastrar insumo</button>
            <p id="mensagem-insumo" role="status"></p>
          </form>
        </section>
      </div>
    </section>

    <section class="cadastro" id="secao-cadastro" hidden>
      <h2>Cadastro de animais</h2>
      <p>Preencha os dados para cadastrar um novo amiguinho.</p>

      <form id="form-animal">
        <label for="nome">Nome do animal *</label>
        <input type="text" id="nome" name="nome" maxlength="100"
          placeholder="Ex.: Bob" required />

        <label for="especie">Espécie *</label>
        <select id="especie" name="especie" required>
          <option value="">Selecione</option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Outro">Outro</option>
        </select>

        <label for="raca">Raça</label>
        <input type="text" id="raca" name="raca" maxlength="100"
          placeholder="Ex.: Labrador" />

        <label for="idade">Idade em anos</label>
        <input type="number" id="idade" name="idade" min="0" step="1"
          placeholder="Ex.: 2" />

        <label for="sexo">Sexo</label>
        <select id="sexo" name="sexo">
          <option value="Não informado">Não informado</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </select>

        <label for="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" rows="4"
          placeholder="Conte um pouco sobre o animal..."></textarea>

        <label for="status">Situação do animal *</label>
        <select id="status" name="status" required>
          <option value="Disponível">Disponível para adoção</option>
          <option value="Reservado">Em processo de adoção</option>
          <option value="Adotado">Adotado</option>
        </select>

        <button type="submit">Cadastrar animal</button>
        <p id="mensagem-cadastro" role="status"></p>
      </form>
    </section>

    <section class="animais">
      <h2>Conheça nossos animais</h2>
      <p>Encontre um amigo para fazer parte da sua família!</p>
      <div id="lista-animais">
        <p>Carregando animais...</p>
      </div>
    </section>

    <footer>
      <p id="api-status">Status da API: verificando...</p>
      <p id="data-hora"></p>
    </footer>
  </main>
`;

function escaparHTML(valor) {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    (caractere) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[caractere],
  );
}

const formularioLogin = document.querySelector("#form-login");
const painelAdmin = document.querySelector("#painel-admin");
const secaoCadastro = document.querySelector("#secao-cadastro");
const mensagemLogin = document.querySelector("#mensagem-login");
const conteudoRota = document.querySelector("#conteudo-rota");

function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function mostrarPainelAdmin() {
  formularioLogin.hidden = true;
  painelAdmin.hidden = false;
  secaoCadastro.hidden = false;
}

function mostrarLogin() {
  formularioLogin.hidden = false;
  painelAdmin.hidden = true;
  secaoCadastro.hidden = true;
  formularioLogin.reset();

  document.querySelector("#lista-adocoes").innerHTML =
    "<p>Entre para visualizar as solicitações.</p>";

  document.querySelector("#lista-animais-admin").innerHTML =
    "<p>Entre para visualizar os animais cadastrados.</p>";

  conteudoRota.innerHTML = "<p>Faça login para acessar a gestão de doações.</p>";
}

async function apiAdmin(url, opcoes = {}) {
  const token = obterToken();

  if (!token) {
    mostrarLogin();
    mensagemLogin.textContent = "Faça login para continuar.";
    throw new Error("Autenticação necessária.");
  }

  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      ...opcoes.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (resposta.status === 401) {
    localStorage.removeItem(CHAVE_TOKEN);
    mostrarLogin();
    mensagemLogin.textContent = "Sua sessão expirou. Entre novamente.";
  }

  return resposta;
}

// ==========================================
// NAVEGAÇÃO DAS TELAS DA AULA 3
// ==========================================

async function navegar() {
  if (!obterToken()) {
    return;
  }

  const rota = window.location.hash || "#/doadores";

  conteudoRota.replaceChildren();

  try {
    if (rota === "#/doadores") {
      renderDoadores(conteudoRota);
    } else if (rota === "#/doacoes/nova") {
      renderNovaDoacao(conteudoRota);
    } else if (rota === "#/doacoes") {
      await renderHistoricoDoacoes(conteudoRota);
    } else {
      conteudoRota.innerHTML = `
        <p>Essa página não foi encontrada.</p>
        <a href="#/doadores">Voltar para doadores</a>
      `;
    }
  } catch (erro) {
    console.error("Erro ao abrir a tela:", erro);
    conteudoRota.textContent = "Não foi possível abrir esta tela. Tente novamente.";
  }
}

window.addEventListener("hashchange", navegar);

document.querySelectorAll(".menu-admin a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!obterToken()) {
      mostrarLogin();
    }
  });
});

// ==========================================
// CARREGAR DADOS ADMINISTRATIVOS
// ==========================================

async function carregarAdocoes() {
  const lista = document.querySelector("#lista-adocoes");

  try {
    const resposta = await apiAdmin("/api/adocoes");
    if (!resposta.ok) throw new Error("Erro ao buscar solicitações.");

    const adocoes = await resposta.json();

    if (!Array.isArray(adocoes) || adocoes.length === 0) {
      lista.innerHTML = "<p>Nenhuma solicitação recebida.</p>";
      return;
    }

    lista.innerHTML = adocoes
      .map(
        (adocao) => `
      <article class="card-animal">
        <h3>Solicitação nº ${Number(adocao.id)}</h3>
        <p><strong>Animal:</strong> ${escaparHTML(adocao.animal)}</p>
        <p><strong>Interessado:</strong> ${escaparHTML(adocao.interessado)}</p>
        <p><strong>E-mail:</strong> ${escaparHTML(adocao.email)}</p>
        <p><strong>Telefone:</strong> ${escaparHTML(adocao.telefone)}</p>
        <p><strong>Cidade:</strong> ${escaparHTML(adocao.cidade)}</p>
        <p><strong>Status:</strong> ${escaparHTML(adocao.status)}</p>
        ${
          adocao.status === "Pendente"
            ? `
              <button type="button" class="btn-aprovar"
                data-id="${Number(adocao.id)}">Aprovar adoção</button>
              <button type="button" class="btn-cancelar"
                data-id="${Number(adocao.id)}">Cancelar solicitação</button>
            `
            : ""
        }
        <p><strong>Data:</strong>
          ${escaparHTML(new Date(adocao.data_solicitacao).toLocaleString("pt-BR"))}
        </p>
      </article>
    `,
      )
      .join("");

    lista.querySelectorAll(".btn-aprovar, .btn-cancelar").forEach((botao) => {
      botao.addEventListener("click", async () => {
        const status = botao.classList.contains("btn-aprovar") ? "Aprovada" : "Cancelada";

        const confirmar = window.confirm(
          status === "Aprovada"
            ? "Deseja aprovar esta adoção?"
            : "Deseja cancelar esta solicitação?",
        );

        if (!confirmar) return;

        botao.disabled = true;

        try {
          const resultado = await atualizarStatusAdocao(Number(botao.dataset.id), status);

          alert(resultado.mensagem || "Solicitação atualizada.");
          await carregarAdocoes();

          if (status === "Aprovada") {
            await carregarAnimais();
            await carregarAnimaisAdmin();
          }
        } catch (erro) {
          alert(erro.message);
          botao.disabled = false;
        }
      });
    });
  } catch (erro) {
    lista.innerHTML = "<p>Não foi possível carregar as solicitações.</p>";
    console.error(erro);
  }
}

async function carregarAnimaisAdmin() {
  const lista = document.querySelector("#lista-animais-admin");

  try {
    const animais = await listarAnimais();

    if (!Array.isArray(animais) || animais.length === 0) {
      lista.innerHTML = "<p>Nenhum animal cadastrado.</p>";
      return;
    }

    const situacoes = {
      Disponível: "Disponível para adoção",
      Reservado: "Em processo de adoção",
      Adotado: "Adotado",
    };

    lista.innerHTML = animais
      .map(
        (animal) => `
      <article class="card-animal">
        <h3>${escaparHTML(animal.nome)}</h3>
        <p><strong>Espécie:</strong> ${escaparHTML(animal.especie)}</p>
        <p><strong>Raça:</strong> ${escaparHTML(animal.raca || "Não informada")}</p>
        <p><strong>Idade:</strong> ${escaparHTML(animal.idade ?? "Não informada")}</p>
        <p><strong>Sexo:</strong> ${escaparHTML(animal.sexo || "Não informado")}</p>
        <p><strong>Situação:</strong>
          ${escaparHTML(situacoes[animal.status] || animal.status || "Não informada")}
        </p>
        <p><strong>Descrição:</strong>
          ${escaparHTML(animal.descricao || "Sem descrição")}
        </p>
      </article>
    `,
      )
      .join("");
  } catch (erro) {
    lista.innerHTML = "<p>Não foi possível carregar os animais cadastrados.</p>";
    console.error(erro);
  }
}

// ==========================================
// ANIMAIS - VITRINE PÚBLICA
// ==========================================

async function carregarAnimais() {
  const lista = document.querySelector("#lista-animais");

  try {
    const animais = await listarAnimais();

    if (!Array.isArray(animais)) {
      throw new Error("A API não retornou uma lista válida de animais.");
    }

    const disponiveis = animais.filter((animal) => animal.status === "Disponível");

    if (disponiveis.length === 0) {
      lista.innerHTML = "<p>No momento, não há animais disponíveis para adoção.</p>";
      return;
    }

    lista.innerHTML = disponiveis
      .map(
        (animal) => `
      <article class="card-animal">
        <h3>${escaparHTML(animal.nome)}</h3>
        <p><strong>Espécie:</strong> ${escaparHTML(animal.especie)}</p>
        <p><strong>Raça:</strong> ${escaparHTML(animal.raca || "Não informada")}</p>
        <p><strong>Idade:</strong> ${escaparHTML(animal.idade ?? "Não informada")}</p>
        <p><strong>Sexo:</strong> ${escaparHTML(animal.sexo || "Não informado")}</p>
        <p>${escaparHTML(animal.descricao || "Conheça esse amiguinho!")}</p>

        <form class="form-adocao" data-animal-id="${Number(animal.id)}">
          <h4>Quero adotar!</h4>
          <label>Seu nome</label>
          <input name="nome" type="text" required />
          <label>Seu e-mail</label>
          <input name="email" type="email" required />
          <label>Seu telefone</label>
          <input name="telefone" type="tel" required />
          <label>Sua cidade</label>
          <input name="cidade" type="text" required />
          <button type="submit">Solicitar adoção</button>
          <p class="mensagem-adocao" role="status"></p>
        </form>
      </article>
    `,
      )
      .join("");

    lista.querySelectorAll(".form-adocao").forEach((formulario) => {
      formulario.addEventListener("submit", solicitarAdocao);
    });
  } catch (erro) {
    lista.innerHTML = "<p>Não foi possível carregar os animais. Tente novamente.</p>";
    console.error(erro);
  }
}

async function solicitarAdocao(evento) {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const mensagem = formulario.querySelector(".mensagem-adocao");
  const botao = formulario.querySelector("button");
  const dados = Object.fromEntries(new FormData(formulario).entries());

  dados.animal_id = Number(formulario.dataset.animalId);

  botao.disabled = true;
  mensagem.textContent = "Enviando solicitação...";

  try {
    const resultado = await enviarSolicitacaoAdocao(dados);

    mensagem.textContent =
      resultado.mensagem || "Solicitação enviada com sucesso! Aguarde nosso contato.";

    formulario.reset();
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
}

// ==========================================
// CADASTRAR ANIMAL
// ==========================================

document.querySelector("#form-animal").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const mensagem = document.querySelector("#mensagem-cadastro");
  const botao = formulario.querySelector("button");
  const dados = Object.fromEntries(new FormData(formulario).entries());

  dados.idade = dados.idade === "" ? null : Number(dados.idade);

  botao.disabled = true;
  mensagem.textContent = "Salvando cadastro...";

  try {
    const resultado = await enviarCadastroAnimal(dados);

    mensagem.textContent = resultado.mensagem || "Animal cadastrado com sucesso!";

    formulario.reset();

    await carregarAnimais();
    await carregarAnimaisAdmin();
  } catch (erro) {
    mensagem.textContent = erro.message;
    console.error("Erro ao cadastrar animal:", erro);
  } finally {
    botao.disabled = false;
  }
});

// ==========================================
// CATEGORIAS E INSUMOS
// ==========================================

async function carregarCategorias() {
  const seletor = document.querySelector("#categoria-insumo");

  try {
    const categorias = await listarCategorias();

    seletor.innerHTML = '<option value="">Sem categoria</option>';

    categorias.forEach((categoria) => {
      const opcao = document.createElement("option");
      opcao.value = categoria.id_categoria;
      opcao.textContent = categoria.nome;
      seletor.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}

document.querySelector("#form-categoria").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const mensagem = document.querySelector("#mensagem-categoria");
  const botao = formulario.querySelector("button");
  const nome = document.querySelector("#nome-categoria").value.trim();

  botao.disabled = true;
  mensagem.textContent = "Cadastrando categoria...";

  try {
    const resposta = await apiAdmin("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || dados.mensagem || "Erro ao cadastrar categoria.");
    }

    mensagem.textContent = "Categoria cadastrada com sucesso!";
    formulario.reset();
    await carregarCategorias();
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

async function carregarInsumos() {
  try {
    await listarInsumos();
  } catch (erro) {
    console.error("Erro ao verificar insumos:", erro);
  }
}

document.querySelector("#form-insumo").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const mensagem = document.querySelector("#mensagem-insumo");
  const botao = formulario.querySelector("button");

  const nome = document.querySelector("#nome-insumo").value.trim();
  const unidade = document.querySelector("#unidade-insumo").value.trim();
  const id_categoria = document.querySelector("#categoria-insumo").value;

  botao.disabled = true;
  mensagem.textContent = "Cadastrando insumo...";

  try {
    const resposta = await apiAdmin("/api/insumos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        unidade,
        id_categoria: id_categoria || null,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || dados.mensagem || "Erro ao cadastrar insumo.");
    }

    mensagem.textContent = "Insumo cadastrado com sucesso!";
    formulario.reset();
    await carregarCategorias();
    await carregarInsumos();
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

// ==========================================
// LOGIN E LOGOUT
// ==========================================

async function carregarDadosAdmin() {
  await carregarAdocoes();
  await carregarAnimaisAdmin();
  await carregarCategorias();
  await carregarInsumos();

  if (!window.location.hash) {
    window.location.hash = "#/doadores";
  } else {
    await navegar();
  }
}

async function verificarLogin() {
  if (!obterToken()) {
    mostrarLogin();
    return;
  }

  try {
    const resposta = await apiAdmin("/api/admin/me");

    if (!resposta.ok) {
      localStorage.removeItem(CHAVE_TOKEN);
      mostrarLogin();
      return;
    }

    mostrarPainelAdmin();
    await carregarDadosAdmin();
  } catch (erro) {
    console.error("Erro ao verificar login:", erro);
    mostrarLogin();
  }
}

formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const botao = document.querySelector("#btn-login");
  const dados = Object.fromEntries(new FormData(formularioLogin).entries());

  botao.disabled = true;
  mensagemLogin.textContent = "Verificando acesso...";

  try {
    const resposta = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Não foi possível entrar.");
    }

    if (!resultado.token) {
      throw new Error("O servidor não retornou o token de acesso.");
    }

    localStorage.setItem(CHAVE_TOKEN, resultado.token);
    mensagemLogin.textContent = "Login realizado com sucesso!";
    mostrarPainelAdmin();

    await carregarDadosAdmin();
  } catch (erro) {
    mensagemLogin.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

document.querySelector("#btn-sair").addEventListener("click", async () => {
  try {
    if (obterToken()) {
      await apiAdmin("/api/admin/logout", { method: "POST" });
    }
  } catch (erro) {
    console.error("Erro ao encerrar sessão:", erro);
  }

  localStorage.removeItem(CHAVE_TOKEN);
  mostrarLogin();
  mensagemLogin.textContent = "Você saiu da área administrativa.";
});

// ==========================================
// STATUS DA API E DATA/HORA
// ==========================================

async function verificarAPI() {
  const status = document.querySelector("#api-status");

  try {
    const dados = await verificarSaudeAPI();

    if (dados.status !== "ok") {
      throw new Error("API indisponível");
    }

    status.textContent = "Status da API: conectado";
  } catch {
    status.textContent = "Status da API: indisponível";
  }
}

function atualizarDataHora() {
  const elemento = document.querySelector("#data-hora");

  if (elemento) {
    elemento.textContent = "Data e hora: " + new Date().toLocaleString("pt-BR");
  }
}

// ==========================================
// INICIAR APLICAÇÃO
// ==========================================

void verificarAPI();
void carregarAnimais();
void verificarLogin();

atualizarDataHora();
setInterval(atualizarDataHora, 1000);
