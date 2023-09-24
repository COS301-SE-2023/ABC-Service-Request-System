import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss']
})
export class DarkModeToggleComponent implements OnInit {

  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.update('light-theme');
  }

  ngOnInit(): void {
      console.log('');
  }

  toggleDarkMode(){
    this.isDarkMode = this.themeService.isDarkMode();
    this.isDarkMode ? this.themeService.update('light-theme') : this.themeService.update('dark-theme');
  }
}
