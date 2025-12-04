import { Trophy, Award, Medal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/sampleData';

export default function Winners() {
  const { photos } = useApp();

  const categoryWinners = categories.map((category) => {
    const categoryPhotos = photos.filter((p) => p.category === category.name);
    const winner = categoryPhotos.reduce((prev, current) =>
      prev.judgeScore > current.judgeScore ? prev : current
    );
    return { category: category.name, photo: winner };
  });

  const top3Overall = [...photos]
    .sort((a, b) => b.judgeScore - a.judgeScore)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-20 h-20 text-amber-400 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Contest Winners</h1>
          <p className="text-xl text-slate-400">
            Celebrating excellence in photography
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Overall Top 3
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {top3Overall.map((photo, index) => {
              const medals = [
                { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500', label: '1st Place' },
                { icon: Award, color: 'text-gray-300', bg: 'bg-gray-400', label: '2nd Place' },
                { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-700', label: '3rd Place' },
              ];
              const medal = medals[index];
              const Icon = medal.icon;

              return (
                <div
                  key={photo.id}
                  className={`bg-slate-800 rounded-lg overflow-hidden border-4 ${
                    index === 0
                      ? 'border-yellow-500 transform scale-105'
                      : index === 1
                      ? 'border-gray-400'
                      : 'border-amber-700'
                  } hover:scale-110 transition duration-300`}
                >
                  <div className="relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className={`absolute top-4 right-4 ${medal.bg} rounded-full p-3`}>
                      <Icon className={`w-8 h-8 text-white`} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <span className={`inline-block ${medal.bg} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                        {medal.label}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {photo.title}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      by {photo.photographerName}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-amber-400 font-bold text-xl">
                        Score: {photo.judgeScore}
                      </div>
                      <div className="text-blue-400 font-semibold">
                        {photo.visitorVotes} votes
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Category Winners
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {categoryWinners.map((winner) => (
              <div
                key={winner.category}
                className="bg-slate-800 rounded-lg overflow-hidden border border-amber-500 hover:border-amber-400 transition group"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={winner.photo.imageUrl}
                      alt={winner.photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Trophy className="w-10 h-10 text-amber-400" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-center">
                    <div className="mb-4">
                      <span className="inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        {winner.category} Winner
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {winner.photo.title}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      by {winner.photo.photographerName}
                    </p>
                    <p className="text-slate-300 mb-4 line-clamp-2">
                      {winner.photo.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Judge Score:</span>
                        <span className="text-amber-400 font-bold text-xl">
                          {winner.photo.judgeScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Visitor Votes:</span>
                        <span className="text-blue-400 font-semibold">
                          {winner.photo.visitorVotes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-lg p-12 border border-amber-500/20">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Congratulations to all winners!
          </h3>
          <p className="text-slate-400">
            Thank you to all participants for sharing your incredible photography with us.
          </p>
        </div>
      </div>
    </div>
  );
}
