# Task Manager API

API para gerenciamento de tarefas, construída com Node.js (NestJS) e MySQL.

---

## Descrição

Este projeto é uma API RESTful para gerenciamento de tarefas, permitindo criação, leitura, atualização e exclusão (CRUD) de tarefas vinculadas a usuários. Utiliza MySQL como banco de dados e está configurado para rodar via Docker com Docker Compose.

---

## Tecnologias utilizadas

- Node.js 20 (imagem oficial Alpine)
- NestJS (framework Node.js)
- MySQL 5.7
- Docker e Docker Compose

---

## Como rodar o projeto

### Pré-requisitos

- Docker instalado e funcionando
- Docker Compose instalado

### Passos

1. Clone este repositório:

```bash
git clone https://github.com/mumbx/task-manager.git
cd task-manager
```

2. No diretório principal, rode o comando para subir o ambiente docker

```bash
docker-compose up  
```

3. Após o termino da instalação, acesse localhost:9000/register

4. Para rodar os teste do controller "TASKS" execute os domandos abaixo

```bash
cd backend
npx jest tasks.controller.spec.ts
```
