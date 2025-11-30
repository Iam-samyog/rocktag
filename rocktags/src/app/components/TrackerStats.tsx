import type { Cat, Building } from "@/types";

interface TrackerStatsProps {
  cats: Cat[];
  buildings: Building[];
  lastUpdate: Date | null | undefined;
  isUpdating: boolean;
}

function formatTimeAgo(date: Date | null | undefined): string {
  if (!date) return 'Never';
  
  const now = Date.now();
  const secondsAgo = (now - date.getTime()) / 1000;
  
  if (secondsAgo < 60) return `${Math.round(secondsAgo)}s ago`;
  if (secondsAgo < 3600) return `${Math.round(secondsAgo / 60)}m ago`;
  return `${Math.round(secondsAgo / 3600)}h ago`;
}

export function TrackerStats({ cats, buildings, lastUpdate, isUpdating }: TrackerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Cats Card */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Cats Tracked</p>
            <p className="text-4xl font-bold text-gray-900">{cats.length}</p>
          </div>
          <span className="text-5xl">🐱</span>
        </div>
        <p className="text-xs text-gray-600 mt-3">Real-time tracking active</p>
      </div>

      {/* Buildings Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Buildings</p>
            <p className="text-4xl font-bold text-gray-900">{buildings.length}</p>
          </div>
          <span className="text-5xl">🏢</span>
        </div>
        <p className="text-xs text-gray-600 mt-3">On UTA campus</p>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Status</p>
            <p className="text-xl font-bold text-green-600">
              {isUpdating ? 'Updating...' : 'Live'}
            </p>
          </div>
          <span className="text-5xl">{isUpdating ? '⏳' : '🟢'}</span>
        </div>
        <p className="text-xs text-gray-600 mt-3">Last: {formatTimeAgo(lastUpdate)}</p>
      </div>
    </div>
  );
}
