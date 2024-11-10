# API-Notion
<br>

## Descrição

Este projeto é uma API que acessa um banco de dados no Notion, desenvolvido com NestJS. A API permite que usuários autenticados e não autenticados criem novos registros, atualizem, excluam e busquem por dados. A API também inclui autenticação JWT.

 </br>
  </br>
  

## Tecnologias Utilizadas


- **[NodeJS](https://nodejs.org/en/download/prebuilt-installer)**: Linguaguem backend  utilizada para desenvolvimento do projeto 
- **[TypeScript](https://www.typescriptlang.org/)**: É um superconjunto sintático estrito de JavaScript e adiciona tipagem estática opcional à linguagem
- **[NesjJS](https://nestjs.com/)**: é um framework Node.js de código aberto destinado ao desenvolvimento de aplicativos do lado do servidor
- **[Redis](https://redis.io/)**: armazena as informações em cache de forma temporaria.
- **[Docker](https://www.docker.com/)**: Utilizado para criar uma imagem Postgres, do kraked assim permitindo executar o banco de dados e tendo a execução da API Gateway mesmo sem instala-lo na maquina.
- **[Jest](https://jestjs.io/pt-BR/)**: Utilizado para criar uma imagem Postgres, assim permitindo executar o banco de dados mesmo sem instala-lo na maquina.

  <br>
   <br>
   
  
## Pré-requisitos

- Node.js (versão 22.11.0 ou superior)
- ter Docker instalado na maquina e Docker Compose
- PostgreSQL (ou outro banco de dados compatível com Prisma)

 </br>
  </br>

  
## Funcionalidades
   
   Autenticação de Usuários:
   - Registro: Permite que novos usuários se registrem.
   - Login: Permite que usuários existentes façam login e obtenham um token JWT com duração de 1 dia.
     
   </br>
    
   Encurtamento de URLs:
   - Listagem de dados por ID: Usuários autenticados e não autenticados podem listar os dados com base no ID especifico de um registro.
   - Listagem de todos os dados: Usuários autenticados e não autenticados  podem listar todos os dados armazenados no banco.
   - Inclusão de dados: permite a criação de novos dados no banco do Notion.
   - Atualização de dados: Usuários podem atualizar os dados do banco com base em um ID especifico.
   - Exclusão de URLs: Usuários podem excluir dados Com base em um ID especifico.

    
  </br>
  



  </br>
 
   Swagger: Documentação interativa da API pode acessada pela url: http://localhost:3000/api, isso depois de estar com aplicação em execução é claro.
   
  </br>
  
   Endpoints:

  ## Execute o acesso as rotas pela API Swagger, ou utilize PostMan ou Insomnia por exemplo, outra coisa a autentificação é opcional caso não queira realiza-la pode utilizar as rotas sem a necessidade de inserir um token, abaixo deixarei um exemplo para execução de cada rota da API.
   
   - Registro de Usuário: POST /auth/register

       ```bash
           POST http://localhost:3000/auth/register

          body:
          '{
            "email":"test@example.com", 
            "password": "password123"
          }'
       ```
       
     
   - Login de Usuário: POST /auth/login

      ```bash
             POST http://localhost:3000/auth/login  
          
          body:
          '{
              "email": "test@example.com", 
              "password": "password123"
          }'
      ```   

     
   - Inserir dados no banco: POST /notion

      ```bash
           POST http://localhost:3000/notion 
        
          Headers: "Authorization: Bearer <seu_token_jwt>" 
        
          body:
              '{
                  "company":"microsoft-IA",
                  "campaign": "dell",
                  "description":"update",
                  "language": "portugues",
                  "plannedDate": "2024-11-10",
                  "where": "link",
                  "content":"teste2",
                  "image": "Imagem sobre programação",
                  "image-content": "https://img.freepik.com/fotos-gratis/codificacao-de-programa-de-computador-na-tela_53876-138060.jpg?semt=ais_hybrid"
              }'
      ```
      
     
   - Listar todos os dados do banco: GET /notion

        ```bash
             GET http://localhost:3000/notion
             headers: Authorization: Bearer <seu_token_jwt>"
        ```
     
   - Listar dados por um ID especifico  GET /notion/:id

       ```bash
            GET http://localhost:3000/notion/id
            headers: Authorization: Bearer <seu_token_jwt>"
       ```
       
   - Atualizar dados com base em ID  especifico: PUT /notion/:id
     
     ```bash
         PUT http://localhost:3000/notion/<id>
         headers: "Authorization: Bearer <seu_token_jwt>"
         body:
              '{
                  "company":"microsoft-IA",
                  "campaign": "dell",
                  "description":"update",
                  "language": "portugues",
                  "plannedDate": "2024-11-10",
                  "where": "link",
                  "content":"teste2",
                  "image": "Imagem sobre programação",
                  "image-content": "https://img.freepik.com/fotos-gratis/codificacao-de-programa-de-computador-na-tela_53876-138060.jpg?semt=ais_hybrid"
              }'
     ```    

   
   - Excluir dados com base em ID  especifico: DELETE /notion/:id

       ```bash
          DELETE http://localhost:3000/notion/<id>
          headers: "Authorization: Bearer <seu_token_jwt>"
       ```

<br>
## Instalação


Siga as etapas para instalar e executar o projeto localmente:


</br>

   1. Clone o repositório:
   
      ```bash
         git clone https://github.com/hcinfo9/API-Notion.git
      ```

   </br>
   
   2. Acesse o diretório do projeto:
      
      ```bash
         cd API-Notion
      ```
      
   </br>
   
   3. Instale as dependências:
       
      ```bash
         npm install
      ```
      
   </br>
   
   4. Cria e inicie o container docker rodando o Servidor Node com NestJS:
   
       ```bash
         docker-compose up --build
      ```
   </br>
   

</br>

  5. Criar um Arquivo com as variaveis de ambiente:
      - Não esquecer de alterar a variavél da API do Notion, do ID do Banco.
     
 ````bash
   - o arquivo de conter a seguinte nomenclatura: .env
   - e deve conter as variaveis de ambiente que estão no arquivo .env.example.
 ````

<br>

## Estrutura do Projeto:
   ```bash
      src/: Contém o código-fonte do projeto.

      auth/: Módulo de autenticação.

      notion/: Módulo de rotas da API, Controller, e services.

      redis/: Configuração do Redis.

      interface/: Interfaces usadas no projeto.

      docker-compose.yml: Configuração do Docker Compose.

      Dockerfile: Configuração do Docker.

      package.json: Dependências e scripts do projeto.

      README.md: Documentação do projeto.

   ```

</br>


