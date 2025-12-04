import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Photo, User } from '../types';
import { getAllPhotos, deletePhoto as deletePhotoAPI } from '../services/photoService';
import { submitScore } from '../services/judgeService';
import { submitVote } from '../services/voteService';
import { getCurrentUser as getCurrentUserAPI } from '../services/authService';
import { transformPhoto, transformUser } from '../utils/transformers';

interface AppContextType {
  photos: Photo[];
  users: User[];
  currentUser: User | null;
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  updatePhotoScore: (photoId: string, score: number) => void;
  addVote: (photoId: string, visitorEmail: string, visitorName: string) => void;
  deletePhoto: (photoId: string) => void;
  refreshPhotos: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [users] = useState<User[]>([]); // Keeping for compatibility, but auth now uses API
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load photos on mount
  useEffect(() => {
    refreshPhotos();
  }, []);

  // Load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUserAPI();
      setCurrentUser(user);
      setLoading(false);
    };
    loadUser();
  }, []);

  const refreshPhotos = async () => {
    try {
      const fetchedPhotos = await getAllPhotos();
      console.log('Fetched photos:', fetchedPhotos.length);
      const transformedPhotos = fetchedPhotos.map((photo: any) => transformPhoto(photo));
      console.log('Transformed photos sample:', transformedPhotos[0]);
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const updatePhotoScore = async (photoId: string, score: number) => {
    try {
      await submitScore(photoId, score);
      // Refresh photos to get updated scores
      await refreshPhotos();
    } catch (error: any) {
      console.error('Error updating score:', error);
      alert(error.response?.data?.message || 'Failed to update score. Please login as a judge.');
      throw error;
    }
  };

  const addVote = async (photoId: string, visitorEmail: string, visitorName: string) => {
    try {
      await submitVote(photoId, visitorEmail, visitorName);
      // Update local state
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? { ...photo, visitorVotes: photo.visitorVotes + 1 }
            : photo
        )
      );
    } catch (error) {
      console.error('Error adding vote:', error);
      throw error;
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await deletePhotoAPI(photoId);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        photos,
        users,
        currentUser,
        loading,
        setCurrentUser,
        updatePhotoScore,
        addVote,
        deletePhoto,
        refreshPhotos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
