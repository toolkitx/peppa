import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPrimaryActionsComponent } from './editor-primary-actions.component';

describe('EditorPrimaryActionsComponent', () => {
  let component: EditorPrimaryActionsComponent;
  let fixture: ComponentFixture<EditorPrimaryActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorPrimaryActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPrimaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
