import { Component, inject, Signal } from "@angular/core";
import { WeatherService } from "../../services/weather.service";
import { LocationService } from "../../services/location.service";
import { Router, RouterLink } from "@angular/router";
import { ConditionsAndZip } from "../../models/conditions-and-zip.type";
import { NgFor, DecimalPipe } from "@angular/common";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  standalone: true,
  imports: [NgFor, RouterLink, DecimalPipe],
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  constructor() {}

  trackById(index: number, location: ConditionsAndZip) {
    return location.zip;
  }

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
