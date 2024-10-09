import * as mongodb from 'mongodb';
import { TodoItem } from './todo';

export interface List {
  _id?: mongodb.ObjectId | string;
  name: string;
  items: TodoItem[];
  color: string;
}
