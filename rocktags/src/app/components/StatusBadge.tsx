interface StatusBadgeProps {
  isUpdating: boolean;
  lastUpdate?: Date;
  hasError?: boolean;
}

export function StatusBadge({ isUpdating, lastUpdate, hasError }: StatusBadgeProps) {
  let status = 'offline';
  let color = 'bg-red-500';
  let text = 'Offline';

  if (hasError) {
    status = 'error';
    color = 'bg-red-500';
    text = '🔴 Connection Error';
  } else if (isUpdating) {
    status = 'live';
    color = 'bg-green-500';
    text = '🟢 Updating';
  } else if (lastUpdate) {
    const secondsAgo = (Date.now() - lastUpdate.getTime()) / 1000;
    if (secondsAgo > 30) {
      status = 'stale';
      color = 'bg-yellow-500';
      text = '🟡 Stale Data';
    } else {
      status = 'live';
      color = 'bg-green-500';
      text = '🟢 Live';
    }
  }

  return (
    <div className={`fixed top-20 right-4 px-4 py-2 rounded-full ${color} text-white text-sm font-semibold shadow-lg flex items-center gap-2 z-10 transition-all duration-300`}>
      <span className={`w-2 h-2 rounded-full ${status === 'live' ? 'animate-pulse' : ''} bg-white`}></span>
      {text}
    </div>
  );
}
