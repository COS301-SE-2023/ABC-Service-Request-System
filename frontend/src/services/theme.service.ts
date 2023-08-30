import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer!: Renderer2;
  private selectedTheme!: string;

  constructor (private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.selectedTheme);
  }

  update(theme: 'dark-theme' | 'light-theme') {
    this.setColorTheme(theme);

    const previousColorTheme = (theme === 'dark-theme' ? 'light-theme' : 'dark-theme');
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
  }

  isDarkMode() {
    return this.selectedTheme === 'dark-theme';
  }

  private setColorTheme(theme: string) {
    this.selectedTheme = theme;
    localStorage.setItem('selected-theme', theme);
  }

  private getColorTheme() {
    if(localStorage.getItem('selected-theme')) {
      this.selectedTheme = localStorage.getItem('selected-theme')!;
    } else {
      this.selectedTheme = 'light-theme';
    }
  }


}
