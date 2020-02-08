import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValueDefModalComponent } from './key-value-def-modal.component';

describe('KeyValueDefModalComponent', () => {
  let component: KeyValueDefModalComponent;
  let fixture: ComponentFixture<KeyValueDefModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyValueDefModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueDefModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
