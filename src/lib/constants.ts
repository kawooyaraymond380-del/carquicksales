import type { Staff, ServiceTypesConfig } from '@/types';

export const STAFF_MEMBERS: Staff[] = [
  { id: 1, name: 'أحمد محمد', nameEn: 'Ahmed Mohamed' },
  { id: 2, name: 'محمد علي', nameEn: 'Mohamed Ali' },
  { id: 3, name: 'خالد إبراهيم', nameEn: 'Khalid Ibrahim' },
  { id: 4, name: 'عبدالله أحمد', nameEn: 'Abdullah Ahmed' },
];

export const SERVICE_TYPES: ServiceTypesConfig = {
  'whole-wash': {
    prices: {
      small: { price: 20, commission: 8, couponCommission: 4 },
      medium: { price: 25, commission: 10, couponCommission: 5 },
      big: { price: 30, commission: 12, couponCommission: 6 },
    },
    needsSize: true,
    hasCoupon: true,
  },
  'inside-only': {
    prices: { default: { price: 10, commission: 4 } },
    needsSize: false,
    hasCoupon: false,
  },
  'outside-only': {
    prices: {
      small: { price: 15, commission: 5 },
      medium: { price: 20, commission: 8 },
      big: { price: 25, commission: 10 },
    },
    needsSize: true,
    hasCoupon: false,
  },
  'spray-only': {
    prices: { default: { price: 10, commission: 4 } },
    needsSize: false,
    hasCoupon: false,
  },
  'engine-wash-only': {
    prices: { default: { price: 10, commission: 4 } },
    needsSize: false,
    hasCoupon: false,
  },
  'mirrors-only': {
    prices: { default: { price: 5, commission: 2 } },
    needsSize: false,
    hasCoupon: false,
  },
  'carpets-covering': {
    prices: { default: { price: 10, commission: 2 } },
    needsSize: false,
    hasCoupon: false,
  },
};
