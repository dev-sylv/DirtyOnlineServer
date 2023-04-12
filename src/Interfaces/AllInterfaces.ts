export interface ManagerDetails extends Document {
  name: string;
  password: string;
  role: string;
  stations: {}[];
  users: {}[];
}

export interface UserDetails {
  name: string;
  email: string;
  phoneNumber: number;
  address: string;
  password: string;
  dateTime: string;
  role: string;
  requests: number;
  history: {}[];
  station: {};
}

export interface MalamDetails {
  name: string;
  email: string;
  image: string;
  uniqueID: string;
  phoneNumber: number;
  address: string;
  password: string;
  dateTime: string;
  status: string;
  role: string;
}
