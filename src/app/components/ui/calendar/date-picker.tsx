'use client'

import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import { forwardRef } from "react"
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

registerLocale('es', es)

interface Props {
  selected: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  placeholderText?: string
}

export const CustomDatePicker = forwardRef<DatePicker, Props>(({ 
  selected, 
  onChange, 
  minDate = new Date(), 
  placeholderText = "Selecciona una fecha" 
}, ref) => {
  // Filtrar días disponibles (Lunes a Viernes)
  const filterWeekDays = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(date)
    }
  }

  // Función para formatear la fecha en español
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return format(date, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
  }

  return (
    <div className="w-full">
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeCaption="Hora"
        minDate={minDate}
        placeholderText={placeholderText}
        locale="es"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
    </div>
  )
})

CustomDatePicker.displayName = "CustomDatePicker"

export default CustomDatePicker 