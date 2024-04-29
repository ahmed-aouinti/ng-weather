import { Component } from "@angular/core";
import { CurrentConditionsComponent } from "../current-conditions/current-conditions.component";
import { ZipcodeEntryComponent } from "../zipcode-entry/zipcode-entry.component";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  standalone: true,
  imports: [ZipcodeEntryComponent, CurrentConditionsComponent],
})
export class MainPageComponent {}
