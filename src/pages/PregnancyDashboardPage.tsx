import React, { memo, useEffect, useState } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <div className={`w-full min-h-screen bg-gray-100 text-gray-900`}> 
      <div className="max-w-md mx-auto px-3 py-4">
        {/* Header de salutation */}
        <div className={`rounded-2xl bg-white shadow p-5 mb-4 transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="text-2xl mb-2" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>Bonjour User Name 👋</div>
          <CircularProgress percent={60} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-pink-50 text-center py-3">
              <div className="text-xs text-gray-500">DPA</div>
              <div className="text-sm font-medium">17/11</div>
            </div>
            <div className="rounded-xl bg-pink-50 text-center py-3">
              <div className="text-xs text-gray-500">Emma</div>
              <div className="text-sm font-medium">30sa</div>
            </div>
            <div className="rounded-xl bg-pink-50 text-center py-3">
              <div className="text-xs text-gray-500">Poids</div>
              <div className="text-sm font-medium">—</div>
            </div>
          </div>
        </div>

        {/* Stat tuiles */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatTile color="#0f3d2e" icon={<span>🩺</span>} label="Consultations" value="12" />
          <StatTile color="#2b1235" icon={<span>💊</span>} label="Médicaments" value="3" />
          <StatTile color="#3b2411" icon={<span>⚠️</span>} label="Symptômes" value="3" />
        </div>

        {/* Développement de bébé */}
        <Card title="Développement de bébé" subtitle="Semaine 24" className="bg-[#fff7ec] mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Taille</div>
              <div className="font-semibold">30.0 cm</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Poids</div>
              <div className="font-semibold">600 g</div>
            </div>
            <div className="mt-3">
              <div className="text-gray-600 mb-2">Taille comparable à :</div>
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">🌽</div>
              <div className="mt-2 text-gray-700" style={{ fontFamily: 'Comic Sans MS, ui-rounded, system-ui' }}>épis de maïs</div>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-white/60 text-gray-700">
              Les poumons de bébé commencent à produire du surfactant, une substance qui l'aidera à respirer après la naissance.
            </div>
          </div>
        </Card>

        {/* Prochains RDV */}
        <Card title="Prochains RDV" className="bg-[#eaf8ef] mb-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">7</div>
              <div>
                <div className="font-medium">Consultation prénatale</div>
                <div className="text-sm text-gray-600">Dans 14 jours</div>
              </div>
            </div>
            <div>›</div>
          </div>
        </Card>

        {/* Symptômes actuels */}
        <Card title="Symptômes actuels" className="bg-[#fff1df] mb-4">
          <div className="space-y-2">
            {[
              { label: 'Nausées matinales', niveau: 'Léger', color: 'bg-green-500' },
              { label: 'Fatigue', niveau: 'Modéré', color: 'bg-orange-500' },
              { label: 'Douleurs lombaires', niveau: 'Léger', color: 'bg-green-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-white">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-sm text-gray-600">{s.niveau}</div>
                  </div>
                </div>
                <div>›</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Nutrition & Exercice */}
        <Card title="Nutrition & Exercice" className="bg-[#efe7ff] mb-4">
          <div className="space-y-4">
            {[
              { label: 'Calories', value: 70, color: 'bg-purple-600' },
              { label: 'Eau', value: 60, color: 'bg-blue-500' },
              { label: 'Activité physique (Cette semaine)', value: 80, color: 'bg-green-600' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="text-sm text-gray-700 mb-1">{bar.label}</div>
                <div className="h-2 rounded-full bg-white">
                  <div className={`h-2 rounded-full ${bar.color}`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Médicaments */}
        <Card title="Médicaments" className="bg-[#e6f3ff] mb-4">
          <div className="space-y-2">
            {[
              { name: 'Acide Folique', dose: '400µg • 1 fois par jour' },
              { name: 'Fer', dose: '65mg • 1 fois par jour' },
            ].map(med => (
              <div key={med.name} className="p-3 rounded-xl bg-white">
                <div className="font-medium">{med.name}</div>
                <div className="text-sm text-gray-600">{med.dose}</div>
              </div>
            ))}
            <div className="text-center text-sm text-gray-600">+ 1 autre</div>
          </div>
        </Card>

        {/* Historique médical récent */}
        <Card title="Historique médical récent" className="bg-[#ffe8ed] mb-8">
          <div className="space-y-2">
            {[
              { title: 'Consultation', date: '09/09/2025', desc: 'Contrôle de routine – tout va bien.' },
              { title: 'Échographie', date: '26/08/2025', desc: 'Échographie morphologique – développement normal' },
              { title: 'Prise de sang', date: '12/08/2025', desc: 'Analyses sanguines – légère carence en fer' },
            ].map(item => (
              <div key={item.title} className="p-3 rounded-xl bg-white">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.date}</div>
                <div className="text-sm text-gray-700 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
});

export default PregnancyDashboardPage;


