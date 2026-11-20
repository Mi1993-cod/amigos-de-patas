const TOKEN_KEY = "amigos_patas_token";

function obterToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function requisicao(url, opcoes = {}) {
  const token = obterToken();

  const headers = {
    ...opcoes.headers,
  };

  if (opcoes.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(url, {
    ...opcoes,
    headers,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || dados.mensagem || `Erro na requisição: ${resposta.status}`);
  }

  return dados;
}

export function verificarSaudeAPI() {
  return requisicao("/api/health");
}

export function listarDoadores() {
  return requisicao("/api/doadores");
}

export function cadastrarDoador(dados) {
  return requisicao("/api/doadores", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarDoador(id, dados) {
  return requisicao(`/api/doadores/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirDoador(id) {
  return requisicao(`/api/doadores/${id}`, {
    method: "DELETE",
  });
}

export function listarCategorias() {
  return requisicao("/api/categorias");
}

export function listarInsumos() {
  return requisicao("/api/insumos");
}

export function listarDoacoes() {
  return requisicao("/api/doacoes");
}

export function cadastrarDoacao(dados) {
  return requisicao("/api/doacoes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function listarAnimais() {
  return requisicao("/api/animais");
}

export function cadastrarAnimal(dados) {
  return requisicao("/api/animais", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function listarAdocoes() {
  return requisicao("/api/adocoes");
}

export function solicitarAdocao(dados) {
  return requisicao("/api/adocoes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarStatusAdocao(id, status) {
  return requisicao(`/api/adocoes/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
