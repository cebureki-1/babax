import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { DataInputModal } from "../components/DataInputModal";
import { DataTable } from "../components/DataTable";
import { ResultsPanel } from "../components/ResultsPanel";
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

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ? String(data.error) : `Request failed (${res.status})`);
  return data;
}

async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ? String(data.error) : `Request failed (${res.status})`);
  }
}

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataEntries, setDataEntries] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [status, setStatus] = useState("normal");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapFromApiRow = (row) => {
    const hvacOn = row.hvac_usage === true || row.hvac_usage === "true";
    const lightOn =
      row.lighting_usage === true || row.lighting_usage === "true";

    const predictedEnergy =
      row.predicted_energy === null || row.predicted_energy === undefined
        ? null
        : Math.round(Number(row.predicted_energy));

    return {
      id: row.id,
      hour: Number(row.hour),
      temperature: Number(row.temperature),
      humidity: Number(row.humidity),
      occupancy: Number(row.occupancy),
      hvacUsage: hvacOn ? "1" : "0",
      lightingUsage: lightOn ? "1" : "0",
      renewableEnergy: row.renewable_energy ? "1" : "0",
      isWeekend: Boolean(row.is_weekend),
      predictedEnergy,
      status: row.status,
      recommendations: Array.isArray(row.recommendations)
        ? row.recommendations
        : []
    };
  };

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);
    const rows = await apiGet("/api/energy-entries");
    const mapped = (rows || []).slice(-5).map(mapFromApiRow);
    setDataEntries(mapped);

    const latest = mapped[0];
    if (latest?.predictedEnergy !== null && latest?.predictedEnergy !== undefined) {
      setPrediction(latest.predictedEnergy);
      setStatus(latest.status || "normal");
      setRecommendations(latest.recommendations || []);
    } else {
      setPrediction(null);
      setStatus("normal");
      setRecommendations([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries().catch((e) => {
      setError(e?.message || "Failed to load");
      setIsLoading(false);
    }); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const chartData = useMemo(() => {
    return dataEntries.map((entry) => ({
      hour: `${entry.hour}:00`,
      energy: entry.predictedEnergy ?? 0
    }));
  }, [dataEntries]);

  const handleAddData = async (newData) => {
    // Send only fields that backend expects
    const payload = {
      hour: newData.hour,
      temperature: newData.temperature,
      humidity: newData.humidity,
      squareFootage: newData.squareFootage,
      occupancy: newData.occupancy,
      hvacUsage: newData.hvacUsage,
      lightingUsage: newData.lightingUsage,
      renewableEnergy: newData.renewableEnergy,
      isWeekend: newData.isWeekend
    };

    await apiPost("/api/energy-entries", payload);
    await loadEntries();
    setIsModalOpen(false);
  };

  const handleDeleteData = async (id) => {
    await apiDelete(`/api/energy-entries/${id}`);
    await loadEntries();
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Monitor and predict building energy consumption</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Data
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Data Table and Chart */}
          <div className="lg:col-span-2 space-y-6">
            <DataTable data={dataEntries} onDelete={handleDeleteData} />
            <EnergyLineChart data={chartData} />
          </div>

          {/* Right Column - Results Panel */}
          <div className="lg:col-span-1">
            <ResultsPanel
              prediction={prediction || 0}
              status={status}
              recommendations={recommendations}
            />
            {error && (
              <div className="mt-4 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <DataInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddData}
      />
    </div>
  );
}
