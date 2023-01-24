import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaralojaComponent } from './taraloja.component';

describe('TaralojaComponent', () => {
  let component: TaralojaComponent;
  let fixture: ComponentFixture<TaralojaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaralojaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaralojaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
