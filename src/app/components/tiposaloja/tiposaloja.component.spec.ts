import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposalojaComponent } from './tiposaloja.component';

describe('TiposalojaComponent', () => {
  let component: TiposalojaComponent;
  let fixture: ComponentFixture<TiposalojaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposalojaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposalojaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
