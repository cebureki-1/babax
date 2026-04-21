import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { EnergyChart } from "../components/EnergyChart";
import { generateDailyData, generateHourlyData, getFeatureImportance } from "../utils/mockData";
import { TrendingUp, Database, Cpu } from "lucide-react";

export function Analysis() {
  const hourlyData = generateHourlyData();
  const dailyData = generateDailyData();
  const featureImportance = getFeatureImportance();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Energy Analysis</h1>
          <p className="text-gray-600">Detailed analytics and correlation insights</p>
        </div>

        {/* Model Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Model Type</p>
                <p className="font-semibold text-gray-900">Random Forest</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Regression model for energy prediction</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Accuracy (R²)</p>
                <p className="font-semibold text-gray-900">0.92</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Model performance score</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Data Points</p>
                <p className="font-semibold text-gray-900">8,760</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Training dataset size</p>
          </div>
        </div>

        {/* Multi-variable Chart */}
        <div className="mb-8">
          <EnergyChart 
            data={hourlyData}
            title="Temperature vs Energy Consumption"
            showTemperature={true}
          />
        </div>

        {/* Occupancy Chart */}
        <div className="mb-8">
          <EnergyChart 
            data={hourlyData}
            title="Occupancy vs Energy Consumption"
            showOccupancy={true}
          />
        </div>

        {/* Weekly Consumption */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Consumption Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
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
              <Bar dataKey="consumption" fill="#10b981" radius={[8, 8, 0, 0]} name="Energy (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Importance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Importance</h3>
          <div className="space-y-4">
            {featureImportance.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.feature}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {(item.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.importance * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Feature importance shows which factors have the most impact on energy consumption predictions
          </p>
        </div>
      </div>
    </div>
  );
}
