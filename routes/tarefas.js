import { Router } from 'express';
import { Tarefa } from '../models/tarefa.js';
import { Projeto } from '../models/projeto.js';
import { Usuario } from '../models/usuario.js';

export const tarefasRouter = Router();

// Endpoint para obter todas as tarefas
tarefasRouter.get('/tarefas', async (req, res) => {
  try {
    const listaTarefas = await Tarefa.findAll({
      include: [
        { model: Projeto, as: 'projeto' }, // Certifique-se de que o alias está correto
        { model: Usuario, as: 'usuarios' }
      ]
    });
    res.json(listaTarefas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tarefas!', error: err.message });
  }
});

// Endpoint para obter uma tarefa específica por ID
tarefasRouter.get('/tarefas/:id', async (req, res) => {
  try {
    const tarefa = await Tarefa.findOne({
      where: { id: req.params.id },
      include: [
        { model: Projeto, as: 'projeto' }, // Certifique-se de que o alias está correto
        { model: Usuario, as: 'usuarios' }
      ]
    });

    if (tarefa) {
      res.json(tarefa);
    } else {
      res.status(404).json({ message: 'Tarefa não encontrada!' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar a tarefa!', error: err.message });
  }
});

// Endpoint para criar uma nova tarefa
tarefasRouter.post('/tarefas', async (req, res) => {
  const { titulo, descricao, status, data_criacao, data_conclusao, projetoId, nomeProjeto, usuarios } = req.body;

  try {
    const tarefa = await Tarefa.create({
      titulo,
      descricao,
      status,
      data_criacao,
      data_conclusao,
      projetoId,
      nomeProjeto // Adicionado o nome do projeto
    });

    if (usuarios && usuarios.length > 0) {
      await tarefa.setUsuarios(usuarios); // Associando usuários à tarefa
    }

    res.status(201).json({ message: 'Tarefa criada com sucesso!', tarefa });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar a tarefa!', error: err.message });
  }
});

// Endpoint para atualizar uma tarefa existente
tarefasRouter.put('/tarefas/:id', async (req, res) => {
  const idTarefa = req.params.id;
  const { titulo, descricao, status, data_criacao, data_conclusao, projetoId, nomeProjeto, usuarios } = req.body;

  try {
    const tarefa = await Tarefa.findOne({ where: { id: idTarefa } });

    if (tarefa) {
      await tarefa.update({ titulo, descricao, status, data_criacao, data_conclusao, projetoId, nomeProjeto });

      if (usuarios && usuarios.length > 0) {
        await tarefa.setUsuarios(usuarios); // Associando usuários à tarefa
      }

      res.json({ message: 'Tarefa atualizada com sucesso!', tarefa });
    } else {
      res.status(404).json({ message: 'Tarefa não encontrada!' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar a tarefa!', error: err.message });
  }
});

// Endpoint para deletar uma tarefa existente
tarefasRouter.delete('/tarefas/:id', async (req, res) => {
  const idTarefa = req.params.id;

  try {
    const tarefa = await Tarefa.findOne({ where: { id: idTarefa } });

    if (tarefa) {
      await tarefa.destroy();
      res.json({ message: 'Tarefa removida com sucesso!' });
    } else {
      res.status(404).json({ message: 'Tarefa não encontrada!' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir a tarefa!', error: err.message });
  }
});
