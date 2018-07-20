import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxsComponent } from './chat-boxs.component';

describe('ChatBoxsComponent', () => {
  let component: ChatBoxsComponent;
  let fixture: ComponentFixture<ChatBoxsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBoxsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
