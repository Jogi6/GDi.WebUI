import { Vehicle } from '../models/vehicle.model';

export interface VehicleLocation {
  vehicleLocationID: string;
  longitude: string;
  latitude: string;
  vehicleID: string;
  vehicle: Vehicle;
}
