import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppProfileComponent } from './supp-profile.component';

describe('SuppProfileComponent', () => {
  let component: SuppProfileComponent;
  let fixture: ComponentFixture<SuppProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
