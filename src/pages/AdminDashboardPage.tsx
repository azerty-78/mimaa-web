import React, { useEffect, useMemo, useState } from 'react';
import { Add, Edit, Delete, Save, Close } from '@mui/icons-material';

type Campaign = {
  id?: number;
  title: string;
  organizer?: string | null;
  description?: string | null;
  link: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  status?: string | null;
};

const emptyCampaign: Campaign = {
  title: '',
  organizer: '',
  description: '',
  link: '',
  imageUrl: '',
  thumbnailUrl: '',
  status: 'planned',
};

const AdminDashboardPage: React.FC = () => {
  const [items, setItems] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3001/campaigns');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const startCreate = () => {
    setEditing({ ...emptyCampaign });
    setShowForm(true);
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
    if (!editing) return;
    if (!editing.title?.trim() || !editing.link?.trim()) {
      setError('Titre et lien sont requis');
      return;
    }
    try {
      setError(null);
      if (editing.id) {
        const res = await fetch(`http://localhost:3001/campaigns/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        if (!res.ok) throw new Error('Échec de la mise à jour');
      } else {
        const res = await fetch('http://localhost:3001/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        if (!res.ok) throw new Error('Échec de la création');
      }
      await fetchItems();
      try { window.dispatchEvent(new CustomEvent('campaigns:changed')); } catch {}
      cancelForm();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l’enregistrement');
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Supprimer cette campagne ?')) return;
    try {
      const res = await fetch(`http://localhost:3001/campaigns/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec de la suppression');
      await fetchItems();
      try { window.dispatchEvent(new CustomEvent('campaigns:changed')); } catch {}
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la suppression');
    }
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
          <p className="text-gray-600">Gérez vos campagnes: créer, modifier, supprimer</p>
        </div>
        <button className="inline-flex items-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={startCreate}><Add className="mr-1" /> Nouvelle campagne</button>
      </div>

      {isLoading ? (
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
              <img src={c.imageUrl || c.thumbnailUrl || 'https://via.placeholder.com/800x320/2563eb/ffffff?text=' + encodeURIComponent(c.title)} alt={c.title} className="w-full h-40 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x320/2563eb/ffffff?text=' + encodeURIComponent(c.title); }} />
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
      )}

      {Form}
    </div>
  );
};

export default AdminDashboardPage;

