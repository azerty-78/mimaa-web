import React, { memo, useState, useEffect } from 'react';
import { MedicalServices, LocalHospital, MoreVert, Share, Favorite, Comment, Verified, Close } from '@mui/icons-material';

type Campaign = {
  id: number;
  title: string;
  description?: string | null;
  organizer?: string | null;
  imageUrl?: string | null;
  link?: string | null;
  status?: string | null;
};

const HomePage: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://localhost:3001/campaigns');
        if (!response.ok) return;
        const data: Campaign[] = await response.json();
        if (isMounted) setCampaigns(Array.isArray(data) ? data : []);
      } catch (error) {
        // Échec silencieux pour ne pas casser la page
        if (isMounted) setCampaigns([]);
      }
    };
    fetchCampaigns();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (campaign: Campaign) => {
    const hasImage = Boolean(campaign.imageUrl);
    if (hasImage) {
      setActiveImageSrc(campaign.imageUrl as string);
      setIsImageModalOpen(true);
      return;
    }
    if (campaign.link) {
      window.open(campaign.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 space-y-4 min-h-full">
      {/* Header avec animation */}
      <div className={`mb-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Actualités Santé</h1>
        <p className="text-gray-600">Restez informé des dernières campagnes et initiatives</p>
      </div>

      {campaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ animationDelay: `${index * 200}ms` }}
          onClick={() => handleCardClick(campaign)}
          role="button"
          tabIndex={0}
        >
          {/* Image du post */}
          {campaign.imageUrl && (
            <div className="relative">
              <img 
                src={campaign.imageUrl || ''} 
                alt={campaign.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <MoreVert className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Header du post */}
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
                  <p className="text-sm text-gray-500">Il y a 2h</p>
                </div>
              </div>
            </div>

            {/* Contenu du post */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{campaign.title}</h3>
              {campaign.status && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {campaign.status}
                </div>
              )}
              <p className="text-gray-700 leading-relaxed">{campaign.description || '—'}</p>
            </div>

            {/* Actions du post */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Favorite className="w-5 h-5" />
                  <span className="text-sm font-medium">0</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <Comment className="w-5 h-5" />
                  <span className="text-sm font-medium">0</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                  <Share className="w-5 h-5" />
                  <span className="text-sm font-medium">0</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Call to action */}
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ animationDelay: '600ms' }}>
        <h3 className="text-xl font-bold mb-2">Rejoignez notre communauté</h3>
        <p className="text-blue-100 mb-4">Partagez vos expériences et restez connecté</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
          Participer
        </button>
      </div>

      {/* Modale d'image */}
      {isImageModalOpen && activeImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => { setIsImageModalOpen(false); setActiveImageSrc(null); }}>
          <div className="relative max-w-3xl w-[90%]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow hover:bg-gray-50" onClick={() => { setIsImageModalOpen(false); setActiveImageSrc(null); }} aria-label="Fermer">
              <Close className="w-5 h-5 text-gray-700" />
            </button>
            <img src={activeImageSrc} alt="Image campagne" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
});

export default HomePage;
