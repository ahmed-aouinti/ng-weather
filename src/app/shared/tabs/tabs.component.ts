import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from "@angular/core";
import { TabComponent } from "./tab/tab.component";
import { NgFor } from "@angular/common";

@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [NgFor],
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.css",
})
export class TabsComponent implements AfterContentInit {
  @Output() closeTabEvent: EventEmitter<string> = new EventEmitter();

  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    this.tabs.changes.subscribe((value) => {
      setTimeout(() => {
        this.selectTab(value.first);
      }, 0);
    });
    if (this.tabs.first) {
      setTimeout(() => {
        this.selectTab(this.tabs.first);
      }, 0);
    }
  }

  selectTab(tab: TabComponent) {
    if (tab) {
      this.tabs.forEach((t) => (t.active = t === tab));
      tab.active = true;
    }
  }

  closeTab(tabId: string) {
    this.closeTabEvent.emit(tabId);
  }
}
