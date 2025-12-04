import { useState, useEffect } from 'react';
import { Award, Save, Trophy, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllCategories } from '../services/categoryService';
import PhotoModal from '../components/PhotoModal';

export default function JudgesPanel() {
  const { photos, updatePhotoScore } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'votes' | 'recent'>('recent');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  let filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  // Apply search filter
  if (searchQuery) {
    filteredPhotos = filteredPhotos.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.photographerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.judgeScore - a.judgeScore;
      case 'votes':
        return b.visitorVotes - a.visitorVotes;
      case 'recent':
      default:
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }
  });

  const currentPhoto = viewMode === 'single' && sortedPhotos.length > 0 ? sortedPhotos[currentPhotoIndex] : null;

  const handleScoreChange = (photoId: string, value: string) => {
    const score = parseInt(value) || 0;
    setScores((prev) => ({ ...prev, [photoId]: score }));
  };

  const handleSaveScore = (photoId: string) => {
    const score = scores[photoId];
    if (score >= 0 && score <= 100) {
      updatePhotoScore(photoId, score);
      alert('Score saved successfully!');
    } else {
      alert('Please enter a score between 0 and 100');
    }
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < sortedPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const announceWinners = () => {
    if (categories.length === 0) {
      alert('Loading categories...');
      return;
    }
    const categoryWinners = categories.map((cat) => {
      const categoryPhotos = photos.filter((p) => p.category === cat.name);
      if (categoryPhotos.length === 0) return null;
      const winner = categoryPhotos.reduce((prev, current) =>
        prev.judgeScore > current.judgeScore ? prev : current
      );
      return `${cat.name}: "${winner.title}" by ${winner.photographerName} (Score: ${winner.judgeScore})`;
    }).filter(Boolean).join('\n');

    const overall = [...photos].sort((a, b) => b.judgeScore - a.judgeScore)[0];
    
    alert(
      `🏆 CONTEST WINNERS ANNOUNCED! 🏆\n\n` +
      `Overall Winner:\n"${overall.title}" by ${overall.photographerName}\nScore: ${overall.judgeScore}\n\n` +
      `Category Winners:\n${categoryWinners}\n\n` +
      `Winners have been announced! Check the Winners page.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-10 h-10 text-amber-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">Judges Panel</h1>
                <p className="text-slate-400">
                  Review and score submitted photographs (0-100 scale)
                </p>
              </div>
            </div>
            <button
              onClick={announceWinners}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold px-6 py-3 rounded-lg transition flex items-center space-x-2 shadow-lg"
            >
              <Trophy className="w-5 h-5" />
              <span>Announce Winners</span>
            </button>
          </div>

          {/* Search and Controls */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, photographer, or description..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition"
              >
                <option value="recent">Most Recent</option>
                <option value="score">Highest Score</option>
                <option value="votes">Most Votes</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg transition"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center space-x-4 overflow-x-auto pb-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories
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

        {/* Single Photo View */}
        {viewMode === 'single' && currentPhoto && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400">
                Photo {currentPhotoIndex + 1} of {sortedPhotos.length}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNextPhoto}
                  disabled={currentPhotoIndex === sortedPhotos.length - 1}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg overflow-hidden border-2 border-amber-500 shadow-2xl">
              <div className="relative">
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.title}
                  className="w-full h-[70vh] object-contain bg-slate-900 cursor-pointer"
                  onClick={() => setSelectedPhoto(currentPhoto)}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {currentPhoto.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {currentPhoto.title}
                </h3>
                <p className="text-slate-400 mb-4 text-lg">
                  by {currentPhoto.photographerName}
                </p>
                <p className="text-slate-300 mb-6 text-lg">{currentPhoto.description}</p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 p-6 rounded-lg">
                    <p className="text-sm text-slate-400 mb-2">Current Score</p>
                    <p className="text-4xl font-bold text-amber-400">
                      {currentPhoto.judgeScore}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-lg">
                    <p className="text-sm text-slate-400 mb-2">Visitor Votes</p>
                    <p className="text-4xl font-bold text-blue-400">
                      {currentPhoto.visitorVotes}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-lg">
                    <label className="text-sm text-slate-400 mb-3 block">
                      Update Score (0-100)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores[currentPhoto.id] ?? currentPhoto.judgeScore}
                        onChange={(e) => handleScoreChange(currentPhoto.id, e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition text-xl"
                      />
                      <button
                        onClick={() => handleSaveScore(currentPhoto.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
        <div className="space-y-6">
          {sortedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400 transition"
            >
              <div className="grid md:grid-cols-3 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {photo.category}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {photo.title}
                  </h3>
                  <p className="text-slate-400 mb-1">
                    by {photo.photographerName}
                  </p>
                  <p className="text-slate-300 mb-6">{photo.description}</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">
                        Current Score
                      </p>
                      <p className="text-3xl font-bold text-amber-400">
                        {photo.judgeScore}
                      </p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">
                        Visitor Votes
                      </p>
                      <p className="text-3xl font-bold text-blue-400">
                        {photo.visitorVotes}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center">
                      <label className="text-sm text-slate-400 mb-2">
                        Update Score (0-100)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scores[photo.id] ?? photo.judgeScore}
                          onChange={(e) =>
                            handleScoreChange(photo.id, e.target.value)
                          }
                          className="w-24 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition"
                        />
                        <button
                          onClick={() => handleSaveScore(photo.id)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition flex items-center space-x-1"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {sortedPhotos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No photos to judge in this category.
            </p>
          </div>
        )}
        </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </div>
    </div>
  );
}
