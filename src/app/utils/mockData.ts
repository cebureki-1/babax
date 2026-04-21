export interface EnergyData {
  time: string;
  consumption: number;
  temperature: number;
  humidity: number;
  occupancy: number;
}

export interface Prediction {
  value: number;
  status: "normal" | "high" | "critical";
  recommendations: string[];
}

// Generate hourly data for the last 24 hours
export function generateHourlyData(): EnergyData[] {
  const data: EnergyData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Base consumption varies by time of day
    let baseConsumption = 80;
    if (hour >= 9 && hour <= 17) {
      baseConsumption = 140; // Working hours
    } else if (hour >= 18 && hour <= 22) {
      baseConsumption = 110; // Evening
    }
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      consumption: baseConsumption + Math.random() * 30 - 15,
      temperature: 20 + Math.random() * 8,
      humidity: 40 + Math.random() * 20,
      occupancy: hour >= 9 && hour <= 18 ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 20),
    });
  }
  
  return data;
}

// Generate daily data for the last 7 days
export function generateDailyData(): EnergyData[] {
  const data: EnergyData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  for (let i = 0; i < 7; i++) {
    const isWeekend = i >= 5;
    const baseConsumption = isWeekend ? 800 : 1400;
    
    data.push({
      time: days[i],
      consumption: baseConsumption + Math.random() * 200 - 100,
      temperature: 22 + Math.random() * 5,
      humidity: 45 + Math.random() * 15,
      occupancy: isWeekend ? 15 : 75,
    });
  }
  
  return data;
}

export function getCurrentPrediction(): Prediction {
  const currentHour = new Date().getHours();
  let consumption = 120;
  let status: "normal" | "high" | "critical" = "normal";
  const recommendations: string[] = [];
  
  if (currentHour >= 9 && currentHour <= 17) {
    consumption = 145;
    status = "high";
    recommendations.push("Consider adjusting HVAC settings during peak hours");
    recommendations.push("Enable energy-saving mode on non-essential equipment");
  } else if (currentHour >= 18 && currentHour <= 22) {
    consumption = 110;
    status = "normal";
    recommendations.push("Good energy usage for evening hours");
  } else {
    consumption = 75;
    status = "normal";
    recommendations.push("Turn off lights in unoccupied areas");
    recommendations.push("Reduce HVAC usage during low occupancy");
  }
  
  return { value: consumption, status, recommendations };
}

export function getDetailedRecommendations() {
  return [
    {
      id: 1,
      title: "Turn off lights in empty rooms",
      description: "Occupancy sensors detect 0 people in multiple zones",
      impact: "High",
      savings: "15-20 kWh/day",
      reason: "Zero occupancy detected in 5 rooms",
    },
    {
      id: 2,
      title: "Reduce HVAC usage",
      description: "Temperature is within comfortable range",
      impact: "Medium",
      savings: "10-15 kWh/day",
      reason: "Current temperature: 22°C (optimal range)",
    },
    {
      id: 3,
      title: "Schedule equipment shutdown",
      description: "Non-essential equipment running during off-hours",
      impact: "High",
      savings: "20-25 kWh/day",
      reason: "Equipment detected running at 2 AM",
    },
    {
      id: 4,
      title: "Optimize peak hour consumption",
      description: "High consumption detected during peak electricity rates",
      impact: "Medium",
      savings: "$50-70/month",
      reason: "Peak usage at 14:00-16:00 daily",
    },
  ];
}

export function getFeatureImportance() {
  return [
    { feature: "Hour of Day", importance: 0.35 },
    { feature: "Temperature", importance: 0.28 },
    { feature: "Occupancy", importance: 0.22 },
    { feature: "Day of Week", importance: 0.10 },
    { feature: "Humidity", importance: 0.05 },
  ];
}
