import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiConfigSelectModalComponent } from './ui-config-select-modal.component';

describe('UiConfigSelectModalComponent', () => {
  let component: UiConfigSelectModalComponent;
  let fixture: ComponentFixture<UiConfigSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiConfigSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiConfigSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
