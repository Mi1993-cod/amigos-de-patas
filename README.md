# 🐾 Amigos de Patas

Sistema web de gestão para uma ONG de proteção animal, desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas (ADS), da Universidade de Marília (UNIMAR).

## 1. Sobre o projeto

O **Amigos de Patas** tem como objetivo auxiliar uma organização de proteção animal na divulgação de animais para adoção e no gerenciamento de suas atividades administrativas.

O sistema permite cadastrar animais, receber solicitações de adoção, administrar doadores, controlar insumos e registrar doações.

## 2. Funcionalidades

### Área pública

- Visualização dos animais cadastrados.
- Exibição das informações dos animais.
- Formulário para solicitação de adoção.
- Envio de solicitações para análise da administração.

### Área administrativa

- Login de administrador com autenticação JWT.
- Cadastro de animais.
- Consulta das solicitações de adoção.
- Aprovação e cancelamento de solicitações.
- Cadastro, consulta, edição e exclusão de doadores.
- Cadastro e consulta de categorias de insumos.
- Cadastro e consulta de insumos.
- Registro de doações vinculadas aos doadores.
- Registro de um ou mais insumos por doação.
- Controle das quantidades recebidas.
- Histórico de doações.
- Proteção do histórico, impedindo a exclusão de doadores que possuam doações vinculadas.

## 3. Tecnologias utilizadas

**Frontend**

- HTML5
- CSS3
- JavaScript
- Vite+

**Backend**

- Node.js
- Express
- Dotenv
- JSON Web Token (jsonwebtoken)

**Banco de dados**

- MySQL
- mysql2

**Segurança**

- bcryptjs para geração e verificação de hashes de senhas.
- jsonwebtoken para autenticação com JWT.
- Variáveis de ambiente para proteger informações sensíveis.

**Gerenciamento de pacotes**

- pnpm

## 4. Requisitos para executar o projeto

Antes de iniciar, é necessário possuir:

- Node.js instalado.
- pnpm instalado (versão 12.18.0 utilizada no projeto).
- MySQL instalado e em execução.
- MySQL Workbench (recomendado).
- Visual Studio Code (recomendado).

## 5. Instalação

Clone o repositório:

```bash
git clone https://github.com/Mi1993-cod/amigos-de-patas.git
```

Entre na pasta do projeto:

```bash
cd amigos-de-patas
```

Instale as dependências:

```bash
pnpm install
```

## 6. Configuração do banco de dados

O projeto utiliza MySQL.

Os arquivos de banco de dados estão localizados na pasta `database`:

- `schema.sql`: criação da estrutura principal do banco.
- `schema_test.sql`: criação da estrutura destinada a testes.
- `migration_jwt.sql`: criação da tabela necessária para autenticação administrativa.

### Atenção antes de executar os arquivos SQL

O arquivo `schema.sql` contém o comando:

```sql
DROP DATABASE IF EXISTS amigos_de_patas;
```

Esse comando apaga o banco principal existente antes de recriá-lo.

**Execute o `schema.sql` somente na primeira instalação, quando for realmente necessário criar o banco do zero e não houver dados que precisem ser preservados.**

Nunca execute esse arquivo novamente sobre um banco que já contenha dados importantes. Faça backup antes de qualquer alteração na estrutura.

O arquivo `schema_test.sql` também contém um comando `DROP DATABASE`, mas atua sobre o banco separado `amigos_de_patas_teste`. Utilize-o somente quando desejar recriar esse banco de testes.

### Ordem de configuração para uma instalação nova

1. Abra o MySQL Workbench e conecte-se ao servidor MySQL.
2. Abra o arquivo `database/schema.sql` e execute-o somente para criar o banco principal do zero.
3. Abra o arquivo `database/migration_jwt.sql`.
4. Antes de executar a migração, selecione o banco `amigos_de_patas` no Workbench ou execute:

```sql
USE amigos_de_patas;
```

5. Execute o conteúdo de `migration_jwt.sql` para criar a tabela `usuario`.

A migração utiliza `CREATE TABLE IF NOT EXISTS`, portanto não recria a tabela caso ela já exista.

O projeto não possui arquivo `seed.sql`. Os dados podem ser cadastrados pelo próprio sistema.

## 7. Configuração das variáveis de ambiente

Na pasta principal do projeto, crie um arquivo chamado `.env`, utilizando o `.env.example` como modelo.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis conforme seu ambiente:

```env
PORT=3000

DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=amigos_de_patas
DB_PORT=3306

JWT_SECRET=coloque_uma_chave_secreta_forte
JWT_EXPIRES_IN=8h
```

Substitua os valores de exemplo pelos dados da sua instalação.

**Importante:** utilize uma chave JWT forte e exclusiva. Não compartilhe o arquivo `.env` nem envie senhas ou chaves secretas ao GitHub.

