export type Staff = {
  id: number;
  name: string;
  nameEn: string;
};

export type Service = {
  id: number;
  timestamp: string;
  serviceType: string;
  carSize: string | null;
  hasCoupon: boolean;
  staffId: number;
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
  [key: string]: ServiceConfig;
};
