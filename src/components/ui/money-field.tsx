'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface MoneyFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string | number;
  onChange?: (value: string) => void;
  currency?: string;
  showCurrency?: boolean;
}

const MoneyField = forwardRef<HTMLInputElement, MoneyFieldProps>(
  ({ className, value = '', onChange, currency = '₦', showCurrency = true, ...props }, ref) => {
    const formatNumber = (val: string | number) => {
      const stringVal = String(val);
      const number = stringVal.replace(/,/g, '');
      if (number && !isNaN(Number(number))) {
        return Number(number).toLocaleString();
      }
      return stringVal;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Remove commas and non-numeric characters except for the first character if it's currency
      const numericValue = inputValue.replace(/,/g, '').replace(/[^\d]/g, '');
      onChange?.(numericValue);
    };

    const displayValue = value ? formatNumber(value) : '';

    return (
      <div className="relative">
        {showCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {currency}
          </span>
        )}
        <Input
          {...props}
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            showCurrency && "pl-8",
            className
          )}
        />
      </div>
    );
  }
);

MoneyField.displayName = 'MoneyField';

export { MoneyField };
