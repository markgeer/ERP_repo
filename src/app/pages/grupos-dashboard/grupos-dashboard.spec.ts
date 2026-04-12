import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposDashboard } from './grupos-dashboard';

describe('GruposDashboard', () => {
  let component: GruposDashboard;
  let fixture: ComponentFixture<GruposDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
