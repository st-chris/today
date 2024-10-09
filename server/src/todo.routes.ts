import * as express from 'express';
import * as mongodb from 'mongodb';
import { collections } from './database';

export const todoRouter = express.Router();
todoRouter.use(express.json());

todoRouter.get('/', async (_req, res) => {
  try {
    const todoLists = await collections.todolists.find({}).toArray();
    res.status(200).send(todoLists);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

todoRouter.get('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const list = await collections.todolists.findOne(query);

    if (list) {
      res.status(200).send(list);
    } else {
      res.status(404).send(`Failed to find a list: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find a list: ID ${req?.params?.id}`);
  }
});

todoRouter.post('/', async (req, res) => {
  try {
    const todolist = req.body;
    const result = await collections.todolists.insertOne(todolist);

    if (result.acknowledged) {
      res.status(201).send(`Created a new list: ID ${result.insertedId}.`);
    } else {
      res.status(500).send('Failed to create a new list.');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

todoRouter.put('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const list = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.todolists.updateOne(query, {
      $set: {
        name: list.name,
        items: list.items,
        color: list.color,
      },
    });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated a list: ID ${id}.`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find a list: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update a list: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

todoRouter.delete('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await collections.todolists.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed a list: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove a list: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find a list: ID ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
