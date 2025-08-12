export type Staff = {
  id: string; // Changed from number to string for Firestore
  name: string;
  nameEn: string;
  userId: string;
};

export type Service = {
  id: string; // Changed from number to string for Firestore
  timestamp: string;
  serviceType: string;
  carSize: string | null;
  hasCoupon: boolean;
  staffId: string; // Changed from number to string for Firestore ID
  staffName: string;
  staffNameEn: string;
  price: number;
  commission: number;
};

export type ServicePrice = {
  price: number;
  commission: number;
  couponCommission?: number;
};

export type ServiceConfig = {
  prices: {
    [key: string]: ServicePrice;
  };
  needsSize: boolean;
  hasCoupon: boolean;
};

export type ServiceTypesConfig = {
  [key:string]: ServiceConfig;
};
