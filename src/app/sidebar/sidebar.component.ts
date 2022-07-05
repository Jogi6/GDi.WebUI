import { Component, NgModule, OnInit } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { VehiclesService } from '../service/vehicles.service';
import { VehicleType } from '../models/vehicleType.model';
import { VehicleLocation } from '../models/vehicleLocation.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  

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
    vehicleID: ''
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
          console.log(this.vehicleTypes);
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

  // Populates form for adding vehicles
  populateAddVehicle(vehicle: Vehicle)
  {
    this.vehicle = vehicle;
    this.vehicle.vehicleType.typeOfVehicle = '0';
    this.vehicle.vehicleType.vehicleTypeID = '0';
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
