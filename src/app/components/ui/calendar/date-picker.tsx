'use client'

import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface DatePickerFieldProps {
  value?: Date
  onChange: (date: Date | null) => void
  error?: string
}

const CustomDatePicker = forwardRef<HTMLDivElement, DatePickerFieldProps>(
  ({ value, onChange, error }, ref) => {
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
      <div ref={ref} className="w-full">
        <div className="relative">
          <DatePicker
            selected={value}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="Hora"
            dateFormat="d 'de' MMMM 'de' yyyy 'a las' HH:mm"
            minDate={new Date()}
            filterDate={filterWeekDays}
            locale={es}
            placeholderText="Selecciona fecha y hora"
            showTimeInput
            customInput={
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative"
              >
                <input
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white cursor-pointer"
                  value={value ? formatDate(value) : ''}
                  readOnly
                  placeholder="Selecciona fecha y hora"
                />
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </motion.div>
            }
            className="react-datepicker-modern"
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        <style jsx global>{`
          .react-datepicker {
            font-family: inherit;
            border: none;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .react-datepicker__header {
            background-color: white;
            border-bottom: 1px solid #f3f4f6;
            border-radius: 0.5rem 0.5rem 0 0;
            padding: 1rem;
          }
          .react-datepicker__day {
            width: 2.5rem;
            line-height: 2.5rem;
            margin: 0.2rem;
            border-radius: 0.375rem;
          }
          .react-datepicker__day:hover {
            background-color: #f3f4f6;
          }
          .react-datepicker__day--selected {
            background-color: #4f46e5 !important;
            color: white;
          }
          .react-datepicker__time-container {
            border-left: 1px solid #f3f4f6;
          }
          .react-datepicker__time-list-item--selected {
            background-color: #4f46e5 !important;
          }
          .react-datepicker__triangle {
            display: none;
          }
          .react-datepicker__navigation {
            top: 1rem;
          }
          .react-datepicker__day--keyboard-selected {
            background-color: #e0e7ff;
            color: #4f46e5;
          }
          .react-datepicker__time-list-item:hover {
            background-color: #f3f4f6 !important;
          }
        `}</style>
      </div>
    )
  }
)

CustomDatePicker.displayName = 'CustomDatePicker'

export default CustomDatePicker 