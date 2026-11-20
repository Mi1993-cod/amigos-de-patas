export function el(tag, atributos = {}, filhos = []) {
  const elemento = document.createElement(tag);

  for (const [chave, valor] of Object.entries(atributos)) {
    if (chave === "className") {
      elemento.className = valor;
    } else if (chave === "textContent") {
      elemento.textContent = valor;
    } else if (chave === "htmlFor") {
      elemento.htmlFor = valor;
    } else if (chave.startsWith("on") && typeof valor === "function") {
      elemento.addEventListener(chave.slice(2).toLowerCase(), valor);
    } else if (typeof valor === "boolean") {
      if (valor) {
        elemento.setAttribute(chave, "");
      } else {
        elemento.removeAttribute(chave);
      }
    } else if (valor !== null && valor !== undefined) {
      elemento.setAttribute(chave, valor);
    }
  }

  const listaFilhos = Array.isArray(filhos) ? filhos : [filhos];

  for (const filho of listaFilhos) {
    if (filho instanceof Node) {
      elemento.appendChild(filho);
    } else if (filho !== null && filho !== undefined) {
      elemento.appendChild(document.createTextNode(String(filho)));
    }
  }

  return elemento;
}

export function mostrarMensagem(elemento, mensagem, tipo = "sucesso") {
  if (!elemento) return;

  elemento.textContent = mensagem;
  elemento.className = `mensagem mensagem-${tipo}`;
  elemento.hidden = false;
  elemento.setAttribute("role", "status");
}

export function esconderMensagem(elemento) {
  if (!elemento) return;

  elemento.textContent = "";
  elemento.hidden = true;
}

export function estado(elemento, mensagem) {
  if (!elemento) return;

  elemento.replaceChildren(document.createTextNode(mensagem));
}

export function formatarData(data) {
  if (!data) return "";

  const dataFormatada = new Date(`${String(data).slice(0, 10)}T12:00:00`);

  if (Number.isNaN(dataFormatada.getTime())) return "";

  return dataFormatada.toLocaleDateString("pt-BR");
}

export function hoje() {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
