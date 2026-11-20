import "./style.css";

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
        <input
          type="email"
          id="email-admin"
          name="email"
          autocomplete="username"
          required
        />

        <label for="senha-admin">Senha</label>
        <input
          type="password"
          id="senha-admin"
          name="senha"
          autocomplete="current-password"
          required
        />

        <button type="submit" id="btn-login">Entrar</button>
        <p id="mensagem-login" role="status"></p>
      </form>

      <div id="painel-admin" style="display: none;">
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
          <p>Cadastre doadores, categorias, insumos e registre as doações recebidas.</p>

          <h4>Cadastro de doadores</h4>
          <form id="form-doador">
            <label for="nome-doador">Nome do doador *</label>
            <input id="nome-doador" name="nome" type="text" required maxlength="150" />

            <label for="tipo-doador">Tipo de doador *</label>
            <select id="tipo-doador" name="tipo_doador" required>
              <option value="">Selecione</option>
              <option value="Pessoa física">Pessoa física</option>
              <option value="Empresa">Empresa</option>
            </select>

            <label for="email-doador">E-mail</label>
            <input id="email-doador" name="email" type="email" maxlength="150" />

            <label for="telefone-doador">Telefone</label>
            <input id="telefone-doador" name="telefone" type="tel" maxlength="20" />

            <button type="submit">Cadastrar doador</button>
            <p id="mensagem-doador" role="status"></p>
          </form>

          <h4>Doadores cadastrados</h4>
          <div id="lista-doadores">
            <p>Carregando doadores...</p>
          </div>

          <hr />

          <h4>Cadastro de categorias</h4>
          <form id="form-categoria">
            <label for="nome-categoria">Nome da categoria *</label>
            <input id="nome-categoria" name="nome" type="text" required maxlength="100" />
            <button type="submit">Cadastrar categoria</button>
            <p id="mensagem-categoria" role="status"></p>
          </form>

          <hr />

          <h4>Cadastro de insumos</h4>
          <form id="form-insumo">
            <label for="nome-insumo">Nome do insumo *</label>
            <input id="nome-insumo" name="nome" type="text" required maxlength="100" />

            <label for="unidade-insumo">Unidade *</label>
            <input
              id="unidade-insumo"
              name="unidade"
              type="text"
              required
              maxlength="30"
              placeholder="Ex.: kg, unidade, pacote"
            />

            <label for="categoria-insumo">Categoria</label>
            <select id="categoria-insumo" name="id_categoria">
              <option value="">Sem categoria</option>
            </select>

            <button type="submit">Cadastrar insumo</button>
            <p id="mensagem-insumo" role="status"></p>
          </form>

          <hr />

          <h4>Registrar doação</h4>
          <form id="form-doacao">
            <label for="doador-doacao">Doador *</label>
            <select id="doador-doacao" name="id_doador" required>
              <option value="">Selecione um doador</option>
            </select>

            <label for="data-doacao">Data da doação *</label>
            <input id="data-doacao" name="data_doacao" type="date" required />

            <label for="insumo-doacao">Insumo *</label>
            <select id="insumo-doacao">
              <option value="">Selecione um insumo</option>
            </select>

            <label for="quantidade-doacao">Quantidade *</label>
            <input id="quantidade-doacao" type="number" min="0.01" step="0.01" />

            <button type="button" id="btn-adicionar-insumo">
              Adicionar insumo à doação
            </button>

            <div id="itens-doacao">
              <p>Nenhum insumo adicionado.</p>
            </div>

            <label for="observacao-doacao">Observação</label>
            <textarea id="observacao-doacao" name="observacao" rows="3"></textarea>

            <button type="submit">Registrar doação</button>
            <p id="mensagem-doacao" role="status"></p>
          </form>

          <hr />

          <h4>Histórico de doações</h4>
          <div id="lista-doacoes">
            <p>Carregando histórico...</p>
          </div>
        </section>
      </div>
    </section>

    <section class="cadastro" id="secao-cadastro" style="display: none;">
      <h2>Cadastro de animais</h2>
      <p>Preencha os dados para cadastrar um novo amiguinho.</p>

      <form id="form-animal">
        <label for="nome">Nome do animal *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          maxlength="100"
          placeholder="Ex.: Bob"
          required
        />

        <label for="especie">Espécie *</label>
        <select id="especie" name="especie" required>
          <option value="">Selecione</option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Outro">Outro</option>
        </select>

        <label for="raca">Raça</label>
        <input
          type="text"
          id="raca"
          name="raca"
          maxlength="100"
          placeholder="Ex.: Labrador"
        />

        <label for="idade">Idade em anos</label>
        <input
          type="number"
          id="idade"
          name="idade"
          min="0"
          step="1"
          placeholder="Ex.: 2"
        />

        <label for="sexo">Sexo</label>
        <select id="sexo" name="sexo">
          <option value="Não informado">Não informado</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </select>

        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          rows="4"
          placeholder="Conte um pouco sobre o animal..."
        ></textarea>

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

