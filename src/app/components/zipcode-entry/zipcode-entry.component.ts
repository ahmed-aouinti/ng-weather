import { Component, inject } from "@angular/core";
import { LocationService } from "../../services/location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
  standalone: true,
})
export class ZipcodeEntryComponent {
  private service = inject(LocationService);

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }
}
