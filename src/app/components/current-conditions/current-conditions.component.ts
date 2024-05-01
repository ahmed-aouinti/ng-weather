import { Component, inject, Signal } from "@angular/core";
import { WeatherService } from "../../services/weather.service";
import { LocationService } from "../../services/location.service";
import { Router, RouterLink } from "@angular/router";
import { ConditionsAndZip } from "../../models/conditions-and-zip.type";
import { NgFor, DecimalPipe, NgIf } from "@angular/common";
import { TabsComponent } from "app/shared/tabs/tabs.component";
import { TabComponent } from "app/shared/tabs/tab/tab.component";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  standalone: true,
  imports: [NgFor, RouterLink, DecimalPipe, NgIf, TabsComponent, TabComponent],
})
export class CurrentConditionsComponent {
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  constructor() {}

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }
}