// ==========================================
// AUTENTICAÇÃO JWT
// ==========================================

const CHAVE_TOKEN = "amigos_patas_token";

const formularioLogin = document.querySelector("#form-login");
const painelAdmin = document.querySelector("#painel-admin");
const secaoCadastro = document.querySelector("#secao-cadastro");
const mensagemLogin = document.querySelector("#mensagem-login");

function obterToken() {
  return sessionStorage.getItem(CHAVE_TOKEN);
}

function mostrarPainelAdmin() {
  formularioLogin.style.display = "none";
  painelAdmin.style.display = "block";
  secaoCadastro.style.display = "block";
}

function mostrarLogin() {
  formularioLogin.style.display = "block";
  painelAdmin.style.display = "none";
  secaoCadastro.style.display = "none";

  formularioLogin.reset();

  document.querySelector("#lista-adocoes").innerHTML =
    "<p>Entre para visualizar as solicitações.</p>";

  document.querySelector("#lista-animais-admin").innerHTML =
    "<p>Entre para visualizar os animais cadastrados.</p>";
}

async function apiAdmin(url, opcoes = {}) {
  const token = obterToken();

  if (!token) {
    mostrarLogin();
    mensagemLogin.textContent = "Faça login para continuar.";
    throw new Error("Autenticação necessária.");
  }

  const cabecalhos = {
    ...opcoes.headers,
    Authorization: `Bearer ${token}`,
  };

  const resposta = await fetch(url, {
    ...opcoes,
    headers: cabecalhos,
  });

  if (resposta.status === 401) {
    sessionStorage.removeItem(CHAVE_TOKEN);
    mostrarLogin();
    mensagemLogin.textContent = "Sua sessão expirou. Entre novamente.";
  }

  return resposta;
}

async function verificarLogin() {
  if (!obterToken()) {
    mostrarLogin();
    return;
  }

  try {
    const resposta = await apiAdmin("/api/admin/me");

    if (!resposta.ok) {
      mostrarLogin();
      return;
    }

    mostrarPainelAdmin();

    await carregarAdocoes();
    await carregarAnimaisAdmin();
    await carregarDoadores();
    await carregarCategorias();
    await carregarInsumos();
    await carregarDoacoes();
  } catch (erro) {
    console.error("Erro ao verificar login:", erro);
    mostrarLogin();
  }
}

// ==========================================
// ENTRAR NA ÁREA ADMINISTRATIVA
// ==========================================

formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const botao = document.querySelector("#btn-login");
  const dados = Object.fromEntries(new FormData(formularioLogin).entries());

  botao.disabled = true;
  mensagemLogin.textContent = "Verificando acesso...";

  try {
    const resposta = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Não foi possível entrar.");
    }

    if (!resultado.token) {
      throw new Error("O servidor não retornou o token de acesso.");
    }

    sessionStorage.setItem(CHAVE_TOKEN, resultado.token);

    mensagemLogin.textContent = "Login realizado com sucesso!";

    mostrarPainelAdmin();

    await carregarAdocoes();
    await carregarAnimaisAdmin();
    await carregarDoadores();
    await carregarCategorias();
    await carregarInsumos();
    await carregarDoacoes();
  } catch (erro) {
    mensagemLogin.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

// ==========================================
// SAIR DA ÁREA ADMINISTRATIVA
// ==========================================

document.querySelector("#btn-sair").addEventListener("click", async () => {
  try {
    if (obterToken()) {
      await apiAdmin("/api/admin/logout", {
        method: "POST",
      });
    }
  } catch (erro) {
    console.error("Erro ao encerrar sessão:", erro);
  }

  sessionStorage.removeItem(CHAVE_TOKEN);

  mostrarLogin();
  mensagemLogin.textContent = "Você saiu da área administrativa.";
});

// ==========================================
// GESTÃO DE DOADORES
// ==========================================

async function carregarDoadores() {
  const lista = document.querySelector("#lista-doadores");
  const seletor = document.querySelector("#doador-doacao");

  try {
    const resposta = await apiAdmin("/api/doadores");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar doadores.");
    }

    const doadores = await resposta.json();

    if (!Array.isArray(doadores)) {
      throw new Error("A resposta da API não contém uma lista válida de doadores.");
    }

    if (doadores.length === 0) {
      lista.innerHTML = "<p>Nenhum doador cadastrado.</p>";
    } else {
      lista.innerHTML = doadores
        .map(
          (doador) => `
        <article class="card-animal">
          <p><strong>Nome:</strong> ${escaparHTML(doador.nome)}</p>
          <p><strong>Tipo:</strong> ${escaparHTML(doador.tipo_doador)}</p>
          <p><strong>E-mail:</strong> ${escaparHTML(doador.email || "Não informado")}</p>
          <p><strong>Telefone:</strong> ${escaparHTML(doador.telefone || "Não informado")}</p>

          <button
            type="button"
            class="btn-editar-doador"
            data-id="${Number(doador.id_doador)}"
          >
            Editar
          </button>

          <button
            type="button"
            class="btn-excluir-doador"
            data-id="${Number(doador.id_doador)}"
          >
            Excluir
          </button>
        </article>
      `,
        )
        .join("");
    }

    seletor.innerHTML = `
      <option value="">Selecione um doador</option>
      ${doadores
        .map(
          (doador) => `
        <option value="${Number(doador.id_doador)}">
          ${escaparHTML(doador.nome)}
        </option>
      `,
        )
        .join("")}
    `;

    // Eventos dos botões de edição e exclusão
    lista.querySelectorAll(".btn-editar-doador").forEach((botao) => {
      botao.addEventListener("click", editarDoador);
    });

    lista.querySelectorAll(".btn-excluir-doador").forEach((botao) => {
      botao.addEventListener("click", excluirDoador);
    });
  } catch (erro) {
    lista.innerHTML = "<p>Não foi possível carregar os doadores.</p>";
    console.error(erro);
  }
}

// EDITAR DOADOR

