'use client'

import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import { forwardRef } from "react"

registerLocale('es', es)

interface Props {
  selected: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  placeholderText?: string
  error?: string
}

export const CustomDatePicker = forwardRef<DatePicker, Props>(({ 
  selected, 
  onChange, 
  minDate = new Date(), 
  placeholderText = "Selecciona una fecha",
  error 
}, ref) => {
  return (
    <div className="w-full">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd 'de' MMMM 'de' yyyy"
        minDate={minDate}
        placeholderText={placeholderText}
        locale="es"
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
        isClearable={false}
        showPopperArrow={false}
        autoComplete="off"
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

CustomDatePicker.displayName = "CustomDatePicker"

export default CustomDatePicker 