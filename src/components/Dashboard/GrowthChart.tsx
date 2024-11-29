import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { formatNumber } from '../../utils/format';

export default function GrowthChart() {
  const [selectedMetric, setSelectedMetric] = useState<'eleitores' | 'liderancas' | 'cidades'>('eleitores');
  const [isOpen, setIsOpen] = useState(false);
  const { growthData, loading } = useDashboard();

  const metrics = {
    eleitores: {
      label: 'Eleitores',
      color: '#22c55e'
    },
    liderancas: {
      label: 'Lideranças',
      color: '#0ea5e9'
    },
    cidades: {
      label: 'Cidades',
      color: '#6366f1'
    }
  };

  const currentMetric = metrics[selectedMetric];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-[300px] flex items-center justify-center">
          <span className="text-gray-500">Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Crescimento</h3>
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {currentMetric.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              {Object.entries(metrics).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedMetric(key as 'eleitores' | 'liderancas' | 'cidades');
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedMetric === key ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={growthData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [formatNumber(value), currentMetric.label]}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={2}
              fill={`url(#colorMetric)`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}