O arquivo `.gitignore` está configurado para ignorar os arquivos de ambiente, mantendo o `.env.example` disponível como modelo.

## 8. Criação do administrador e acesso de demonstração

Após configurar o banco de dados e as variáveis de ambiente, utilize o script:

```bash
node server/criar-admin.js
```

O script solicita os dados do administrador e armazena a senha em formato de hash utilizando bcryptjs.

Execute-o para cadastrar o administrador no banco de dados utilizado na instalação.

**Dados de acesso de demonstração:**

- E-mail: `admin@amigosdepatas.com`
- Senha: fornecida separadamente para fins de avaliação.

A senha não deve ser publicada no repositório GitHub.

**Importante:** cada instalação do projeto possui seu próprio banco de dados. Portanto, o administrador deve ser cadastrado no banco local utilizando o script acima.

## 9. Como executar o projeto

É necessário abrir dois terminais na pasta principal do projeto.

**Terminal 1 — Iniciar a API:**

```bash
node server/index.js
```

A API será iniciada na porta 3000.

Mensagem esperada:

```text
API Amigos de Patas rodando na porta 3000
```

**Terminal 2 — Iniciar o frontend:**

```bash
pnpm dev
```

Acesse o endereço apresentado pelo terminal. Normalmente:

```text
http://localhost:5173/
```

Caso a porta 5173 esteja ocupada, o Vite+ poderá utilizar outra porta disponível, como 5174 ou 5175.

## 10. Rotas da API

A API disponibiliza as seguintes rotas:

| Método | Rota                      | Acesso        |
| ------ | ------------------------- | ------------- |
| POST   | `/api/admin/login`        | Público       |
| GET    | `/api/admin/me`           | Administrador |
| POST   | `/api/admin/logout`       | Público       |
| GET    | `/api/health`             | Público       |
| GET    | `/api/db-health`          | Público       |
| GET    | `/api/animais`            | Público       |
| POST   | `/api/animais`            | Administrador |
| POST   | `/api/adocoes`            | Público       |
| GET    | `/api/adocoes`            | Administrador |
| PUT    | `/api/adocoes/:id/status` | Administrador |
| GET    | `/api/doadores`           | Administrador |
| POST   | `/api/doadores`           | Administrador |
| PUT    | `/api/doadores/:id`       | Administrador |
| DELETE | `/api/doadores/:id`       | Administrador |
| GET    | `/api/categorias`         | Administrador |
| POST   | `/api/categorias`         | Administrador |
| GET    | `/api/insumos`            | Administrador |
| POST   | `/api/insumos`            | Administrador |
| POST   | `/api/doacoes`            | Administrador |
| GET    | `/api/doacoes`            | Administrador |

As rotas administrativas protegidas exigem um token JWT válido no cabeçalho `Authorization`, no formato:

```text
Authorization: Bearer SEU_TOKEN
```

A exclusão de doadores que possuam doações vinculadas é impedida para preservar o histórico de doações.

## 11. Autenticação e segurança

A autenticação administrativa utiliza JSON Web Token (JWT).

O funcionamento contempla:

- Verificação de e-mail e senha.
- Senhas armazenadas com hash utilizando bcryptjs.
- Emissão de token JWT após autenticação válida.
- Envio do token nas requisições administrativas pelo cabeçalho `Authorization`.
- Proteção das rotas administrativas por middleware.
- Expiração do token configurada para 8 horas por padrão.
- Remoção do token no logout.

O frontend utiliza `localStorage` para armazenar o token durante a sessão.

## 12. Testes e compilação

Para verificar o projeto, utilize:

**Verificação e correção de formatação:**

```bash
vp check --fix
```

**Verificação de código:**

```bash
vp check
```

**Compilação de produção:**

```bash
pnpm build
```

**Visualização da versão compilada:**

```bash
pnpm preview
```

## 13. Backup do banco de dados

Recomenda-se realizar backups periódicos do banco MySQL, principalmente antes de alterações na estrutura das tabelas.

Exemplo de backup pelo terminal:

```bash
mysqldump -u seu_usuario_mysql -p amigos_de_patas > backup_amigos_de_patas.sql
```

O comando solicitará a senha do MySQL. O arquivo gerado poderá ser utilizado para restaurar os dados em caso de necessidade.

## 14. Identificação acadêmica

**Projeto:** Amigos de Patas

**Curso:** Análise e Desenvolvimento de Sistemas (ADS)

**Instituição:** Universidade de Marília (UNIMAR)

**Finalidade:** Projeto acadêmico desenvolvido para as atividades práticas do curso.

---

Desenvolvido com dedicação para contribuir com a proteção animal e incentivar a adoção responsável. 🐾
