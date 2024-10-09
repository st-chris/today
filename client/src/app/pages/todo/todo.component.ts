import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ListDialogComponent } from 'src/app/components/list-dialog/list-dialog.component';
import { TodoItem } from '@backend/models/todo';
import { List } from '@backend/models/list';
import { ColorService } from 'src/app/services/color.service';
import { TodoListsService } from 'src/app/services/todo-lists.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  private _subs: Subscription = new Subscription();
  private listId: string;
  public todoList: List = { name: '', color: '', items: [] };
  public numberOfItemsDone = 0;
  public numberOfItemsToDo = 0;
  public maxNewItemLength = 25;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorService,
    private todoListsService: TodoListsService,
    public dialog: MatDialog
  ) {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.fetchList(this.listId);
    if (!this.todoList) {
      this.navigateToIndex();
    }
  }

  private fetchList(id: string): void {
    this._subs.add(
      this.todoListsService.getList(id).subscribe({
        next: (list) => {
          this.todoList = list;
          [this.numberOfItemsDone, this.numberOfItemsToDo] = this.updateCounts(
            this.todoList
          );
        },
        error: (error) => {
          console.error(error);
          this.navigateToIndex();
        },
      })
    );
  }

  navigateToIndex(): void {
    this.router.navigate(['/']);
  }

  updateCounts(list: List): number[] {
    const done = list.items.filter((el) => el.done).length;
    const toDo = list.items.length - done;
    return [done, toDo];
  }

  updateList(list: List): void {
    [this.numberOfItemsDone, this.numberOfItemsToDo] = this.updateCounts(list);

    this._subs.add(
      this.todoListsService.updateList(this.listId, list).subscribe({
        next: () => null,
        error: () => alert('Failed to save, please try again later.'),
      })
    );
  }

  drop(event: CdkDragDrop<TodoItem[]>) {
    moveItemInArray(
      this.todoList.items,
      event.previousIndex,
      event.currentIndex
    );
  }

  addItem(item: string): void {
    const lastUsedColor = this.todoList.items[this.todoList.items.length - 1]
      ? this.todoList.items[this.todoList.items.length - 1].color
      : undefined;

    this.todoList.items.push({
      text: item,
      color: this.colorService.getRandomColor(lastUsedColor),
      done: false,
    });

    this.updateList(this.todoList);
  }

  onClickItem(item: TodoItem): void {
    item.done = !item.done;
    this.updateList(this.todoList);
  }

  onDelItem(index: number): void {
    this.todoList.items.splice(index, 1);
    this.updateList(this.todoList);
  }

  trackByFn(index: number): number {
    return index;
  }

  openConfirmDialog(): void {
    const amountOfItems = this.todoList.items.length;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        text:
          'This will empty your current todo list, ' +
          (amountOfItems && amountOfItems === 1
            ? ' 1 item'
            : amountOfItems + ' items') +
          ' will be lost. This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoList.items = [];
        this.updateList(this.todoList);
      }
    });
  }

  openDialog(item?: TodoItem, index?: number): void {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      data: {
        name: item?.text,
        isEdit: !!item,
        titleText: 'Edit todo item',
        color: item?.color,
      },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isEdit && index !== undefined && index >= 0) {
        this.todoList.items[index].text = result.name;
        this.updateList(this.todoList);
      }
    });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
