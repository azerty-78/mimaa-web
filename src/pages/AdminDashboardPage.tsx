import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../components/ToastProvider';
import { Add, Edit, Delete, Save, Close, People, Person, PersonAdd, Block, CheckCircle, Search, FilterList, Download, Clear, LocalHospital, LocationOn, Phone, Email } from '@mui/icons-material';
import { campaignApi, userApi, healthCenterApi, type Campaign, type User, type HealthCenter } from '../services/api';

const emptyCampaign: Campaign = {
  title: '',
  organizer: '',
  description: '',
  link: '',
  imageUrl: '',
  thumbnailUrl: '',
  status: 'planned',
};

const emptyHealthCenter: Omit<HealthCenter, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  type: 'hospital',
  address: '',
  city: '',
  region: '',
  phone: '',
  email: '',
  website: '',
  description: '',
  services: [],
  specialties: [],
  capacity: 0,
  isActive: true,
  coordinates: {
    latitude: 0,
    longitude: 0
  },
  images: []
};

const AdminDashboardPage: React.FC = () => {
  const [items, setItems] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingHealthCenters, setIsLoadingHealthCenters] = useState(true);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [editingHealthCenter, setEditingHealthCenter] = useState<HealthCenter | null>(null);
  // const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showHealthCenterForm, setShowHealthCenterForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'users' | 'healthCenters'>('campaigns');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive' | 'pregnant_woman' | 'doctor' | 'administrator'>('all');
  const [healthCenterSearch, setHealthCenterSearch] = useState('');
  const [healthCenterFilter, setHealthCenterFilter] = useState<'all' | 'hospital' | 'clinic' | 'health_center' | 'maternity'>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await campaignApi.getAll();
      setItems(Array.isArray(data) ? data : []);
      toast.show('Campagnes chargées', 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
      toast.show('Erreur lors du chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await userApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
      toast.show('Utilisateurs chargés', 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des utilisateurs');
      toast.show('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchHealthCenters = async () => {
    try {
      setIsLoadingHealthCenters(true);
      const data = await healthCenterApi.getAll();
      setHealthCenters(Array.isArray(data) ? data : []);
      toast.show('Centres de santé chargés', 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des centres de santé');
      toast.show('Erreur lors du chargement des centres de santé', 'error');
    } finally {
      setIsLoadingHealthCenters(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchUsers();
    fetchHealthCenters();
  }, []);

  const startCreate = () => {
    setEditing({ ...emptyCampaign });
    setShowForm(true);
    toast.show('Création d’une campagne', 'info');
  };

  const startEdit = (c: Campaign) => {
    setEditing({ ...c });
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditing(null);
    setShowForm(false);
    setError(null);
  };

  const saveForm = async () => {
    const toastAction = editing?.id ? 'Mise à jour' : 'Création';
    if (!editing) return;
    if (!editing.title?.trim() || !editing.link?.trim()) {
      setError('Titre et lien sont requis');
      toast.show('Titre et lien sont requis', 'error');
      return;
    }
    try {
      setError(null);
      if (editing.id) await campaignApi.update(editing.id as number, editing);
      else await campaignApi.create(editing as any);
      await fetchItems();
      try { window.dispatchEvent(new CustomEvent('campaigns:changed')); } catch {}
      cancelForm();
      toast.show(`${toastAction} réussie`, 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l’enregistrement');
      toast.show('Erreur lors de l’enregistrement', 'error');
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Supprimer cette campagne ?')) return;
    try {
      await campaignApi.delete(id);
      await fetchItems();
      try { window.dispatchEvent(new CustomEvent('campaigns:changed')); } catch {}
      toast.show('Campagne supprimée', 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la suppression');
      toast.show('Erreur lors de la suppression', 'error');
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      await userApi.update(user.id, { isActive: !user.isActive });
      await fetchUsers();
      toast.show(`Utilisateur ${user.isActive ? 'désactivé' : 'activé'}`, 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la modification');
      toast.show('Erreur lors de la modification', 'error');
    }
  };

  // Fonctions pour les centres de santé
  const startCreateHealthCenter = () => {
    setEditingHealthCenter({ ...emptyHealthCenter } as HealthCenter);
    setShowHealthCenterForm(true);
    toast.show('Création d\'un centre de santé', 'info');
  };

  const startEditHealthCenter = (hc: HealthCenter) => {
    setEditingHealthCenter({ ...hc });
    setShowHealthCenterForm(true);
  };

  const cancelHealthCenterForm = () => {
    setEditingHealthCenter(null);
    setShowHealthCenterForm(false);
    setError(null);
  };

  const saveHealthCenterForm = async () => {
    const toastAction = editingHealthCenter?.id ? 'Mise à jour' : 'Création';
    if (!editingHealthCenter) return;
    if (!editingHealthCenter.name?.trim() || !editingHealthCenter.address?.trim()) {
      setError('Nom et adresse sont requis');
      toast.show('Nom et adresse sont requis', 'error');
      return;
    }
    try {
      setError(null);
      if (editingHealthCenter.id) {
        await healthCenterApi.update(editingHealthCenter.id, editingHealthCenter);
      } else {
        await healthCenterApi.create(editingHealthCenter);
      }
      await fetchHealthCenters();
      cancelHealthCenterForm();
      toast.show(`${toastAction} réussie`, 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'enregistrement');
      toast.show('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const removeHealthCenter = async (id?: number) => {
    if (!id) return;
    if (!confirm('Supprimer ce centre de santé ?')) return;
    try {
      await healthCenterApi.delete(id);
      await fetchHealthCenters();
      toast.show('Centre de santé supprimé', 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la suppression');
      toast.show('Erreur lors de la suppression', 'error');
    }
  };

  const toggleHealthCenterStatus = async (healthCenter: HealthCenter) => {
    try {
      await healthCenterApi.update(healthCenter.id, { isActive: !healthCenter.isActive });
      await fetchHealthCenters();
      toast.show(`Centre de santé ${healthCenter.isActive ? 'désactivé' : 'activé'}`, 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la modification');
      toast.show('Erreur lors de la modification', 'error');
    }
  };

  const removeUser = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await userApi.delete(id);
      await fetchUsers();
      toast.show('Utilisateur supprimé', 'success');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la suppression');
      toast.show('Erreur lors de la suppression', 'error');
    }
  };

  const toast = useToast();

  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const pregnant = users.filter(u => u.profileType === 'pregnant_woman').length;
    const doctors = users.filter(u => u.profileType === 'doctor').length;
    const admins = users.filter(u => u.profileType === 'administrator').length;
    return { total, active, pregnant, doctors, admins };
  }, [users]);

  const healthCenterStats = useMemo(() => {
    const total = healthCenters.length;
    const active = healthCenters.filter(hc => hc.isActive).length;
    const hospitals = healthCenters.filter(hc => hc.type === 'hospital').length;
    const clinics = healthCenters.filter(hc => hc.type === 'clinic').length;
    const healthCentersCount = healthCenters.filter(hc => hc.type === 'health_center').length;
    const maternities = healthCenters.filter(hc => hc.type === 'maternity').length;
    return { total, active, hospitals, clinics, healthCenters: healthCentersCount, maternities };
  }, [healthCenters]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    // Filtre par statut
    if (userFilter === 'active') filtered = filtered.filter(u => u.isActive);
    else if (userFilter === 'inactive') filtered = filtered.filter(u => !u.isActive);
    else if (userFilter !== 'all') filtered = filtered.filter(u => u.profileType === userFilter);
    
    // Recherche par nom/email
    if (userSearch.trim()) {
      const query = userSearch.toLowerCase();
      filtered = filtered.filter(u => 
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [users, userFilter, userSearch]);

  const filteredHealthCenters = useMemo(() => {
    let filtered = healthCenters;
    
    // Filtre par type
    if (healthCenterFilter !== 'all') {
      filtered = filtered.filter(hc => hc.type === healthCenterFilter);
    }
    
    // Recherche par nom/adresse/ville
    if (healthCenterSearch.trim()) {
      const query = healthCenterSearch.toLowerCase();
      filtered = filtered.filter(hc => 
        hc.name.toLowerCase().includes(query) ||
        hc.address.toLowerCase().includes(query) ||
        hc.city.toLowerCase().includes(query) ||
        hc.region.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [healthCenters, healthCenterFilter, healthCenterSearch]);

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };


  const bulkActivate = async () => {
    try {
      const promises = selectedUsers.map(id => 
        userApi.update(id, { isActive: true })
      );
      await Promise.all(promises);
      await fetchUsers();
      setSelectedUsers([]);
      toast.show(`${selectedUsers.length} utilisateur(s) activé(s)`, 'success');
    } catch (e: any) {
      toast.show('Erreur lors de l\'activation en lot', 'error');
    }
  };

  const bulkDeactivate = async () => {
    try {
      const promises = selectedUsers.map(id => 
        userApi.update(id, { isActive: false })
      );
      await Promise.all(promises);
      await fetchUsers();
      setSelectedUsers([]);
      toast.show(`${selectedUsers.length} utilisateur(s) désactivé(s)`, 'success');
    } catch (e: any) {
      toast.show('Erreur lors de la désactivation en lot', 'error');
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ?`)) return;
    try {
      const promises = selectedUsers.map(id => userApi.delete(id));
      await Promise.all(promises);
      await fetchUsers();
      setSelectedUsers([]);
      toast.show(`${selectedUsers.length} utilisateur(s) supprimé(s)`, 'success');
    } catch (e: any) {
      toast.show('Erreur lors de la suppression en lot', 'error');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Nom', 'Email', 'Type', 'Statut', 'Date création'].join(','),
      ...filteredUsers.map(u => [
        `"${u.firstName} ${u.lastName}"`,
        `"${u.email}"`,
        `"${u.profileType}"`,
        `"${u.isActive ? 'Actif' : 'Inactif'}"`,
        `"${new Date(u.createdAt || '').toLocaleDateString()}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show('Export CSV généré', 'success');
  };

  const Form = useMemo(() => (
    !showForm || !editing ? null : (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={cancelForm}>
        <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-2xl p-5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{editing.id ? 'Modifier' : 'Créer'} une campagne</h3>
            <button className="p-2 rounded hover:bg-gray-100" onClick={cancelForm}><Close /></button>
          </div>
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Titre *</span>
              <input className="border rounded px-3 py-2" value={editing.title} onChange={e => setEditing(v => ({ ...(v as any), title: e.target.value }))} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Organisateur</span>
              <input className="border rounded px-3 py-2" value={editing.organizer || ''} onChange={e => setEditing(v => ({ ...(v as any), organizer: e.target.value }))} />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm text-gray-600">Lien (site officiel) *</span>
              <input className="border rounded px-3 py-2" value={editing.link} onChange={e => setEditing(v => ({ ...(v as any), link: e.target.value }))} />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm text-gray-600">Description</span>
              <textarea className="border rounded px-3 py-2" rows={3} value={editing.description || ''} onChange={e => setEditing(v => ({ ...(v as any), description: e.target.value }))} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Image URL</span>
              <input className="border rounded px-3 py-2" value={editing.imageUrl || ''} onChange={e => setEditing(v => ({ ...(v as any), imageUrl: e.target.value }))} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Thumbnail URL</span>
              <input className="border rounded px-3 py-2" value={editing.thumbnailUrl || ''} onChange={e => setEditing(v => ({ ...(v as any), thumbnailUrl: e.target.value }))} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Statut</span>
              <select className="border rounded px-3 py-2" value={editing.status || ''} onChange={e => setEditing(v => ({ ...(v as any), status: e.target.value }))}>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={cancelForm}><Close className="mr-1" />Annuler</button>
            <button className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={saveForm}><Save className="mr-1" />Enregistrer</button>
          </div>
        </div>
      </div>
    )
  ), [showForm, editing, error]);

  return (
    <div className="w-full p-3 sm:p-4 space-y-4 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrateur</h1>
          <p className="text-gray-600">Gérez vos campagnes et utilisateurs</p>
        </div>
        <div className="flex gap-2">
        <button className="inline-flex items-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={startCreate}><Add className="mr-1" /> Nouvelle campagne</button>
          <button className="inline-flex items-center px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => setShowUserForm(true)}><PersonAdd className="mr-1" /> Nouvel utilisateur</button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'campaigns' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campagnes
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'healthCenters' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('healthCenters')}
        >
          Centres de Santé
        </button>
      </div>

      {/* Statistiques utilisateurs */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <People className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.active}</div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Person className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.pregnant}</div>
              <div className="text-sm text-gray-600">Femmes enceintes</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Person className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.doctors}</div>
              <div className="text-sm text-gray-600">Médecins</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Person className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.admins}</div>
              <div className="text-sm text-gray-600">Administrateurs</div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterList className="text-gray-400 w-5 h-5" />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les utilisateurs</option>
                  <option value="active">Actifs uniquement</option>
                  <option value="inactive">Inactifs uniquement</option>
                  <option value="pregnant_woman">Femmes enceintes</option>
                  <option value="doctor">Médecins</option>
                  <option value="administrator">Administrateurs</option>
                </select>
              </div>
              <button
                onClick={exportUsers}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Actions en lot */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-800 font-medium">
                    {selectedUsers.length} utilisateur(s) sélectionné(s)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={bulkActivate}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Activer
                  </button>
                  <button
                    onClick={bulkDeactivate}
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
                  >
                    <Block className="w-4 h-4 inline mr-1" />
                    Désactiver
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    <Delete className="w-4 h-4 inline mr-1" />
                    Supprimer
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    <Clear className="w-4 h-4 inline mr-1" />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'campaigns' && (isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0,1,2].map(i => (
            <div key={i} className="bg-white rounded-xl shadow border p-4">
              <div className="w-full h-40 bg-gray-200 animate-pulse mb-3" />
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow border overflow-hidden">
              <img src={c.imageUrl || c.thumbnailUrl || `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='800' height='320'><rect width='100%' height='100%' fill='#2563eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='24' fill='#ffffff'>${(c.title || 'Campagne santé').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`)}`} alt={c.title} className="w-full h-40 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='800' height='320'><rect width='100%' height='100%' fill='#2563eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='24' fill='#ffffff'>${(c.title || 'Campagne santé').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`)}`; }} />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate" title={c.title}>{c.title}</h3>
                <p className="text-sm text-gray-600 truncate" title={c.organizer || ''}>{c.organizer || '—'}</p>
                <div className="mt-3 flex justify-end gap-2">
                  <button className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" onClick={() => startEdit(c)}><Edit fontSize="small" /></button>
                  <button className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => remove(c.id)}><Delete fontSize="small" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Liste des utilisateurs */}
      {activeTab === 'users' && (isLoadingUsers ? (
        <div className="space-y-4">
          {[0,1,2].map(i => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* En-tête avec sélection globale */}
          {filteredUsers.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedUsers.length === filteredUsers.length
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {selectedUsers.length === filteredUsers.length && <CheckCircle className="w-3 h-3" />}
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedUsers.length === filteredUsers.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} utilisateur(s) trouvé(s)
                </span>
              </div>
            </div>
          )}

          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleSelectUser(user.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedUsers.includes(user.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {selectedUsers.includes(user.id) && <CheckCircle className="w-3 h-3" />}
                  </button>
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Person className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.profileType === 'administrator' ? 'bg-purple-100 text-purple-800' :
                        user.profileType === 'doctor' ? 'bg-blue-100 text-blue-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {user.profileType === 'administrator' ? 'Administrateur' :
                         user.profileType === 'doctor' ? 'Médecin' : 'Femme enceinte'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-1.5 rounded text-sm ${
                      user.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    onClick={() => toggleUserStatus(user)}
                  >
                    {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    className="px-3 py-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200"
                    onClick={() => removeUser(user.id)}
                  >
                    <Delete fontSize="small" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <Person className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500">
                {userSearch || userFilter !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche ou de filtre.'
                  : 'Aucun utilisateur n\'est enregistré dans le système.'
                }
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Section Centres de Santé */}
      {activeTab === 'healthCenters' && (
        <div className="space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <LocalHospital className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{healthCenterStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{healthCenterStats.active}</div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <LocalHospital className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{healthCenterStats.hospitals}</div>
              <div className="text-sm text-gray-600">Hôpitaux</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <LocalHospital className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{healthCenterStats.clinics}</div>
              <div className="text-sm text-gray-600">Cliniques</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <LocalHospital className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{healthCenterStats.maternities}</div>
              <div className="text-sm text-gray-600">Maternités</div>
            </div>
          </div>

          {/* Barre d'outils */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un centre de santé..."
                    value={healthCenterSearch}
                    onChange={(e) => setHealthCenterSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={healthCenterFilter}
                  onChange={(e) => setHealthCenterFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="hospital">Hôpitaux</option>
                  <option value="clinic">Cliniques</option>
                  <option value="health_center">Centres de santé</option>
                  <option value="maternity">Maternités</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={startCreateHealthCenter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Add className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Liste des centres de santé */}
          {isLoadingHealthCenters ? (
            <div className="space-y-4">
              {[0,1,2].map(i => (
                <div key={i} className="bg-white rounded-xl shadow p-4">
                  <div className="h-4 w-2/3 bg-gray-200 animate-pulse mb-2" />
                  <div className="h-3 w-1/2 bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHealthCenters.map((healthCenter) => (
                <div key={healthCenter.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <LocalHospital className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{healthCenter.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <LocationOn className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{healthCenter.address}, {healthCenter.city}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{healthCenter.phone}</span>
                          </div>
                          {healthCenter.email && (
                            <div className="flex items-center space-x-1">
                              <Email className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{healthCenter.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            healthCenter.type === 'hospital' ? 'bg-red-100 text-red-800' :
                            healthCenter.type === 'clinic' ? 'bg-blue-100 text-blue-800' :
                            healthCenter.type === 'maternity' ? 'bg-pink-100 text-pink-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {healthCenter.type === 'hospital' ? 'Hôpital' :
                             healthCenter.type === 'clinic' ? 'Clinique' :
                             healthCenter.type === 'maternity' ? 'Maternité' : 'Centre de santé'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            healthCenter.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {healthCenter.isActive ? 'Actif' : 'Inactif'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Capacité: {healthCenter.capacity} lits
                          </span>
                        </div>
                        {healthCenter.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{healthCenter.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className={`px-3 py-1.5 rounded text-sm ${
                          healthCenter.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        onClick={() => toggleHealthCenterStatus(healthCenter)}
                      >
                        {healthCenter.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                        {healthCenter.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        className="px-3 py-1.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                        onClick={() => startEditHealthCenter(healthCenter)}
                      >
                        <Edit fontSize="small" />
                        Modifier
                      </button>
                      <button
                        className="px-3 py-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={() => removeHealthCenter(healthCenter.id)}
                      >
                        <Delete fontSize="small" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredHealthCenters.length === 0 && (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <LocalHospital className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun centre de santé trouvé</h3>
                  <p className="text-gray-500">
                    {healthCenterSearch || healthCenterFilter !== 'all' 
                      ? 'Essayez de modifier vos critères de recherche ou de filtre.'
                      : 'Aucun centre de santé n\'est enregistré dans le système.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {Form}
      
      {/* Formulaire de création/édition des centres de santé */}
      {showHealthCenterForm && editingHealthCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={cancelHealthCenterForm}>
          <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 p-6 border-b">
              <h3 className="text-lg font-bold">
                {editingHealthCenter.id ? 'Modifier le centre de santé' : 'Créer un centre de santé'}
              </h3>
              <button className="p-2 rounded hover:bg-gray-100" onClick={cancelHealthCenterForm}>
                <Close />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Informations de base</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      value={editingHealthCenter.name}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du centre de santé"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      value={editingHealthCenter.type}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hospital">Hôpital</option>
                      <option value="clinic">Clinique</option>
                      <option value="health_center">Centre de santé</option>
                      <option value="maternity">Maternité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <input
                      type="text"
                      value={editingHealthCenter.address}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adresse complète"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        value={editingHealthCenter.city}
                        onChange={(e) => setEditingHealthCenter({...editingHealthCenter, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ville"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Région *</label>
                      <select
                        value={editingHealthCenter.region}
                        onChange={(e) => setEditingHealthCenter({...editingHealthCenter, region: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez une région</option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={editingHealthCenter.phone}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+237 6XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingHealthCenter.email || ''}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contact@centre-sante.cm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <input
                      type="url"
                      value={editingHealthCenter.website || ''}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.centre-sante.cm"
                    />
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Informations supplémentaires</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editingHealthCenter.description || ''}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description du centre de santé..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacité (nombre de lits)</label>
                    <input
                      type="number"
                      value={editingHealthCenter.capacity}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, capacity: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Services (séparés par des virgules)</label>
                    <input
                      type="text"
                      value={editingHealthCenter.services.join(', ')}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, services: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Urgences, Consultations, Chirurgie, Maternité"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialités (séparées par des virgules)</label>
                    <input
                      type="text"
                      value={editingHealthCenter.specialties.join(', ')}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Gynécologie-Obstétrique, Pédiatrie, Chirurgie"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={editingHealthCenter.coordinates?.latitude || ''}
                        onChange={(e) => setEditingHealthCenter({...editingHealthCenter, coordinates: {...editingHealthCenter.coordinates!, latitude: parseFloat(e.target.value) || 0}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={editingHealthCenter.coordinates?.longitude || ''}
                        onChange={(e) => setEditingHealthCenter({...editingHealthCenter, coordinates: {...editingHealthCenter.coordinates!, longitude: parseFloat(e.target.value) || 0}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingHealthCenter.isActive}
                      onChange={(e) => setEditingHealthCenter({...editingHealthCenter, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Centre de santé actif
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={cancelHealthCenterForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={saveHealthCenterForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingHealthCenter.id ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowUserForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Créer un utilisateur</h3>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setShowUserForm(false)}><Close /></button>
            </div>
            <div className="text-center py-8 text-gray-600">
              <PersonAdd className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Fonctionnalité de création d'utilisateur à implémenter</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

