import React, { memo, useState, useEffect } from 'react';
import { MedicalServices, LocalHospital, MoreVert, Share, Favorite, Comment, Verified, Close } from '@mui/icons-material';
import { useToast } from '../components/ToastProvider';
import { campaignApi, type Campaign } from '../services/api';

const HomePage: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);
  const buildSvgDataUri = (title: string) => {
    const w = 800; const h = 320;
    const bg = '#2563eb';
    const fg = '#ffffff';
    const text = (title || 'Campagne santé').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='28' fill='${fg}'>${text}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
  const defaultImage = buildSvgDataUri('Santé');
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const getTitleImage = (title: string) => buildSvgDataUri(title);

  const toast = useToast();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Hydrater likes/commentaires depuis localStorage
    try {
      const likesRaw = localStorage.getItem('likes');
      if (likesRaw) setLikeCounts(JSON.parse(likesRaw));
      const commentsOpenRaw = localStorage.getItem('commentsOpen');
      if (commentsOpenRaw) setOpenComments(JSON.parse(commentsOpenRaw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('likes', JSON.stringify(likeCounts)); } catch {}
  }, [likeCounts]);

  useEffect(() => {
    try { localStorage.setItem('commentsOpen', JSON.stringify(openComments)); } catch {}
  }, [openComments]);

  useEffect(() => {
    const controller = new AbortController();
    const fromSession = sessionStorage.getItem('campaigns');
    if (fromSession) {
      try {
        const parsed = JSON.parse(fromSession);
        if (Array.isArray(parsed)) {
          setCampaigns(parsed);
          setIsLoading(false);
          return () => controller.abort();
        }
      } catch {}
    }


    const triggerReload = () => {
      // Invalider le cache pour forcer rechargement
      try { sessionStorage.removeItem('campaigns'); } catch {}
      fetchCampaigns();
    };

    fetchCampaigns();
    window.addEventListener('campaigns:changed', triggerReload);
    window.addEventListener('focus', triggerReload);
    return () => controller.abort();
  }, []);

  const openImage = (imageSrc?: string | null) => {
    if (!imageSrc) return;
    setActiveImageSrc(imageSrc);
    setIsImageModalOpen(true);
  };

  const openOfficialSite = (campaign: Campaign) => {
    const url = campaign.link;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async (campaign: Campaign) => {
    const url = campaign.link || window.location.href;
    const shareData = {
      title: campaign.title,
      text: campaign.description || 'Découvrez cette campagne santé',
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData as any);
        toast.show('Lien partagé', 'success');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.show('Lien copié dans le presse-papiers', 'success');
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (_) {}
  };

  const handleLike = (campaignId: number) => {
    setLikeCounts((prev) => ({ ...prev, [campaignId]: (prev[campaignId] || 0) + 1 }));
  };

  const toggleMenu = (campaignId: number) => {
    setOpenMenuId((prev) => (prev === campaignId ? null : campaignId));
  };

  const toggleComments = (campaignId: number) => {
    setOpenComments((prev) => ({ ...prev, [campaignId]: !prev[campaignId] }));
  };

  const submitComment = (campaignId: number) => {
    setCommentTexts((prev) => ({ ...prev, [campaignId]: '' }));
    toast.show('Commentaire envoyé', 'success');
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    // Invalider le cache et recharger
    try { sessionStorage.removeItem('campaigns'); } catch {}
    fetchCampaigns();
  };

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      console.log('🔍 Récupération des campagnes...');
      const data = await campaignApi.getAll();
      console.log('📋 Campagnes récupérées:', data);
      setCampaigns(Array.isArray(data) ? data : []);
      setRetryCount(0); // Reset retry count on success
      try { sessionStorage.setItem('campaigns', JSON.stringify(Array.isArray(data) ? data : [])); } catch {}
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des campagnes:', error);
      if ((error as any)?.name !== 'AbortError') {
        setHasError(true);
        setCampaigns([]);
        const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
        toast.show(`Erreur: ${errorMessage}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 space-y-4 min-h-full">
      <div className={`mb-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Actualités Santé</h1>
        <p className="text-gray-600">Restez informé des dernières campagnes et initiatives</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[0,1,2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="w-full h-56 bg-gray-200 animate-pulse" />
              <div className="p-6">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-3 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-4">
              Impossible de charger les campagnes. Vérifiez votre connexion internet.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Recharger la page
              </button>
            </div>
            {retryCount > 0 && (
              <p className="text-sm text-red-600 mt-2">
                Tentative {retryCount} de 3
              </p>
            )}
          </div>
        </div>
      )}

      {!isLoading && campaigns.map((campaign, index) => {
        if (!campaign.id) return null; // Skip campaigns without ID
        
        return (
        <div
          key={campaign.id}
          className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="relative">
            <img 
              src={(campaign.imageUrl || campaign.thumbnailUrl || getTitleImage(campaign.title) || defaultImage) || ''}
              alt={campaign.title}
              className="w-full h-56 object-cover cursor-zoom-in"
              loading="lazy"
              onClick={() => openImage(campaign.imageUrl || campaign.thumbnailUrl || getTitleImage(campaign.title) || defaultImage)}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = getTitleImage(campaign.title); }}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="relative">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors" aria-label="Options" onClick={(e) => { e.stopPropagation(); toggleMenu(campaign.id!); }}>
                  <MoreVert className="w-5 h-5 text-gray-600" />
                </button>
                {openMenuId === campaign.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); openOfficialSite(campaign); setOpenMenuId(null); }}>
                      Aller au site officiel
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); handleShare(campaign); setOpenMenuId(null); }}>
                      Partager
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {true ? (
                    <MedicalServices className="w-5 h-5 text-white" />
                  ) : (
                    <LocalHospital className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">{campaign.organizer || 'Organisateur'}</span>
                    {true && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Annonce</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {campaign.title}
              </h3>
              {campaign.status && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {campaign.status}
                </div>
              )}
              <p className="text-gray-700 leading-relaxed">{campaign.description || '—'}</p>
              {campaign.link && (
                <div className="mt-3">
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    onClick={() => openOfficialSite(campaign)}
                  >
                    Aller au site officiel
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors" onClick={() => handleLike(campaign.id!)}>
                  <Favorite className="w-5 h-5" />
                  <span className="text-sm font-medium">{likeCounts[campaign.id!] || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors" onClick={() => toggleComments(campaign.id!)}>
                  <Comment className="w-5 h-5" />
                  <span className="text-sm font-medium">Commenter</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors" onClick={() => handleShare(campaign)}>
                  <Share className="w-5 h-5" />
                  <span className="text-sm font-medium">Partager</span>
                </button>
              </div>
            </div>

            {openComments[campaign.id!] && (
              <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <textarea
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Votre commentaire..."
                  value={commentTexts[campaign.id!] || ''}
                  onChange={(e) => setCommentTexts((prev) => ({ ...prev, [campaign.id!]: e.target.value }))}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300" onClick={() => toggleComments(campaign.id!)}>Annuler</button>
                  <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => submitComment(campaign.id!)} disabled={!commentTexts[campaign.id!]?.trim()}>Envoyer</button>
                </div>
              </div>
            )}
          </div>
        </div>
        );
      })}

      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ animationDelay: '600ms' }}>
        <h3 className="text-xl font-bold mb-2">Rejoignez notre communauté</h3>
        <p className="text-blue-100 mb-4">Partagez vos expériences et restez connecté</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
          Participer
        </button>
      </div>

      {isImageModalOpen && activeImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => { setIsImageModalOpen(false); setActiveImageSrc(null); }}>
          <div className="relative max-w-3xl w-[90%]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow hover:bg-gray-50" onClick={() => { setIsImageModalOpen(false); setActiveImageSrc(null); }} aria-label="Fermer">
              <Close className="w-5 h-5 text-gray-700" />
            </button>
            <img src={activeImageSrc} alt="Image campagne" className="w-full h-auto rounded-lg shadow-lg" onError={(e) => { (e.currentTarget as HTMLImageElement).src = defaultImage; }} />
          </div>
        </div>
      )}
    </div>
  );
});

export default HomePage;
