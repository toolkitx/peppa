import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSecondaryActionsComponent } from './editor-secondary-actions.component';

describe('EditorSecondaryActionsComponent', () => {
  let component: EditorSecondaryActionsComponent;
  let fixture: ComponentFixture<EditorSecondaryActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSecondaryActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSecondaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
