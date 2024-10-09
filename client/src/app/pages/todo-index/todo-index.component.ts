import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ListDialogComponent } from 'src/app/components/list-dialog/list-dialog.component';
import { List } from '@backend/models/list';
import { ColorService } from 'src/app/services/color.service';
import { TodoListsService } from 'src/app/services/todo-lists.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-index',
  templateUrl: './todo-index.component.html',
  styleUrls: ['./todo-index.component.scss'],
})
export class TodoIndexComponent implements OnInit, OnDestroy {
  private _subs: Subscription = new Subscription();

  public name = '';
  public todoLists: List[] = [];
  public deleteAllListsMsg =
    'This will delete all the todo lists you have created. This action cannot be undone.';

  constructor(
    private colorService: ColorService,
    private todoListsService: TodoListsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchLists();
  }

  private fetchLists(): void {
    this._subs.add(
      this.todoListsService.getLists().subscribe((lists) => {
        this.todoLists = lists;
      })
    );
  }

  onDelItem(id: string): void {
    this._subs.add(
      this.todoListsService.deleteList(id).subscribe({
        next: () => this.fetchLists(),
      })
    );
  }

  openDialog(list?: List, index?: number): void {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      data: {
        name: list?.name || '',
        isEdit: list ? true : false,
        color: list?.color || '',
        titleText: list ? 'Edit todo list' : 'Create a new todo list',
      },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.isEdit && list?._id && index !== undefined && index >= 0) {
          this._subs.add(
            this.todoListsService
              .updateList(list._id.toString(), {
                name: result.name,
                color: list.color,
                items: list.items,
              })
              .subscribe({
                next: () => {
                  this.fetchLists();
                },
                error: (error) => {
                  alert('Failed to update list');
                  console.error(error);
                },
              })
          );
        }
        if (!result.isEdit) {
          const lastUsedColor = this.todoLists[this.todoLists.length - 1]
            ? this.todoLists[this.todoLists.length - 1].color
            : '';

          this.todoListsService
            .createList({
              name: result.name,
              items: [],
              color: this.colorService.getRandomColor(lastUsedColor),
            })
            .subscribe({
              next: () => {
                this.fetchLists();
              },
              error: (error) => {
                alert('Failed to create list');
                console.error(error);
              },
            });
        }
      }
    });
  }

  openConfirmDialog(list?: List): void {
    let message = '';
    if (list && list._id !== undefined) {
      message =
        "This will delete the '" +
        list.name +
        "' list. This action cannot be undone.";
    } else {
      message = this.deleteAllListsMsg;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: message },
    });

    this._subs.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (list?._id !== undefined) {
            this.onDelItem(list._id.toString());
            this.fetchLists();
          } else {
            this.todoLists = [];
            //implement delete all through api
          }
        }
      })
    );
  }

  trackByFn(index: number): number {
    return index;
  }

  drop(event: CdkDragDrop<List[]>) {
    moveItemInArray(this.todoLists, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
