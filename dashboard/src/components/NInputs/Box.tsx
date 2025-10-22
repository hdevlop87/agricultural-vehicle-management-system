import React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface BaseInputProps {
    children: React.ReactNode;
    variant?: "default" | "rounded" | "ghost";
    status?: "default" | "error";
    hasIcon?: boolean;
    className?: string;
    onHover?: () => void;
    onClick?: () => void;
}

const BaseInput: React.FC<BaseInputProps> = ({
    children,
    variant = "default",
    status = "default",
    className = "",
    onHover,
    onClick,
}) => {
    const inputVariants = cva(
        "relative w-full flex items-center  overflow-hidden p-2 bg-none",
        {
            variants: {
                variant: {
                    default: "border rounded-md hover:border-primary",
                    rounded: "border rounded-full hover:border-primary",
                    ghost: "border-none p-0 py-1",
                },
                status: {
                    default: "",
                    error: "border-2 border-red-500",
                },
                hasIcon: {
                    true: "pl-8",
                    false: "pl-3",
                },
            },
            defaultVariants: {
                variant: "default",
                status: "default",
            },
        }
    );

    return (
        <div className={cn(inputVariants({ variant, status }), className)}
            onMouseEnter={onHover}
            onClick={onClick}>
            {children}
        </div>
    );
};

export default BaseInput;
