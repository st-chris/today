import { Pipe, PipeTransform } from '@angular/core';
import { TodoItem } from '@backend/models/todo';

@Pipe({
  name: 'todoDoneFilter',
})
export class TodoDoneFilterPipe implements PipeTransform {
  transform(todos: TodoItem[]) {
    return todos.filter((todo) => !todo.done);
  }
}
