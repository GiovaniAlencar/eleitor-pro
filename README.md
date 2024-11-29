# Eleitor Pro

Sistema de gerenciamento de eleitores e lideranças políticas.

## 🚀 Estrutura do Projeto

O projeto é dividido em duas partes:

### Frontend (React + TypeScript)
- Interface moderna e responsiva
- Gerenciamento de estado com React Hooks
- Estilização com Tailwind CSS
- Mapas interativos com Mapbox GL
- Ícones com Lucide React

### Backend (Laravel)
- API RESTful
- Autenticação com Laravel Sanctum
- Banco de dados MySQL
- CORS configurado

## 💻 Pré-requisitos

Antes de começar, verifique se você tem os seguintes requisitos:

- Node.js 18 ou superior
- PHP 8.1 ou superior
- MySQL 5.7 ou superior
- Composer (gerenciador de pacotes PHP)
- Git

## 🔧 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/eleitor-pro.git
cd eleitor-pro
```

### 2. Frontend (React)

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 3. Backend (Laravel)

```bash
# Entre na pasta da API
cd api

# Instale as dependências do PHP
composer install

# Copie o arquivo de ambiente
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Configure o banco de dados no arquivo .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eleitor_pro
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha

# Execute as migrações
php artisan migrate

# Inicie o servidor
php artisan serve
```

O backend estará disponível em `http://localhost:8000`

### 4. Configuração do Frontend

Crie um arquivo `.env` na raiz do projeto frontend com as seguintes variáveis:

```env
VITE_API_URL=http://localhost:8000/api
VITE_MAPBOX_TOKEN=seu_token_do_mapbox
```

## 📱 Funcionalidades

- **Dashboard**: Visão geral dos dados
- **Lideranças**: Cadastro e gestão
- **Eleitores**: Cadastro e gestão
- **Mapa Eleitoral**: Visualização geográfica
- **Configurações**: Perfil e sistema

## 🗂️ Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/        # Páginas da aplicação
│   ├── services/     # Serviços e API
│   └── utils/        # Funções utilitárias
└── public/          # Arquivos estáticos

api/
├── app/
│   ├── Http/Controllers/  # Controladores
│   ├── Models/           # Modelos
│   └── Services/         # Serviços
└── routes/
    └── api.php          # Rotas da API
```

## 🛠️ Comandos Úteis

### Frontend
```bash
npm run dev     # Inicia servidor de desenvolvimento
npm run build   # Gera build de produção
npm run preview # Visualiza build de produção
```

### Backend
```bash
php artisan serve   # Inicia servidor de desenvolvimento
php artisan migrate # Executa migrações
php artisan db:seed # Popula banco de dados
```

## 🔒 Segurança

- Autenticação via Laravel Sanctum
- Proteção CSRF
- Validação de formulários
- Sanitização de dados
- Proteção XSS

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ❗ Solução de Problemas

### Erro de Versão do PHP
Se você encontrar erros relacionados à versão do PHP, certifique-se de:

1. Ter o PHP 8.1 ou superior instalado
2. Configurar o PHP corretamente no path do sistema
3. Verificar a versão com `php -v`

### Erro de Dependências
Se encontrar erros ao instalar dependências:

1. Limpe o cache do Composer:
```bash
composer clear-cache
```

2. Remova o diretório vendor e reinstale:
```bash
rm -rf vendor
composer install
```

### Erro de Conexão com Banco
Se encontrar erros de conexão com o banco de dados:

1. Verifique se o MySQL está rodando
2. Confirme as credenciais no `.env`
3. Crie o banco de dados manualmente:
```sql
CREATE DATABASE eleitor_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erro de CORS
Se encontrar erros de CORS:

1. Verifique as configurações no arquivo `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Para mais ajuda, abra uma issue no repositório do projeto.