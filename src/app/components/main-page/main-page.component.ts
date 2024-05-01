import { Component } from "@angular/core";
import { CurrentConditionsComponent } from "../current-conditions/current-conditions.component";
import { ZipcodeEntryComponent } from "../zipcode-entry/zipcode-entry.component";
import { CacheControlComponent } from "../cache-control/cache-control.component";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  standalone: true,
  imports: [
    ZipcodeEntryComponent,
    CurrentConditionsComponent,
    CacheControlComponent,
  ],
})
export class MainPageComponent {}
