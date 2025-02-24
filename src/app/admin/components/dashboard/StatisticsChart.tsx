'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { createBrowserClient } from '@/supabase/client'
import { motion } from 'framer-motion'

interface StatisticsChartProps {
  type: 'appointments' | 'clients' | 'products'
  dateFilter: '24hours' | '7days' | '30days' | '3months'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg border border-gray-100 rounded-lg">
        <p className="text-sm font-medium text-night-lemon">{label}</p>
        <p className="text-2xl font-bold text-night-lemon mt-1">
          {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export function StatisticsChart({ type, dateFilter }: StatisticsChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [percentageChange, setPercentageChange] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchData()
  }, [type, dateFilter])

  const getDateRange = () => {
    const now = new Date()
    const ranges = {
      '24hours': {
        start: subDays(startOfDay(now), 1),
        format: 'HH:mm',
        label: 'Last 24 hours'
      },
      '7days': {
        start: subDays(startOfDay(now), 7),
        format: 'EEE',
        label: 'Last 7 days'
      },
      '30days': {
        start: subDays(startOfDay(now), 30),
        format: 'dd MMM',
        label: 'Last 30 days'
      },
      '3months': {
        start: subMonths(startOfDay(now), 3),
        format: 'MMM',
        label: 'Last 3 months'
      }
    }

    return ranges[dateFilter]
  }

  const fetchData = async () => {
    setIsLoading(true)
    const { start, format: dateFormat } = getDateRange()
    
    try {
      let query = supabase
        .from(type === 'clients' ? 'appointments' : type)
        .select('created_at, status')
        .gte('created_at', start.toISOString())
        .lte('created_at', new Date().toISOString())

      if (type === 'clients') {
        query = query.eq('status', 'pending')
      }

      const { data: rawData, error } = await query

      if (error) throw error

      // Procesar datos según el tipo
      const processedData = processData(rawData, dateFormat)
      setData(processedData)

      // Calcular totales y cambio porcentual
      const total = rawData.length
      setTotalCount(total)

      // Calcular el cambio porcentual
      const halfwayPoint = new Date((new Date(start).getTime() + new Date().getTime()) / 2)
      const firstHalf = rawData.filter((item: any) => new Date(item.created_at) < halfwayPoint).length
      const secondHalf = rawData.filter((item: any) => new Date(item.created_at) >= halfwayPoint).length
      
      const change = ((secondHalf - firstHalf) / (firstHalf || 1)) * 100
      setPercentageChange(change)

    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processData = (rawData: any[], dateFormat: string) => {
    const groupedData = rawData.reduce((acc: any, item: any) => {
      const date = format(new Date(item.created_at), dateFormat, { locale: es })
      
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
      
      return acc
    }, {})

    return Object.entries(groupedData).map(([date, count]) => ({
      date,
      count
    }))
  }

  if (isLoading) {
    return (
      <div className={`${isExpanded ? 'h-80' : 'h-40'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-night-lemon" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold text-night-lemon">
              {totalCount}
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-1 text-sm font-medium ${
                percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}%
            </motion.div>
            <div className="ml-auto">
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                ▼
              </motion.span>
            </div>
          </div>
          <p className="text-sm text-silver-lemon mt-1">
            {getDateRange().label}
          </p>
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 200 : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D1C19" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#1D1C19" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1D1C19"
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: "#1D1C19",
                strokeWidth: 2,
                stroke: "#fff"
              }}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
} 