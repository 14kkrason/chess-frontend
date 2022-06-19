import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-information-dialog',
  templateUrl: './game-information-dialog.component.html',
  styleUrls: ['./game-information-dialog.component.scss'],
})
export class GameInformationDialogComponent implements OnInit {
  header!: string;
  color!: string;
  status: string = 'Game over.';
  message!: string;
  newScore!: string;
  scoreGain!: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {}

  ngOnInit(): void {
    // if true the last move was made by the player
    const areColorsEqual =
      this.data.gameData.color === this.data.recievedData.color;
    let readable_reason = this.data.recievedData.reason.replace('_', ' ');

    switch (this.data.recievedData.status) {
      case 'win':
        if (areColorsEqual) {
          this.header = 'Win';
          this.color = '#69f0ae';
          this.status = 'You won!';
          this.message = 'Match ended by ' + readable_reason + '.';
        } else {
          this.header = 'Loss';
          this.color = '#f44336';
          this.status = 'You lost.';
          this.message = 'Match ended by ' + readable_reason + '.';
        }
        break;
      case 'loss':
        if (areColorsEqual) {
          this.header = 'Loss';
          this.color = '#f44336';
          this.status = 'You lost.';
          this.message = 'Match ended by ' + readable_reason + '.';
        } else {
          this.header = 'Win';
          this.color = '#69f0ae';
          this.status = 'You won!';
          this.message = 'Match ended by ' + readable_reason + '.';
        }
        break;
      case 'draw':
        if (readable_reason === 'draw') {
          readable_reason = '50 move rule or insufficient material.';
        }
        this.header = 'Draw';
        this.color = '#424242';
        this.message = 'Draw via ' + readable_reason;
        break;
      case 'draw-offered':
        // TODO: implement the offers of draw
        // this will probably include some listeners and back and forth action
        this.header = 'No information';
        break;
      case 'game-ended':
        this.header = 'Game ended';
        this.color = '#424242';
        this.message = readable_reason;
        break;
    }

    if (this.data.gameData.color === 'white') {
      this.newScore = this.data.recievedData.result.nWhiteRating;
      this.scoreGain =
        (this.data.recievedData.result.gainWhite < 0 ? '' : '+') +
        this.data.recievedData.result.gainWhite;
    } else if (this.data.gameData.color === 'black') {
      this.newScore = this.data.recievedData.result.nBlackRating;
      this.scoreGain =
        (this.data.recievedData.result.gainBlack < 0 ? '' : '+') +
        this.data.recievedData.result.gainBlack;
    }
  }
}
