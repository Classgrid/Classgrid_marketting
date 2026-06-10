import { Info, AlertTriangle, XCircle } from 'lucide-react';

export function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'error', children: React.ReactNode }) {
  const Icon = type === 'warning' ? AlertTriangle : type === 'error' ? XCircle : Info;
  
  const colorClasses = {
    info: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200',
    error: 'bg-red-500/10 border-red-500/50 text-red-200'
  };
  
  return (
    <div className={`my-6 flex items-start gap-4 rounded-lg border p-4 ${colorClasses[type]}`}>
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="flex-1 leading-relaxed text-sm font-medium">{children}</div>
    </div>
  );
}
