// Transform backend photo data to frontend format
export const transformPhoto = (backendPhoto: any) => {
  // Construct full image URL if it's a relative path
  let imageUrl = backendPhoto.imageUrl;
  if (imageUrl && !imageUrl.startsWith('http')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    imageUrl = `${baseUrl}${imageUrl}`;
  }

  const transformed = {
    id: backendPhoto._id,
    title: backendPhoto.title,
    description: backendPhoto.description,
    category: backendPhoto.categoryId?.name || backendPhoto.category || '',
    imageUrl: imageUrl,
    photographerId: backendPhoto.photographerId?._id || backendPhoto.photographerId,
    photographerName: backendPhoto.photographerId?.name || '',
    judgeScore: backendPhoto.judgeScore || 0,
    visitorVotes: backendPhoto.visitorVotes || 0,
    uploadedAt: backendPhoto.createdAt || backendPhoto.uploadedAt || new Date(),
  };

  console.log('Transformed photo:', transformed.title, '→', transformed.imageUrl);
  return transformed;
};

// Transform backend user data to frontend format
export const transformUser = (backendUser: any, role: string) => {
  return {
    id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    role: role as 'photographer' | 'judge' | 'admin' | 'visitor',
  };
};

// Transform backend category data to frontend format
export const transformCategory = (backendCategory: any) => {
  return {
    id: backendCategory._id,
    name: backendCategory.name,
    icon: backendCategory.icon || 'image',
  };
};
