import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesMenuComponent } from './tiles-menu.component';

describe('TilesMenuComponent', () => {
  let component: TilesMenuComponent;
  let fixture: ComponentFixture<TilesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TilesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
