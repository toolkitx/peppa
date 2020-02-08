import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSiderComponent } from './editor-sider.component';

describe('EditorSiderComponent', () => {
  let component: EditorSiderComponent;
  let fixture: ComponentFixture<EditorSiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
