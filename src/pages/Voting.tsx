import { useState, useEffect } from 'react';
import { ThumbsUp, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllCategories } from '../services/categoryService';
import PhotoModal from '../components/PhotoModal';
import { Photo } from '../types';

export default function Voting() {
  const { photos, addVote } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [votedPhotos, setVotedPhotos] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const handleVote = (photoId: string) => {
    if (!votedPhotos.has(photoId)) {
      addVote(photoId);
      setVotedPhotos((prev) => new Set(prev).add(photoId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ThumbsUp className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Vote for Your Favorites</h1>
          </div>
          <p className="text-slate-400">
            Help choose the winners by voting for the best photographs
          </p>
        </div>

        <div className="mb-8 flex items-center space-x-4 overflow-x-auto pb-4">
          <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const hasVoted = votedPhotos.has(photo.id);
            return (
              <div
                key={photo.id}
                className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-400 transition group"
              >
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {photo.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {photo.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    by {photo.photographerName}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-slate-400">
                      <span className="text-blue-400 font-semibold text-2xl">
                        {photo.visitorVotes}
                      </span>{' '}
                      votes
                    </div>

                    <button
                      onClick={() => handleVote(photo.id)}
                      disabled={hasVoted}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition ${
                        hasVoted
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{hasVoted ? 'Voted' : 'Vote'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No photos available for voting in this category.
            </p>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
