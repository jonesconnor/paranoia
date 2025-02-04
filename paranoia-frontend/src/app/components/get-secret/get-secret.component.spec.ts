import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSecretComponent } from './get-secret.component';

describe('GetSecretComponent', () => {
  let component: GetSecretComponent;
  let fixture: ComponentFixture<GetSecretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSecretComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
