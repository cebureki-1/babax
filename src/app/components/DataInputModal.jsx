import { useState } from "react";
import { X } from "lucide-react";

export function DataInputModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    hour: "",
    temperature: "",
    humidity: "",
    squareFootage: "",
    occupancy: "",
    hvacUsage: "0",
    lightingUsage: "0",
    renewableEnergy: "0",
    isWeekend: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.hour || formData.hour < 0 || formData.hour > 23) {
      newErrors.hour = "Hour must be between 0 and 23";
    }
    if (!formData.temperature) {
      newErrors.temperature = "Temperature is required";
    }
    if (!formData.humidity || formData.humidity < 0 || formData.humidity > 100) {
      newErrors.humidity = "Humidity must be between 0 and 100";
    }
    if (!formData.squareFootage || formData.squareFootage <= 0) {
      newErrors.squareFootage = "Square footage must be greater than 0";
    }
    if (!formData.occupancy || formData.occupancy < 0) {
      newErrors.occupancy = "Occupancy must be 0 or greater";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
      });
      setFormData({
        hour: "",
        temperature: "",
        humidity: "",
        squareFootage: "",
        occupancy: "",
        hvacUsage: "0",
        lightingUsage: "0",
        renewableEnergy: "0",
        isWeekend: false,
      });
      setErrors({});
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Add Energy Data</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hour (0-23)
              </label>
              <input
                type="number"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                min="0"
                max="23"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hour"
              />
              {errors.hour && (
                <p className="text-xs text-red-500 mt-1">{errors.hour}</p>
              )}
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter temperature"
              />
              {errors.temperature && (
                <p className="text-xs text-red-500 mt-1">{errors.temperature}</p>
              )}
            </div>

            {/* Humidity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidity (0-100%)
              </label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter humidity"
              />
              {errors.humidity && (
                <p className="text-xs text-red-500 mt-1">{errors.humidity}</p>
              )}
            </div>

            {/* Square Footage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <input
                type="number"
                name="squareFootage"
                value={formData.squareFootage}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter square footage"
              />
              {errors.squareFootage && (
                <p className="text-xs text-red-500 mt-1">{errors.squareFootage}</p>
              )}
            </div>

            {/* Occupancy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupancy
              </label>
              <input
                type="number"
                name="occupancy"
                value={formData.occupancy}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of people"
              />
              {errors.occupancy && (
                <p className="text-xs text-red-500 mt-1">{errors.occupancy}</p>
              )}
            </div>

            {/* HVAC Usage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HVAC Usage
              </label>
              <select
                name="hvacUsage"
                value={formData.hvacUsage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Off</option>
                <option value="1">On</option>
              </select>
            </div>

            {/* Lighting Usage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lighting Usage
              </label>
              <select
                name="lightingUsage"
                value={formData.lightingUsage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Off</option>
                <option value="1">On</option>
              </select>
            </div>

            {/* Renewable Energy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renewable Energy
              </label>
              <select
                name="renewableEnergy"
                value={formData.renewableEnergy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>

          {/* Is Weekend Checkbox */}
          <div className="mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isWeekend"
                checked={formData.isWeekend}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Is Weekend</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
