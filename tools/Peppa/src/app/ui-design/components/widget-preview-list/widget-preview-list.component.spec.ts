import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPreviewListComponent } from './widget-preview-list.component';

describe('WidgetPreviewListComponent', () => {
  let component: WidgetPreviewListComponent;
  let fixture: ComponentFixture<WidgetPreviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetPreviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
