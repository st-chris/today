import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoComponent } from './todo.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { TodoListsService } from 'src/app/services/todo-lists.service';
import { HttpClientModule } from '@angular/common/http';
import { List } from '@backend/models/list';
import { ColorService } from 'src/app/services/color.service';

describe('TodoComponent', () => {
  const items = [
    {
      text: 'item a',
      color: '#febc82',
      done: false,
    },
    {
      text: 'item b',
      color: '#fecb02',
      done: false,
    },
    {
      text: 'item c',
      color: '#02c8f5',
      done: false,
    },
    {
      text: 'item d',
      color: '#fecb02',
      done: false,
    },
    {
      text: 'item e',
      color: '#ff5503',
      done: false,
    },
    {
      text: 'item f',
      color: '#fecb02',
      done: false,
    },
  ];
  const dummyList: List = {
    name: 'Dummy',
    items,
    color: '#FFFFFF',
  };
  const dummyList2: List = {
    name: 'Dummy2',
    items: [
      {
        text: 'item a',
        color: '#febc82',
        done: false,
      },
      {
        text: 'item b',
        color: '#fecb02',
        done: false,
      },
    ],
    color: '#FFFFFF',
  };
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoListsService: TodoListsService;
  let colorService: ColorService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoComponent, HeaderComponent, FooterComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => of({ id: 12 }),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todoListsService = TestBed.inject(TodoListsService);
    colorService = TestBed.inject(ColorService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate home if getting list gives error', () => {
    spyOn(todoListsService, 'getList').and.returnValue(
      throwError(() => new Error())
    );
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  describe('Handle list', () => {
    beforeEach(async () => {
      spyOn(todoListsService, 'getList').and.returnValue(of(dummyList));
      fixture.detectChanges();
    });

    it('should get list back and handle it', () => {
      expect(component.todoList).toBe(dummyList);
    });

    it('should update counts of list', () => {
      expect(component.updateCounts(dummyList2)).toEqual([0, 2]);
      dummyList2.items[0].done = true;
      dummyList2.items[1].done = true;
      expect(component.updateCounts(dummyList2)).toEqual([2, 0]);
    });

    it('should add item to list', () => {
      spyOn(colorService, 'getRandomColor').and.returnValue('#fecb02');
      component.addItem('item g');
      dummyList.items.push({ text: 'item g', color: '#fecb02', done: false });

      expect(component.todoList).toEqual(dummyList);
      expect(
        component.todoList.items[component.todoList.items.length - 1]
      ).toEqual(dummyList.items[dummyList.items.length - 1]);
    });

    it('should mark item as done', () => {
      const item = { text: 'item g', color: '#fecb02', done: false };
      component.onClickItem(item);

      expect(item.done).toEqual(true);
    });

    it('should delete item', () => {
      component.onDelItem(1);
      dummyList.items.splice(1, 0);

      expect(component.todoList).toEqual(dummyList);
    });
  });

  describe('Handle dialogs', () => {
    beforeEach(async () => {
      spyOn(todoListsService, 'getList').and.returnValue(of(dummyList));
      fixture.detectChanges();
    });

    it('should edit item in list', () => {
      component.todoList.items = items;
      const editItem = { text: 'item g edit', color: '#fecb02', done: false };
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () =>
          of({
            name: 'item g edit',
            color: '#fecb02',
            isEdit: true,
            titleText: 'Edit todo item',
          }),
      } as MatDialogRef<unknown>);

      component.openDialog(editItem, component.todoList.items.length - 1);
      expect(component.dialog).toBeDefined();

      expect(
        component.todoList.items[component.todoList.items.length - 1].text
      ).toEqual(editItem.text);
    });

    it('should empty list', () => {
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as MatDialogRef<unknown>);

      component.openConfirmDialog();
      expect(component.dialog).toBeDefined();

      expect(component.todoList.items).toEqual([]);
    });
  });
});
