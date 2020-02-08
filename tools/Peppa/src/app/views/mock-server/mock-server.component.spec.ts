import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockServerComponent } from './mock-server.component';

describe('MockServerComponent', () => {
  let component: MockServerComponent;
  let fixture: ComponentFixture<MockServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
