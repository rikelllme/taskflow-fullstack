## Como rodar o projeto

1. Instalar dependências:

npm install

2. Rodar migrações do Prisma:

npx prisma migrate dev

3. Rodar o servidor:

npm run start:dev

O servidor estará rodando em http://localhost:3000

## Exemplos de requests

### Criar tarefa

POST /tasks

```json
{
  "title": "Minha tarefa",
  "description": "Descrição",
  "priority": "HIGH",
  "status": "PENDING",
  "categoryIds": []
}
```

### Listar tarefas

GET /tasks

GET /tasks?status=PENDING

GET /tasks?priority=HIGH

GET /tasks?categoryId=uuid

### Atualizar tarefa

PATCH /tasks/:id

```json
{
  "title": "Novo título"
}
```

### Atualizar status

PATCH /tasks/:id/status

```json
{
  "status": "DONE"
}
```

### Deletar tarefa

DELETE /tasks/:id