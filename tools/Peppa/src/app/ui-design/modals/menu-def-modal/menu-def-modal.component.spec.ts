import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDefModalComponent } from './menu-def-modal.component';

describe('MenuDefModalComponent', () => {
  let component: MenuDefModalComponent;
  let fixture: ComponentFixture<MenuDefModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDefModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDefModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
