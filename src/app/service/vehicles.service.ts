import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { Observable } from 'rxjs';
import { VehicleType } from '../models/vehicleType.model';
import { VehicleLocation } from '../models/vehicleLocation.model';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  //API base url
  baseUrl = 'https://localhost:7285/api/vehicles';
  baseUrlType = 'https://localhost:7285/api/vehicletypes';
  baseUrlLocations = 'https://localhost:7285/api/vehiclelocation';

  //Http Constractor
  constructor(private http: HttpClient) { }

  //Service that gets a response from API with list of Vehicles
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl);
  };

  //Service to post new Vehicle
  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    vehicle.vehicleID = '0';
    vehicle.vehicleType.typeOfVehicle = '0';
    vehicle.vehicleType.vehicleTypeID = '0';
    return this.http.post<Vehicle>(this.baseUrl, vehicle);
  };

  //Servisce to delete vhicle
  deleteVehicle(vehicleID: string): Observable<Vehicle> {
    return this.http.delete<Vehicle>(this.baseUrl + '/' + vehicleID);
  }

  //Servisce to update vehicle information
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(this.baseUrl + '/' + vehicle.vehicleID, vehicle);
  }

  //Get a list of vehicles type
  getVehiclesTypes(): Observable<VehicleType[]> {
    return this.http.get<VehicleType[]>(this.baseUrlType);
  }

  //Add vehicle location service
  addVehicleLocation(vehicleLocation: VehicleLocation): Observable<VehicleLocation> {
    vehicleLocation.vehicleLocationID = '0';
    vehicleLocation.vehicle.vehicleType.typeOfVehicle = '0';
    vehicleLocation.vehicle.vehicleType.vehicleTypeID = '0';
    return this.http.post<VehicleLocation>(this.baseUrlLocations, vehicleLocation);
  }

  getVehicleLocation(vehicleLocation: VehicleLocation): Observable<VehicleLocation> {
    return this.http.get<VehicleLocation>(this.baseUrlLocations + '/' + vehicleLocation.vehicleID);
  }
}
