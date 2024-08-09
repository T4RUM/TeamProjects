import { Router } from "express";
import { Usuario } from "../models/usuario.js";
import { Equipe } from "../models/equipe.js";
import { Projeto } from "../models/projeto.js";
import { Tarefa } from "../models/tarefa.js";

export const projetosRouter = Router();

projetosRouter.get("/projetos", async (req, res) => {
    try {
        const listaProjetos = await Projeto.findAll({
            include: [Equipe, Tarefa, Usuario]
        });
        res.json(listaProjetos);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar projetos!", error: err.message });
    }
});

projetosRouter.get("/projetos/:id", async (req, res) => {
    try {
        const projeto = await Projeto.findOne({
            where: { id: req.params.id },
            include: [Equipe, Tarefa, Usuario]
        });

        if (projeto) {
            res.json(projeto);
        } else {
            res.status(404).json({ message: "Projeto não encontrado!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar o projeto!", error: err.message });
    }
});

projetosRouter.post("/projetos", async (req, res) => {
    const { nome, descricao, data_inicio, data_final, equipeId } = req.body;

    try {
        await Projeto.create({
            nome,
            descricao,
            data_inicio,
            data_final,
            equipeId // Certifique-se de que 'equipeId' está incluído no seu modelo Projeto
        });
        res.status(201).json({ message: "Projeto criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao criar o projeto!", error: err.message });
    }
});

projetosRouter.put("/projetos/:id", async (req, res) => {
    const idProjeto = req.params.id;
    const { nome, descricao, data_inicio, data_final } = req.body;

    try {
        const projeto = await Projeto.findOne({ where: { id: idProjeto } });

        if (projeto) {
            await projeto.update({ nome, descricao, data_inicio, data_final });
            res.json({ message: "Projeto atualizado com sucesso!" });
        } else {
            res.status(404).json({ message: "Projeto não encontrado!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar o projeto!", error: err.message });
    }
});

projetosRouter.delete("/projetos/:id", async (req, res) => {
    const idProjeto = req.params.id;

    try {
        const projeto = await Projeto.findOne({ where: { id: idProjeto } });

        if (projeto) {
            await projeto.destroy();
            res.json({ message: "Projeto removido com sucesso!" });
        } else {
            res.status(404).json({ message: "Projeto não encontrado!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erro ao excluir o projeto!", error: err.message });
    }
});
