import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListDialogData } from 'src/app/model/list-dialog-data';

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss'],
})
export class ListDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ListDialogData) {}
}
