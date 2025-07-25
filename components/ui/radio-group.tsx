"use client"

import * as React from "react"

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface RadioGroupItemProps {
  value: string
  id: string
  disabled?: boolean
  className?: string
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange(child.props.value),
          } as any)
        }
        return child
      })}
    </div>
  )
}

export function RadioGroupItem({ value, id, disabled, className, ...props }: RadioGroupItemProps & any) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      disabled={disabled}
      className={`w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 ${className}`}
      {...props}
    />
  )
}
