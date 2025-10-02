import React, { memo, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { appointmentApi, pregnancyApi, type Appointment, type PregnancyRecord } from '../services/api';
import { useToast } from '../components/ToastProvider';
import SymptomTracker from '../components/SymptomTracker';
import KickCounter from '../components/KickCounter';
import WeightTracker from '../components/WeightTracker';
import ReminderSystem from '../components/ReminderSystem';

const Card: React.FC<{ title: string; subtitle?: string; className?: string; children?: React.ReactNode }> = ({ title, subtitle, className, children }) => (
  <div className={`rounded-2xl p-4 sm:p-5 shadow border border-black/5 ${className || ''}`}>
    <div className="mb-3">
      <h3 className="text-xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const StatTile: React.FC<{ color: string; icon: React.ReactNode; label: string; value: string }> = ({ color, icon, label, value }) => (
  <div className={`rounded-2xl p-4 text-white`} style={{ background: color }}>
    <div className="flex items-center justify-between">
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{value}</div>
    </div>
    <div className="mt-2 text-white/90" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{label}</div>
  </div>
);

const CircularProgress: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="relative w-40 h-40 mx-auto">
    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="10" fill="none" />
      <circle cx="50" cy="50" r="45" stroke="#ec4899" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${Math.PI * 2 * 45}`} strokeDashoffset={`${Math.PI * 2 * 45 * (1 - percent/100)}`} />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-bold text-pink-600">{percent}%</div>
        <div className="text-gray-500" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Terminé</div>
      </div>
    </div>
  </div>
);

const PregnancyDashboardPage: React.FC = memo(() => {
  const { user } = useAuth();
  const { show } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [record, setRecord] = useState<PregnancyRecord | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApptModal, setShowApptModal] = useState(false);
  const [showApptDetails, setShowApptDetails] = useState<Appointment | null>(null);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [symptomForm, setSymptomForm] = useState<{ name: string; severity: 'léger' | 'modéré' | 'sévère' }>({ name: '', severity: 'léger' });
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showSymptomTracker, setShowSymptomTracker] = useState(false);
  const [showKickCounter, setShowKickCounter] = useState(false);
  const [showWeightTracker, setShowWeightTracker] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [medForm, setMedForm] = useState<{ name: string; dose: string; frequency: string }>({ name: '', dose: '', frequency: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [apptFilter, setApptFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showUltrasoundModal, setShowUltrasoundModal] = useState(false);
  const [usForm, setUsForm] = useState<{ date: string; lengthCm: string; estimatedWeightGrams: string; summary: string }>({ date: '', lengthCm: '', estimatedWeightGrams: '', summary: '' });
  const [symptomFilter, setSymptomFilter] = useState<'all' | 'léger' | 'modéré' | 'sévère'>('all');
  const [symptomQuery, setSymptomQuery] = useState('');
  const [medQuery, setMedQuery] = useState('');
  const [savingAppt, setSavingAppt] = useState(false);
  const [apptForm, setApptForm] = useState<{ date: string; type: string; notes: string }>({
    date: '',
    type: 'Consultation prénatale',
    notes: '',
  });
  // const isDev = import.meta.env.MODE !== 'production';

  useEffect(() => { setIsVisible(true); }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }
      try {
        let [pr, appts] = await Promise.all([
          pregnancyApi.getByUserId(user.id),
          appointmentApi.getByUserId(user.id),
        ]);
        if (!pr && user.profileType === 'pregnant_woman') {
          // créer un dossier de grossesse par défaut si manquant
          const defaultRecord: Omit<PregnancyRecord, 'id'> = {
            userId: user.id,
            dueDate: new Date(Date.now() + 40 * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            currentWeek: 12,
            lastMenstrualPeriod: new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            heightCm: 160,
            weightKg: 60,
            bmi: 23.4,
            babyName: 'Bébé',
            ultrasound: { date: new Date().toISOString().slice(0, 10), summary: 'Dossier initial créé.', estimatedWeightGrams: 100, lengthCm: 10 },
            symptoms: [],
            medications: [],
            nutrition: { caloriesTarget: 2200, waterLitersTarget: 2.3, activityTargetMinPerWeek: 150 },
            medicalParams: {
              systolicMmHg: 110,
              diastolicMmHg: 70,
              fastingGlucoseMgDl: 85,
              hemoglobinGdl: 12.5,
              bmi: 23.4,
              preExistingConditions: [],
              allergies: [],
              riskFlags: [],
            },
            notes: 'Créé automatiquement.'
          };
          pr = await pregnancyApi.create(defaultRecord);
        }
        setRecord(pr);
        setAppointments(appts || []);
      } catch (e) {
        console.error('Erreur chargement données grossesse:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    const handler = () => { refresh(); };
    window.addEventListener('pregnancyDataUpdated', handler as any);
    return () => window.removeEventListener('pregnancyDataUpdated', handler as any);
  }, [user]);

  const refresh = async () => {
    if (!user) return;
    try {
      setRefreshing(true);
      const [pr, appts] = await Promise.all([
        pregnancyApi.getByUserId(user.id),
        appointmentApi.getByUserId(user.id),
      ]);
      setRecord(pr);
      setAppointments(appts || []);
    } finally {
      setRefreshing(false);
    }
  };

  const nextAppointment = useMemo(() => {
    const future = appointments
      .filter(a => new Date(a.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return future[0] || null;
  }, [appointments]);

  const daysUntil = (isoDate?: string) => {
    if (!isoDate) return null;
    const diff = Math.ceil((new Date(isoDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
  };

  const nutritionAdvice = useMemo(() => {
    const week = record?.currentWeek || 0;
    const mp = record?.medicalParams;
    const adv: { label: string; value: number; color: string; tip: string }[] = [];
    const cal = (record?.nutrition?.caloriesTarget || 2200) + (week >= 13 ? 340 : 0) + (week >= 27 ? 112 : 0);
    adv.push({ label: 'Calories', value: Math.min(100, Math.round((cal / 2800) * 100)), color: 'bg-purple-600', tip: `Cible ~${cal} kcal/j` });
    const water = record?.nutrition?.waterLitersTarget || 2.3;
    adv.push({ label: 'Eau', value: Math.min(100, Math.round((water / 3) * 100)), color: 'bg-blue-500', tip: `Cible ${water} L/j` });
    const activity = record?.nutrition?.activityTargetMinPerWeek || 150;
    adv.push({ label: 'Activité physique (sem.)', value: Math.min(100, Math.round((activity / 150) * 100)), color: 'bg-green-600', tip: `${activity} min/sem` });
    if (mp && mp.hemoglobinGdl < 11) {
      adv.push({ label: 'Fer', value: 60, color: 'bg-red-500', tip: 'Augmenter aliments riches en fer + vitamine C' });
    }
    if (mp && mp.fastingGlucoseMgDl > 95) {
      adv.push({ label: 'Glucose', value: 50, color: 'bg-orange-500', tip: 'Réduire sucres rapides, fractionner repas' });
    }
    return adv;
  }, [record]);

  const filteredAppointments = useMemo(() => {
    if (apptFilter === 'all') return appointments.slice().sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime());
    const now = Date.now();
    return appointments
      .filter(a => apptFilter === 'upcoming' ? new Date(a.date).getTime() >= now : new Date(a.date).getTime() < now)
      .sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime());
  }, [appointments, apptFilter]);

  const filteredSymptoms = useMemo(() => {
    let list = record?.symptoms || [];
    if (symptomFilter !== 'all') list = list.filter(s => s.severity === symptomFilter);
    if (symptomQuery.trim()) list = list.filter(s => s.name.toLowerCase().includes(symptomQuery.toLowerCase()));
    return list;
  }, [record?.symptoms, symptomFilter, symptomQuery]);

  const filteredMeds = useMemo(() => {
    let list = record?.medications || [];
    if (medQuery.trim()) list = list.filter(m => `${m.name} ${m.dose} ${m.frequency}`.toLowerCase().includes(medQuery.toLowerCase()));
    return list;
  }, [record?.medications, medQuery]);

  const openApptModal = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setApptForm({ date: nextWeek.toISOString().slice(0, 16), type: 'Consultation prénatale', notes: '' });
    setShowApptModal(true);
  };

  const openSymptomModal = () => {
    try {
      setSymptomForm({ name: '', severity: 'léger' });
      setShowSymptomModal(true);
      console.log('[UI] Ouverture modal symptôme');
    } catch (e) {
      alert('Impossible d\'ouvrir la fenêtre d\'ajout de symptôme');
    }
  };

  const openMedicationModal = () => {
    try {
      setMedForm({ name: '', dose: '', frequency: '' });
      setShowMedicationModal(true);
      console.log('[UI] Ouverture modal médicament');
    } catch (e) {
      alert('Impossible d\'ouvrir la fenêtre d\'ajout de médicament');
    }
  };

  const saveAppointment = async () => {
    if (!user) return;
    try {
      setSavingAppt(true);
      const toCreate = {
        userId: user.id,
        type: apptForm.type,
        date: new Date(apptForm.date).toISOString(),
        status: 'scheduled',
        notes: apptForm.notes,
      } as Omit<Appointment, 'id'>;
      const created = await appointmentApi.create(toCreate);
      setAppointments(prev => [...prev, created]);
      setShowApptModal(false);
      show('Rendez-vous enregistré', 'success');
    } catch (e) {
      console.error('Erreur sauvegarde RDV:', e);
      show('Échec enregistrement du rendez-vous', 'error');
    } finally {
      setSavingAppt(false);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-gray-100 text-gray-900`}> 
      <div className="max-w-md mx-auto px-3 py-4">
        {loading && (
          <div className="rounded-2xl bg-white shadow p-5 mb-4">Chargement…</div>
        )}
        {/* Header de salutation */}
        <div className={`rounded-2xl bg-white shadow p-5 mb-4 transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="text-2xl mb-2" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Bonjour {user?.firstName || 'Utilisateur'} 👋</div>
          <CircularProgress percent={Math.min(100, Math.max(0, Math.round(((record?.currentWeek || 0) / 40) * 100)))} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-pink-50 text-center py-3">
              <div className="text-xs text-gray-500">DPA</div>
              <div className="text-sm font-medium">{formatDate(record?.dueDate)}</div>
            </div>
            <div className="rounded-xl bg-pink-50 text-center py-3">
              <div className="text-xs text-gray-500">Semaine</div>
              <div className="text-sm font-medium">{record?.currentWeek ? `${record.currentWeek}sa` : '—'}</div>
            </div>
            <div className="rounded-xl bg-pink-50 text-center py-3">
              <div className="text-xs text-gray-500">Poids</div>
              <div className="text-sm font-medium">{record?.weightKg ? `${record.weightKg} kg` : '—'}</div>
            </div>
          </div>
          {record?.babyName && (
            <div className="mt-2 text-center text-sm text-gray-700">Bébé: <span className="font-semibold">{record.babyName}</span></div>
          )}
          <div className="mt-3 text-center">
            <button onClick={refresh} className="text-blue-700 underline text-sm" disabled={refreshing}>{refreshing ? 'Rafraîchissement…' : 'Rafraîchir'}</button>
          </div>
        </div>

        {/* Stat tuiles */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatTile color="#0f3d2e" icon={<span>🩺</span>} label="Consultations" value={`${appointments.length}`} />
          <StatTile color="#2b1235" icon={<span>💊</span>} label="Médicaments" value={`${record?.medications?.length || 0}`} />
          <StatTile color="#3b2411" icon={<span>⚠️</span>} label="Symptômes" value={`${record?.symptoms?.length || 0}`} />
        </div>

        {/* Développement de bébé */}
        <Card title="Développement de bébé" subtitle={record?.currentWeek ? `Semaine ${record.currentWeek}` : undefined} className="bg-[#fff7ec] mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Taille</div>
              <div className="font-semibold">{record?.ultrasound?.lengthCm ? `${record.ultrasound.lengthCm} cm` : '—'}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Poids</div>
              <div className="font-semibold">{record?.ultrasound?.estimatedWeightGrams ? `${record.ultrasound.estimatedWeightGrams} g` : '—'}</div>
            </div>
            <div className="mt-3">
              <div className="text-gray-600 mb-2">Taille comparable à :</div>
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">🌽</div>
              <div className="mt-2 text-gray-700" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{record?.currentWeek && record.currentWeek >= 24 ? 'épis de maïs' : 'fruit de saison'}</div>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-white/60 text-gray-700">
              {record?.ultrasound?.summary || 'Aucune note disponible.'}
            </div>
            {record?.medicalParams && (
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 rounded-xl bg-white"><div className="text-gray-500">TA</div><div className="font-semibold">{record.medicalParams.systolicMmHg}/{record.medicalParams.diastolicMmHg}</div></div>
                <div className="p-2 rounded-xl bg-white"><div className="text-gray-500">Glycémie</div><div className="font-semibold">{record.medicalParams.fastingGlucoseMgDl} mg/dL</div></div>
                <div className="p-2 rounded-xl bg-white"><div className="text-gray-500">Hb</div><div className="font-semibold">{record.medicalParams.hemoglobinGdl} g/dL</div></div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <button onClick={() => { const d = new Date(); setUsForm({ date: d.toISOString().slice(0,16), lengthCm: '', estimatedWeightGrams: '', summary: '' }); setShowUltrasoundModal(true); }} className="text-blue-700 underline text-sm">Nouvelle échographie</button>
              {record?.ultrasounds && record.ultrasounds.length > 0 && (
                <button onClick={() => document.getElementById('us-history')?.scrollIntoView({ behavior: 'smooth' })} className="text-blue-700 underline text-sm">Voir l'historique</button>
              )}
            </div>
          </div>
        </Card>

        {/* Prochains RDV */}
        <Card title="Prochains RDV" className="bg-[#eaf8ef] mb-4">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <button className={`${apptFilter==='upcoming'?'font-semibold underline':''}`} onClick={()=>setApptFilter('upcoming')}>À venir</button>
            <span className="text-gray-400">•</span>
            <button className={`${apptFilter==='past'?'font-semibold underline':''}`} onClick={()=>setApptFilter('past')}>Passés</button>
            <span className="text-gray-400">•</span>
            <button className={`${apptFilter==='all'?'font-semibold underline':''}`} onClick={()=>setApptFilter('all')}>Tous</button>
          </div>
          <div className="space-y-2">
            {filteredAppointments.length > 0 ? filteredAppointments.map(ap => (
              <button key={ap.id} onClick={() => setShowApptDetails(ap)} className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">{new Date(ap.date).getDate()}</div>
                  <div>
                    <div className="font-medium">{ap.type}</div>
                    <div className="text-sm text-gray-600">{(() => { const d = daysUntil(ap.date); return d !== null ? (d > 0 ? `Dans ${d} j` : d === 0 ? "Aujourd'hui" : `Il y a ${Math.abs(d)} j`) : ''; })()}</div>
                  </div>
                </div>
                <div>›</div>
              </button>
            )) : (
              <div className="p-3 rounded-xl bg-white text-sm text-gray-600">Aucun rendez-vous à venir.</div>
            )}
          </div>
          <div className="mt-3 text-center">
            <button onClick={openApptModal} className="text-blue-700 font-medium underline">Programmer un RDV</button>
          </div>
        </Card>

        {/* Symptômes actuels */}
        <Card title="Symptômes actuels" className="bg-[#fff1df] mb-4">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <input value={symptomQuery} onChange={e=> setSymptomQuery(e.target.value)} placeholder="Rechercher…" className="flex-1 rounded-xl border border-gray-300 p-2 bg-white" />
            <select value={symptomFilter} onChange={e=> setSymptomFilter(e.target.value as any)} className="rounded-xl border border-gray-300 p-2 bg-white">
              <option value="all">Tous</option>
              <option value="léger">Léger</option>
              <option value="modéré">Modéré</option>
              <option value="sévère">Sévère</option>
            </select>
          </div>
          <div className="space-y-2">
            {filteredSymptoms.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-white">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.severity === 'léger' ? 'bg-green-500' : s.severity === 'modéré' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-600">{s.severity[0].toUpperCase() + s.severity.slice(1)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button className="text-blue-700 underline" onClick={() => { setSymptomForm({ name: s.name, severity: s.severity as any }); setShowSymptomModal(true); }}>Éditer</button>
                  <button className="text-red-600 underline" onClick={async () => { if (!record) return; const updated = await pregnancyApi.removeSymptom(record, s.name); setRecord(updated); show('Symptôme supprimé', 'success'); }}>Supprimer</button>
                </div>
              </div>
            ))}
            {filteredSymptoms.length === 0 && (
              <div className="p-3 rounded-xl bg-white text-sm text-gray-600">Aucun symptôme déclaré.</div>
            )}
            <div className="pt-1 text-center">
              <button type="button" onClick={openSymptomModal} className="text-blue-700 underline text-sm">Ajouter un symptôme</button>
            </div>
          </div>
        </Card>

        {/* Nutrition & Exercice */}
        <Card title="Nutrition & Exercice" className="bg-[#efe7ff] mb-4">
          <div className="space-y-4">
            {nutritionAdvice.map(bar => (
              <div key={bar.label}>
                <div className="text-sm text-gray-700 mb-1 flex justify-between"><span>{bar.label}</span><span className="text-gray-500">{bar.tip}</span></div>
                <div className="h-2 rounded-full bg-white">
                  <div className={`h-2 rounded-full ${bar.color}`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Médicaments */}
        <Card title="Médicaments" className="bg-[#e6f3ff] mb-4">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <input value={medQuery} onChange={e=> setMedQuery(e.target.value)} placeholder="Rechercher…" className="w-full rounded-xl border border-gray-300 p-2 bg-white" />
          </div>
          <div className="space-y-2">
            {filteredMeds.map(med => (
              <div key={med.name} className="p-3 rounded-xl bg-white">
                <div className="font-medium">{med.name}</div>
                <div className="text-sm text-gray-600">{med.dose} • {med.frequency}</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <button className="text-blue-700 underline" onClick={() => { setMedForm({ name: med.name, dose: med.dose, frequency: med.frequency }); setShowMedicationModal(true); }}>Éditer</button>
                  <button className="text-red-600 underline" onClick={async () => { if (!record) return; const updated = await pregnancyApi.removeMedication(record, med.name); setRecord(updated); show('Médicament supprimé', 'success'); }}>Supprimer</button>
                </div>
              </div>
            ))}
            {filteredMeds.length === 0 && (
              <div className="p-3 rounded-xl bg-white text-sm text-gray-600">Aucun médicament enregistré.</div>
            )}
            <div className="pt-1 text-center">
              <button type="button" onClick={openMedicationModal} className="text-blue-700 underline text-sm">Ajouter un médicament</button>
            </div>
          </div>
        </Card>

        {/* Outils de suivi */}
        <Card title="Outils de suivi" className="bg-[#f0f9ff] mb-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSymptomTracker(true)}
              className="flex flex-col items-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Tracker de Symptômes</div>
              <div className="text-xs text-gray-500 text-center">Suivez vos symptômes quotidiennement</div>
            </button>
            
            <button
              onClick={() => setShowKickCounter(true)}
              className="flex flex-col items-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl mb-2">👶</div>
              <div className="text-sm font-medium text-gray-900">Compteur de Mouvements</div>
              <div className="text-xs text-gray-500 text-center">Enregistrez les mouvements du bébé</div>
            </button>
            
            <button
              onClick={() => setShowWeightTracker(true)}
              className="flex flex-col items-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-sm font-medium text-gray-900">Suivi du Poids</div>
              <div className="text-xs text-gray-500 text-center">Surveillez votre prise de poids</div>
            </button>
            
            <button
              onClick={() => setShowReminders(true)}
              className="flex flex-col items-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-sm font-medium text-gray-900">Rappels</div>
              <div className="text-xs text-gray-500 text-center">Programmez vos rappels</div>
            </button>
          </div>
        </Card>

        {/* Historique médical récent */}
        <Card title="Historique médical récent" className="bg-[#ffe8ed] mb-8">
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-white">
              <div className="font-medium">Échographie</div>
              <div className="text-xs text-gray-500">{record?.ultrasound?.date || '—'}</div>
              <div className="text-sm text-gray-700 mt-1">{record?.ultrasound?.summary || '—'}</div>
            </div>
            {nextAppointment && (
              <div className="p-3 rounded-xl bg-white">
                <div className="font-medium">{nextAppointment.type}</div>
                <div className="text-xs text-gray-500">{new Date(nextAppointment.date).toLocaleDateString()}</div>
                <div className="text-sm text-gray-700 mt-1">{nextAppointment.notes || '—'}</div>
              </div>
            )}
          </div>
        </Card>

        {record?.ultrasounds && record.ultrasounds.length > 0 && (
          <Card title="Historique des échographies" className="bg-[#fff7ec] mb-8" >
            <div id="us-history" className="space-y-3">
              <div className="p-3 rounded-xl bg-white">
                {/* Mini-graph longueur */}
                {(() => {
                  const points = record.ultrasounds.map((u, idx) => ({ x: idx, y: u.lengthCm }));
                  const maxY = Math.max(...points.map(p=>p.y));
                  const minY = Math.min(...points.map(p=>p.y));
                  const w = 260; const h = 60; const pad = 6;
                  const toX = (i:number) => pad + (i*(w-2*pad))/Math.max(1, points.length-1);
                  const toY = (v:number) => h - pad - ((v - minY) / Math.max(1, (maxY-minY))) * (h-2*pad);
                  const d = points.map((p,i)=> `${i===0?'M':'L'}${toX(p.x)},${toY(p.y)}`).join(' ');
                  return (
                    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
                      <path d={d} fill="none" stroke="#ec4899" strokeWidth="2" />
                    </svg>
                  );
                })()}
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  {record.ultrasounds.map(u => (
                    <div key={u.date} className="p-2 rounded-xl bg-[#fff7ec]">
                      <div className="font-medium">{new Date(u.date).toLocaleDateString()}</div>
                      <div className="text-gray-700">{u.lengthCm} cm • {u.estimatedWeightGrams} g</div>
                      <div className="text-gray-600">{u.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modal RDV */}
      {showApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowApptModal(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-2 mb-3">
              <span>📅</span>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Rendez-vous médicaux</h2>
            </div>
            <div className="mb-3 p-3 rounded-xl bg-green-50">
              <div className="text-green-700 font-semibold">Prochain rendez-vous</div>
              <div className="text-sm text-green-700/80">Choisissez une date et un type</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date et heure</label>
                <input type="datetime-local" value={apptForm.date} onChange={e => setApptForm({ ...apptForm, date: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Type</label>
                <select value={apptForm.type} onChange={e => setApptForm({ ...apptForm, type: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2 bg-white">
                  <option>Consultation prénatale</option>
                  <option>Échographie</option>
                  <option>Analyse de sang</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Notes</label>
                <textarea value={apptForm.notes} onChange={e => setApptForm({ ...apptForm, notes: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" rows={3} placeholder="Préparez vos questions, carnet de grossesse, mouvements du bébé…" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setShowApptModal(false)} className="text-gray-700">Fermer</button>
              <button disabled={savingAppt} onClick={saveAppointment} className="rounded-xl bg-green-600 px-4 py-2 text-white disabled:opacity-50">{savingAppt ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Boutons de test retirés */}

      {/* Modal Ajouter Symptôme */}
      {showSymptomModal && record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSymptomModal(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow">
            <h2 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Ajouter un symptôme</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nom</label>
                <input value={symptomForm.name} onChange={e => setSymptomForm({ ...symptomForm, name: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Sévérité</label>
                <select value={symptomForm.severity} onChange={e => setSymptomForm({ ...symptomForm, severity: e.target.value as any })} className="w-full rounded-xl border border-gray-300 p-2 bg-white">
                  <option value="léger">Léger</option>
                  <option value="modéré">Modéré</option>
                  <option value="sévère">Sévère</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 gap-2">
              <button onClick={() => setShowSymptomModal(false)} className="px-4 py-2 rounded-xl bg-gray-200">Annuler</button>
              <button onClick={async () => { const updated = await pregnancyApi.addSymptom(record, symptomForm); setRecord(updated); setShowSymptomModal(false); show('Symptôme ajouté', 'success'); }} className="px-4 py-2 rounded-xl bg-green-600 text-white">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Médicament */}
      {showMedicationModal && record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMedicationModal(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow">
            <h2 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Ajouter un médicament</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nom</label>
                <input value={medForm.name} onChange={e => setMedForm({ ...medForm, name: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dose</label>
                  <input value={medForm.dose} onChange={e => setMedForm({ ...medForm, dose: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fréquence</label>
                  <input value={medForm.frequency} onChange={e => setMedForm({ ...medForm, frequency: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" placeholder="p.ex. 1 fois/jour" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 gap-2">
              <button onClick={() => setShowMedicationModal(false)} className="px-4 py-2 rounded-xl bg-gray-200">Annuler</button>
              <button onClick={async () => { const updated = await pregnancyApi.addMedication(record, medForm); setRecord(updated); setShowMedicationModal(false); show('Médicament ajouté', 'success'); }} className="px-4 py-2 rounded-xl bg-green-600 text-white">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Détails RDV */}
      {showApptDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowApptDetails(null)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-2 mb-3">
              <span>🩺</span>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>{showApptDetails.type}</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Date: </span>{new Date(showApptDetails.date).toLocaleString()}</div>
              <div><span className="text-gray-500">Statut: </span>{showApptDetails.status}</div>
              <div><span className="text-gray-500">Notes: </span>{showApptDetails.notes || '—'}</div>
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => setShowApptDetails(null)} className="rounded-xl bg-gray-200 px-4 py-2">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle échographie */}
      {showUltrasoundModal && record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUltrasoundModal(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-2 mb-3">
              <span>🧒</span>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Nouvelle échographie</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date et heure</label>
                <input type="datetime-local" value={usForm.date} onChange={e=> setUsForm({ ...usForm, date: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Taille (cm)</label>
                  <input type="number" value={usForm.lengthCm} onChange={e=> setUsForm({ ...usForm, lengthCm: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Poids estimé (g)</label>
                  <input type="number" value={usForm.estimatedWeightGrams} onChange={e=> setUsForm({ ...usForm, estimatedWeightGrams: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Résumé</label>
                <textarea rows={3} value={usForm.summary} onChange={e=> setUsForm({ ...usForm, summary: e.target.value })} className="w-full rounded-xl border border-gray-300 p-2" />
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 gap-2">
              <button onClick={()=> setShowUltrasoundModal(false)} className="px-4 py-2 rounded-xl bg-gray-200">Annuler</button>
              <button onClick={async ()=> { const u = { date: new Date(usForm.date).toISOString(), lengthCm: Number(usForm.lengthCm), estimatedWeightGrams: Number(usForm.estimatedWeightGrams), summary: usForm.summary }; const updated = await pregnancyApi.addUltrasound(record, u); setRecord(updated); setShowUltrasoundModal(false); show('Échographie enregistrée', 'success'); }} className="px-4 py-2 rounded-xl bg-green-600 text-white">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modales des nouveaux outils */}
      {showSymptomTracker && user && (
        <SymptomTracker
          userId={user.id}
          onClose={() => setShowSymptomTracker(false)}
        />
      )}

      {showKickCounter && user && (
        <KickCounter
          userId={user.id}
          onClose={() => setShowKickCounter(false)}
        />
      )}

      {showWeightTracker && user && (
        <WeightTracker
          userId={user.id}
          onClose={() => setShowWeightTracker(false)}
        />
      )}

      {/* Modale Rappels */}
      {showReminders && user && (
        <ReminderSystem
          userId={user.id}
          onClose={() => setShowReminders(false)}
          onNotify={(m) => show(m, 'info')}
        />
      )}
    </div>
  );
});

export default PregnancyDashboardPage;


