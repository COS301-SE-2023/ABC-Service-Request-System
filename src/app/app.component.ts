import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Project';
  constructor(private http: HttpClient) {
    alert(this.fetchData());
  }

  getData() {
    return this.http.get<{ message: string }>('/api/data');
  }

  fetchData() {
    this.getData().subscribe({
      next: (response) => {
        const message = response.message;
        alert(message);
        return message;
      },
      error: () => {
        return 'Error fetching data';
      }
    });
  }
}
