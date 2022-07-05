import { Component, NgModule, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { VehiclesService } from '../service/vehicles.service';
import { VehicleType } from '../models/vehicleType.model';
import { VehicleLocation } from '../models/vehicleLocation.model';
import { MapPoint } from '../models/mapPoint.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  @Output() vehicleChangedEvent = new EventEmitter<VehicleLocation>();

  @Input("currentCoordinates")
  set currentCoordinates(currentCoordinates: MapPoint) {
    this.vehicleLocation.longitude = currentCoordinates.longitude.toFixed(5).toString();
    this.vehicleLocation.latitude = currentCoordinates.latitude.toFixed(5).toString();
  }

  //Array of vehicles
  vehicles: Vehicle[] = [];
  vehicleTypes: VehicleType[] = [];

  vehicleType: VehicleType = {
    vehicleTypeID: '',
    typeOfVehicle: ''
  }

  //Variable of type "Vehicle"
  vehicle: Vehicle = {
    vehicleID: '',
    vehicleName: '',
    registrationNumber: '',
    model: '',
    productionYear: '',
    vehicleTypeID: '',
    vehicleType: this.vehicleType
  }

  vehicleLocation: VehicleLocation = {
    vehicleLocationID: '',
    longitude: '',
    latitude: '',
    vehicleID: '',
    vehicle: this.vehicle
  }

  //Constructor for vehicle sevice
  constructor(private vehicleService: VehiclesService) {
  }

  ngOnInit(): void {
    //Gets list of vehicles on page load
    this.getAllVehicles();
  }

  //Methode for calling a list of vehicles
  async getAllVehicles() {
    await this.vehicleService.getAllVehicles()
    .subscribe(
      response => {
        this.vehicles = response;
        console.log(this.vehicles);
        this.vehicle = {
          vehicleID: '',
          vehicleName: '',
          registrationNumber: '',
          model: '',
          productionYear: '',
          vehicleTypeID: '',
          vehicleType: this.vehicleType
        };
      }
    )
    await this.vehicleService.getVehiclesTypes()
      .subscribe(
        response => {
          this.vehicleTypes = response;
          console.log(this.vehicleTypes);
        }
      )
  }

  //Gets all vehicle types
  getAllVehiclesTypes() {
    this.vehicleService.getVehiclesTypes()
      .subscribe(
        response => {
          this.vehicleTypes = response;
        }
      )
  }

  // Populates form for adding vehicles
  populateAddVehicle(vehicle: Vehicle) {
    this.vehicle = vehicle;

    this.vehicleLocation.vehicleID = vehicle.vehicleID;
    this.vehicleLocation.vehicle = vehicle;
    this.getVehicleLocation(this.vehicleLocation);
    this.vehicleChangedEvent.emit(this.vehicleLocation);
    
  }

  getVehicleLocation(vehicleLocation: VehicleLocation) {
    this.vehicleService.getVehicleLocation(this.vehicleLocation)
      .subscribe(
        response => {
          this.vehicleLocation = response;
        }
    )
  }


  //Submit methode that gets data to API to be stored to database
  addVehicle() {
    if (this.vehicle.vehicleID === '') {
      this.vehicleService.addVehicle(this.vehicle)
        .subscribe(
          response => {
            this.getAllVehicles();
            this.vehicle = {
              vehicleID: '',
              vehicleName: '',
              registrationNumber: '',
              model: '',
              productionYear: '',
              vehicleTypeID: '',
              vehicleType: this.vehicleType
            };
          }
        )
    }
    else {
      this.updateVehicle(this.vehicle);
    }
  }

  //Submits location
  addLocation() {
    this.vehicleService.addVehicleLocation(this.vehicleLocation)
      .subscribe(
        response => {
          this.getAllVehicles();
          this.vehicleLocation = {
            vehicleLocationID: '',
            longitude: '',
            latitude: '',
            vehicleID: '',
            vehicle: this.vehicle
          };
        }
      )
  }

  //Delete vehicle from list, and refreshes the list
  deleteVehicle(vehicleID: string) {
    this.vehicleService.deleteVehicle(vehicleID)
      .subscribe(
        response => {
          this.getAllVehicles();
        }
    )
  }

  //Update Vehicle
  updateVehicle(vehicle: Vehicle) {
    this.vehicleService.updateVehicle(vehicle)
      .subscribe(
        response => {
          this.getAllVehicles();
        }
      )
  }
}
