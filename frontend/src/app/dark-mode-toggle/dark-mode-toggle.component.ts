import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/services/theme.service';
import * as DarkReader from 'darkreader';
@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss']
})
export class DarkModeToggleComponent implements OnInit {

  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
    // this.themeService.update('light-theme');
    // alert('print');
  }

  ngOnInit(): void {
    this.checkDarkModePreference();

    if(DarkReader.isEnabled())
      this.isDarkMode = false;
    else if (!DarkReader.isEnabled())
      this.isDarkMode = true;
    else
      this.isDarkMode = !this.themeService.isDarkMode();
  }

  checkDarkModePreference(): void {
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'enabled') {
      this.enableDarkMode();
    } else if (darkModeSetting === 'disabled') {
      DarkReader.disable();
    }
  }

  toggleDarkMode(): void {
    if (DarkReader.isEnabled()) {
      DarkReader.disable();
      localStorage.setItem('darkMode', 'disabled');
    } else {
      this.enableDarkMode();
      localStorage.setItem('darkMode', 'enabled');
    }
  }

  enableDarkMode(): void {
    // Set the fetch method for DarkReader
    DarkReader.setFetchMethod(window.fetch);

    // Now enable DarkReader
    DarkReader.enable({
        brightness: 80,
        contrast: 100,
        sepia: 10
    });
  }

}
