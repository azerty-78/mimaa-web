import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Timer, Pause, Play, RotateCcw, AlertTriangle } from 'lucide-react';

interface Contraction {
  id: string;
  start: string; // ISO
  end?: string; // ISO
  durationSec?: number;
}

interface ContractionTrackerProps {
  userId: number;
  onClose: () => void;
}

const storageKey = (userId: number) => `contractions_${userId}`;

const ContractionTracker: React.FC<ContractionTrackerProps> = ({ userId, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());
  const [contractions, setContractions] = useState<Contraction[]>([]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try { const raw = localStorage.getItem(storageKey(userId)); if (raw) setContractions(JSON.parse(raw)); } catch {}
  }, [userId]);

  const save = (items: Contraction[]) => {
    setContractions(items);
    try { localStorage.setItem(storageKey(userId), JSON.stringify(items)); } catch {}
  };

  const startContraction = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStart(new Date());
  };

  const stopContraction = () => {
    if (!isRunning || !currentStart) return;
    const end = new Date();
    const durationSec = Math.max(1, Math.round((end.getTime() - currentStart.getTime()) / 1000));
    const item: Contraction = { id: Date.now().toString(), start: currentStart.toISOString(), end: end.toISOString(), durationSec };
    save([item, ...contractions]);
    setIsRunning(false);
    setCurrentStart(null);
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentStart(null);
  };

  const getElapsed = () => {
    if (!isRunning || !currentStart) return '00:00';
    const sec = Math.max(0, Math.floor((now.getTime() - currentStart.getTime()) / 1000));
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = (sec % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const lastFive = useMemo(() => contractions.slice(0, 5), [contractions]);

  const avgIntervalMin = useMemo(() => {
    if (contractions.length < 2) return null;
    const diffs = [] as number[];
    for (let i = 0; i < contractions.length - 1; i++) {
      const a = new Date(contractions[i].start).getTime();
      const b = new Date(contractions[i + 1].start).getTime();
      diffs.push(Math.abs(a - b));
    }
    const avgMs = diffs.reduce((s, v) => s + v, 0) / diffs.length;
    return Math.round((avgMs / 1000 / 60) * 10) / 10; // minutes
  }, [contractions]);

  const warning = avgIntervalMin !== null && avgIntervalMin <= 5;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Tracker de Contractions</h2>
                <p className="text-rose-100">Mesurez durée et fréquence</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-rose-200">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-rose-50 p-4 rounded-xl text-center">
              <div className="text-sm text-rose-800">Durée</div>
              <div className="text-3xl font-bold text-rose-600">{getElapsed()}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-sm text-blue-800">Total</div>
              <div className="text-3xl font-bold text-blue-600">{contractions.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-sm text-green-800">Intervalle moy.</div>
              <div className="text-3xl font-bold text-green-600">{avgIntervalMin ?? '—'}{avgIntervalMin ? ' min' : ''}</div>
            </div>
          </div>

          {warning && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Contractions rapprochées. Si régulières et douloureuses, contactez votre maternité.</span>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <button onClick={startContraction} className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700">
                <Play className="w-5 h-5" /> Démarrer
              </button>
            ) : (
              <>
                <button onClick={stopContraction} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
                  <Pause className="w-5 h-5" /> Arrêter
                </button>
                <button onClick={reset} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700">
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              </>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Récentes</h3>
            {lastFive.length > 0 ? (
              <div className="space-y-2">
                {lastFive.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900">{c.durationSec ? `${c.durationSec}s` : '—'}</div>
                      <div className="text-xs text-gray-600">{new Date(c.start).toLocaleTimeString()}</div>
                    </div>
                    <Timer className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Aucune contraction enregistrée</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractionTracker;


