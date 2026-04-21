import { useEffect, useMemo, useState } from "react";
import { Upload, Calendar } from "lucide-react";
import { EnergyLineChart } from "../components/EnergyLineChart";

const API_BASE_URL = "http://localhost:4000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ? String(data.error) : `Request failed (${res.status})`);
  return data;
}

export function TimeAnalysis() {
  const [timeRange, setTimeRange] = useState("24hours");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [backendChartData, setBackendChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data for different time ranges
  const getSampleData = () => {
    if (timeRange === "24hours") {
      return Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        energy: 60 + Math.random() * 40 + (i >= 9 && i <= 17 ? 30 : 0),
      }));
    } else if (timeRange === "week") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
        hour: day,
        energy: 800 + Math.random() * 400 + (i < 5 ? 300 : 0),
      }));
    } else if (timeRange === "month") {
      return Array.from({ length: 30 }, (_, i) => ({
        hour: `Day ${i + 1}`,
        energy: 1000 + Math.random() * 500,
      }));
    } else {
      return [];
    }
  };

  const sampleData = useMemo(() => getSampleData(), [timeRange]);

useEffect(() => {
  setError(null);
  setBackendChartData(null);

  if (timeRange !== "24hours" && timeRange !== "week") return;

  let mounted = true;

  const load = async () => {
    try {
      setIsLoading(true);

      if (timeRange === "24hours") {
        const rows = await apiGet("/api/energy-entries/analysis/hourly");
        if (!mounted) return;

        setBackendChartData(
          (rows || [])
            .slice(-5) // 🔥 последние 5
            .map((r) => ({
              hour: `${r.hour}:00`,
              energy: Number(r.energy) || 0,
            }))
        );
      } else {
        const rows = await apiGet("/api/energy-entries/analysis/daily");
        if (!mounted) return;

        setBackendChartData(
          (rows || [])
            .slice(-5) // 🔥 последние 5
            .map((r) => ({
              hour: r.time,
              energy: Number(r.consumption) || 0,
            }))
        );
      }
    } catch (e) {
      if (!mounted) return;
      setError(e?.message || "Failed to load analysis");
    } finally {
      if (mounted) setIsLoading(false);
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, [timeRange]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`File "${file.name}" uploaded successfully!`);
      // In real app, parse CSV and process data
    }
  };

  const chartData = backendChartData || sampleData;
  const stats = useMemo(() => {
    const values = chartData || [];
    const total = values.reduce((acc, d) => acc + (Number(d.energy) || 0), 0);
    const avg = values.length > 0 ? total / values.length : 0;
    const peak =
      values.length > 0
        ? Math.max(...values.map((d) => Number(d.energy) || 0))
        : 0;

    return { total, avg, peak };
  }, [chartData]);

  return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Time Analysis</h1>
            <p className="text-gray-600">Analyze energy consumption across different time periods</p>
          </div>

          {/* Time Range Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Range</h3>
            
            {/* Radio Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeRange"
                  value="24hours"
                  checked={timeRange === "24hours"}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">24 Hours</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeRange"
                  value="week"
                  checked={timeRange === "week"}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Week</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeRange"
                  value="month"
                  checked={timeRange === "month"}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Month</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeRange"
                  value="custom"
                  checked={timeRange === "custom"}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Custom Range</span>
              </label>
            </div>

            {/* Custom Date Range */}
            {timeRange === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            )}

            {/* CSV Upload */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Upload CSV Data</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Upload historical data in CSV format for detailed analysis
              </p>
            </div>
          </div>

          {/* Chart */}
          {timeRange !== "custom" || (startDate && endDate) ? (
            <>
              {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
              {isLoading && <div className="mb-4 text-sm text-gray-500">Loading...</div>}
              <EnergyLineChart data={chartData} />
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg">Select date range to view analysis</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-2">Average Consumption</p>
              <p className="text-3xl font-semibold text-gray-900">
                {Math.round(stats.avg)} kWh
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-2">Peak Consumption</p>
              <p className="text-3xl font-semibold text-gray-900">
                {Math.round(stats.peak)} kWh
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-2">Total Consumption</p>
              <p className="text-3xl font-semibold text-gray-900">
                {Math.round(stats.total)} kWh
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}
