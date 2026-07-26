import React, {
  ReactNode,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import styles from "./filters.module.css";
import { SelectOption } from "../selectOptions";
export interface FiltersContainerProps {
  children: ReactNode;
  ariaLabel?: string;
}

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: ReactNode;
}

export function FormButton({
  isActive = false,
  children,
  ...buttonAttributes
}: FormButtonProps) {
  const buttonClassName = isActive ? "styles.ativo" : "";

  return (
    <button className={buttonClassName} {...buttonAttributes}>
      {children}
    </button>
  );
}

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export function FormSelect({ options, ...selectAttributes }: FormSelectProps) {
  return (
    <select {...selectAttributes}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function FormInput({ ...inputAttributes }: FormInputProps) {
  return <input type="text" {...inputAttributes} />;
}

export function FiltersContainer({
  children,
  ariaLabel,
}: FiltersContainerProps) {
  return (
    <div className={styles.filtersContainer} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
