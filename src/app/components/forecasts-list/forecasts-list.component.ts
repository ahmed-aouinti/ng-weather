import { Component, OnDestroy, inject } from "@angular/core";
import { WeatherService } from "../../services/weather.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Forecast } from "../../models/forecast.type";
import { NgFor, DecimalPipe, DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
  standalone: true,
  imports: [NgFor, RouterLink, DecimalPipe, DatePipe],
})
export class ForecastsListComponent implements OnDestroy {
  zipcode: string;
  forecast: Forecast;
  protected weatherService = inject(WeatherService);
  private subscription: Subscription;
  private route = inject(ActivatedRoute);

  constructor() {
    this.subscription = this.route.params.subscribe((params) => {
      this.zipcode = params["zipcode"];
      this.weatherService
        .getForecast(this.zipcode)
        .subscribe((data) => (this.forecast = data));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
