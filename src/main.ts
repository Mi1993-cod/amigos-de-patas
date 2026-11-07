import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="pagina">
    <header>
      <h1>🐾 Amigos de Patas</h1>
      <p>Protegendo animais e construindo um futuro melhor.</p>
   </header>

<div class="foto-animais">
  <img
    src="/cachorro-gato.jpg"
    alt="Um cachorro e um gato juntos"
  />
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

    <footer>
      <p id="api-status">Status da API: verificando...</p>
      <p id="data-hora"></p>
    </footer>
  </main>
`;

async function verificarAPI() {
  const status = document.querySelector("#api-status");

  try {
    const resposta = await fetch("/api/health");
    const dados = await resposta.json();

    if (!resposta.ok || dados.status !== "ok") {
      throw new Error("API indisponível");
    }

    if (status) {
      status.textContent = "Status da API: ok";
    }
  } catch {
    if (status) {
      status.textContent = "Status da API: indisponível";
    }
  }
}

function atualizarDataHora() {
  const elemento = document.querySelector("#data-hora");

  if (elemento) {
    elemento.textContent = "Data e hora: " + new Date().toLocaleString("pt-BR");
  }
}

verificarAPI();
atualizarDataHora();
setInterval(atualizarDataHora, 1000);
