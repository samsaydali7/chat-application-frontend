import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatcsListComponent } from './contatcs-list.component';

describe('ContatcsListComponent', () => {
  let component: ContatcsListComponent;
  let fixture: ComponentFixture<ContatcsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatcsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatcsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
