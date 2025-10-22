"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SwitchInputProps } from "../type";
import BaseInput from "../Box";

const SwitchInput: React.FC<SwitchInputProps> = ({
  value,
  onChange,
  label = "",
  helper,
  className = "",
  variant = 'default',
  status = 'default',
}) => {
  return (
    <BaseInput variant={variant} status={status} className={cn('p-2 gap-2 justify-between items-center', className)}>
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        <Label className="text-xs text-muted-foreground">{helper}</Label>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </BaseInput>
  );
};

export default SwitchInput;
