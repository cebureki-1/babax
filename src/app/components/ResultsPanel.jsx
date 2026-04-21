import { Zap, TrendingDown, Lightbulb } from "lucide-react";

export function ResultsPanel({ prediction, status, recommendations }) {
  const statusConfig = {
    normal: {
      color: "bg-green-500",
      text: "Normal",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    medium: {
      color: "bg-yellow-500",
      text: "Medium",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    high: {
      color: "bg-red-500",
      text: "High",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
  };

  const config = statusConfig[status] || statusConfig.normal;

  return (
    <div className="space-y-6">
      {/* Prediction Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Predicted Energy</p>
            <p className="text-3xl font-semibold text-gray-900">{prediction} kWh</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${config.bgColor}`}>
          <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`}></div>
          <span className={`text-sm font-medium ${config.textColor}`}>
            Status: {config.text}
          </span>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
        </div>
        
        {recommendations.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations at this time</p>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <TrendingDown className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
