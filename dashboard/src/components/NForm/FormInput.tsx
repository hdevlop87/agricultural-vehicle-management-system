import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  SwitchInput,
  CheckboxInput,
  TextInput,
  NumberInput,
  PasswordInput,
  TextAreaInput,
  DateInput,
  FileInput,
  SelectInput,
  RadioGroupInput,
  CheckboxGroupInput,
  StarRatingInput,
  EmojiInput,
  PhoneInput,
  ColorArrayInput,
  ColorPickerInput,
  TimeInput,
  MapInput,
} from "@/components/NInputs";
import { useFormContext } from 'react-hook-form';
import { FormInputProps } from "./type";

export const Inputs: Record<string, React.FC<any>> = {
  switch: SwitchInput,
  checkbox: CheckboxInput,
  text: TextInput,
  number: NumberInput,
  password: PasswordInput,
  textarea: TextAreaInput,
  date: DateInput,
  file: FileInput,
  select: SelectInput,
  radio: RadioGroupInput,
  checkboxes: CheckboxGroupInput,
  stars: StarRatingInput,
  emoji: EmojiInput,
  phone: PhoneInput,
  colorArray: ColorArrayInput,
  colorPicker: ColorPickerInput,
  time: TimeInput,
  map: MapInput
};

const Input: React.FC<FormInputProps> = ({
  name,
  type,
  formLabel,
  formDescription,
  required = false,
  ...rest
}) => {
  const InputComponent = Inputs[type];
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        return (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="text-foreground">
              {formLabel}
              {required && (
                <span className="text-destructive ml-1" aria-label="required">
                  *
                </span>
              )}
            </FormLabel>
            <FormControl>
              <InputComponent
                value={field.value}
                onChange={field.onChange}
                status={hasError ? "error" : "default"}
                {...rest}
              />
            </FormControl>
            {!hasError && (
              <FormDescription>{formDescription}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default Input;
