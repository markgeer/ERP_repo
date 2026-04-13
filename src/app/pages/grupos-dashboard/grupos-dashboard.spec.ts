import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposDashboardComponent } from './grupos-dashboard';

describe('GruposDashboardComponent', () => {
  let component: GruposDashboardComponent;
  let fixture: ComponentFixture<GruposDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
