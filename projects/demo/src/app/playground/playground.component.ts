import { Component, effect, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoadingIndicatorComponent } from '@softwarity/loading-indicator';

const PALETTES = [
  'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
  'orange', 'chartreuse', 'spring-green', 'azure', 'violet', 'rose'
] as const;

const DIAMETERS = [24, 32, 48, 64, 96, 128] as const;

@Component({
  imports: [
    MatIconModule,
    LoadingIndicatorComponent,
  ],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss'
})
export class PlaygroundComponent {
  protected isDarkMode = signal(document.body.classList.contains('dark-mode'));

  // Diameter selection
  protected diameters = DIAMETERS;
  protected selectedDiameter = signal<number>(64);

  // withContainer toggle
  protected withContainer = signal(false);

  // Palette selection
  protected palettes = PALETTES;
  protected selectedPalette = signal<string>('');

  // Override configurations for colors
  protected backgroundOverride = signal({ enabled: false, light: '#e8def8', dark: '#4a4458' });
  protected shapeOverride = signal({ enabled: false, light: '#6750a4', dark: '#ccc2dc' });

  private styleElement: HTMLStyleElement | null = null;

  constructor() {
    effect(() => {
      this.backgroundOverride();
      this.shapeOverride();
      this.updateCustomColors();
    });
  }

  private updateCustomColors(): void {
    const background = this.backgroundOverride();
    const shape = this.shapeOverride();

    const hasAnyOverride = background.enabled || shape.enabled;

    if (hasAnyOverride) {
      if (!this.styleElement) {
        this.styleElement = document.createElement('style');
        document.head.appendChild(this.styleElement);
      }
      const lines: string[] = [];
      if (background.enabled) {
        lines.push(`--loading-indicator-background-color: light-dark(${background.light}, ${background.dark});`);
      }
      if (shape.enabled) {
        lines.push(`--loading-indicator-shape-color: light-dark(${shape.light}, ${shape.dark});`);
      }
      this.styleElement.textContent = `:root { ${lines.join(' ')} }`;
    } else if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  toggleOverride(variant: 'background' | 'shape'): void {
    const signalMap = {
      background: this.backgroundOverride,
      shape: this.shapeOverride
    };
    signalMap[variant].update(v => ({ ...v, enabled: !v.enabled }));
  }

  updateOverrideColor(variant: 'background' | 'shape', mode: 'light' | 'dark', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const signalMap = {
      background: this.backgroundOverride,
      shape: this.shapeOverride
    };
    signalMap[variant].update(v => ({ ...v, [mode]: value }));
  }

  toggleColorScheme(): void {
    this.isDarkMode.update(dark => !dark);
    document.body.classList.toggle('dark-mode', this.isDarkMode());
  }

  onPaletteChange(palette: string): void {
    const html = document.documentElement;
    PALETTES.forEach(p => html.classList.remove(p));
    if (palette) {
      html.classList.add(palette);
    }
    this.selectedPalette.set(palette);
  }

  onDiameterChange(diameter: number): void {
    this.selectedDiameter.set(diameter);
  }

  toggleWithContainer(): void {
    this.withContainer.update(v => !v);
  }
}
