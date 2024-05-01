import { NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { DataCacheService } from "app/services/data-cache.service";

@Component({
  selector: "app-cache-control",
  standalone: true,
  imports: [NgIf],
  templateUrl: "./cache-control.component.html",
  styleUrl: "./cache-control.component.css",
})
export class CacheControlComponent {
  private storageCacheService = inject(DataCacheService);

  protected currentCacheDuration: number =
    this.storageCacheService.getCacheDuration();

  cacheDurationValid = true;

  set cacheDuration(value: number) {
    // Validate input before setting
    if (value >= 0) {
      this.storageCacheService.setCacheDuration(value);
      this.cacheDurationValid = true; // Reset valid flag if input is positive
    } else {
      console.error("Invalid cache duration. Must be a positive number.");
      this.cacheDurationValid = false; // Set valid flag to false for error message
    }
  }
}
