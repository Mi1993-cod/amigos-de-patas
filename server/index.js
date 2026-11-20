import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ==========================================
// AUTENTICAÇÃO JWT DO ADMINISTRADOR
// ==========================================

function exigirAdmin(req, res, next) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
    return res.status(401).json({
      mensagem: "Acesso restrito. Faça login como administrador.",
    });
  }

  const token = autorizacao.slice(7);

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado.");
    }

    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: dados.id,
      nome: dados.nome,
      email: dados.email,
    };

    next();
  } catch {
    return res.status(401).json({
      mensagem: "Sessão inválida ou expirada. Faça login novamente.",
    });
  }
}

// ==========================================
// LOGIN ADMINISTRATIVO COM JWT E BCRYPT
// ==========================================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha ||
      email.length > 150 ||
      senha.length > 256
    ) {
      return res.status(400).json({
        mensagem: "Informe um e-mail e uma senha válidos.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET não configurado.");

      return res.status(500).json({
        mensagem: "Configuração de autenticação incompleta.",
      });
    }

    const [usuarios] = await pool.execute(
      `SELECT id, nome, email, senha_hash, ativo
       FROM usuario
       WHERE email = ?
       LIMIT 1`,
      [email.trim().toLowerCase()],
    );

    if (usuarios.length === 0 || !usuarios[0].ativo) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      },
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro na autenticação administrativa:", error.message);

    return res.status(500).json({
      mensagem: "Não foi possível realizar o login.",
    });
  }
});

// ==========================================
// VERIFICAR SE O ADMINISTRADOR ESTÁ CONECTADO
// ==========================================

app.get("/api/admin/me", exigirAdmin, (req, res) => {
  res.json({
    autenticado: true,
    usuario: req.usuario,
  });
});

// ==========================================
// SAIR DA ÁREA ADMINISTRATIVA
// ==========================================

app.post("/api/admin/logout", (req, res) => {
  res.json({
    mensagem: "Sessão encerrada.",
  });
});

// ==========================================
// TESTE DA API
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    projeto: "Amigos de Patas",
    mensagem: "API funcionando corretamente!",
  });
});

// ==========================================
// TESTE DE CONEXÃO COM MYSQL
// ==========================================

app.get("/api/db-health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS conectado");

    res.json({
      status: "ok",
      banco: "amigos_de_patas",
      mensagem: "Conexão com MySQL funcionando!",
      resultado: rows[0],
    });
  } catch (error) {
    console.error("Erro ao conectar ao MySQL:", error.message);

    res.status(500).json({
      status: "erro",
      mensagem: "Não foi possível conectar ao MySQL.",
    });
  }
});

// ==========================================
// BUSCAR ANIMAIS
// ROTA PÚBLICA
// ==========================================

app.get("/api/animais", async (req, res) => {
  try {
    const [animais] = await pool.query("SELECT * FROM animais ORDER BY id DESC");

    res.json(animais);
  } catch (error) {
    console.error("Erro ao buscar animais:", error.message);

    res.status(500).json({
      mensagem: "Não foi possível buscar os animais.",
    });
  }
});

// ==========================================
// CADASTRAR ANIMAL
// SOMENTE ADMINISTRADOR
// ==========================================

