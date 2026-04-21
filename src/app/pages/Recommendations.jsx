import { RecommendationCard } from "../components/RecommendationCard";
import { getDetailedRecommendations } from "../utils/mockData";
import { Lightbulb, TrendingDown, DollarSign } from "lucide-react";

export function Recommendations() {
  const recommendations = getDetailedRecommendations();

  const totalSavings = recommendations.reduce((acc, rec) => {
    const match = rec.savings.match(/(\d+)-(\d+)/);
    if (match) {
      const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
      return acc + avg;
    }
    return acc;
  }, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">AI Recommendations</h1>
          <p className="text-gray-600">Optimization suggestions based on machine learning analysis</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6" />
              <p className="text-green-100">Active Recommendations</p>
            </div>
            <p className="text-4xl font-semibold">{recommendations.length}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6" />
              <p className="text-blue-100">Potential Savings</p>
            </div>
            <p className="text-4xl font-semibold">{Math.round(totalSavings)} kWh</p>
            <p className="text-sm text-blue-100 mt-1">per day</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6" />
              <p className="text-purple-100">Cost Savings</p>
            </div>
            <p className="text-4xl font-semibold">${Math.round(totalSavings * 0.12)}</p>
            <p className="text-sm text-purple-100 mt-1">per day estimate</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How AI Recommendations Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-semibold mb-1">1. Data Collection</div>
              <p className="text-blue-700">Gathering real-time sensor data from temperature, occupancy, and energy meters</p>
            </div>
            <div>
              <div className="font-semibold mb-1">2. ML Analysis</div>
              <p className="text-blue-700">Random Forest model analyzes patterns and predicts optimal energy usage</p>
            </div>
            <div>
              <div className="font-semibold mb-1">3. Optimization</div>
              <p className="text-blue-700">Algorithm generates actionable recommendations to reduce consumption</p>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Actions</h2>
          <div className="space-y-4">
            {/* {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                title={rec.title}
                description={rec.description}
                impact={rec.impact as "High" | "Medium" | "Low"}
                savings={rec.savings}
                reason={rec.reason}
              />
            ))} */}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Implementation Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Prioritize high-impact recommendations first for maximum energy savings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Monitor energy consumption after implementing changes to verify effectiveness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Schedule automated actions (e.g., equipment shutdown) to reduce manual intervention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Review recommendations weekly as patterns change with seasons and occupancy</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
