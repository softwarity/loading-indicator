import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { LoadingIndicatorComponent } from './loading-indicator.component';

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have default diameter of 48', () => {
      fixture.detectChanges();
      expect(component.diameter()).toBe(48);
    });

    it('should have withContainer disabled by default', () => {
      fixture.detectChanges();
      expect(component.withContainer()).toBeFalse();
    });
  });

  describe('inputs', () => {
    it('should accept custom diameter', () => {
      fixture.componentRef.setInput('diameter', 96);
      fixture.detectChanges();
      expect(component.diameter()).toBe(96);
    });

    it('should accept diameter as string and transform to number', () => {
      fixture.componentRef.setInput('diameter', '64');
      fixture.detectChanges();
      expect(component.diameter()).toBe(64);
    });

    it('should enable withContainer when set', () => {
      fixture.componentRef.setInput('withContainer', true);
      fixture.detectChanges();
      expect(component.withContainer()).toBeTrue();
    });

    it('should accept withContainer as empty string (boolean attribute)', () => {
      fixture.componentRef.setInput('withContainer', '');
      fixture.detectChanges();
      expect(component.withContainer()).toBeTrue();
    });
  });

  describe('rendering', () => {
    it('should render SVG element', () => {
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should apply diameter to SVG width and height', () => {
      fixture.componentRef.setInput('diameter', 64);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.style.width).toBe('64px');
      expect(svg.style.height).toBe('64px');
    });

    it('should have viewBox of 0 0 100 100', () => {
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.getAttribute('viewBox')).toBe('0 0 100 100');
    });

    it('should render path element', () => {
      fixture.detectChanges();
      const path = fixture.nativeElement.querySelector('path');
      expect(path).toBeTruthy();
    });

    it('should have soft edge filter defined', () => {
      fixture.detectChanges();
      const filter = fixture.nativeElement.querySelector('filter#softEdge');
      expect(filter).toBeTruthy();
    });

    it('should apply filter to path', () => {
      fixture.detectChanges();
      const path = fixture.nativeElement.querySelector('path');
      expect(path.getAttribute('filter')).toBe('url(#softEdge)');
    });

    it('should add with-container class when withContainer is true', () => {
      fixture.componentRef.setInput('withContainer', true);
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.loading-container');
      expect(container.classList.contains('with-container')).toBeTrue();
    });

    it('should not have with-container class by default', () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.loading-container');
      expect(container.classList.contains('with-container')).toBeFalse();
    });
  });

  describe('animation', () => {
    it('should generate valid SVG path', () => {
      fixture.detectChanges();
      const path = fixture.nativeElement.querySelector('path');
      const d = path.getAttribute('d');
      expect(d).toBeTruthy();
      expect(d).toMatch(/^M\s/);
      expect(d).toContain('C');
      expect(d).toContain('Z');
    });

    it('should apply rotation transform', fakeAsync(() => {
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('svg');
      const transform = svg.style.transform;
      expect(transform).toMatch(/rotate\([\d.]+deg\)/);
      discardPeriodicTasks();
    }));
  });

  describe('lifecycle', () => {
    it('should start animation on init', fakeAsync(() => {
      fixture.detectChanges();
      const initialPath = fixture.nativeElement.querySelector('path').getAttribute('d');
      tick(500);
      fixture.detectChanges();
      const laterPath = fixture.nativeElement.querySelector('path').getAttribute('d');
      expect(initialPath).toBeTruthy();
      expect(laterPath).toBeTruthy();
      discardPeriodicTasks();
    }));

    it('should clean up animation on destroy', fakeAsync(() => {
      fixture.detectChanges();
      tick(100);
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
      discardPeriodicTasks();
    }));
  });
});
