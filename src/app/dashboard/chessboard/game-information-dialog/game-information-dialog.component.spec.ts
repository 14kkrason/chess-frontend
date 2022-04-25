import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInformationDialogComponent } from './game-information-dialog.component';

describe('GameInformationDialogComponent', () => {
  let component: GameInformationDialogComponent;
  let fixture: ComponentFixture<GameInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameInformationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