async function editarDoador(evento) {
  const botao = evento.currentTarget;
  const id = Number(botao.dataset.id);

  if (!Number.isInteger(id) || id <= 0) {
    alert("Identificação do doador inválida.");
    return;
  }

  const card = botao.closest(".card-animal");

  if (!card) return;

  const paragrafos = card.querySelectorAll("p");

  const nomeAtual = paragrafos[0]?.textContent.replace("Nome:", "").trim() || "";
  const tipoAtual = paragrafos[1]?.textContent.replace("Tipo:", "").trim() || "";
  const emailAtual = paragrafos[2]?.textContent.replace("E-mail:", "").trim() || "";
  const telefoneAtual = paragrafos[3]?.textContent.replace("Telefone:", "").trim() || "";

  const nome = window.prompt("Nome do doador:", nomeAtual);

  if (nome === null) return;

  if (!nome.trim()) {
    alert("O nome do doador é obrigatório.");
    return;
  }

  const tipoEscolhido = window.prompt(
    "Tipo de doador:\n1 - Pessoa física\n2 - Empresa",
    tipoAtual === "Empresa" ? "2" : "1",
  );

  if (tipoEscolhido === null) return;

  let tipo_doador;

  if (tipoEscolhido.trim() === "1" || tipoEscolhido.trim().toLowerCase() === "pessoa física") {
    tipo_doador = "Pessoa física";
  } else if (tipoEscolhido.trim() === "2" || tipoEscolhido.trim().toLowerCase() === "empresa") {
    tipo_doador = "Empresa";
  } else {
    alert("Tipo inválido. Informe 1 para Pessoa física ou 2 para Empresa.");
    return;
  }

  const email = window.prompt(
    "E-mail do doador (deixe em branco se não tiver):",
    emailAtual === "Não informado" ? "" : emailAtual,
  );

  if (email === null) return;

  const telefone = window.prompt(
    "Telefone do doador (deixe em branco se não tiver):",
    telefoneAtual === "Não informado" ? "" : telefoneAtual,
  );

  if (telefone === null) return;

  botao.disabled = true;

  try {
    const resposta = await apiAdmin(`/api/doadores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome.trim(),
        tipo_doador,
        email: email.trim(),
        telefone: telefone.trim(),
      }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.mensagem || resultado.erro || "Não foi possível atualizar o doador.",
      );
    }

    alert(resultado.mensagem || "Doador atualizado com sucesso!");

    await carregarDoadores();
  } catch (erro) {
    alert(erro.message);
    console.error("Erro ao editar doador:", erro);
    botao.disabled = false;
  }
}

// EXCLUIR DOADOR

async function excluirDoador(evento) {
  const botao = evento.currentTarget;
  const id = Number(botao.dataset.id);

  if (!Number.isInteger(id) || id <= 0) {
    alert("Identificação do doador inválida.");
    return;
  }

  const confirmar = window.confirm(
    "Tem certeza de que deseja excluir este doador?\n\nSe ele tiver doações registradas, a exclusão não será permitida para preservar o histórico.",
  );

  if (!confirmar) return;

  botao.disabled = true;

  try {
    const resposta = await apiAdmin(`/api/doadores/${id}`, {
      method: "DELETE",
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      if (resposta.status === 409) {
        throw new Error(
          resultado.mensagem ||
            "Este doador possui doações registradas e não pode ser excluído. O histórico foi preservado.",
        );
      }

      throw new Error(resultado.mensagem || resultado.erro || "Não foi possível excluir o doador.");
    }

    alert(resultado.mensagem || "Doador excluído com sucesso!");

    await carregarDoadores();
  } catch (erro) {
    alert(erro.message);
    console.error("Erro ao excluir doador:", erro);
    botao.disabled = false;
  }
}

// CADASTRAR DOADOR

document.querySelector("#form-doador").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const mensagem = document.querySelector("#mensagem-doador");
  const botao = formulario.querySelector("button");

  const dados = Object.fromEntries(new FormData(formulario).entries());

  if (!dados.email.trim()) {
    delete dados.email;
  }

  if (!dados.telefone.trim()) {
    delete dados.telefone;
  }

  botao.disabled = true;
  mensagem.textContent = "Cadastrando doador...";

  try {
    const resposta = await apiAdmin("/api/doadores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao cadastrar doador.");
    }

    mensagem.textContent = "Doador cadastrado com sucesso!";
    formulario.reset();

    await carregarDoadores();
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

// ==========================================
// VERIFICAR API
// ==========================================

async function verificarAPI() {
  const status = document.querySelector("#api-status");

  try {
    const resposta = await fetch("/api/health");
    const dados = await resposta.json();

    if (!resposta.ok || dados.status !== "ok") {
      throw new Error("API indisponível");
    }

    status.textContent = "Status da API: conectado";
  } catch {
    status.textContent = "Status da API: indisponível";
  }
}

// ==========================================
// CARREGAR ANIMAIS
// VITRINE PÚBLICA
// ==========================================

async function carregarAnimais() {
  const lista = document.querySelector("#lista-animais");

  try {
    const resposta = await fetch("/api/animais");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar animais");
    }

    const animais = await resposta.json();

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

// ==========================================
// CARREGAR TODOS OS ANIMAIS
// SOMENTE ADMINISTRADOR
// ==========================================

async function carregarAnimaisAdmin() {
  const lista = document.querySelector("#lista-animais-admin");

  try {
    const resposta = await apiAdmin("/api/animais");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar animais cadastrados.");
    }

    const animais = await resposta.json();

    if (!Array.isArray(animais)) {
      throw new Error("A resposta da API não contém uma lista válida.");
    }

    if (animais.length === 0) {
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

            <p><strong>Espécie:</strong>
              ${escaparHTML(animal.especie)}
            </p>

            <p><strong>Raça:</strong>
              ${escaparHTML(animal.raca || "Não informada")}
            </p>

            <p><strong>Idade:</strong>
              ${escaparHTML(animal.idade ?? "Não informada")}
            </p>

            <p><strong>Sexo:</strong>
              ${escaparHTML(animal.sexo || "Não informado")}
            </p>

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

    console.error("Erro ao carregar animais administrativos:", erro);
  }
}

// ==========================================
// CADASTRAR ANIMAL
// SOMENTE ADMINISTRADOR
// ==========================================

async function cadastrarAnimal(evento) {
  evento.preventDefault();

  const formulario = document.querySelector("#form-animal");
  const mensagem = document.querySelector("#mensagem-cadastro");
  const botao = formulario.querySelector("button");

  const dados = Object.fromEntries(new FormData(formulario).entries());

  dados.idade = dados.idade === "" ? null : Number(dados.idade);

  botao.disabled = true;
  mensagem.textContent = "Salvando cadastro...";

  try {
    const resposta = await apiAdmin("/api/animais", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao cadastrar animal.");
    }

    mensagem.textContent = "Animal cadastrado com sucesso!";

    formulario.reset();

    await carregarAnimais();
    await carregarAnimaisAdmin();
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
}

// ==========================================
// SOLICITAR ADOÇÃO
// ROTA PÚBLICA
// ==========================================

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
    const resposta = await fetch("/api/adocoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Não foi possível enviar a solicitação.");
    }

    mensagem.textContent = "Solicitação enviada com sucesso! Aguarde nosso contato.";

    formulario.reset();
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
}

// ==========================================
// CARREGAR SOLICITAÇÕES
// SOMENTE ADMINISTRADOR
// ==========================================

async function carregarAdocoes() {
  const lista = document.querySelector("#lista-adocoes");

  try {
    const resposta = await apiAdmin("/api/adocoes");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar solicitações.");
    }

    const adocoes = await resposta.json();

    if (adocoes.length === 0) {
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
          <button
            type="button"
            class="btn-aprovar"
            data-id="${Number(adocao.id)}"
            data-status="Aprovada"
          >
            Aprovar adoção
          </button>

          <button
            type="button"
            class="btn-cancelar"
            data-id="${Number(adocao.id)}"
            data-status="Cancelada"
          >
            Cancelar solicitação
          </button>
        `
            : ""
        }

        <p>
          <strong>Data:</strong>
          ${escaparHTML(new Date(adocao.data_solicitacao).toLocaleString("pt-BR"))}
        </p>
      </article>
    `,
      )
      .join("");

    lista.querySelectorAll(".btn-aprovar, .btn-cancelar").forEach((botao) => {
      botao.addEventListener("click", async () => {
        const id = botao.dataset.id;
        const status = botao.dataset.status;

        const confirmar = window.confirm(
          status === "Aprovada"
            ? "Deseja aprovar esta adoção?"
            : "Deseja cancelar esta solicitação?",
        );

        if (!confirmar) return;

        botao.disabled = true;

        try {
          const resposta = await apiAdmin(`/api/adocoes/${id}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
          });

          const resultado = await resposta.json();

          if (!resposta.ok) {
            throw new Error(resultado.mensagem || "Erro ao atualizar solicitação.");
          }

          alert(resultado.mensagem);

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

