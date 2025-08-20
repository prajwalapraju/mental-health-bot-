import { useQuery } from "@tanstack/react-query";
import MoodTracker from "@/components/mood-tracker";
import { Line } from "react-chartjs-2";
import type { MoodEntry } from "@shared/schema";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Mood() {
  const { data: moodEntries } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood"],
  });

  // Get last 7 days of mood data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = {
    labels: last7Days.map(date => 
      date.toLocaleDateString('en-US', { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Mood',
        data: last7Days.map(date => {
          const dayEntries = moodEntries?.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate.toDateString() === date.toDateString();
          }) || [];
          
          if (dayEntries.length === 0) return null;
          
          // Average mood for the day
          const avgMood = dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length;
          return avgMood;
        }),
        borderColor: 'hsl(217, 91%, 60%)',
        backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'hsl(217, 91%, 60%)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
        ticks: {
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Mood Tracking
        </h1>
        <p className="text-gray-600">Track and visualize your emotional well-being</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Mood Check-in */}
        <div className="space-y-6">
          <MoodTracker />
          
          {/* Recent Entries */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">
              Recent Entries
            </h3>
            <div className="space-y-3">
              {moodEntries?.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {entry.mood === 1 ? '😔' : 
                       entry.mood === 2 ? '😐' : 
                       entry.mood === 3 ? '🙂' : 
                       entry.mood === 4 ? '😊' : '😄'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Mood: {entry.mood}/5
                      </div>
                      {entry.notes && (
                        <div className="text-sm text-gray-600">{entry.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">
                  No mood entries yet. Start tracking your mood above!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mood Trend Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-display font-semibold text-gray-800 mb-6">
            7-Day Mood Trend
          </h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
          
          {/* Mood Statistics */}
          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {moodEntries?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sage-600">
                {moodEntries?.length > 0 
                  ? (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm text-gray-600">Average Mood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {moodEntries?.filter((entry) => entry.mood >= 4).length || 0}
              </div>
              <div className="text-sm text-gray-600">Good Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
