import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pool from "./db.js";
import readline from "node:readline";
import { stdin, stdout } from "node:process";

dotenv.config();

const rl = readline.createInterface({ input: stdin, output: stdout });

function perguntar(pergunta) {
  return new Promise((resolve) => rl.question(pergunta, resolve));
}

function perguntarSenha() {
  return new Promise((resolve) => {
    stdout.write("Crie uma senha (mínimo 8 caracteres): ");
    let senha = "";

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    function receber(tecla) {
      if (tecla === "\u0003") {
        stdin.setRawMode(false);
        rl.close();
        process.exit(1);
      }

      if (tecla === "\r" || tecla === "\n") {
        stdin.setRawMode(false);
        stdin.removeListener("data", receber);
        stdout.write("\n");
        resolve(senha);
        return;
      }

      if (tecla === "\u007f" || tecla === "\b") {
        senha = senha.slice(0, -1);
        return;
      }

      if (tecla >= " " && tecla <= "~") {
        senha += tecla;
      }
    }

    stdin.on("data", receber);
  });
}

try {
  if (!stdin.isTTY) {
    throw new Error("Execute pelo terminal interativo do VS Code.");
  }

  const nome = await perguntar("Nome do administrador: ");
  const email = await perguntar("E-mail do administrador: ");
  const senha = await perguntarSenha();

  if (!nome.trim() || !email.trim() || !senha) {
    throw new Error("Preencha todos os campos.");
  }

  if (senha.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres.");
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await pool.execute(
    `INSERT INTO usuario (nome, email, senha_hash)
     VALUES (?, ?, ?)`,
    [nome.trim(), email.trim().toLowerCase(), senhaHash],
  );

  console.log("Administrador cadastrado com sucesso!");
} catch (error) {
  console.error("Não foi possível cadastrar:", error.message);
} finally {
  stdin.setRawMode?.(false);
  rl.close();
  await pool.end();
}
