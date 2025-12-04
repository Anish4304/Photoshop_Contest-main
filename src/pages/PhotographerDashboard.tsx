import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Trophy, ThumbsUp, Eye, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Photo } from '../types';
import PhotoModal from '../components/PhotoModal';
import { uploadPhoto } from '../services/photoService';
import { getAllCategories } from '../services/categoryService';

export default function PhotographerDashboard() {
  const { photos, currentUser, deletePhoto, refreshPhotos } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const cats = await getAllCategories();
        console.log('Loaded categories:', cats);
        setCategories(cats);
        if (cats.length > 0) {
          setCategoryId(cats[0]._id);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const userPhotos = photos.filter(
    (p) => p.photographerId === currentUser?.id
  );

  // Calculate statistics
  const totalScore = userPhotos.reduce((sum, p) => sum + p.judgeScore, 0);
  const totalVotes = userPhotos.reduce((sum, p) => sum + p.visitorVotes, 0);
  const avgScore = userPhotos.length > 0 ? (totalScore / userPhotos.length).toFixed(1) : 0;
  const highestScored = userPhotos.length > 0 ? userPhotos.reduce((prev, current) => 
    prev.judgeScore > current.judgeScore ? prev : current
  ) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!currentUser || !selectedFile || !categoryId) {
      setSubmitError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedFile); // Backend expects 'image' field name
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);

      // Upload to backend
      await uploadPhoto(formData);

      // Refresh photos from backend
      await refreshPhotos();

      // Reset form
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?._id || '');
      setSelectedFile(null);
      setImagePreview('');
      setShowForm(false);
      setSubmitError('');
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setSubmitError(error.response?.data?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Photographer Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back, {currentUser?.name}! Manage your submissions here.
          </p>
        </div>

        {/* Statistics Dashboard */}
        {userPhotos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <ImageIcon className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">{userPhotos.length}</span>
              </div>
              <p className="text-slate-400 text-sm">Total Submissions</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 text-amber-400" />
                <span className="text-3xl font-bold text-amber-400">{avgScore}</span>
              </div>
              <p className="text-slate-400 text-sm">Average Score</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <ThumbsUp className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-green-400">{totalVotes}</span>
              </div>
              <p className="text-slate-400 text-sm">Total Votes</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-purple-400">{highestScored?.judgeScore || 0}</span>
              </div>
              <p className="text-slate-400 text-sm">Best Score</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Submit New Photo</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Upload Your Photo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition"
                  placeholder="Enter a captivating title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition"
                  placeholder="Describe your photo..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category {categoriesLoading && <span className="text-amber-400">(Loading...)</span>}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition"
                  required
                  disabled={categoriesLoading || categories.length === 0}
                >
                  {categoriesLoading ? (
                    <option value="">Loading categories...</option>
                  ) : categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">
                    ⚠️ Backend not connected. Please start the backend server.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Upload Photo
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg transition-all ${
                    isDragging
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-600 bg-slate-700'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="block px-6 py-8 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Upload
                        className={`w-12 h-12 ${
                          isDragging ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      />
                      <div className="text-center">
                        <p className="text-slate-300 font-medium">
                          {selectedFile ? (
                            <span className="text-amber-400">
                              {selectedFile.name}
                            </span>
                          ) : isDragging ? (
                            <span className="text-amber-400">
                              Drop your image here
                            </span>
                          ) : (
                            <>
                              Drag & drop your photo here, or{' '}
                              <span className="text-amber-400 underline">
                                browse
                              </span>
                            </>
                          )}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          Supports: JPG, PNG, GIF (Max 10MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-amber-400/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {submitError && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                  {submitError}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSubmitError('');
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Your Submissions ({userPhotos.length})
          </h2>

          {userPhotos.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
              <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                You haven't submitted any photos yet.
              </p>
              <p className="text-slate-500 mt-2">
                Click the button above to upload your first photo!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400 transition group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300 cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {photo.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {photo.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {photo.description}
                    </p>

                    <div className="flex justify-between items-center text-sm mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span>
                            Score:{' '}
                            <span className="text-amber-400 font-semibold">
                              {photo.judgeScore}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                          <ThumbsUp className="w-4 h-4 text-blue-400" />
                          <span>
                            Votes:{' '}
                            <span className="text-blue-400 font-semibold">
                              {photo.visitorVotes}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setSelectedPhoto(photo)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                          title="View Photo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
