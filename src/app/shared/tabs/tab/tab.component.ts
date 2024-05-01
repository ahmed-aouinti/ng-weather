import { Component, Input } from "@angular/core";

@Component({
  selector: "app-tab",
  standalone: true,
  imports: [],
  template: `<div [hidden]="!active">
    <ng-content></ng-content>
  </div>`,
})
export class TabComponent {
  @Input({ required: true }) title: string;
  @Input({ required: true }) id: string;
  active = false;
}