// ==========================================
// DATA E HORA
// ==========================================

function atualizarDataHora() {
  const elemento = document.querySelector("#data-hora");

  if (elemento) {
    elemento.textContent = "Data e hora: " + new Date().toLocaleString("pt-BR");
  }
}

// ==========================================
// GESTÃO DE CATEGORIAS
// ==========================================

const formularioCategoria = document.querySelector("#form-categoria");

async function carregarCategorias() {
  const seletor = document.querySelector("#categoria-insumo");

  try {
    const resposta = await apiAdmin("/api/categorias");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar as categorias.");
    }

    const dados = await resposta.json();
    const categorias = Array.isArray(dados) ? dados : dados.categorias || [];

    seletor.innerHTML = '<option value="">Selecione uma categoria</option>';

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

if (formularioCategoria) {
  formularioCategoria.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mensagem = document.querySelector("#mensagem-categoria");
    const nome = document.querySelector("#nome-categoria").value.trim();

    try {
      const resposta = await apiAdmin("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || dados.mensagem || "Erro ao cadastrar categoria.");
      }

      mensagem.textContent = "Categoria cadastrada com sucesso!";
      formularioCategoria.reset();

      await carregarCategorias();
    } catch (erro) {
      mensagem.textContent = erro.message;
      console.error("Erro ao cadastrar categoria:", erro);
    }
  });
}

