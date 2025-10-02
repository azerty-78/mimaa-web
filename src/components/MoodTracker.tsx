import React, { useEffect, useState } from 'react';
import { Smile, Frown, Meh, Heart, NotebookPen } from 'lucide-react';

type Mood = 'heureuse' | 'fatiguée' | 'stressée' | 'nauséeuse' | 'calme';

interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: Mood;
  note?: string;
}

interface MoodTrackerProps {
  userId: number;
  onClose: () => void;
}

const MOOD_OPTIONS: { mood: Mood; label: string; icon: React.ReactNode; color: string }[] = [
  { mood: 'heureuse', label: 'Heureuse', icon: <Smile className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800' },
  { mood: 'calme', label: 'Calme', icon: <Heart className="w-5 h-5" />, color: 'bg-green-100 text-green-800' },
  { mood: 'fatiguée', label: 'Fatiguée', icon: <Meh className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800' },
  { mood: 'stressée', label: 'Stressée', icon: <Frown className="w-5 h-5" />, color: 'bg-red-100 text-red-800' },
  { mood: 'nauséeuse', label: 'Nauséeuse', icon: <NotebookPen className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
];

const storageKey = (userId: number) => `moods_${userId}`;

const MoodTracker: React.FC<MoodTrackerProps> = ({ userId, onClose }) => {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [selected, setSelected] = useState<Mood>('calme');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(storageKey(userId)); if (raw) setEntries(JSON.parse(raw)); } catch {}
  }, [userId]);

  const save = (items: MoodEntry[]) => {
    setEntries(items);
    try { localStorage.setItem(storageKey(userId), JSON.stringify(items)); } catch {}
  };

  const addEntry = () => {
    const item: MoodEntry = { id: Date.now().toString(), date, mood: selected, note: note.trim() || undefined };
    const updated = [item, ...entries].sort((a,b)=> b.date.localeCompare(a.date));
    save(updated);
    setNote('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smile className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Journal d'humeur</h2>
                <p className="text-blue-100">Notez comment vous vous sentez</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-blue-200">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" value={date} onChange={e=> setDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Humeur</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {MOOD_OPTIONS.map(opt => (
                  <button key={opt.mood} onClick={()=> setSelected(opt.mood)} className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${selected===opt.mood?'bg-blue-600 text-white border-blue-600':'bg-white border-gray-300'}`}>
                    {opt.icon}
                    <span className="text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (optionnel)</label>
            <textarea value={note} onChange={e=> setNote(e.target.value)} rows={3} placeholder="Décrivez votre journée..." className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <button onClick={addEntry} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">Ajouter</button>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Historique</h3>
            {entries.length > 0 ? (
              <div className="space-y-2">
                {entries.map(e => {
                  const meta = MOOD_OPTIONS.find(m => m.mood === e.mood)!;
                  return (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${meta.color}`}>{meta.label}</span>
                        <span className="text-sm text-gray-600">{new Date(e.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {e.note && <div className="text-sm text-gray-700 max-w-[60%] truncate">{e.note}</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Aucune entrée</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;


