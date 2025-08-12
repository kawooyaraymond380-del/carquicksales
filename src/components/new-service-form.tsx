'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/hooks/use-app';
import { SERVICE_TYPES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AIServiceSuggester } from '@/components/ai-service-suggester';

export function NewServiceForm() {
  const { t, language, staff, addService } = useApp();
  
  const [serviceType, setServiceType] = useState('');
  const [carSize, setCarSize] = useState('');
  const [staffId, setStaffId] = useState('');
  const [useCoupon, setUseCoupon] = useState(false);
  const [price, setPrice] = useState<number | string>('');
  const [commission, setCommission] = useState<number | string>('');

  const serviceConfig = serviceType ? SERVICE_TYPES[serviceType] : null;

  const resetForm = useCallback(() => {
    setServiceType('');
    setCarSize('');
    setStaffId('');
    setUseCoupon(false);
    setPrice('');
    setCommission('');
  }, []);

  const handleAISuggestion = (suggestion: string) => {
    const suggestedServiceKey = Object.keys(SERVICE_TYPES).find(key => 
      t(key as keyof typeof import('@/lib/translations').translations.en).toLowerCase() === suggestion.toLowerCase()
    );
    if (suggestedServiceKey) {
      setServiceType(suggestedServiceKey);
    }
  };

  useEffect(() => {
    if (!serviceConfig) {
      setPrice('');
      setCommission('');
      setCarSize('');
      setUseCoupon(false);
      return;
    }

    if (!serviceConfig.needsSize) {
      setCarSize('');
    }

    if (!serviceConfig.hasCoupon) {
      setUseCoupon(false);
    }

    const priceKey = serviceConfig.needsSize ? carSize : 'default';
    if (!priceKey) {
      setPrice('');
      setCommission('');
      return;
    }

    const priceObj = serviceConfig.prices[priceKey];
    if (priceObj) {
      if (useCoupon && serviceConfig.hasCoupon && priceObj.couponCommission !== undefined) {
        setPrice(0);
        setCommission(priceObj.couponCommission);
      } else {
        setPrice(priceObj.price);
        setCommission(priceObj.commission);
      }
    }
  }, [serviceType, carSize, useCoupon, serviceConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !staffId || (serviceConfig?.needsSize && !carSize)) {
      alert(t('field-required'));
      return;
    }

    const selectedStaff = staff.find(s => s.id === parseInt(staffId));
    if (!selectedStaff) return;
    
    addService({
      serviceType,
      carSize: carSize || null,
      hasCoupon: useCoupon,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      staffNameEn: selectedStaff.nameEn,
      price: Number(price),
      commission: Number(commission),
    });

    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('new-service-title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <AIServiceSuggester onSuggestionClick={handleAISuggestion} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="service-type">{t('service-type-label')}</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger id="service-type">
                  <SelectValue placeholder={t('select-service-type')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SERVICE_TYPES).map((key) => (
                    <SelectItem key={key} value={key}>
                      {t(key as keyof typeof import('@/lib/translations').translations.en)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="car-size">{t('car-size-label')}</Label>
              <Select value={carSize} onValueChange={setCarSize} disabled={!serviceConfig?.needsSize}>
                <SelectTrigger id="car-size">
                  <SelectValue placeholder={t('select-car-size')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t('small-car')}</SelectItem>
                  <SelectItem value="medium">{t('medium-car')}</SelectItem>
                  <SelectItem value="big">{t('big-car')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-member">{t('staff-member-label')}</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger id="staff-member">
                  <SelectValue placeholder={t('select-staff-member')} />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {language === 'ar' ? s.name : s.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {serviceConfig?.hasCoupon && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-8">
                <Checkbox id="free-wash-coupon" checked={useCoupon} onCheckedChange={(checked) => setUseCoupon(Boolean(checked))} />
                <Label htmlFor="free-wash-coupon" className="cursor-pointer">{t('free-wash-coupon-label')}</Label>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="price">{t('price-label')}</Label>
              <Input id="price" value={price} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commission">{t('commission-label')}</Label>
              <Input id="commission" value={commission} readOnly />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={resetForm}>{t('clear-btn')}</Button>
            <Button type="submit">{t('submit-btn')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