app.post("/api/animais", exigirAdmin, async (req, res) => {
  try {
    const { nome, especie, raca, idade, sexo, descricao, status } = req.body;

    const especiesPermitidas = ["Cachorro", "Gato", "Outro"];
    const sexosPermitidos = ["Macho", "Fêmea", "Não informado"];
    const statusPermitidos = ["Disponível", "Reservado", "Adotado"];

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        mensagem: "O nome do animal é obrigatório.",
      });
    }

    if (!especiesPermitidas.includes(especie)) {
      return res.status(400).json({
        mensagem: "Selecione uma espécie válida.",
      });
    }

    const idadeNumerica =
      idade === "" || idade === null || idade === undefined ? null : Number(idade);

    if (idadeNumerica !== null && (!Number.isInteger(idadeNumerica) || idadeNumerica < 0)) {
      return res.status(400).json({
        mensagem: "Informe uma idade válida.",
      });
    }

    const sexoFinal = sexo || "Não informado";

    if (!sexosPermitidos.includes(sexoFinal)) {
      return res.status(400).json({
        mensagem: "Selecione um sexo válido.",
      });
    }

    const statusFinal = status || "Disponível";

    if (!statusPermitidos.includes(statusFinal)) {
      return res.status(400).json({
        mensagem: "Selecione uma situação válida para o animal.",
      });
    }

    const [resultado] = await pool.query(
      `INSERT INTO animais
      (nome, especie, raca, idade, sexo, descricao, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        especie,
        raca || null,
        idadeNumerica,
        sexoFinal,
        descricao || null,
        statusFinal,
      ],
    );

    res.status(201).json({
      mensagem: "Animal cadastrado com sucesso!",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro ao cadastrar animal:", error.message);

    res.status(500).json({
      mensagem: "Não foi possível cadastrar o animal.",
    });
  }
});

// ==========================================
// SOLICITAR ADOÇÃO
// ROTA PÚBLICA
// ==========================================

app.post("/api/adocoes", async (req, res) => {
  let conexao;

  try {
    const { animal_id, nome, email, telefone, cidade } = req.body;

    if (!animal_id || !nome?.trim() || !email?.trim() || !telefone?.trim() || !cidade?.trim()) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios.",
      });
    }

    const idAnimal = Number(animal_id);

    if (!Number.isInteger(idAnimal) || idAnimal <= 0) {
      return res.status(400).json({
        mensagem: "Animal inválido.",
      });
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    conexao = await pool.getConnection();

    await conexao.beginTransaction();

    const [animais] = await conexao.query(
      "SELECT id, status FROM animais WHERE id = ? FOR UPDATE",
      [idAnimal],
    );

    if (animais.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    if (animais[0].status !== "Disponível") {
      await conexao.rollback();

      return res.status(409).json({
        mensagem: "Este animal não está disponível para adoção.",
      });
    }

    const [interessado] = await conexao.query(
      `INSERT INTO interessados
      (nome, email, telefone, cidade)
      VALUES (?, ?, ?, ?)`,
      [nome.trim(), email.trim(), telefone.trim(), cidade.trim()],
    );

    const [adocao] = await conexao.query(
      `INSERT INTO adocoes
      (animal_id, interessado_id, status)
      VALUES (?, ?, ?)`,
      [idAnimal, interessado.insertId, "Pendente"],
    );

    await conexao.commit();

    res.status(201).json({
      mensagem: "Solicitação de adoção enviada com sucesso!",
      id: adocao.insertId,
      status: "Pendente",
    });
  } catch (error) {
    if (conexao) {
      await conexao.rollback();
    }

    console.error("Erro ao registrar adoção:", error.message);

    res.status(500).json({
      mensagem: "Não foi possível registrar a solicitação.",
    });
  } finally {
    conexao?.release();
  }
});

// ==========================================
// LISTAR SOLICITAÇÕES DE ADOÇÃO
// SOMENTE ADMINISTRADOR
// ==========================================

app.get("/api/adocoes", exigirAdmin, async (req, res) => {
  try {
    const [adocoes] = await pool.query(`
      SELECT
        adocoes.id,
        animais.nome AS animal,
        interessados.nome AS interessado,
        interessados.email,
        interessados.telefone,
        interessados.cidade,
        adocoes.status,
        adocoes.data_solicitacao
      FROM adocoes
      INNER JOIN animais
        ON adocoes.animal_id = animais.id
      INNER JOIN interessados
        ON adocoes.interessado_id = interessados.id
      ORDER BY adocoes.data_solicitacao DESC
    `);

    res.json(adocoes);
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error.message);

    res.status(500).json({
      mensagem: "Não foi possível buscar as solicitações.",
    });
  }
});

// ==========================================
// APROVAR OU CANCELAR ADOÇÃO
// SOMENTE ADMINISTRADOR
// ==========================================

app.put("/api/adocoes/:id/status", exigirAdmin, async (req, res) => {
  let conexao;

  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Solicitação inválida.",
      });
    }

    if (!["Aprovada", "Cancelada"].includes(status)) {
      return res.status(400).json({
        mensagem: "Status inválido.",
      });
    }

    conexao = await pool.getConnection();

    await conexao.beginTransaction();

    const [adocoes] = await conexao.query(
      "SELECT id, animal_id, status FROM adocoes WHERE id = ? FOR UPDATE",
      [id],
    );

    if (adocoes.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        mensagem: "Solicitação não encontrada.",
      });
    }

    if (adocoes[0].status !== "Pendente") {
      await conexao.rollback();

      return res.status(409).json({
        mensagem: "Esta solicitação já foi processada.",
      });
    }

    if (status === "Aprovada") {
      const [animais] = await conexao.query("SELECT status FROM animais WHERE id = ? FOR UPDATE", [
        adocoes[0].animal_id,
      ]);

      if (animais.length === 0 || animais[0].status !== "Disponível") {
        await conexao.rollback();

        return res.status(409).json({
          mensagem: "Este animal não está disponível.",
        });
      }

      await conexao.query("UPDATE animais SET status = 'Adotado' WHERE id = ?", [
        adocoes[0].animal_id,
      ]);
    }

    await conexao.query("UPDATE adocoes SET status = ? WHERE id = ?", [status, id]);

    await conexao.commit();

    res.json({
      mensagem: "Solicitação atualizada com sucesso!",
      status,
    });
  } catch (error) {
    if (conexao) {
      await conexao.rollback();
    }

    console.error("Erro ao atualizar adoção:", error);

    res.status(500).json({
      mensagem: "Não foi possível atualizar a solicitação.",
    });
  } finally {
    conexao?.release();
  }
});

// ==========================================
// CADASTRO, CONSULTA, EDIÇÃO E EXCLUSÃO DE DOADORES
// SOMENTE ADMINISTRADOR
// ==========================================

// Listar doadores
app.get("/api/doadores", exigirAdmin, async (req, res) => {
  try {
    const [doadores] = await pool.execute(
      `SELECT id_doador, nome, tipo_doador, email, telefone, data_cadastro
       FROM doadores
       ORDER BY nome`,
    );

    return res.json(doadores);
  } catch (erro) {
    console.error("Erro ao listar doadores:", erro);

    return res.status(500).json({
      mensagem: "Erro ao consultar doadores.",
    });
  }
});

// Cadastrar doador
app.post("/api/doadores", exigirAdmin, async (req, res) => {
  try {
    const { nome, tipo_doador, email, telefone } = req.body;

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        mensagem: "Informe o nome do doador.",
      });
    }

    if (!["Pessoa física", "Empresa"].includes(tipo_doador)) {
      return res.status(400).json({
        mensagem: "Selecione um tipo de doador válido.",
      });
    }

    const [resultado] = await pool.execute(
      `INSERT INTO doadores
       (nome, tipo_doador, email, telefone)
       VALUES (?, ?, ?, ?)`,
      [nome.trim(), tipo_doador, email?.trim() || null, telefone?.trim() || null],
    );

    return res.status(201).json({
      mensagem: "Doador cadastrado com sucesso!",
      id_doador: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar doador:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao cadastrar doador.",
    });
  }
});

// Editar doador
app.put("/api/doadores/:id", exigirAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, tipo_doador, email, telefone } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Doador inválido.",
      });
    }

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        mensagem: "Informe o nome do doador.",
      });
    }

    if (!["Pessoa física", "Empresa"].includes(tipo_doador)) {
      return res.status(400).json({
        mensagem: "Selecione um tipo de doador válido.",
      });
    }

    if (
      (email !== undefined && email !== null && typeof email !== "string") ||
      (telefone !== undefined && telefone !== null && typeof telefone !== "string")
    ) {
      return res.status(400).json({
        mensagem: "E-mail ou telefone inválido.",
      });
    }

    const [doadores] = await pool.execute("SELECT id_doador FROM doadores WHERE id_doador = ?", [
      id,
    ]);

    if (doadores.length === 0) {
      return res.status(404).json({
        mensagem: "Doador não encontrado.",
      });
    }

    await pool.execute(
      `UPDATE doadores
       SET nome = ?, tipo_doador = ?, email = ?, telefone = ?
       WHERE id_doador = ?`,
      [nome.trim(), tipo_doador, email?.trim() || null, telefone?.trim() || null, id],
    );

    return res.json({
      mensagem: "Doador atualizado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao editar doador:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao atualizar doador.",
    });
  }
});

// Excluir doador
app.delete("/api/doadores/:id", exigirAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Doador inválido.",
      });
    }

    const [resultado] = await pool.execute("DELETE FROM doadores WHERE id_doador = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Doador não encontrado.",
      });
    }

    return res.json({
      mensagem: "Doador excluído com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir doador:", erro);

    if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({
        mensagem: "Este doador possui doações registradas e não pode ser excluído.",
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao excluir doador.",
    });
  }
});

// ==========================================
// CADASTRO E CONSULTA DE CATEGORIAS
// SOMENTE ADMINISTRADOR
// ==========================================

// Listar categorias
app.get("/api/categorias", exigirAdmin, async (req, res) => {
  try {
    const [categorias] = await pool.execute(
      `SELECT id_categoria, nome
       FROM categorias
       ORDER BY nome`,
    );

    res.json(categorias);
  } catch (erro) {
    console.error("Erro ao listar categorias:", erro);

    res.status(500).json({
      mensagem: "Erro ao consultar categorias.",
    });
  }
});

// Cadastrar categoria
app.post("/api/categorias", exigirAdmin, async (req, res) => {
  try {
    const { nome } = req.body;

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        mensagem: "Informe o nome da categoria.",
      });
    }

    const [resultado] = await pool.execute(
      `INSERT INTO categorias (nome)
       VALUES (?)`,
      [nome.trim()],
    );

    res.status(201).json({
      mensagem: "Categoria cadastrada com sucesso!",
      id_categoria: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar categoria:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Esta categoria já está cadastrada.",
      });
    }

    res.status(500).json({
      mensagem: "Erro ao cadastrar categoria.",
    });
  }
});

// ==========================================
// CADASTRO E CONSULTA DE INSUMOS
// SOMENTE ADMINISTRADOR
// ==========================================

// Listar insumos
app.get("/api/insumos", exigirAdmin, async (req, res) => {
  try {
    const [insumos] = await pool.execute(`
      SELECT
        insumos.id_insumo,
        insumos.nome,
        insumos.unidade,
        insumos.id_categoria,
        categorias.nome AS categoria
      FROM insumos
      LEFT JOIN categorias
        ON insumos.id_categoria = categorias.id_categoria
      ORDER BY insumos.nome
    `);

    res.json(insumos);
  } catch (erro) {
    console.error("Erro ao listar insumos:", erro);

    res.status(500).json({
      mensagem: "Erro ao consultar insumos.",
    });
  }
});

// Cadastrar insumo
app.post("/api/insumos", exigirAdmin, async (req, res) => {
  try {
    const { nome, unidade, id_categoria } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof unidade !== "string" ||
      !unidade.trim()
    ) {
      return res.status(400).json({
        mensagem: "Informe o nome e a unidade do insumo.",
      });
    }

    const categoriaId =
      id_categoria === "" || id_categoria === null || id_categoria === undefined
        ? null
        : Number(id_categoria);

    if (categoriaId !== null && (!Number.isInteger(categoriaId) || categoriaId <= 0)) {
      return res.status(400).json({
        mensagem: "Selecione uma categoria válida.",
      });
    }

    if (categoriaId !== null) {
      const [categorias] = await pool.execute(
        "SELECT id_categoria FROM categorias WHERE id_categoria = ?",
        [categoriaId],
      );

      if (categorias.length === 0) {
        return res.status(404).json({
          mensagem: "Categoria não encontrada.",
        });
      }
    }

    const [resultado] = await pool.execute(
      `INSERT INTO insumos
       (nome, unidade, id_categoria)
       VALUES (?, ?, ?)`,
      [nome.trim(), unidade.trim(), categoriaId],
    );

    res.status(201).json({
      mensagem: "Insumo cadastrado com sucesso!",
      id_insumo: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar insumo:", erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar insumo.",
    });
  }
});

// ==========================================
// ROTAS DE DOAÇÕES
// ==========================================

// REGISTRAR UMA DOAÇÃO
app.post("/api/doacoes", exigirAdmin, async (req, res) => {
  const { id_doador, data_doacao, observacao, insumos } = req.body;

  if (
    !Number.isInteger(Number(id_doador)) ||
    Number(id_doador) <= 0 ||
    !data_doacao ||
    !Array.isArray(insumos) ||
    insumos.length === 0
  ) {
    return res.status(400).json({
      mensagem: "Informe o doador, a data e pelo menos um insumo.",
    });
  }

  for (const item of insumos) {
    if (
      !Number.isInteger(Number(item.id_insumo)) ||
      Number(item.id_insumo) <= 0 ||
      !Number.isFinite(Number(item.quantidade)) ||
      Number(item.quantidade) <= 0
    ) {
      return res.status(400).json({
        mensagem: "Confira os insumos e as quantidades informadas.",
      });
    }
  }

  let conexao;

  try {
    conexao = await pool.getConnection();

    await conexao.beginTransaction();

    const [resultado] = await conexao.execute(
      `INSERT INTO doacoes (id_doador, data_doacao, observacao)
       VALUES (?, ?, ?)`,
      [Number(id_doador), data_doacao, observacao?.trim() || null],
    );

    const idDoacao = resultado.insertId;

    for (const item of insumos) {
      await conexao.execute(
        `INSERT INTO doacao_insumo (id_doacao, id_insumo, quantidade)
         VALUES (?, ?, ?)`,
        [idDoacao, Number(item.id_insumo), Number(item.quantidade)],
      );
    }

    await conexao.commit();

    return res.status(201).json({
      mensagem: "Doação registrada com sucesso!",
      id_doacao: idDoacao,
    });
  } catch (erro) {
    if (conexao) {
      await conexao.rollback();
    }

    console.error("Erro ao registrar doação:", erro);

    return res.status(400).json({
      mensagem: "Não foi possível registrar a doação. Confira os dados informados.",
    });
  } finally {
    if (conexao) {
      conexao.release();
    }
  }
});

// CONSULTAR HISTÓRICO DE DOAÇÕES
app.get("/api/doacoes", exigirAdmin, async (req, res) => {
  try {
    const [resultados] = await pool.execute(`
      SELECT
        d.id_doacao,
        d.data_doacao,
        d.observacao,
        doador.id_doador,
        doador.nome AS nome_doador,
        di.id_insumo,
        insumo.nome AS nome_insumo,
        insumo.unidade,
        di.quantidade
      FROM doacoes d
      INNER JOIN doadores doador
        ON d.id_doador = doador.id_doador
      LEFT JOIN doacao_insumo di
        ON d.id_doacao = di.id_doacao
      LEFT JOIN insumos insumo
        ON di.id_insumo = insumo.id_insumo
      ORDER BY d.data_doacao DESC, d.id_doacao DESC
    `);

    const doacoes = {};

    for (const linha of resultados) {
      if (!doacoes[linha.id_doacao]) {
        doacoes[linha.id_doacao] = {
          id_doacao: linha.id_doacao,
          data_doacao: linha.data_doacao,
          observacao: linha.observacao,
          id_doador: linha.id_doador,
          nome_doador: linha.nome_doador,
          insumos: [],
        };
      }

      if (linha.id_insumo !== null) {
        doacoes[linha.id_doacao].insumos.push({
          id_insumo: linha.id_insumo,
          nome_insumo: linha.nome_insumo,
          unidade: linha.unidade,
          quantidade: linha.quantidade,
        });
      }
    }

    return res.json(Object.values(doacoes));
  } catch (erro) {
    console.error("Erro ao consultar doações:", erro);

    return res.status(500).json({
      mensagem: "Erro ao consultar o histórico de doações.",
    });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`API Amigos de Patas rodando na porta ${PORT}`);
});
