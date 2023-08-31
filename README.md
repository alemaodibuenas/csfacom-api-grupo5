
**Documentação**

***Tecnologias usadas no projeto***

-   **Front-End**:


-   **Back-End**:

    -   NestJS 9.0

    -   MySQL

    -   TypeORM 0.3.11

    -   JWT

    -   Swagger

***Estrutura de pastas Front-End***

-   tsconfig.json

-   README.md

-   packge.json

-   Dockerfile

-   .gitlab-ci.yml

-   .gitignore

-   .eslintrc.json

-   .env.production


***Variáveis de ambiente:***

Os arquivos responsáveis para definir as variáveis de ambiente são:

-   **.env.production**: variáveis de ambiente para produção:

-   **.env.development**: variáveis de ambiente para desenvolvimento

Em Ambos arquivos deve ser definido as seguintes constantes:

REACT_APP_API_DEV=


***Estrutura de pastas Back-End.***

-   tsconfig.json

-   README.md

-   package.json

-   nest-cli.json

-   Dockerfile

-   .prettierrc

-   .gitlab-ci.yml

-   .gitignore

-   .env

-   Uploads

-   src

    -   auth

        -   authentication

        -   guards

        -   permissions

        -   rules

        -   strategies

        -   auth.controller.ts

        -   auth.module.ts

        -   auth.service.ts

    -   casl

    -   exceptions

    -   foto

    -   helpers

    -   logger

    -   paginate

    -   permissão

    -   resultado

    -   usuário

    -   pessoa

    -   app.controler.ts

    -   app.module.ts

    -   app.service.ts

    -   main.ts

***Detalhamento das pastas de módulos de Dados***

Dentro de cada pasta de modulo de dados temos a seguinte estrutura:

-   dto

-   entities

-   nome_modulo.controller.ts

-   nome_modulo.module.ts

-   nome_modulo.service.ts

***Detalhamento da estrutura Back-End.***

-   **Auth**: pasta com as tratativas JWT de autorização e permissões
    (guards);

-   **Exceptions:** pasta contendo regras para tratativas de erros;

-   **Foto:** pasta contendo a estrutura de dados e logica para o
    armazenamento de fotos;

-   **Helpers:** pasta contendo funções auxiliares para o projeto;

-   **Logger**: pasta contendo a estrutura de dados para o módulo de
    log's;

-   **Permissão**: pasta contendo a estrutura de dados para regras de
    permissão;

-   **Usuário**: pasta contendo a estrutura de dados para usuários

-   **Pessoaes**: pasta contendo a estrutura de dados para pessoaes:

***Variáveis de ambiente:***

Os arquivos responsáveis para definir as variáveis de ambiente são:

-   **.env**: variáveis de ambiente:

SECRET=+SUkrWvV36l+VaUBrpZtW8rRFMPQsSF+fYJWMaQ4raI=

SERVER_PORT=3001

DB_TYPE=mysql

DB_HOST=HOST DO BANCO

DB_PORT=3306

DB_USERNAME=root

DB_PASSWORD=SENHA DO BANCO

DB_DATABASE=

DB_SYNCHRONIZE=false

FILE_SIZE_MB=5

BUCKET_ACCESS_KEY_ID=

BUCKET_SECRET_ACCESS_KEY=

BUCKET_NAME=

BUCKET_ENDPOINT=us-east-1.linodeobjects.com

**Observação:** DB_SYNCHRONIZE = true -\> typeORM ON, False -\> TypeORM
OFF;

**Gerar um hash para o  jwt segura, cuidado ao colocar  em produção não
pode peder essa hash, se a hash for trocada terá que fazer update em
todas as senhas salvas.**

\`\`\`bash

\# Senha base64 de tamanho 32

\$ openssl rand -base64 32

PY6AZ36rLe7lSxh5JI0L9QyyLd7D9GLgX4x1exVLWNY=

\`\`\`

***Scripts disponíveis Back-End.***

-   **npm install**: instala todas as dependências do projeto;

-   **npm run start:dev**: inicia a aplicação em modo de
    desenvolvimento;

-   **nest build**: gera um build do projeto

**Observação:**\
para compilar o projeto siga os passos:

-   **npm install**

-   **npm run start:dev** (se for a primeira carga do projeto,
    certifique-se que o DB\_ SYNCHRONIZE esteja marcado com true. Assim
    o banco de dados será buildado do zero. Após isso pare a compilação
    e deixe o atributo marcado como false e rode novamente este comando
    para verificar se tudo estar correto);

-   **nest build**; após ter sucesso na compilação da aplicação e
    criação do banco em caso de primeira carga, rode este comando para
    gera a build de produção do projeto.

**NOTA SWAGGER:** A definição dos endpointes podem ser verificadas na
rota **URL/api.\
\
NOTA:** por padrão a aplicação rodará na porta 3001, localhost:3001.

**NOTA BANCO DE DADOS:** Está sendo usado banco MYSQL