// ==========================================
// GESTÃO DE INSUMOS
// ==========================================

const formularioInsumo = document.querySelector("#form-insumo");

if (formularioInsumo) {
  formularioInsumo.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mensagem = document.querySelector("#mensagem-insumo");

    const nome = document.querySelector("#nome-insumo").value.trim();
    const unidade = document.querySelector("#unidade-insumo").value.trim();
    const id_categoria = document.querySelector("#categoria-insumo").value;

    try {
      const resposta = await apiAdmin("/api/insumos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      formularioInsumo.reset();

      await carregarCategorias();
      await carregarInsumos();
    } catch (erro) {
      mensagem.textContent = erro.message;
      console.error("Erro ao cadastrar insumo:", erro);
    }
  });
}

async function carregarInsumos() {
  const seletor = document.querySelector("#insumo-doacao");

  try {
    const resposta = await apiAdmin("/api/insumos");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os insumos.");
    }

    const dados = await resposta.json();
    const insumos = Array.isArray(dados) ? dados : dados.insumos || [];

    seletor.innerHTML = '<option value="">Selecione um insumo</option>';

    insumos.forEach((insumo) => {
      const opcao = document.createElement("option");
      opcao.value = insumo.id_insumo;
      opcao.textContent = `${insumo.nome} (${insumo.unidade})`;
      seletor.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar insumos:", erro);
  }
}

// ==========================================
// ADICIONAR INSUMOS À DOAÇÃO
// ==========================================

const itensDoacao = [];

document.querySelector("#btn-adicionar-insumo").addEventListener("click", () => {
  const seletorInsumo = document.querySelector("#insumo-doacao");
  const campoQuantidade = document.querySelector("#quantidade-doacao");
  const lista = document.querySelector("#itens-doacao");

  const id_insumo = Number(seletorInsumo.value);
  const quantidade = Number(campoQuantidade.value);

  if (!id_insumo || !quantidade || quantidade <= 0) {
    alert("Selecione um insumo e informe uma quantidade válida.");
    return;
  }

  const insumo = seletorInsumo.selectedOptions[0];

  itensDoacao.push({
    id_insumo,
    nome: insumo.textContent,
    quantidade,
  });

  lista.innerHTML = itensDoacao
    .map(
      (item) => `
      <p>
        ${escaparHTML(item.nome)} - Quantidade: ${item.quantidade}
      </p>
    `,
    )
    .join("");

  seletorInsumo.value = "";
  campoQuantidade.value = "";
});

// ==========================================
// REGISTRAR DOAÇÃO
// ==========================================

document.querySelector("#form-doacao").addEventListener("submit", async (event) => {
  event.preventDefault();

  const id_doador = Number(document.querySelector("#doador-doacao").value);
  const data_doacao = document.querySelector("#data-doacao").value;
  const observacao = document.querySelector("#observacao-doacao").value;
  const mensagem = document.querySelector("#mensagem-doacao");

  if (!id_doador || !data_doacao || itensDoacao.length === 0) {
    mensagem.textContent = "Selecione um doador, informe a data e adicione pelo menos um insumo.";
    return;
  }

  const dadosDoacao = {
    id_doador,
    data_doacao,
    observacao,
    insumos: itensDoacao.map((item) => ({
      id_insumo: item.id_insumo,
      quantidade: item.quantidade,
    })),
  };

  try {
    const resposta = await apiAdmin("/api/doacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosDoacao),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.erro || resultado.mensagem || "Não foi possível registrar a doação.",
      );
    }

    mensagem.textContent = "Doação registrada com sucesso!";

    document.querySelector("#form-doacao").reset();

    itensDoacao.length = 0;

    document.querySelector("#itens-doacao").innerHTML = "<p>Nenhum insumo adicionado.</p>";

    await carregarDoacoes();
  } catch (erro) {
    console.error("Erro ao registrar doação:", erro);
    mensagem.textContent = erro.message;
  }
});

