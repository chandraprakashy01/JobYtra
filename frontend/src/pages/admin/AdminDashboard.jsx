import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="animate-fadeIn">
                <div className="h-8 w-64 skeleton rounded mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="card h-32 skeleton rounded-xl"></div>
                    ))}
                </div>
                <div className="card h-96 skeleton rounded-xl"></div>
            </div>
        );
    }

    if (!stats) return <div className="text-center text-gray-500 py-12">Failed to load stats.</div>;

    const data = [
        { name: 'Students', value: stats.totalStudents },
        { name: 'Companies', value: stats.totalCompanies },
        { name: 'Placed', value: stats.totalPlaced },
    ];

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card border-accentBlue/30 bg-gradient-to-br from-lightNavy to-[#0a1128] hover:border-accentBlue/60">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Students</h3>
                        <Users className="w-5 h-5 text-accentBlue opacity-50" />
                    </div>
                    <p className="text-4xl font-bold">{stats.totalStudents}</p>
                </div>
                <div className="card border-gray-700/50 bg-gradient-to-br from-lightNavy to-[#0a1128] hover:border-gray-500">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Companies</h3>
                        <Briefcase className="w-5 h-5 text-gray-400 opacity-50" />
                    </div>
                    <p className="text-4xl font-bold">{stats.totalCompanies}</p>
                </div>
                <div className="card border-green-500/30 bg-gradient-to-br from-lightNavy to-[#0a1128] hover:border-green-500/60">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Placed</h3>
                        <CheckCircle className="w-5 h-5 text-green-500 opacity-50" />
                    </div>
                    <p className="text-4xl font-bold text-green-500">{stats.totalPlaced}</p>
                </div>
                <div className="card border-purple-500/30 bg-gradient-to-br from-lightNavy to-[#0a1128] hover:border-purple-500/60">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-400">Placement Rate</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500 opacity-50" />
                    </div>
                    <p className="text-4xl font-bold text-purple-500">{stats.placementRate.toFixed(1)}%</p>
                </div>
            </div>

            <div className="card h-[400px] p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Platform Overview</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                            <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                                contentStyle={{backgroundColor: '#16203B', border: '1px solid #374151', borderRadius: '8px'}} 
                            />
                            <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
