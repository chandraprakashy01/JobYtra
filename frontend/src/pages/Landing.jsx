import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, Users, CheckCircle, Search, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
  const [topStudents, setTopStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/public/top-students')
      .then(res => {
        setTopStudents(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-accentBlue/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="text-center max-w-5xl relative z-10 animate-slideUp">
          <div className="inline-flex items-center space-x-2 bg-lightNavy border border-gray-800 rounded-full px-4 py-2 mb-8 text-sm text-gray-300">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Now accepting applications for 2026 batch</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-6 leading-[1.1] tracking-tight">
            Launch Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-cyan-400">Engineering Career</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Connect with top technology companies. Build your profile, apply for jobs, and track your applications securely in one beautifully designed platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
            <Link to="/jobs" className="btn-primary w-full sm:w-auto py-4 px-8 text-lg font-bold flex items-center justify-center gap-2 group">
              <Search className="w-5 h-5 transition-transform group-hover:scale-110"/> Browse Jobs
            </Link>
            <Link to="/register" className="btn-secondary w-full sm:w-auto py-4 px-8 text-lg font-bold flex items-center justify-center gap-2 group bg-lightNavy/50 backdrop-blur-sm">
              Join Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-lightNavy/50 border-y border-gray-800/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-800">
            <div className="p-4 sm:p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-white">500<span className="text-blue-500">+</span></h3>
              <p className="text-gray-400 text-lg font-medium">Registered Students</p>
            </div>
            <div className="p-4 sm:p-6 flex flex-col items-center pt-10 sm:pt-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-white">50<span className="text-purple-500">+</span></h3>
              <p className="text-gray-400 text-lg font-medium">Hiring Partners</p>
            </div>
            <div className="p-4 sm:p-6 flex flex-col items-center pt-10 sm:pt-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-white">120<span className="text-green-500">+</span></h3>
              <p className="text-gray-400 text-lg font-medium">Students Placed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Partners Section */}
      <section className="py-20 bg-darkNavy/20 relative border-b border-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
              Our Top Hiring Partners
            </h2>
            <p className="text-gray-400 text-lg">Leading tech clients actively recruiting talent from JobYtra</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Google', desc: 'Search, Cloud & AI Solutions', logoColor: 'from-blue-500 via-red-500 to-yellow-500' },
              { name: 'Microsoft', desc: 'Cloud & Productivity Software', logoColor: 'from-blue-600 to-cyan-500' },
              { name: 'Amazon', desc: 'E-Commerce & AWS Cloud Services', logoColor: 'from-amber-500 to-orange-600' },
              { name: 'Meta', desc: 'Social Technologies & Metaverse', logoColor: 'from-blue-500 to-indigo-600' },
              { name: 'Netflix', desc: 'Global Entertainment & Streaming', logoColor: 'from-red-600 to-red-800' },
              { name: 'Adobe', desc: 'Creative Cloud & Document Solutions', logoColor: 'from-red-500 to-rose-600' },
              { name: 'Razorpay', desc: 'Fintech & Payment Gateway Systems', logoColor: 'from-blue-400 to-indigo-500' },
              { name: 'Zomato', desc: 'Food Delivery & Restaurant Discovery', logoColor: 'from-red-500 to-red-600' }
            ].map((client, idx) => (
              <div key={idx} className="card p-6 flex flex-col items-center justify-center text-center border-gray-800 bg-[#161d36]/30 hover:border-accentBlue/30 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${client.logoColor} flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-white/5`}>
                  {client.name.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{client.name}</h4>
                <p className="text-gray-500 text-xs">{client.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Students */}
      <section className="py-24 bg-darkNavy/40 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center justify-center gap-3">
              <Star className="text-yellow-500 w-8 h-8" /> Top Performing Students
            </h2>
            <p className="text-gray-400 text-lg">Meet our academically brightest engineering minds</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading Skeletons
              Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="card flex flex-col items-center p-8 border-gray-800/50 bg-lightNavy/30">
                  <div className="w-24 h-24 rounded-full skeleton mb-4"></div>
                  <div className="h-6 w-32 skeleton rounded mb-3"></div>
                  <div className="h-4 w-24 skeleton rounded mb-4"></div>
                  <div className="h-8 w-20 skeleton rounded-full mb-6"></div>
                  <div className="flex gap-2 w-full justify-center">
                    <div className="h-6 w-16 skeleton rounded"></div>
                    <div className="h-6 w-16 skeleton rounded"></div>
                    <div className="h-6 w-16 skeleton rounded"></div>
                  </div>
                </div>
              ))
            ) : topStudents.length > 0 ? (
              topStudents.map((student, idx) => (
                <div key={idx} className={`card flex flex-col items-center p-8 group border-gray-800/50 bg-gradient-to-b from-lightNavy/50 to-transparent hover:border-accentBlue/40 animate-slideUp animate-stagger-${(idx % 3) + 1}`}>
                  <div className="w-24 h-24 bg-gradient-to-tr from-accentBlue to-cyan-400 rounded-full flex items-center justify-center text-4xl font-bold mb-5 shadow-lg shadow-accentBlue/20 group-hover:scale-110 transition-transform duration-300">
                    {student.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-white">{student.name}</h3>
                  <p className="text-accentBlue mb-4 font-medium">{student.branch}</p>
                  <div className="bg-darkNavy border border-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 flex items-center gap-2">
                    <span className="text-gray-400">CGPA</span>
                    <span className="text-white">{student.cgpa}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {student.skills?.slice(0, 3).map(skill => (
                      <span key={skill} className="text-xs bg-darkNavy border border-gray-800 px-3 py-1.5 rounded-md text-gray-300 font-medium group-hover:border-gray-700 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 px-4 bg-lightNavy/30 rounded-2xl border border-gray-800 border-dashed">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No top students found</h3>
                <p className="text-gray-500 mt-2">Student rankings will appear here once data is available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
