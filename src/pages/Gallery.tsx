import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllCategories } from '../services/categoryService';
import PhotoModal from '../components/PhotoModal';
import { Photo } from '../types';

export default function Gallery() {
  const { photos } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
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

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Photo Gallery</h1>
          <p className="text-slate-400">
            Browse all submissions from talented photographers
          </p>
        </div>

        <div className="mb-8 flex items-center space-x-4 overflow-x-auto pb-4">
          <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-white'
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
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`group cursor-pointer ${
                index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative overflow-hidden rounded-lg h-full min-h-[300px] bg-slate-800">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    console.error('Image failed to load:', photo.imageUrl);
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-2">
                      <span className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {photo.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {photo.title}
                    </h3>
                    <p className="text-slate-300 mb-3">{photo.photographerName}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-amber-400 font-semibold">
                        Score: {photo.judgeScore}
                      </div>
                      <div className="text-blue-400 font-semibold">
                        Votes: {photo.visitorVotes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No photos found in this category.
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
