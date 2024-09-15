import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) { }

  //delte confirmation
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  //cancel delete
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
