import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobofferItemComponent } from './joboffer-item.component';

describe('JobofferItemComponent', () => {
  let component: JobofferItemComponent;
  let fixture: ComponentFixture<JobofferItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobofferItemComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobofferItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
