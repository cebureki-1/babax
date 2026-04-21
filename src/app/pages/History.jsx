import { useEffect, useMemo, useState } from "react";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

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

export function History() {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiGet("/api/energy-entries/history")
      .then((rows) => {
        if (!mounted) return;
        setHistoryEntries(rows || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load history");
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getStatusBadge = (status) => {
    const configs = {
      normal: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };
    return configs[status] || configs.normal;
  };

  const getAccuracyIcon = (prediction, actual) => {
    const predictionNum = Number(prediction);
    const actualNum = Number(actual);

    if (!Number.isFinite(predictionNum) || predictionNum <= 0) {
      return { icon: TrendingDown, color: "text-yellow-600", text: "0.0% accurate" };
    }

    const diff = Math.abs(predictionNum - actualNum);
    const accuracy = ((1 - diff / predictionNum) * 100).toFixed(1);
    
    if (accuracy >= 95) {
      return { icon: TrendingUp, color: "text-green-600", text: `${accuracy}% accurate` };
    } else {
      return { icon: TrendingDown, color: "text-yellow-600", text: `${accuracy}% accurate` };
    }
  };

  const stats = useMemo(() => {
    const total = historyEntries.length;
    const highCount = historyEntries.filter((e) => e.status === "high").length;
    const normalCount = historyEntries.filter((e) => e.status === "normal").length;

    const accuracies = historyEntries
      .map((e) => {
        const pred = Number(e.prediction);
        const act = Number(e.actual);
        if (!Number.isFinite(pred) || pred <= 0 || !Number.isFinite(act)) return null;
        const diff = Math.abs(pred - act);
        return (1 - diff / pred) * 100;
      })
      .filter((v) => v !== null);

    const avgAccuracy =
      accuracies.length === 0
        ? null
        : accuracies.reduce((a, b) => a + b, 0) / accuracies.length;

    return {
      total,
      highCount,
      normalCount,
      avgAccuracy
    };
  }, [historyEntries]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">History</h1>
          <p className="text-gray-600">View past predictions and actual consumption data</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Predictions</p>
            <p className="text-3xl font-semibold text-gray-900">
              {isLoading ? "..." : stats.total}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Avg Accuracy</p>
            <p className="text-3xl font-semibold text-green-600">
              {isLoading || stats.avgAccuracy === null ? "..." : `${stats.avgAccuracy.toFixed(1)}%`}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">High Status Count</p>
            <p className="text-3xl font-semibold text-red-600">
              {isLoading ? "..." : stats.highCount}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Normal Status Count</p>
            <p className="text-3xl font-semibold text-green-600">
              {isLoading ? "..." : stats.normalCount}
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Prediction History</h2>
          </div>
          
          <div className="overflow-x-auto">
            {error && <div className="p-6 text-sm text-red-600">{error}</div>}
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted (kWh)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual (kWh)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historyEntries.map((entry) => {
                  const accuracy = getAccuracyIcon(entry.prediction, entry.actual);
                  const AccuracyIcon = accuracy.icon;
                  
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{entry.date}</p>
                            <p className="text-xs text-gray-500">{entry.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-blue-600">{entry.prediction}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{entry.actual}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-lg ${getStatusBadge(entry.status)}`}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <AccuracyIcon className={`w-4 h-4 ${accuracy.color}`} />
                          <span className={`text-sm font-medium ${accuracy.color}`}>
                            {accuracy.text}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!isLoading && historyEntries.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">No history yet</div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Prediction Accuracy</h3>
          <p className="text-sm text-blue-800">
            Our machine learning model continuously learns from historical data to improve prediction accuracy. 
            The system compares predicted values with actual consumption to refine future predictions.
          </p>
        </div>
      </div>
    </div>
  );
}
