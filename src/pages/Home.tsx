import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Camera, Eye, ThumbsUp, Trees, User, Bird, Building } from 'lucide-react';
import { getAllCategories } from '../services/categoryService';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const categoryIcons: Record<string, typeof Trees> = {
    Nature: Trees,
    Portrait: User,
    Wildlife: Bird,
    Street: Building,
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 animate-bounce">
            <Camera className="w-20 h-20 text-amber-400 mx-auto" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Capture the <span className="text-amber-400">Moment</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12">
            Join the world's premier photography contest. Share your vision, compete with the best, and win amazing prizes.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/gallery"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105 flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>View Gallery</span>
            </Link>
            <Link
              to="/voting"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105 flex items-center space-x-2"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Vote Now</span>
            </Link>
            <Link
              to="/login"
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105 flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contest Categories
            </h2>
            <p className="text-xl text-slate-400">
              Choose your specialty and showcase your talent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || Trees;
              return (
                <div
                  key={category._id}
                  className="group bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition cursor-pointer transform hover:scale-105"
                >
                  <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400 transition">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-slate-400">
                    Submit your best {category.name.toLowerCase()} photography
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400">
              Simple steps to participate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Register</h3>
              <p className="text-slate-400">
                Create your photographer account and join our community
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Submit</h3>
              <p className="text-slate-400">
                Upload your best photos in one or more categories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Win</h3>
              <p className="text-slate-400">
                Get judged by experts and voted by visitors to win prizes
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <Camera className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">
            &copy; 2024 PhotoContest. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Showcasing the world's best photography
          </p>
        </div>
      </footer>
    </div>
  );
}
