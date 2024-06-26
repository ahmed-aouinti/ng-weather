import { Injectable, Signal, inject, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CurrentConditions } from "../models/current-conditions.type";
import { ConditionsAndZip } from "../models/conditions-and-zip.type";
import { Forecast } from "../models/forecast.type";
import { LocationService } from "./location.service";
import { NgToastService } from "ng-angular-popup";
import { DataCacheService } from "./data-cache.service";

const CONDITION = "condition_";
const FORECAST = "forecast_";

@Injectable({ providedIn: "root" })
export class WeatherService {
  static readonly URL = "https://api.openweathermap.org/data/2.5";
  static readonly APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static readonly ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";

  private readonly currentConditions = signal<ConditionsAndZip[]>([]);
  private readonly http = inject(HttpClient);
  private readonly locationService = inject(LocationService);
  private readonly toast = inject(NgToastService);
  private readonly dataCacheService = inject(DataCacheService);

  constructor() {
    this.locationService.locations$.subscribe((locations) =>
      this.handleChangeLocations(locations)
    );
  }

  private handleChangeLocations(locations: string[]): void {
    const currentZips = this.currentConditions().map((cc) => cc.zip);

    locations.forEach((loc) => {
      if (!currentZips.includes(loc)) {
        this.addCurrentConditions(loc);
      }
    });

    currentZips.forEach((zip) => {
      if (!locations.includes(zip)) {
        this.removeCurrentConditions(zip);
      }
    });
  }

  private addCurrentConditions(zipcode: string): void {
    const cachedCondition: CurrentConditions = this.dataCacheService.getItem(
      CONDITION + zipcode
    )?.data;

    if (cachedCondition) {
      this.updateConditions(zipcode, cachedCondition);
      return;
    }
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http
      .get<CurrentConditions>(
        `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
      .subscribe(
        (data) => {
          const condition: ConditionsAndZip = { zip: zipcode, data };
          this.saveInCache(CONDITION + zipcode, condition);
          this.updateConditions(zipcode, data);
        },
        (error: HttpErrorResponse) => {
          // Handle error
          const message = `Error fetching weather data for zip code ${zipcode} : ${error.error.message}`;
          this.toast.error({
            detail: "ERROR",
            summary: message,
            sticky: true,
            position: "topRight",
          });
          this.locationService.removeLocation(zipcode);
        }
      );
  }

  private removeCurrentConditions(zipcode: string): void {
    this.currentConditions.update((conditions) =>
      conditions.filter((cc) => cc.zip !== zipcode)
    );
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cachedForecast: Forecast = this.dataCacheService.getItem(
      FORECAST + zipcode
    );

    if (cachedForecast) {
      return of(cachedForecast);
    }
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http
      .get<Forecast>(
        `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
      )
      .pipe(tap((forecast) => this.saveInCache(FORECAST + zipcode, forecast)));
  }

  private updateConditions(zip: string, data: CurrentConditions) {
    this.currentConditions.update((conditions) => [
      ...conditions,
      { zip, data },
    ]);
  }

  private saveInCache<T>(key: string, data: T) {
    this.dataCacheService.setCachedItem(key, data);
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
