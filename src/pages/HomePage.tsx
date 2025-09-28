import React, { memo, useState, useEffect } from 'react';
import { MedicalServices, LocalHospital, MoreVert, Share, Favorite, Comment, Verified } from '@mui/icons-material';

const HomePage: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const posts = [
    {
      id: 1,
      title: "Campagne de santé centre Pasteur",
      image: "/api/placeholder/400/200",
      author: "Centre Pasteur",
      verified: true,
      type: "campaign",
      content: "Nouvelle campagne de sensibilisation sur la santé maternelle et infantile.",
      stats: { likes: 124, comments: 23, shares: 8 }
    },
    {
      id: 2,
      title: "JOURNÉES NATIONALES DE VACCINATION",
      subtitle: "RIPOSTE À L'ÉPIDÉMIE DE POLIOMYÉLITE",
      author: "Ministère de la Santé",
      verified: true,
      type: "vaccination",
      date: "DU 29 MAI AU 1ER JUIN 2025",
      content: "Permettons à nos enfants de 1 à 5 ans de recevoir leur dose de vitamine A et faisons vacciner tous nos enfants de 0 à 5 ans.",
      stats: { likes: 456, comments: 67, shares: 34 }
    }
  ];

  return (
    <div className="w-full p-3 sm:p-4 space-y-4 min-h-full">
      {/* Header avec animation */}
      <div className={`mb-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Actualités Santé</h1>
        <p className="text-gray-600">Restez informé des dernières campagnes et initiatives</p>
      </div>

      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          {/* Image du post */}
          {post.image && (
            <div className="relative">
              <img 
                src={post.image} 
                alt={post.title} 
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
                  {post.type === 'campaign' ? (
                    <MedicalServices className="w-5 h-5 text-white" />
                  ) : (
                    <LocalHospital className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">{post.author}</span>
                    {post.verified && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Il y a 2h</p>
                </div>
              </div>
            </div>

            {/* Contenu du post */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
              {post.subtitle && (
                <h4 className="text-base font-semibold text-green-600 mb-2">{post.subtitle}</h4>
              )}
              {post.date && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {post.date}
                </div>
              )}
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </div>

            {/* Actions du post */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Favorite className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.stats.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <Comment className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.stats.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                  <Share className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.stats.shares}</span>
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
    </div>
  );
});

export default HomePage;
