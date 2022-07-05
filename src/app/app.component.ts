import { Component } from '@angular/core';
import { VehicleLocation } from './models/vehicleLocation.model';
import { MapPoint } from './models/mapPoint.model';
import esri = __esri;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public currentCoordinates: MapPoint | undefined;



  mapLoadedEvent (status: boolean) {
    console.log('The map loaded: ' + status);
  }
  mapClickEvent(event: esri.ViewClickEvent) {
    this.currentCoordinates = { longitude: event.mapPoint.longitude, latitude: event.mapPoint.latitude }
  }
  vehicleChangedEvent(event: VehicleLocation) {
    this.currentCoordinates = { longitude: Number.parseFloat(event.longitude), latitude: Number.parseFloat(event.latitude) }
    console.log(this.currentCoordinates);
  }
}
