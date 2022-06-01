import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-draw-offer-dialog',
  templateUrl: './draw-offer-dialog.component.html',
  styleUrls: ['./draw-offer-dialog.component.scss'],
})
export class DrawOfferDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<DrawOfferDialogComponent>) {}

  ngOnInit(): void {}

  onAccept(): void {
    this.dialogRef.close('accepted');
  }

  onDecline(): void {
    this.dialogRef.close('declined');
  }
}
