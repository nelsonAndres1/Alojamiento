import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmarReservaComponent } from './comfirmar-reserva.component';

describe('ComfirmarReservaComponent', () => {
  let component: ComfirmarReservaComponent;
  let fixture: ComponentFixture<ComfirmarReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfirmarReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
