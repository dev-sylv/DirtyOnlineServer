export interface ManagerDetails extends Document {
  name: string;
  password: string;
  role: string;
  stations: {}[];
  users: {}[];
}

export interface UserDetails extends Document {
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

export interface MalamDetails extends Document {
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

export interface stationInterface extends Document {
  stationName: string;
  email: string;
  phoneNumber: number;
  address: string;
  password: string;
  users: {}[];
  requests: {}[];
  transactionHistory: {}[];
  feedbacks: {}[];
}

export interface requestInterface extends Document {
  requestMessage: string;
  status: string;
}
