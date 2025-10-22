"use client";

import React from "react";
import { CheckboxInputProps } from "../type";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import BaseInput from "../Box";
import { cn } from "@/lib/utils";


const CheckboxForm: React.FC<CheckboxInputProps> = ({
  value,
  onChange,
  helper,
  label,
  checkboxClassName,
  className,
  variant = 'default',
  status = 'default',
}) => { 

  return (
    <BaseInput variant={variant} status={status} className={cn('gap-2 items-start',className)}>
      <Checkbox 
        checked={value} 
        onCheckedChange={onChange} 
        className={cn("cursor-pointer transition-colors duration-200 border-primary", checkboxClassName)}
      />
      <div className="flex flex-col gap-1">
        <Label className="cursor-pointer" onClick={() => onChange(!value)}>{label}</Label>
        {helper && <Label className="text-xs text-muted-foreground">{helper}</Label>}
      </div>
    </BaseInput>
  );
};

export default CheckboxForm;
