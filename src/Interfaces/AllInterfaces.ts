export interface ManagerDetails extends Document {
  name: string;
  email: string;
  phoneNumber: string;
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
  phoneNumber: number;
  address: string;
  password: string;
  dateTime: string;
  role: string;
  requests: number;
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
  stationName: string;
  email: string;
  phoneNumber: number;
  address: string;
  password: string;
  users: {}[];
  requests: {}[];
  transactionHistory: {}[];
  feedbacks: string[];
}

export interface requestInterface extends Document {
  requestMessage: string;
  requestStatus: boolean;
}
