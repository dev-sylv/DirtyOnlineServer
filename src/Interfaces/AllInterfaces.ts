export interface ManagerDetails extends Document {
  name: string;
  email: string;
  phoneNumber: number;
  accountDetails: string;
  password: string;
  role: string;
  stations: {}[];
  users: {}[];
  isVerified: boolean;
}

export interface UserDetails extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  dateTime: string;
  role: string;
  makeRequests: {}[];
  numberOfRequests: number;
  history: {}[];
  station: {};
  transactionHistory: {}[];
  isVerified: boolean;
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
  station: string;
  email: string;
  phoneNumber: number;
  address: string;
  password: string;
  users: {}[];
  requests: {}[];
  transactionHistory: {}[];
  malams: {}[];
  feedbacks: {}[];
}

export interface requestInterface extends Document {
  requestMessage: string;
  requestStatus: boolean;
}
