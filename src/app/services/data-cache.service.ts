import { Injectable, WritableSignal, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataCacheService {
  private readonly cacheDurationSignal: WritableSignal<number> =
    signal<number>(7200); // Default duration: 2 hours in seconds

  constructor() {}

  getCacheDuration(): number {
    return this.cacheDurationSignal();
  }

  setCacheDuration(duration: number) {
    this.cacheDurationSignal.set(duration);
  }

  getItem(key: string) {
    const item = JSON.parse(localStorage.getItem(key));

    const expiredCache =
      Date.now() - item?.timeCached > this.cacheDurationSignal() * 1000;

    if ((item && !expiredCache) || !item?.timeCached) {
      return item;
    }

    return null;
  }

  setCachedItem<T>(key: string, data: T) {
    const item = JSON.stringify({ ...data, timeCached: Date.now() });
    localStorage.setItem(key, item);
  }

  setItem<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
