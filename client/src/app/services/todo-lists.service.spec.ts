import { TestBed } from '@angular/core/testing';

import { TodoListsService } from './todo-lists.service';
import { HttpClientModule } from '@angular/common/http';

describe('TodoListsService', () => {
  let service: TodoListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TodoListsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
