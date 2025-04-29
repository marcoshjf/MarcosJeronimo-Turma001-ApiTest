import pactum from 'pactum';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

const p = pactum;
const baseUrl = 'https://shrimo.com/fake-api';
// let idTodo = '';

p.request.setDefaultTimeout(10000);


it('Deve criar uma nova tarefa com dados válidos', async () => {
  await p
    .spec()
    .post(`${baseUrl}/todos`)
    .withJson({
      title: 'Estudar Pactum',
      description: 'Estudar testes de API com PactumJS',
      dueDate: '2025-05-05',
      priority: 'Alta',
      status: 'Não Iniciado',
      tags: ['Testes', 'Pactum']
    })
    .expectStatus(StatusCodes.OK)
    .expectJsonLike({
      title: 'Estudar Pactum'
    });
});


describe('Shrimo Todos API', () => {
  it('Deve retornar a lista de tarefas', async () => {
    await p
      .spec()
      .get(`${baseUrl}/todos`)
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'array'
      });
  });
});

it('Deve criar uma tarefa apenas com título e descrição', async () => {
  await p
    .spec()
    .post(`${baseUrl}/todos`)
    .withJson({
      title: 'Tarefa simples',
      description: 'Sem data nem tags'
    })
    .expectStatus(StatusCodes.OK);
});

it('Deve aceitar tarefa sem título (API fake permite)', async () => {
  await p
    .spec()
    .post(`${baseUrl}/todos`)
    .withJson({
      description: 'Falta título',
      dueDate: '2025-06-01',
      priority: 'Média',
      status: 'Em Andamento',
      tags: ['bug']
    })
    .expectStatus(StatusCodes.OK); // API não valida isso
});

it('Deve retornar uma tarefa com ID simulado', async () => {
  await p
    .spec()
    .get(`${baseUrl}/todos/1`)
    .expectStatus(StatusCodes.OK);
});


it('Deve retornar sucesso mesmo com ID inexistente (fake API)', async () => {
  await p
    .spec()
    .get(`${baseUrl}/todos/999999`)
    .expectStatus(StatusCodes.OK); // Não retorna 404
});


it('Deve deletar uma tarefa (simulado)', async () => {
  await p
    .spec()
    .delete(`${baseUrl}/todos/1`)
    .expectStatus(StatusCodes.OK);
});


it('Deve deletar mesmo que o ID não exista (fake)', async () => {
  await p
    .spec()
    .delete(`${baseUrl}/todos/abc123`)
    .expectStatus(StatusCodes.OK);
});


it('Deve aceitar tarefa com lista de tags vazia', async () => {
  await p
    .spec()
    .post(`${baseUrl}/todos`)
    .withJson({
      title: 'Tarefa sem tags',
      description: 'Teste com array de tags vazio',
      tags: []
    })
    .expectStatus(StatusCodes.OK);
});

it('Deve aceitar tarefa com campos desconhecidos (API tolerante)', async () => {
  await p
    .spec()
    .post(`${baseUrl}/todos`)
    .withJson({
      title: 'Tarefa com extra',
      description: 'Teste com campo inesperado',
      extra: 'valor inválido'
    })
    .expectStatus(StatusCodes.OK); // A API não valida contra campos desconhecidos
});


