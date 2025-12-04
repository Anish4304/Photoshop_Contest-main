# Frontend Integration Guide

## 🔗 Connecting Frontend to Backend

### Base URL Configuration

Update your frontend API configuration to point to the backend:

```typescript
// src/config/api.ts or similar
export const API_BASE_URL = 'http://localhost:5000/api';
```

### CORS Configuration

The backend is already configured with CORS enabled for all origins. For production, you should restrict this:

```typescript
// backend/src/server.ts (already set up)
app.use(cors()); // Currently allows all origins
```

For production, update to:
```typescript
app.use(cors({
  origin: 'http://your-frontend-domain.com',
  credentials: true
}));
```

## 🔐 Authentication Flow

### 1. Register/Login

```typescript
// Login example
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token in localStorage or context
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  }
  
  throw new Error(data.message);
};
```

### 2. Making Authenticated Requests

```typescript
// Helper function for authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};

// Usage
const getMyProfile = () => fetchWithAuth('/auth/me');
```

### 3. Photo Upload

```typescript
const uploadPhoto = async (photoData: {
  title: string;
  description: string;
  categoryId: string;
  imageFile: File;
}) => {
  const formData = new FormData();
  formData.append('image', photoData.imageFile);
  formData.append('title', photoData.title);
  formData.append('description', photoData.description);
  formData.append('categoryId', photoData.categoryId);
  
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/photos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return response.json();
};
```

## 📡 API Integration Examples

### Get Categories

```typescript
const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await response.json();
  return data.data; // Array of categories
};
```

### Get Photos

```typescript
const getPhotos = async (categoryId?: string) => {
  const url = categoryId 
    ? `${API_BASE_URL}/photos?categoryId=${categoryId}`
    : `${API_BASE_URL}/photos`;
    
  const response = await fetch(url);
  const data = await response.json();
  return data.data; // Array of photos
};
```

### Submit Vote

```typescript
const submitVote = async (visitorId: string, photoId: string) => {
  const response = await fetch(`${API_BASE_URL}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ visitorId, photoId }),
  });
  
  return response.json();
};
```

### Get Winners

```typescript
const getWinners = async (categoryId?: string) => {
  const url = categoryId
    ? `${API_BASE_URL}/winners?categoryId=${categoryId}`
    : `${API_BASE_URL}/winners`;
    
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};
```

### Analytics

```typescript
const getHighestScoredPhoto = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/highest-scored-photo`);
  const data = await response.json();
  return data.data;
};

const getPhotographersMultipleCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/photographers-multiple-categories`);
  const data = await response.json();
  return data.data;
};
```

## 🎨 React Context Setup Example

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setToken(data.data.token);
      setUser(data.data);
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

## 📸 Image Display

Photos are served from the backend at:
```
http://localhost:5000/uploads/filename.jpg
```

In your React component:
```tsx
<img 
  src={`http://localhost:5000${photo.imageUrl}`} 
  alt={photo.title}
/>
```

Or create a helper:
```typescript
export const getImageUrl = (imageUrl: string) => {
  return `http://localhost:5000${imageUrl}`;
};

// Usage
<img src={getImageUrl(photo.imageUrl)} alt={photo.title} />
```

## 🔄 State Management Example (React Query)

```typescript
// src/hooks/usePhotos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePhotos = (categoryId?: string) => {
  return useQuery({
    queryKey: ['photos', categoryId],
    queryFn: async () => {
      const url = categoryId 
        ? `http://localhost:5000/api/photos?categoryId=${categoryId}`
        : 'http://localhost:5000/api/photos';
      const response = await fetch(url);
      const data = await response.json();
      return data.data;
    },
  });
};

export const useSubmitPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (photoData: any) => {
      const formData = new FormData();
      formData.append('image', photoData.imageFile);
      formData.append('title', photoData.title);
      formData.append('description', photoData.description);
      formData.append('categoryId', photoData.categoryId);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};
```

## 🎯 TypeScript Types for Frontend

```typescript
// src/types/api.ts
export interface Category {
  _id: string;
  name: 'Nature' | 'Portrait' | 'Wildlife' | 'Street';
  description?: string;
  submissionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Photographer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  role: 'photographer';
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  photographerId: string | Photographer;
  categoryId: string | Category;
  galleries: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Judge {
  _id: string;
  name: string;
  email: string;
  expertise?: string;
  role: 'judge';
  createdAt: string;
  updatedAt: string;
}

export interface Winner {
  _id: string;
  photoId: string | Photo;
  categoryId: string | Category;
  position: number;
  totalScore: number;
  announcement?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
}
```

## 🚀 Complete API Service Example

```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()),

  register: (userData: any) =>
    fetch(`${API_BASE_URL}/auth/register/photographer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),

  // Categories
  getCategories: () =>
    fetch(`${API_BASE_URL}/categories`).then(res => res.json()),

  // Photos
  getPhotos: (categoryId?: string) =>
    fetch(`${API_BASE_URL}/photos${categoryId ? `?categoryId=${categoryId}` : ''}`)
      .then(res => res.json()),

  getPhoto: (id: string) =>
    fetch(`${API_BASE_URL}/photos/${id}`).then(res => res.json()),

  uploadPhoto: (formData: FormData) =>
    fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }).then(res => res.json()),

  // Winners
  getWinners: (categoryId?: string) =>
    fetch(`${API_BASE_URL}/winners${categoryId ? `?categoryId=${categoryId}` : ''}`)
      .then(res => res.json()),

  // Analytics
  getHighestScoredPhoto: () =>
    fetch(`${API_BASE_URL}/analytics/highest-scored-photo`).then(res => res.json()),

  getPhotographersMultipleCategories: () =>
    fetch(`${API_BASE_URL}/analytics/photographers-multiple-categories`)
      .then(res => res.json()),

  // Votes
  addVisitor: (name: string, email: string) =>
    fetch(`${API_BASE_URL}/votes/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    }).then(res => res.json()),

  submitVote: (visitorId: string, photoId: string) =>
    fetch(`${API_BASE_URL}/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, photoId }),
    }).then(res => res.json()),
};
```

## 📋 Environment Variables for Frontend

Create a `.env` file in your frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_IMAGE_BASE_URL=http://localhost:5000
```

Usage:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_API_IMAGE_BASE_URL;
```

## ✅ Integration Checklist

- [ ] Update API base URL in frontend
- [ ] Implement authentication context
- [ ] Add token to all protected requests
- [ ] Create API service layer
- [ ] Add TypeScript types
- [ ] Handle file uploads for photos
- [ ] Display images from backend
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test all endpoints

## 🎉 Ready to Integrate!

Your backend is fully functional and ready to connect with the React frontend. All endpoints are tested and working!
