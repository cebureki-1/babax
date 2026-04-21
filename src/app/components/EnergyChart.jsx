import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { EnergyData } from "../utils/mockData";

interface EnergyChartProps {
  data: EnergyData[];
  title: string;
  showTemperature?: boolean;
  showOccupancy?: boolean;
}

export function EnergyChart({ data, title, showTemperature = false, showOccupancy = false }: EnergyChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="consumption" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            name="Energy (kWh)"
          />
          {showTemperature && (
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              name="Temperature (°C)"
            />
          )}
          {showOccupancy && (
            <Line 
              type="monotone" 
              dataKey="occupancy" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Occupancy (%)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
