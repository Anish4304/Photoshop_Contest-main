export interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  photographerId: string;
  photographerName: string;
  judgeScore: number;
  visitorVotes: number;
  uploadedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'photographer' | 'judge' | 'admin' | 'visitor';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Winner {
  categoryId: string;
  categoryName: string;
  photo: Photo;
}
