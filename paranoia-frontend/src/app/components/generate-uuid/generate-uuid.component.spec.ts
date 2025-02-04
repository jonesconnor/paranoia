import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateUuidComponent } from './generate-uuid.component';

describe('GenerateUuidComponent', () => {
  let component: GenerateUuidComponent;
  let fixture: ComponentFixture<GenerateUuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateUuidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateUuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
