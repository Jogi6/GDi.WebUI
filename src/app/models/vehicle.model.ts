import { VehicleType } from '../models/vehicleType.model';

export interface Vehicle {
  vehicleID: string;
  vehicleName: string;
  registrationNumber: string;
  model: string;
  productionYear: string;
  vehicleTypeID: string;
  vehicleType: VehicleType;
}
