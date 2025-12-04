import { useState } from 'react';
import { Shield, Trash2, Users, ImageIcon, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/sampleData';

export default function AdminDashboard() {
  const { photos, users, deletePhoto } = useApp();
  const [activeTab, setActiveTab] = useState<'photos' | 'users' | 'stats'>('stats');

  const totalPhotos = photos.length;
  const totalUsers = users.length;
  const totalVotes = photos.reduce((sum, p) => sum + p.visitorVotes, 0);
  const avgScore = photos.reduce((sum, p) => sum + p.judgeScore, 0) / totalPhotos;

  const photosPerCategory = categories.map((cat) => ({
    category: cat.name,
    count: photos.filter((p) => p.category === cat.name).length,
  }));

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-10 h-10 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">
            Manage the contest, photos, users, and view statistics
          </p>
        </div>

        <div className="mb-8 flex space-x-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'stats'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'photos'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Photos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Users
          </button>
        </div>

        {activeTab === 'stats' && (
          <div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <ImageIcon className="w-10 h-10 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{totalPhotos}</div>
                <div className="text-blue-100">Total Photos</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <Users className="w-10 h-10 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{totalUsers}</div>
                <div className="text-purple-100">Total Users</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <Trophy className="w-10 h-10 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{totalVotes}</div>
                <div className="text-green-100">Total Votes</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white">
                <Shield className="w-10 h-10 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{avgScore.toFixed(1)}</div>
                <div className="text-amber-100">Avg Score</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Photos Per Category
              </h2>
              <div className="space-y-4">
                {photosPerCategory.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-amber-400 font-bold">
                        {item.count} photos
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.count / totalPhotos) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Top Performers
              </h2>
              <div className="space-y-4">
                {[...photos]
                  .sort((a, b) => b.judgeScore - a.judgeScore)
                  .slice(0, 5)
                  .map((photo, index) => (
                    <div
                      key={photo.id}
                      className="flex items-center space-x-4 bg-slate-700 rounded-lg p-4"
                    >
                      <div className="text-2xl font-bold text-amber-400 w-8">
                        #{index + 1}
                      </div>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-white font-semibold">
                          {photo.title}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {photo.photographerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">
                          {photo.judgeScore}
                        </div>
                        <div className="text-slate-400 text-sm">score</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <div className="mb-4">
              <p className="text-slate-400">
                Total: {photos.length} photos
              </p>
            </div>
            <div className="space-y-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-red-400 transition"
                >
                  <div className="grid md:grid-cols-4 gap-0">
                    <div className="relative h-48 md:h-auto">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="md:col-span-3 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {photo.title}
                        </h3>
                        <p className="text-slate-400 mb-2">
                          by {photo.photographerName}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="bg-amber-500 px-2 py-1 rounded text-white">
                            {photo.category}
                          </span>
                          <span className="text-slate-400">
                            Score: {photo.judgeScore}
                          </span>
                          <span className="text-slate-400">
                            Votes: {photo.visitorVotes}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to delete this photo?'
                            )
                          ) {
                            deletePhoto(photo.id);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="mb-4">
              <p className="text-slate-400">
                Total: {users.length} users
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Photos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-700 ${
                        index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'
                      }`}
                    >
                      <td className="px-6 py-4 text-white">{user.name}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.role === 'admin'
                              ? 'bg-red-500 text-white'
                              : user.role === 'judge'
                              ? 'bg-purple-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {photos.filter((p) => p.photographerId === user.id).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
