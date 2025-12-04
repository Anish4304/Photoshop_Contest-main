import { X, User, Award, ThumbsUp } from 'lucide-react';
import { Photo } from '../types';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-5xl w-full bg-slate-800 rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-700 text-white rounded-full p-2 transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-slate-900">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 text-white">
            <div className="mb-4">
              <span className="inline-block bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                {photo.category}
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-3">{photo.title}</h2>

            <div className="flex items-center space-x-2 mb-6 text-slate-300">
              <User className="w-5 h-5" />
              <span>{photo.photographerName}</span>
            </div>

            <p className="text-slate-300 mb-8 leading-relaxed">
              {photo.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-slate-400">Judge Score</span>
                </div>
                <div className="text-3xl font-bold text-amber-400">
                  {photo.judgeScore}
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Visitor Votes</span>
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  {photo.visitorVotes}
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-400">
              Uploaded on {new Date(photo.uploadedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
