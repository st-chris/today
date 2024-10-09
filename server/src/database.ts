import * as mongodb from 'mongodb';
import { List } from './api/models/list';

export const collections: {
  todolists?: mongodb.Collection<List>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  const db = client.db('today');
  await applySchemaValidation(db);

  const todolistsCollection = db.collection<List>('todolists');
  collections.todolists = todolistsCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'position', 'level'],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: 'string',
          description: "'name' is required and is a string",
        },
        color: {
          bsonType: 'string',
          description: "'color' is required and is a string",
          minLength: 6,
        },
        items: {
          bsonType: ['array'],
          minItems: 0,
          items: {
            bsonType: ['object'],
            required: ['text', 'color', 'done'],
            additionalProperties: false,
            description: "'todo items' must contain the stated fields.",
            properties: {
              text: {
                bsonType: 'string',
                description: "'text' is required and is a string",
              },
              color: {
                bsonType: 'string',
                description: "'color' is required and is a string",
                minLength: 6,
              },
              done: {
                bsonType: 'bool',
                description: "'color' is required and is a string",
              },
            },
          },
        },
      },
    },
  };

  await db
    .command({
      collMod: 'employees',
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('employees', { validator: jsonSchema });
      }
    });
}
