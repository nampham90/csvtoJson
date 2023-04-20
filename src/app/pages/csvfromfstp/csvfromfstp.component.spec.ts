import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvfromfstpComponent } from './csvfromfstp.component';

describe('CsvfromfstpComponent', () => {
  let component: CsvfromfstpComponent;
  let fixture: ComponentFixture<CsvfromfstpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvfromfstpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvfromfstpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
