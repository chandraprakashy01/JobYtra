import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Building2, ExternalLink } from 'lucide-react';

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/companies')
            .then(res => {
                setCompanies(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const handleVerify = async (id) => {
        try {
            await api.put(`/admin/companies/${id}/verify`);
            setCompanies(companies.map(c => c.id === id ? { ...c, isVerified: true } : c));
        } catch (error) {
            alert('Failed to verify');
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">Manage Companies</h1>
            
            <div className="table-container">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-darkNavy border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Company Name</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Website</th>
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
                                    <td className="p-4"><div className="h-4 w-32 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-5 w-20 skeleton rounded-full"></div></td>
                                    <td className="p-4"><div className="h-8 w-24 skeleton rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : companies.length > 0 ? (
                            companies.map(company => (
                                <tr key={company.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-bold text-white flex items-center">
                                        <div className="w-8 h-8 rounded-md bg-accentBlue/10 flex items-center justify-center mr-3 text-accentBlue">
                                            {company.name.charAt(0)}
                                        </div>
                                        {company.name}
                                    </td>
                                    <td className="p-4 text-gray-400">{company.email}</td>
                                    <td className="p-4">
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-accentBlue hover:text-hoverBlue hover:underline flex items-center text-sm">
                                            {company.website} <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </td>
                                    <td className="p-4">
                                        {company.isVerified ? 
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle className="w-3.5 h-3.5 mr-1.5"/> Verified</span> : 
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><XCircle className="w-3.5 h-3.5 mr-1.5"/> Pending</span>
                                        }
                                    </td>
                                    <td className="p-4 text-right">
                                        {!company.isVerified ? (
                                            <button onClick={() => handleVerify(company.id)} className="btn-primary ml-auto !py-1.5 !px-4 text-sm hover:shadow-green-500/20 hover:bg-green-600 hover:border-green-600">
                                                Verify
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 text-sm italic mr-2">Verified</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-gray-500">
                                    <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-400">No companies found</p>
                                    <p className="text-sm mt-1">There are currently no registered hiring partners.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCompanies;
