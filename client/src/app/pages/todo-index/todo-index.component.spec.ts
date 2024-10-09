import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoIndexComponent } from './todo-index.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { TodoListsService } from 'src/app/services/todo-lists.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { List } from '@backend/models/list';
import { of, throwError } from 'rxjs';
import { ColorService } from 'src/app/services/color.service';

describe('TodoIndexComponent', () => {
  let component: TodoIndexComponent;
  let fixture: ComponentFixture<TodoIndexComponent>;
  let todoListsService: TodoListsService;
  let colorService: ColorService;
  const dummyList2: List = {
    _id: '3ef',
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
    color: '#ffffff',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TodoIndexComponent,
        HeaderComponent,
        FooterComponent,
        ConfirmDialogComponent,
      ],
      imports: [HttpClientModule, MatDialogModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoIndexComponent);
    component = fixture.componentInstance;
    todoListsService = TestBed.inject(TodoListsService);
    colorService = TestBed.inject(ColorService);
    fixture.detectChanges();

    spyOn(todoListsService, 'getLists').and.returnValue(of([dummyList2]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open confirm dialog to delete all lists', () => {
    spyOn(component.dialog, 'open').and.callThrough();

    component.openConfirmDialog();
    expect(component.dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: { text: component.deleteAllListsMsg },
    });
  });

  it('should open confirm dialog to delete ONE list', () => {
    spyOn(component.dialog, 'open').and.callThrough();

    component.openConfirmDialog(dummyList2);
    expect(component.dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        text: "This will delete the 'Dummy2' list. This action cannot be undone.",
      },
    });
  });

  it('should delete ONE list', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<unknown>);
    spyOn(component, 'onDelItem').and.callThrough();
    spyOn(todoListsService, 'deleteList').and.returnValue(of('done'));

    component.openConfirmDialog(dummyList2);

    expect(component.onDelItem).toHaveBeenCalledWith('3ef');
  });

  it('should open dialog to create a list', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of({ isEdit: false, name: 'New List' }),
    } as MatDialogRef<unknown>);
    spyOn(todoListsService, 'createList').and.returnValue(of('done'));
    spyOn(colorService, 'getRandomColor').and.returnValue('#ffffff');

    component.openDialog();

    expect(todoListsService.createList).toHaveBeenCalledWith({
      name: 'New List',
      items: [],
      color: '#ffffff',
    });
  });

  it('should edit list', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of({ isEdit: true, name: 'Edit List' }),
    } as MatDialogRef<unknown>);
    spyOn(todoListsService, 'updateList').and.returnValue(of('done'));

    component.openDialog(dummyList2, 0);

    expect(todoListsService.updateList).toHaveBeenCalledWith('3ef', {
      name: 'Edit List',
      color: '#ffffff',
      items: dummyList2.items,
    });
  });

  it('should get an error on editing list', () => {
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of({ isEdit: true, name: 'Edit List' }),
    } as MatDialogRef<unknown>);
    spyOn(todoListsService, 'updateList').and.returnValue(
      throwError(() => new Error())
    );
    spyOn(window, 'alert');

    component.openDialog(dummyList2, 0);

    expect(window.alert).toHaveBeenCalledWith('Failed to update list');
  });
});
