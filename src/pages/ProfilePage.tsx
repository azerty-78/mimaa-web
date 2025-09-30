import React, { useState, memo, useEffect } from 'react';
import { Edit, Person, Email, Phone, LocationOn, CameraAlt, Save, Close, Verified, TrendingUp, Message, Campaign, PictureAsPdf } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { pregnancyApi, type PregnancyRecord } from '../services/api';

const ProfilePage: React.FC = memo(() => {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    region: user?.region || '',
    profileImage: null as File | null
  });
  const [record, setRecord] = useState<PregnancyRecord | null>(null);
  const [medParamsForm, setMedParamsForm] = useState({
    systolicMmHg: '',
    diastolicMmHg: '',
    fastingGlucoseMgDl: '',
    hemoglobinGdl: '',
    babyName: '',
    weightKg: '',
  });
  const [savingMedical, setSavingMedical] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user || user.profileType !== 'pregnant_woman') return;
      const pr = await pregnancyApi.getByUserId(user.id);
      setRecord(pr);
      setMedParamsForm({
        systolicMmHg: pr?.medicalParams?.systolicMmHg?.toString() || '',
        diastolicMmHg: pr?.medicalParams?.diastolicMmHg?.toString() || '',
        fastingGlucoseMgDl: pr?.medicalParams?.fastingGlucoseMgDl?.toString() || '',
        hemoglobinGdl: pr?.medicalParams?.hemoglobinGdl?.toString() || '',
        babyName: pr?.babyName || '',
        weightKg: pr?.weightKg?.toString() || '',
      });
    };
    load();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      setError('');
    }
  };

  const handleEditClick = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      region: user?.region || '',
      profileImage: null
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    try {
      let profileImageBase64 = user?.profileImage || null;
      if (formData.profileImage) {
        profileImageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.profileImage!);
        });
      }
      const updatedData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        region: formData.region,
        profileImage: profileImageBase64,
      };
      await updateProfile(updatedData);
      setIsEditModalOpen(false);
    } catch (error) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMedicalParams = async () => {
    if (!user || !record) return;
    setSavingMedical(true);
    try {
      const updated = await pregnancyApi.update(record.id, {
        babyName: medParamsForm.babyName || undefined,
        weightKg: medParamsForm.weightKg ? Number(medParamsForm.weightKg) : record.weightKg,
        medicalParams: {
          systolicMmHg: medParamsForm.systolicMmHg ? Number(medParamsForm.systolicMmHg) : (record.medicalParams?.systolicMmHg || 0),
          diastolicMmHg: medParamsForm.diastolicMmHg ? Number(medParamsForm.diastolicMmHg) : (record.medicalParams?.diastolicMmHg || 0),
          fastingGlucoseMgDl: medParamsForm.fastingGlucoseMgDl ? Number(medParamsForm.fastingGlucoseMgDl) : (record.medicalParams?.fastingGlucoseMgDl || 0),
          hemoglobinGdl: medParamsForm.hemoglobinGdl ? Number(medParamsForm.hemoglobinGdl) : (record.medicalParams?.hemoglobinGdl || 0),
          bmi: record.bmi,
          preExistingConditions: record.medicalParams?.preExistingConditions || [],
          allergies: record.medicalParams?.allergies || [],
          riskFlags: record.medicalParams?.riskFlags || [],
        }
      });
      setRecord(updated);
      // Notifier le dashboard qu'il doit se rafraîchir
      window.dispatchEvent(new Event('pregnancyDataUpdated'));
    } finally {
      setSavingMedical(false);
    }
  };

  const exportPdf = () => {
    // Simple export: ouvrir une nouvelle fenêtre avec contenu imprimable
    const w = window.open('', '_blank');
    if (!w || !record) return;
    w.document.write(`<html><head><title>Dossier grossesse</title></head><body>`);
    w.document.write(`<h1>Dossier de ${user?.firstName || ''} ${user?.lastName || ''}</h1>`);
    w.document.write(`<p>DPA: ${record.dueDate} — Semaine: ${record.currentWeek}</p>`);
    w.document.write(`<p>Bébé: ${record.babyName || '-'}</p>`);
    w.document.write(`<h3>Paramètres médicaux</h3>`);
    w.document.write(`<pre>${JSON.stringify(record.medicalParams, null, 2)}</pre>`);
    if (record.ultrasounds?.length) {
      w.document.write(`<h3>Échographies</h3><pre>${JSON.stringify(record.ultrasounds, null, 2)}</pre>`);
    }
    w.document.write(`</body></html>`);
    w.document.close();
    w.print();
  };

  const getProfileTypeLabel = (profileType: string) => {
    switch (profileType) {
      case 'pregnant_woman':
        return 'Femme enceinte';
      case 'doctor':
        return 'Médecin';
      case 'administrator':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { icon: Campaign, label: 'Campagnes suivies', value: '12', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { icon: Message, label: 'Messages reçus', value: '45', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { icon: TrendingUp, label: 'Engagement', value: '89%', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' }
  ];

  if (!user) {
    return (
      <div className="w-full p-3 sm:p-4 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-4 min-h-full">
      {/* Header du profil avec animation */}
      <div className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } transition-all duration-700`}>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden bg-white/20 border-4 border-white/30 shadow-lg">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={`Photo de profil de ${user.username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {getInitials(user.username)}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-blue-100 text-sm">{getProfileTypeLabel(user.profileType)}</p>
            <Verified className="w-4 h-4 text-blue-200" />
          </div>
          <button 
            onClick={handleEditClick}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 hover:scale-105"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier le profil</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className={`grid grid-cols-3 gap-4 mb-6 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } transition-all duration-700`} style={{ animationDelay: '200ms' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`p-3 rounded-lg ${stat.bgColor} mb-2`}>
                <Icon className={`w-6 h-6 ${stat.color.replace('from-', 'text-').replace(' to-', '')}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Informations personnelles */}
      <div className="space-y-4">
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '400ms' }}>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Person className="w-5 h-5 mr-2 text-blue-500" />
            Informations personnelles
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-600 flex items-center">
                <Email className="w-4 h-4 mr-2" />
                Email
              </span>
              <span className="text-gray-800 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-600 flex items-center">
                <Person className="w-4 h-4 mr-2" />
                Nom complet
              </span>
              <span className="text-gray-800 font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Téléphone
              </span>
              <span className="text-gray-800 font-medium">{user.phone || 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-600 flex items-center">
                <LocationOn className="w-4 h-4 mr-2" />
                Région
              </span>
              <span className="text-gray-800 font-medium">{user.region || 'Non renseignée'}</span>
            </div>
          </div>
        </div>

        {/* Préférences */}
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '600ms' }}>
          <h3 className="font-semibold text-gray-800 mb-4">Préférences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <span className="text-gray-800 font-medium">Notifications de santé</span>
                <p className="text-sm text-gray-600">Recevez des alertes importantes</p>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer hover:bg-blue-600 transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <span className="text-gray-800 font-medium">Alertes d'urgence</span>
                <p className="text-sm text-gray-600">Notifications critiques</p>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer hover:bg-blue-600 transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Paramètres médicaux (visible pour femme enceinte) */}
        {user.profileType === 'pregnant_woman' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">Paramètres médicaux</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Nom du bébé</label>
                <input value={medParamsForm.babyName} onChange={e=> setMedParamsForm({ ...medParamsForm, babyName: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Poids (kg)</label>
                <input type="number" value={medParamsForm.weightKg} onChange={e=> setMedParamsForm({ ...medParamsForm, weightKg: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tension systolique</label>
                <input type="number" value={medParamsForm.systolicMmHg} onChange={e=> setMedParamsForm({ ...medParamsForm, systolicMmHg: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tension diastolique</label>
                <input type="number" value={medParamsForm.diastolicMmHg} onChange={e=> setMedParamsForm({ ...medParamsForm, diastolicMmHg: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Glycémie à jeun (mg/dL)</label>
                <input type="number" value={medParamsForm.fastingGlucoseMgDl} onChange={e=> setMedParamsForm({ ...medParamsForm, fastingGlucoseMgDl: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Hémoglobine (g/dL)</label>
                <input type="number" value={medParamsForm.hemoglobinGdl} onChange={e=> setMedParamsForm({ ...medParamsForm, hemoglobinGdl: e.target.value })} className="w-full rounded-lg border border-gray-300 p-2" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={saveMedicalParams} disabled={savingMedical || !record} className="px-4 py-2 rounded-xl bg-green-600 text-white disabled:opacity-50">{savingMedical ? 'Sauvegarde…' : 'Enregistrer'}</button>
              <button onClick={exportPdf} className="px-4 py-2 rounded-xl bg-red-600 text-white flex items-center gap-2"><PictureAsPdf className="w-4 h-4" /> Exporter PDF</button>
            </div>
            {record && (
              <div className="mt-4 text-sm text-gray-700">
                <div>Dernière écho: {record.ultrasound?.date ? new Date(record.ultrasound.date).toLocaleDateString() : '—'}; Taille: {record.ultrasound?.lengthCm || '—'} cm; Poids estimé: {record.ultrasound?.estimatedWeightGrams || '—'} g</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sheet de modification */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header du bottom sheet */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Modifier le profil</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Close className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Contenu du formulaire */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Photo de profil */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil
                </label>
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {formData.profileImage ? (
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    ) : user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Photo de profil actuelle"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CameraAlt className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Nom d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom d'utilisateur"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre prénom"
                />
              </div>

              {/* Nom de famille */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de famille
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom de famille"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+237 6XX XX XX XX"
                />
              </div>

              {/* Région */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez votre région</option>
                  <option value="Adamaoua">Adamaoua</option>
                  <option value="Centre">Centre</option>
                  <option value="Est">Est</option>
                  <option value="Extrême-Nord">Extrême-Nord</option>
                  <option value="Littoral">Littoral</option>
                  <option value="Nord">Nord</option>
                  <option value="Nord-Ouest">Nord-Ouest</option>
                  <option value="Ouest">Ouest</option>
                  <option value="Sud">Sud</option>
                  <option value="Sud-Ouest">Sud-Ouest</option>
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="p-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;

