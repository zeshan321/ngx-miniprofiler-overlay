import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent implements OnInit {
  public forecasts: WeatherForecast[];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }
    ngOnInit(): void {
      this.http.get<WeatherForecast[]>(this.baseUrl + 'weatherforecast').subscribe(result => {
        this.forecasts = result;
      }, error => console.error(error));

      this.http.get<any>('https://jsonplaceholder.typicode.com/todos/1').subscribe(result => {
        console.log(result);
      }, error => console.error(error));
    }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
