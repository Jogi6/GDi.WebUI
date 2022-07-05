import { Component } from '@angular/core';
import esri = __esri;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public currentCoordinates: esri.Point | undefined ;
  mapLoadedEvent (status: boolean) {
    console.log('The map loaded: ' + status);
  }
  mapClickEvent(event: esri.ViewClickEvent) {
    console.log("click: ", event.mapPoint);
    this.currentCoordinates = event.mapPoint;
  }
}
