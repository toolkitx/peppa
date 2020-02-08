import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFieldDefModelComponent } from './table-field-def-model.component';

describe('TableFieldDefModelComponent', () => {
  let component: TableFieldDefModelComponent;
  let fixture: ComponentFixture<TableFieldDefModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFieldDefModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFieldDefModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
