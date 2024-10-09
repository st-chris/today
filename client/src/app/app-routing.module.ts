import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoIndexComponent } from './pages/todo-index/todo-index.component';
import { TodoComponent } from './pages/todo/todo.component';

const routes: Routes = [
  { path: '', component: TodoIndexComponent },
  { path: 'todo', component: TodoIndexComponent },
  { path: 'todo/:id', component: TodoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
