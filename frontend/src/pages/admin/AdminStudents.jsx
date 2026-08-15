import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Users } from 'lucide-react';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/students')
            .then(res => {
                setStudents(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/students/${id}/approve`);
            setStudents(students.map(s => s.id === id ? { ...s, isApproved: true } : s));
        } catch (error) {
            alert('Failed to approve');
        }
    };
    const handleToggleTopPerformer = async (id) => {
        try {
            const res = await api.put(`/admin/students/${id}/toggle-top-performer`);
            setStudents(students.map(s => s.id === id ? { ...s, isTopPerformer: res.data.isTopPerformer } : s));
        } catch (error) {
            alert('Failed to toggle top performer status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/admin/students/${id}`);
            setStudents(students.filter(s => s.id !== id));
        } catch (error) {
            alert('Failed to delete student');
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">Manage Students</h1>
            
            <div className="table-container">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-darkNavy border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Branch / CGPA</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="p-4"><div className="h-5 w-32 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-40 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-24 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-5 w-20 skeleton rounded-full"></div></td>
                                    <td className="p-4"><div className="h-8 w-24 skeleton rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : students.length > 0 ? (
                            students.map(student => (
                                <tr key={student.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-bold text-white">{student.name}</td>
                                    <td className="p-4 text-gray-400">{student.email}</td>
                                    <td className="p-4 text-gray-300">
                                        <span className="bg-gray-800 px-2 py-1 rounded-md text-xs mr-2">{student.branch}</span>
                                        <span className="font-semibold">{student.cgpa}</span>
                                    </td>
                                    <td className="p-4">
                                        {student.isApproved ? 
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle className="w-3.5 h-3.5 mr-1.5"/> Approved</span> : 
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><XCircle className="w-3.5 h-3.5 mr-1.5"/> Pending</span>
                                        }
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {!student.isApproved ? (
                                                <button onClick={() => handleApprove(student.id)} className="btn-primary !py-1.5 !px-4 text-sm hover:shadow-green-500/20 hover:bg-green-600 hover:border-green-600">
                                                    Approve
                                                </button>
                                            ) : (
                                                <span className="text-gray-500 text-sm italic mr-2">Resolved</span>
                                            )}
                                            {student.isApproved && (
                                                <button onClick={() => handleToggleTopPerformer(student.id)} className={`btn-secondary !py-1.5 !px-4 text-sm ${student.isTopPerformer ? '!border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10' : ''}`}>
                                                    {student.isTopPerformer ? 'Unfeature' : 'Feature'}
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(student.id)} className="btn-secondary !py-1.5 !px-4 text-sm !border-red-500/50 text-red-400 hover:bg-red-500/10">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-gray-500">
                                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-400">No students found</p>
                                    <p className="text-sm mt-1">There are currently no registered students.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStudents;
