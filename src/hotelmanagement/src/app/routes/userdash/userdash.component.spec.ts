import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdashComponent } from './userdash.component';

describe('UserdashComponent', () => {
  let component: UserdashComponent;
  let fixture: ComponentFixture<UserdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
