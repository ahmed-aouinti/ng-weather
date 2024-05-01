import { Injectable, WritableSignal, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";
import { NgToastService } from "ng-angular-popup";
import { DataCacheService } from "./data-cache.service";

export const LOCATIONS: string = "locations";

@Injectable({ providedIn: "root" })
export class LocationService {
  private locationsSignal: WritableSignal<string[]> = signal<string[]>([]);
  locations$: Observable<string[]> = toObservable(this.locationsSignal);

  private toast = inject(NgToastService);
  private dataCacheService = inject(DataCacheService);

  constructor() {
    let locString = this.dataCacheService.getItem(LOCATIONS);
    if (locString) {
      const locations = JSON.parse(locString);
      this.locationsSignal.set(locations);
    }
  }

  addLocation(zipcode: string): void {
    const locations = [...this.locationsSignal()];
    if (locations.includes(zipcode)) {
      const message = `The zip code ${zipcode} is already added.`;
      this.toast.warning({
        detail: "WARN",
        summary: message,
        duration: 4000,
        position: "topRight",
      });
    } else {
      this.updateLocations([...this.locationsSignal(), zipcode]);
    }
  }

  removeLocation(zipcode: string): void {
    const locations = this.locationsSignal().filter((loc) => loc !== zipcode);
    this.updateLocations(locations);
  }

  private updateLocations(locations: string[]): void {
    this.locationsSignal.set(locations);
    this.dataCacheService.setItem(LOCATIONS, JSON.stringify(locations));
  }
}
