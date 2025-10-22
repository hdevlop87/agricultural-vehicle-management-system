"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { format, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateInputProps } from "../type";
import { Label } from "@/components/ui/label";
import NIcon from "@/components/NIcon";
import { cn } from "@/lib/utils";
import BaseInput from "../Box";
import { getIconColorProps } from "../utils";



const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className = "",
  icon,
  showIcon = true,
  iconColor,
  variant = 'default',
  status = 'default',
}) => {

  const shouldDisplayIcon = Boolean(icon) && showIcon;
  const iconProps = getIconColorProps(iconColor, "h-4 w-4");

  return (
    <BaseInput variant={variant} status={status} className={cn('h-9', className)}>
      {shouldDisplayIcon && (
        <NIcon
          icon={icon}
          className={iconProps.className}
          style={iconProps.style}
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "w-full flex px-2  items-center cursor-pointer gap-2 justify-start text-left font-normal relative",
            !value && "text-foreground",
          )}
          >

            <Label className="text-muted-foreground">{value ? format(value, "PPP") : placeholder}</Label>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </BaseInput>
  );
};

export default DateInput