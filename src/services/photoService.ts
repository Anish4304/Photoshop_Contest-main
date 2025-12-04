import api from './api';

export interface Photo {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  photographerId: string;
  categoryId: string;
  galleries?: string[];
  uploadedAt: string;
}

// Get all photos
export const getAllPhotos = async () => {
  try {
    const { data } = await api.get('/photos');
    const photos = data.data || [];
    
    // Fetch all scores and votes in parallel
    const [allScores, allVotes] = await Promise.all([
      api.get('/scores').then(res => res.data.data || []).catch(() => []),
      api.get('/votes').then(res => res.data.data || []).catch(() => [])
    ]);
    
    // Map scores and votes to photos
    return photos.map((photo: any) => {
      const photoScores = allScores.filter((s: any) => s.photoId === photo._id || s.photoId?._id === photo._id);
      const totalJudgeScore = photoScores.reduce((sum: number, s: any) => sum + s.score, 0);
      
      const photoVotes = allVotes.filter((v: any) => v.photoId === photo._id || v.photoId?._id === photo._id);
      const visitorVotes = photoVotes.length;
      
      return {
        ...photo,
        judgeScore: totalJudgeScore,
        visitorVotes: visitorVotes,
      };
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

// Get photos by category
export const getPhotosByCategory = async (categoryId: string) => {
  const { data } = await api.get(`/photos?categoryId=${categoryId}`);
  return data.data || [];
};

// Upload photo
export const uploadPhoto = async (formData: FormData) => {
  const { data } = await api.post('/photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.photo;
};

// Delete photo
export const deletePhoto = async (photoId: string) => {
  const { data } = await api.delete(`/photos/${photoId}`);
  return data;
};