// ==========================================
// CARREGAR HISTÓRICO DE DOAÇÕES
// ==========================================

async function carregarDoacoes() {
  const lista = document.querySelector("#lista-doacoes");

  try {
    const resposta = await apiAdmin("/api/doacoes");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar histórico de doações.");
    }

    const doacoes = await resposta.json();

    if (doacoes.length === 0) {
      lista.innerHTML = "<p>Nenhuma doação registrada.</p>";
      return;
    }

    lista.innerHTML = doacoes
      .map(
        (doacao) => `
      <article class="card-animal">
        <h3>Doação nº ${Number(doacao.id_doacao)}</h3>
        <p><strong>Doador:</strong> ${escaparHTML(doacao.nome_doador)}</p>
        <p><strong>Data:</strong> ${escaparHTML(
          new Date(doacao.data_doacao).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          }),
        )}</p>

        <p><strong>Insumos recebidos:</strong></p>
        ${doacao.insumos
          .map(
            (item) => `
          <p>
            ${escaparHTML(item.nome_insumo)} -
            Quantidade: ${escaparHTML(item.quantidade)}
            ${escaparHTML(item.unidade)}
          </p>
        `,
          )
          .join("")}

        <p><strong>Observação:</strong>
          ${escaparHTML(doacao.observacao || "Nenhuma")}
        </p>
      </article>
    `,
      )
      .join("");
  } catch (erro) {
    lista.innerHTML = "<p>Não foi possível carregar o histórico de doações.</p>";
    console.error("Erro ao carregar doações:", erro);
  }
}

// ==========================================
// INICIAR APLICAÇÃO
// ==========================================

document.querySelector("#form-animal").addEventListener("submit", cadastrarAnimal);

verificarAPI().catch(console.error);

void carregarAnimais();
void verificarLogin();

atualizarDataHora();

setInterval(atualizarDataHora, 1000);
