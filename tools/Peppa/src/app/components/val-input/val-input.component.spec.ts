import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValInputComponent } from './val-input.component';

describe('ValInputComponent', () => {
  let component: ValInputComponent;
  let fixture: ComponentFixture<ValInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
