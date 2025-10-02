import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarClock, Pill, Droplets, AlarmClock, Trash2, CheckCircle, Repeat } from 'lucide-react';

export type ReminderType = 'vitamin' | 'appointment' | 'water' | 'custom';

interface ReminderItem {
  id: string;
  title: string;
  type: ReminderType;
  dateTimeIso: string; // ISO datetime
  repeatDaily?: boolean;
  notes?: string;
  done?: boolean;
}

interface ReminderSystemProps {
  userId: number;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

const typeMeta: Record<ReminderType, { label: string; color: string; icon: React.ReactNode }> = {
  vitamin: { label: 'Vitamines', color: 'bg-amber-100 text-amber-800', icon: <Pill className="w-4 h-4" /> },
  appointment: { label: 'Rendez-vous', color: 'bg-green-100 text-green-800', icon: <CalendarClock className="w-4 h-4" /> },
  water: { label: 'Hydratation', color: 'bg-blue-100 text-blue-800', icon: <Droplets className="w-4 h-4" /> },
  custom: { label: 'Personnalisé', color: 'bg-gray-100 text-gray-800', icon: <Bell className="w-4 h-4" /> },
};

const storageKey = (userId: number) => `reminders_${userId}`;

const ReminderSystem: React.FC<ReminderSystemProps> = ({ userId, onClose, onNotify }) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType>('vitamin');
  const [dateTime, setDateTime] = useState<string>(() => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [notes, setNotes] = useState('');

  // Charger les rappels
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (raw) setReminders(JSON.parse(raw));
    } catch (e) {
      console.error('Erreur chargement rappels:', e);
    }
  }, [userId]);

  const save = (items: ReminderItem[]) => {
    setReminders(items);
    try { localStorage.setItem(storageKey(userId), JSON.stringify(items)); } catch {}
  };

  const addReminder = () => {
    if (!title.trim()) return;
    const item: ReminderItem = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      dateTimeIso: new Date(dateTime).toISOString(),
      repeatDaily,
      notes: notes.trim() || undefined,
      done: false,
    };
    save([item, ...reminders].sort((a,b)=> new Date(a.dateTimeIso).getTime() - new Date(b.dateTimeIso).getTime()));
    setTitle('');
    setNotes('');
    setRepeatDaily(false);
  };

  const removeReminder = (id: string) => {
    save(reminders.filter(r => r.id !== id));
  };

  const markDone = (id: string) => {
    save(reminders.map(r => r.id === id ? { ...r, done: true } : r));
  };

  const upcoming = useMemo(() => reminders.filter(r => new Date(r.dateTimeIso).getTime() >= Date.now() && !r.done).slice(0, 5), [reminders]);

  // Vérification périodique et notification simple (Toast/alert)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      reminders.forEach(rem => {
        const due = new Date(rem.dateTimeIso).getTime();
        if (!rem.done && Math.abs(due - now) < 1000 * 30) { // ±30s
          const msg = `Rappel: ${rem.title}`;
          if (onNotify) onNotify(msg); else alert(msg);
          // Marquer fait si non récurrent, sinon passer au lendemain même heure
          if (rem.repeatDaily) {
            const next = new Date(due);
            next.setDate(next.getDate() + 1);
            rem.dateTimeIso = next.toISOString();
          } else {
            rem.done = true;
          }
          save([...reminders]);
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [reminders, onNotify]);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Rappels personnalisés</h2>
                <p className="text-blue-100">Ne manquez plus vos vitamines, RDV et hydratation</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors">✕</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Formulaire */}
          <div className="bg-gray-50 p-5 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer un rappel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Ex: Prendre vitamine D" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select value={type} onChange={e=> setType(e.target.value as ReminderType)} className="w-full p-3 border border-gray-300 rounded-xl bg-white">
                  <option value="vitamin">Vitamines</option>
                  <option value="appointment">Rendez-vous</option>
                  <option value="water">Hydratation</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & heure</label>
                <input type="datetime-local" value={dateTime} onChange={e=> setDateTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Répéter chaque jour</label>
                <button onClick={()=> setRepeatDaily(v=> !v)} className={`px-3 py-2 rounded-lg border ${repeatDaily?'bg-blue-600 text-white border-blue-600':'bg-white border-gray-300'}`}>
                  <Repeat className="w-4 h-4 inline-block mr-1" /> {repeatDaily ? 'Activé' : 'Désactivé'}
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
                <textarea value={notes} onChange={e=> setNotes(e.target.value)} rows={3} placeholder="Infos complémentaires..." className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <button onClick={addReminder} disabled={!title} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">Ajouter le rappel</button>
          </div>

          {/* À venir */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">À venir</h3>
            {upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcoming.map(r => (
                  <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeMeta[r.type].color}`}>{typeMeta[r.type].label}</span>
                        <span className="text-sm text-gray-500">{formatDateTime(r.dateTimeIso)}</span>
                      </div>
                      <button onClick={() => removeReminder(r.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="mt-2 font-medium text-gray-900">{r.title}</div>
                    {r.notes && <div className="text-sm text-gray-600 mt-1">{r.notes}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Aucun rappel à venir</div>
            )}
          </div>

          {/* Tous les rappels */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tous les rappels</h3>
            {reminders.length > 0 ? (
              <div className="space-y-2">
                {reminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{r.title}</div>
                      <div className="text-xs text-gray-600">{typeMeta[r.type].label} • {formatDateTime(r.dateTimeIso)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!r.done && (
                        <button onClick={() => markDone(r.id)} className="text-green-600 hover:text-green-700" title="Marquer comme fait"><CheckCircle className="w-5 h-5" /></button>
                      )}
                      <button onClick={() => removeReminder(r.id)} className="text-red-500 hover:text-red-700" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Aucun rappel enregistré</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderSystem;
