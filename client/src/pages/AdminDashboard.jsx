//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Users, BookOpen, BarChart, Shield, CheckCircle, XCircle, Edit, Trash2, Plus, Search, Filter, Calendar, MapPin, Award, X, Save, Clock, Eye, FileCheck, Heart, MessageCircle, FileText, TrendingUp, TrendingDown, Activity, Zap, Target, Bell } from 'lucide-react';

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, value, label, bgColor }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-3 sm:gap-4">
            <div className={`${bgColor} p-3 sm:p-4 rounded-xl`}>{icon}</div>
            <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">{label}</p>
            </div>
        </div>
    </div>
);

const QuickAction = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-all w-full text-left">
        <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
    </button>
);

const ActivityItem = ({ icon, title, subtitle, time }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
        <p className="text-xs text-gray-500">{time}</p>
    </div>
);

const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => (
    <button
        data-tab={id}
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm ${activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-green-600'
            }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// --- CHART COMPONENTS ---
const SimpleBarChart = ({ data, title, color = 'green' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const colorClasses = {
        green: 'bg-gradient-to-r from-green-400 to-green-600',
        blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
        orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
        purple: 'bg-gradient-to-r from-purple-400 to-purple-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                        <div className="w-20 text-sm font-semibold text-gray-700 transition-colors group-hover:text-gray-900">{item.label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden shadow-inner">
                            <div 
                                className={`h-full ${colorClasses[color]} rounded-full transition-all duration-700 ease-out hover:shadow-lg transform hover:scale-y-110 origin-left`}
                                style={{ 
                                    width: `${(item.value / maxValue) * 100}%`,
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'slideInFromLeft 0.8s ease-out forwards'
                                }}
                            ></div>
                        </div>
                        <div className="w-12 text-sm font-bold text-gray-800 transition-all group-hover:text-gray-900">{item.value}</div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes slideInFromLeft {
                    from {
                        width: 0%;
                        opacity: 0;
                    }
                    to {
                        width: var(--final-width);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

const LineChart = ({ data, title, color = 'green' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const range = maxValue - minValue;
    
    const colorClasses = {
        green: 'stroke-green-500',
        blue: 'stroke-blue-500',
        orange: 'stroke-orange-500',
        purple: 'stroke-purple-500'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={colorClasses[color]}
                        points={data.map((item, index) => {
                            const x = (index / (data.length - 1)) * 300;
                            const y = 100 - ((item.value - minValue) / range) * 80;
                            return `${x},${y}`;
                        }).join(' ')}
                    />
                    {data.map((item, index) => {
                        const x = (index / (data.length - 1)) * 300;
                        const y = 100 - ((item.value - minValue) / range) * 80;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="3"
                                fill="currentColor"
                                className={colorClasses[color]}
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                {data.map((item, index) => (
                    <span key={index}>{item.label}</span>
                ))}
            </div>
        </div>
    );
};

const DonutChart = ({ data, title, size = 120 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    // Improved color palette with better contrast and visual appeal
    const colors = [
        '#10B981', // Green for Users
        '#3B82F6', // Blue for Partners  
        '#F59E0B', // Amber for Admins
        '#EF4444', // Red for Pending
        '#8B5CF6', // Purple for additional roles
        '#06B6D4'  // Cyan for other roles
    ];
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-center gap-6">
                <div className="relative group" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90 transition-transform duration-300 group-hover:scale-105">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const circumference = 2 * Math.PI * 45;
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -cumulativePercentage * circumference / 100;
                            
                            cumulativePercentage += percentage;
                            
                            return (
                                <circle
                                    key={index}
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    fill="none"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="20"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-700 ease-out hover:stroke-width-24"
                                    style={{
                                        animationDelay: `${index * 200}ms`,
                                        animation: 'drawCircle 1s ease-out forwards'
                                    }}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">{total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                            <div 
                                className="w-3 h-3 rounded-full transition-all duration-200 group-hover:scale-125 shadow-sm" 
                                style={{ backgroundColor: colors[index % colors.length] }}
                            ></div>
                            <span className="text-sm text-gray-700 transition-colors group-hover:text-gray-900">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes drawCircle {
                    from {
                        stroke-dashoffset: 283;
                    }
                    to {
                        stroke-dashoffset: var(--final-offset);
                    }
                }
            `}</style>
        </div>
    );
};

const GroupedBarChart = ({ data, title, categories, colors = ['#3B82F6', '#10B981'] }) => {
    const maxValue = Math.max(...data.flat().map(item => item.value));
    const chartHeight = 200;
    const barWidth = 30;
    const barSpacing = 10;
    const categorySpacing = 60;
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                    {categories.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: colors[index] }}
                            ></div>
                            <span className="text-sm text-gray-600">{category}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative" style={{ height: chartHeight + 40 }}>
                <svg width="100%" height={chartHeight} className="overflow-visible">
                    {/* Y-axis grid lines */}
                    {[0, 1, 2, 3, 4, 5].map(value => (
                        <line
                            key={value}
                            x1="40"
                            y1={chartHeight - (value / 5) * chartHeight}
                            x2="100%"
                            y2={chartHeight - (value / 5) * chartHeight}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                        />
                    ))}
                    
                    {/* Y-axis labels */}
                    {[0, 1, 2, 3, 4, 5].map(value => (
                        <text
                            key={value}
                            x="35"
                            y={chartHeight - (value / 5) * chartHeight + 4}
                            textAnchor="end"
                            className="text-xs fill-gray-500"
                        >
                            {value}
                        </text>
                    ))}
                    
                    {/* Bars */}
                    {data.map((categoryData, categoryIndex) => (
                        <g key={categoryIndex}>
                            {categoryData.map((item, itemIndex) => {
                                const x = 50 + (itemIndex * categorySpacing) + (categoryIndex * (barWidth + barSpacing));
                                const height = (item.value / maxValue) * chartHeight;
                                const y = chartHeight - height;
                                
                                return (
                                    <g key={itemIndex}>
                                        <rect
                                            x={x}
                                            y={y}
                                            width={barWidth}
                                            height={height}
                                            fill={colors[categoryIndex]}
                                            rx="2"
                                        />
                                        <text
                                            x={x + barWidth / 2}
                                            y={y - 5}
                                            textAnchor="middle"
                                            className="text-xs font-semibold fill-gray-800"
                                        >
                                            {item.value}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    ))}
                    
                    {/* X-axis labels */}
                    {data[0].map((item, index) => (
                        <text
                            key={index}
                            x={50 + (index * categorySpacing) + (barWidth + barSpacing) / 2}
                            y={chartHeight + 20}
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                        >
                            {item.label}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
};

// --- OVERVIEW TAB ---
const OverviewTab = ({ stats, setActiveTab, users }) => {
    // Calculate real user role distribution
    const userRoleData = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    const roleChartData = Object.entries(userRoleData).map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value
    }));

    return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />} value={stats.totalUsers} label="Total Users" bgColor="bg-blue-50" />
            <StatCard icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />} value={stats.activeQuests} label="Active Quests" bgColor="bg-green-50" />
            <StatCard icon={<Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />} value={stats.pendingPartners} label="Pending Role Requests" bgColor="bg-yellow-50" />
            <StatCard icon={<FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />} value={stats.pendingSubmissions} label="Pending Submissions" bgColor="bg-orange-50" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <QuickAction
                        icon={<Users className="w-6 h-6 text-blue-500" />}
                        title="Manage Users"
                        subtitle="View and manage user accounts"
                        onClick={() => setActiveTab('users')}
                    />
                    <QuickAction
                        icon={<BookOpen className="w-6 h-6 text-green-500" />}
                        title="Review Quests" 
                        subtitle="Approve or reject quest submissions" 
                        onClick={() => setActiveTab('submissions')} 
                    />
                    <QuickAction
                        icon={<FileText className="w-6 h-6 text-purple-500" />} 
                        title="Community Posts" 
                        subtitle="Manage community content" 
                        onClick={() => setActiveTab('community')} 
                    />
                    <QuickAction 
                        icon={<Users className="w-6 h-6 text-orange-500" />} 
                        title="Notifications" 
                        subtitle="Send announcements to users" 
                        onClick={() => setActiveTab('notifications')} 
                    />
                </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">User Role Distribution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {userRoleData.user || 0}
                        </div>
                        <div className="text-sm text-blue-700 font-semibold">Users</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            {userRoleData.partner || 0}
                        </div>
                        <div className="text-sm text-purple-700 font-semibold">Partners</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                            {userRoleData.admin || 0}
                        </div>
                        <div className="text-sm text-red-700 font-semibold">Admins</div>
                    </div>
                </div>
            </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
                <ActivityItem
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    title="New user registered"
                    subtitle="Recent sign up"
                    time="Recent"
                />
                <ActivityItem
                    icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                    title="Quest completed"
                    subtitle="User activity"
                    time="Recent"
                />
                <ActivityItem
                    icon={<Shield className="w-5 h-5 text-yellow-500" />}
                    title="Partner approved"
                    subtitle="Partnership confirmed"
                    time="Recent"
                />
            </div>
        </div>
    </div>
);
};

// --- USER PROFILE MODAL ---
const UserProfileModal = ({ user, onClose }) => {
    const [userData, setUserData] = useState(user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUpdatedUserData();
        }
    }, [user]);

    const fetchUpdatedUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${user._id}`, {
                headers: { 'x-auth-token': token }
            });
            
            if (response.ok) {
                const updatedUser = await response.json();
                setUserData(updatedUser);
            }
        } catch (error) {
            console.error('Error fetching updated user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="w-5 h-5 text-red-600" />;
            case 'partner': return <Users className="w-5 h-5 text-purple-600" />;
            default: return <Users className="w-5 h-5 text-blue-600" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'from-red-400 to-red-600';
            case 'partner': return 'from-purple-400 to-purple-600';
            default: return 'from-blue-400 to-blue-600';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-bold">User Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading updated user data...</p>
                        </div>
                    )}
                    {!loading && (
                        <>
                    <div className="text-center">
                        <div className={`w-20 h-20 bg-gradient-to-br ${getRoleColor(userData.role)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            {getRoleIcon(userData.role)}
                        </div>
                        <h4 className="text-2xl font-bold">{userData.username}</h4>
                        <p className="text-gray-500">{userData.email}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${userData.role === 'partner'
                                    ? 'bg-purple-100 text-purple-700'
                                    : userData.role === 'admin'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                {userData.role}
                            </span>
                            {userData.requested_role && !userData.is_approved && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                    Pending {userData.requested_role}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-green-600" />
                                <h5 className="font-semibold text-sm text-green-700">Eco Score</h5>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{userData.eco_score || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-blue-600" />
                                <h5 className="font-semibold text-sm text-blue-700">Points</h5>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{userData.points || 0}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Profile Information
                            </h5>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">HAU Affiliation:</span>
                                    <span className="font-semibold text-gray-800">{userData.hau_affiliation || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Avatar Theme:</span>
                                    <span className="font-semibold text-gray-800">{userData.avatar_theme || 'Default'}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Header Theme:</span>
                                    <span className="font-semibold text-gray-800">{userData.header_theme || 'Default'}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Approval Status:</span>
                                    <span className={`font-semibold flex items-center gap-1 ${userData.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {userData.is_approved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        {userData.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Activity
                            </h5>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Quests Completed:</span>
                                    <span className="font-semibold text-gray-800">{userData.questsCompleted?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Member Since:</span>
                                    <span className="font-semibold text-gray-800">{new Date(userData.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Last Active:</span>
                                    <span className="font-semibold text-gray-800">{userData.updated_at ? new Date(userData.updated_at).toLocaleDateString() : 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- USERS TAB ---
const UsersTab = ({ users, pendingPartners, onApprove, onReject, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' ||
            (filterRole === 'student' && u.role === 'user') ||
            (filterRole === 'partner' && u.role === 'partner');
        return matchesSearch && matchesRole;
    });

    // Generate user statistics for charts
    const userRoleData = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    const roleChartData = Object.entries(userRoleData).map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value
    }));

    const userStatusData = users.reduce((acc, user) => {
        acc[user.status || 'active'] = (acc[user.status || 'active'] || 0) + 1;
        return acc;
    }, {});

    const statusChartData = Object.entries(userStatusData).map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value
    }));

    return (
        <div className="space-y-8">

            {/* Pending Role Approvals (Partner & Admin) */}
            {pendingPartners.length > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-6 h-6 text-yellow-600" />
                        <h3 className="text-xl font-bold text-yellow-900">Pending Role Requests ({pendingPartners.length})</h3>
                    </div>
                    <div className="space-y-3">
                        {pendingPartners.map(request => (
                            <div key={request._id} className="bg-white p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{request.username}</p>
                                    <p className="text-sm text-gray-500">{request.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${request.requested_role === 'admin'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            Requested: {request.requested_role === 'admin' ? 'Admin' : 'Partner'}
                                        </span>
                                        <p className="text-xs text-gray-400">Applied: {new Date(request.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onApprove(request._id)}
                                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => onReject(request._id)}
                                        className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Management Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-6">
                        <h3 className="text-xl font-bold">User Management</h3>
                        <p className="text-sm text-gray-500">Manage all user accounts and roles</p>
                    </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                    {/* Search Bar - Left */}
                    <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors text-sm"
                            />
                        </div>
                    
                    {/* Filters - Right */}
                    <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setFilterRole('all')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filterRole === 'all'
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All Roles
                            </button>
                            <button
                                onClick={() => setFilterRole('student')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filterRole === 'student'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Students
                            </button>
                            <button
                                onClick={() => setFilterRole('partner')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filterRole === 'partner'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Partners
                            </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Role</th>
                                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Points</th>
                                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 hidden md:table-cell">Joined</th>
                                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-2 sm:px-4 py-3 font-semibold text-sm">{user.username}</td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{user.email}</td>
                                    <td className="px-2 sm:px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'partner'
                                                ? 'bg-purple-100 text-purple-700'
                                                : user.role === 'admin'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600">{user.points || 0}</td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-2 sm:px-4 py-3">
                                        <div className="flex gap-1 sm:gap-2">
                                            <button
                                                onClick={() => onDeleteUser(user._id)}
                                                className="p-1 sm:p-2 hover:bg-red-50 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <UserProfileModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

// --- QUEST MODAL ---
const QuestModal = ({ quest, onClose, onSave }) => {
    const [formData, setFormData] = useState(quest || {
        title: '',
        category: 'Gardening & Planting',
        difficulty: 'Medium',
        points: 50,
        description: '',
        location: '',
        duration: '',
        maxParticipants: 50,
        objectives: '',
        submissionRequirements: ''
    });
    const [objectives, setObjectives] = useState(quest?.objectives || ['']);
    const [submissionRequirements, setSubmissionRequirements] = useState(quest?.submissionRequirements || ['']);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(quest?.imageUrl || null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const addObjective = () => {
        setObjectives([...objectives, '']);
    };

    const removeObjective = (index) => {
        if (objectives.length > 1) {
            setObjectives(objectives.filter((_, i) => i !== index));
        }
    };

    const updateObjective = (index, value) => {
        const newObjectives = [...objectives];
        newObjectives[index] = value;
        setObjectives(newObjectives);
    };

    const addSubmissionRequirement = () => {
        setSubmissionRequirements([...submissionRequirements, '']);
    };

    const removeSubmissionRequirement = (index) => {
        if (submissionRequirements.length > 1) {
            setSubmissionRequirements(submissionRequirements.filter((_, i) => i !== index));
        }
    };

    const updateSubmissionRequirement = (index, value) => {
        const newRequirements = [...submissionRequirements];
        newRequirements[index] = value;
        setSubmissionRequirements(newRequirements);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            ...formData, 
            image: selectedFile,
            objectives: objectives.filter(obj => obj.trim() !== ''),
            submissionRequirements: submissionRequirements.filter(req => req.trim() !== '')
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-bold">{quest ? 'Edit Quest' : 'Create New Quest'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            placeholder="e.g., Campus Tree Planting"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            >
                                <option>Gardening & Planting</option>
                                <option>Recycling & Waste</option>
                                <option>Energy Conservation</option>
                                <option>Water Conservation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Points Reward</label>
                            <input
                                type="number"
                                required
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Max Participants</label>
                            <input
                                type="number"
                                required
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                                placeholder="e.g., HAU Main Campus"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Duration</label>
                            <input
                                type="text"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                                placeholder="e.g., 1 week"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            rows="4"
                            placeholder="Describe the quest objectives and activities..."
                        />
                    </div>

                    {/* Objectives Section */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Objectives</label>
                        {objectives.map((objective, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={objective}
                                    onChange={(e) => updateObjective(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                                    placeholder={`Objective ${index + 1}...`}
                                />
                                {objectives.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeObjective(index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                    </div>
                        ))}
                        <button
                            type="button"
                            onClick={addObjective}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Objective
                        </button>
                    </div>

                    {/* Submission Requirements Section */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Submission Requirements</label>
                        {submissionRequirements.map((requirement, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                        <input
                                    type="text"
                                    value={requirement}
                                    onChange={(e) => updateSubmissionRequirement(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                                    placeholder={`Requirement ${index + 1}...`}
                                />
                                {submissionRequirements.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSubmissionRequirement(index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                        </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSubmissionRequirement}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Requirement
                        </button>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {quest ? 'Update Quest' : 'Create Quest'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- QUESTS TAB ---
const QuestsTab = ({ quests, setQuests }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingQuest, setEditingQuest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const handleSaveQuest = async (questData) => {
        try {
            console.log('Quest data being sent:', questData);
            const token = localStorage.getItem('token');

            if (editingQuest) {
                // For updates, we'll use JSON for now (can add file upload later)
                const payload = {
                    title: questData.title,
                    description: questData.description,
                    category: questData.category,
                    difficulty: questData.difficulty,
                    points: questData.points,
                    duration: questData.duration,
                    location: questData.location,
                    objectives: questData.objectives || [],
                    submissionRequirements: questData.submissionRequirements || ['Photo proof required'],
                    maxParticipants: questData.maxParticipants
                };

                const response = await fetch(`/api/quests/${editingQuest._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Failed to update quest');
                const updatedQuest = await response.json();
                setQuests(quests.map(q => q._id === editingQuest._id ? updatedQuest : q));
            } else {
                // For new quests, use JSON (no image upload for now)
                const payload = {
                    title: questData.title,
                    description: questData.description,
                    category: questData.category,
                    difficulty: questData.difficulty,
                    points: questData.points,
                    duration: questData.duration,
                    location: questData.location,
                    objectives: questData.objectives || [],
                    submissionRequirements: questData.submissionRequirements || ['Photo proof required'],
                    maxParticipants: questData.maxParticipants
                };

                const response = await fetch('/api/quests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Server error response:', errorData);
                    throw new Error(errorData.msg || 'Failed to create quest');
                }
                const newQuest = await response.json();
                setQuests([newQuest, ...quests]);
                alert('Quest created successfully!');
            }

            setShowModal(false);
            setEditingQuest(null);
        } catch (error) {
            console.error('Error saving quest:', error);
            alert(`Failed to save quest: ${error.message}`);
        }
    };

    const handleDeleteQuest = async (id) => {
        if (!confirm('Are you sure you want to delete this quest?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/quests/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) throw new Error('Failed to delete quest');
            setQuests(quests.filter(q => q._id !== id));
        } catch (error) {
            console.error('Error deleting quest:', error);
            alert('Failed to delete quest. You may not have permission.');
        }
    };

    // Filter quests based on search and filters
    const filteredQuests = quests.filter(quest => {
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || quest.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter
    const categories = [...new Set(quests.map(q => q.category))];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-lg sm:text-xl font-bold">Quest Management</h3>
                    <button
                        onClick={() => {
                            setEditingQuest(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold text-sm sm:text-base w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quest
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                    {/* Search Bar - Left */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors text-sm"
                        />
                    </div>
                    
                    {/* Filters - Right */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors text-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredQuests.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No quests found</p>
                        </div>
                    ) : (
                        filteredQuests.map(quest => (
                        <div key={quest._id} className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                        <h4 className="text-base sm:text-lg font-bold">{quest.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${quest.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {quest.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {quest.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {quest.points} points
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {quest.completions?.length || 0} participants
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {quest.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-start sm:ml-4">
                                    <button
                                        onClick={() => {
                                            setEditingQuest(quest);
                                            setShowModal(true);
                                        }}
                                        className="p-2 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                                    >
                                        <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuest(quest._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                                    >
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {quest.difficulty}
                                </span>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <QuestModal
                    quest={editingQuest}
                    onClose={() => {
                        setShowModal(false);
                        setEditingQuest(null);
                    }}
                    onSave={handleSaveQuest}
                />
            )}
        </div>
    );
};

// --- ANALYTICS TAB ---
const AnalyticsTab = ({ stats, users, quests }) => {
    const [analyticsData, setAnalyticsData] = useState({
        userGrowth: [],
        questCompletions: [],
        categoryStats: {},
        monthlyActivity: []
    });

    useEffect(() => {
        calculateAnalytics();
    }, [users, quests]);

    const calculateAnalytics = () => {
        // Calculate user growth over time
        const usersByMonth = {};
        users.forEach(user => {
            const month = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            usersByMonth[month] = (usersByMonth[month] || 0) + 1;
        });

        // Calculate quest completions by category
        const categoryStats = {};
        quests.forEach(quest => {
            const category = quest.category;
            if (!categoryStats[category]) {
                categoryStats[category] = { total: 0, completed: quest.completions?.length || 0 };
            }
            categoryStats[category].total++;
            categoryStats[category].completed += quest.completions?.length || 0;
        });

        setAnalyticsData({
            userGrowth: Object.entries(usersByMonth),
            categoryStats: categoryStats,
            totalEngagement: users.reduce((sum, u) => sum + (u.questsCompleted?.length || 0), 0),
            averagePoints: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.points || 0), 0) / users.length) : 0
        });
    };

    // Generate chart data
    const userGrowthChartData = analyticsData.userGrowth.map(([label, value]) => ({
        label,
        value
    }));

    const categoryChartData = Object.entries(analyticsData.categoryStats).map(([label, stats]) => ({
        label: label.split(' ')[0], // Shorten category names
        value: stats.completed
    }));

    const userRoleData = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    const roleChartData = Object.entries(userRoleData).map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value
    }));

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">{quests.length}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Total Quests</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">{analyticsData.totalEngagement}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Quest Completions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                            <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">{analyticsData.averagePoints}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Avg Points/User</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <SimpleBarChart 
                    data={userGrowthChartData} 
                    title="User Registration Growth" 
                    color="blue" 
                />
                <DonutChart 
                    data={roleChartData} 
                    title="User Role Distribution" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <SimpleBarChart 
                    data={categoryChartData} 
                    title="Quest Category Performance" 
                    color="green" 
                />
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg sm:text-xl font-bold mb-4">Platform Health</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Active Users</span>
                            <span className="text-sm font-semibold text-green-600">{users.filter(u => u.questsCompleted > 0).length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Inactive Users</span>
                            <span className="text-sm font-semibold text-gray-600">{users.filter(u => u.questsCompleted === 0).length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Pending Partners</span>
                            <span className="text-sm font-semibold text-yellow-600">{stats.pendingPartners}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Active Quests</span>
                            <span className="text-sm font-semibold text-blue-600">{stats.activeQuests}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Points Awarded</span>
                            <span className="text-sm font-semibold text-purple-600">{users.reduce((sum, u) => sum + (u.points || 0), 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

// --- COMMUNITY TAB ---
const CommunityTab = ({ posts, setPosts }) => {
    const [showModal, setShowModal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editingChallenge, setEditingChallenge] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [postFilter, setPostFilter] = useState('all'); // all, admin, partner, user
    const [challenges, setChallenges] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'posts', 'challenges'
    const [loading, setLoading] = useState(true);

    const handleSavePost = async (postData) => {
        try {
            const token = localStorage.getItem('token');

            if (editingPost) {
                // Update existing post - use JSON for updates
                const payload = {
                    title: postData.title,
                    content: postData.content,
                    category: postData.category,
                    tags: postData.tags.split(',').map(t => t.trim()).filter(t => t)
                };

                const response = await fetch(`/api/posts/${editingPost._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to update post');
                }
                const updatedPost = await response.json();
                setPosts(posts.map(p => p._id === editingPost._id ? updatedPost : p));
                alert('Post updated successfully!');
            } else {
                // Create new post
                const formData = new FormData();
                formData.append('title', postData.title);
                formData.append('content', postData.content);
                formData.append('category', postData.category);
                formData.append('tags', JSON.stringify(postData.tags.split(',').map(t => t.trim()).filter(t => t)));

                if (postData.image) {
                    formData.append('image', postData.image);
                }

                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to create post');
                }
                const newPost = await response.json();
                setPosts([newPost, ...posts]);
                alert('Post created successfully!');
            }

            setShowModal(false);
            setEditingPost(null);
        } catch (error) {
            console.error('Error saving post:', error);
            alert(`Failed to save post: ${error.message}`);
        }
    };

    const handleSaveChallenge = async (challengeData) => {
        try {
            const token = localStorage.getItem('token');
            
            // Use FormData to handle file uploads
            const formData = new FormData();
            formData.append('title', challengeData.title);
            formData.append('content', challengeData.content);
            formData.append('target', challengeData.target);
            formData.append('points', challengeData.points);
            formData.append('duration', challengeData.duration);
            formData.append('location', challengeData.location);
            formData.append('badgeTitle', challengeData.badgeTitle);
            
            if (challengeData.badge) {
                formData.append('badge', challengeData.badge);
            }

            const url = editingChallenge ? `/api/challenges/${editingChallenge._id}` : '/api/challenges';
            const method = editingChallenge ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `Failed to ${editingChallenge ? 'update' : 'create'} challenge`);
            }
            
            const updatedChallenge = await response.json();
            
            if (editingChallenge) {
                setChallenges(prev => prev.map(c => c._id === editingChallenge._id ? updatedChallenge : c));
                alert('Challenge updated successfully!');
            } else {
                setChallenges(prev => [updatedChallenge, ...prev]);
            alert('Community challenge created successfully!');
            }
            
            setShowChallengeModal(false);
            setEditingChallenge(null);
        } catch (error) {
            console.error('Error saving challenge:', error);
            alert(`Failed to save challenge: ${error.message}`);
        }
    };

    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/challenges', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setChallenges(data);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
        }
    };

    useEffect(() => {
        fetchChallenges();
        setLoading(false);
    }, []);

    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowModal(true);
    };

    const handleDeletePost = async (postId) => {
        const reason = prompt('Please provide a reason for deleting this post:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) throw new Error('Failed to delete post');
            setPosts(posts.filter(p => p._id !== postId));
            alert('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. You may not have permission.');
        }
    };

    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = postFilter === 'all' || 
            (postFilter === 'admin' && p.author?.role === 'admin') ||
            (postFilter === 'partner' && p.author?.role === 'partner') ||
            (postFilter === 'user' && p.author?.role === 'user');
        return matchesSearch && matchesFilter;
    });

    const filteredChallenges = challenges.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate posts by author role for admin controls
    const adminPosts = posts.filter(p => p.author?.role === 'admin');
    const partnerPosts = posts.filter(p => p.author?.role === 'partner');
    const userPosts = posts.filter(p => p.author?.role === 'user');

    return (
        <div className="space-y-6">
            {/* Admin Post Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold">Admin Posts</h3>
                            <p className="text-xl sm:text-2xl font-bold text-red-600">{adminPosts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold">Partner Posts</h3>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">{partnerPosts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold">User Posts</h3>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">{userPosts.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Community Content Management</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Manage all community posts and challenges</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                setEditingPost(null);
                                setShowModal(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Create Post
                        </button>
                        <button
                            onClick={() => setShowChallengeModal(true)}
                            className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold text-sm"
                        >
                            <Users className="w-4 h-4" />
                            Create Challenge
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                    {/* Search Bar - Left */}
                    <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors text-sm"
                            />
                        </div>
                    
                    {/* Filters - Right */}
                    <div className="flex gap-2 sm:gap-3 flex-wrap">
                        {/* Content Type Filter */}
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors text-sm"
                        >
                            <option value="all">All Content</option>
                            <option value="posts">Posts Only</option>
                            <option value="challenges">Challenges Only</option>
                        </select>
                        
                        {/* Post Role Filters */}
                        {(activeFilter === 'all' || activeFilter === 'posts') && (
                            <select
                                value={postFilter}
                                onChange={(e) => setPostFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
                            >
                                <option value="all">All Posts</option>
                                <option value="admin">Admin Posts</option>
                                <option value="partner">Partner Posts</option>
                                <option value="user">User Posts</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Posts Section */}
                    {(activeFilter === 'all' || activeFilter === 'posts') && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">Posts</h4>
                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No posts found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredPosts.map(post => (
                                        <div key={post._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h4 className="text-lg font-bold">{post.title}</h4>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                            {post.category}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            post.author?.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                            post.author?.role === 'partner' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {post.author?.role || 'user'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {post.views} views
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {post.likes?.length || 0} likes
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="w-4 h-4" />
                                                            {post.comments?.length || 0} comments
                                                        </span>
                                                    </div>
                                                    {post.tags && post.tags.length > 0 && (
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                            {post.tags.map((tag, idx) => (
                                                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Challenges Section */}
                    {(activeFilter === 'all' || activeFilter === 'challenges') && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">Community Challenges</h4>
                            {filteredChallenges.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No challenges found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredChallenges.map(challenge => (
                                        <div key={challenge._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h4 className="text-lg font-bold">{challenge.title}</h4>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                            Challenge
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            challenge.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {challenge.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(challenge.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            {challenge.participants?.length || 0} participants
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Target className="w-4 h-4" />
                                                            {challenge.current_progress || 0} / {challenge.target} progress
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingChallenge(challenge);
                                                            setShowChallengeModal(true);
                                                        }}
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                                                    >
                                                        <Edit className="w-5 h-5 text-blue-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* No content message */}
                    {activeFilter === 'all' && filteredPosts.length === 0 && filteredChallenges.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No content found. Create your first post or challenge!</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <PostModal
                    post={editingPost}
                    onClose={() => {
                        setShowModal(false);
                        setEditingPost(null);
                    }}
                    onSave={handleSavePost}
                />
            )}

            {showChallengeModal && (
                <ChallengeModal
                    challenge={editingChallenge}
                    onClose={() => {
                        setShowChallengeModal(false);
                        setEditingChallenge(null);
                    }}
                    onSave={handleSaveChallenge}
                />
            )}
        </div>
    );
};

// --- NOTIFICATIONS TAB ---
const NotificationsTab = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/notifications', {
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Notifications</h3>
                    <button
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            fetch('/api/notifications/read-all', {
                                method: 'PUT',
                                headers: { 'x-auth-token': token }
                            }).then(() => fetchNotifications());
                        }}
                        className="text-sm text-green-600 hover:underline"
                    >
                        Mark all as read
                    </button>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <div
                                key={notification._id}
                                className={`p-4 rounded-lg border border-gray-200 transition ${notification.is_read ? 'bg-gray-50' : 'bg-white shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="text-xs text-green-600 hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification._id)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



// --- SUBMISSIONS TAB ---
const SubmissionsTab = ({ onApprove, onReject }) => {
    const [submissions, setSubmissions] = useState([]);
    const [challengeSubmissions, setChallengeSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [activeTab, setActiveTab] = useState('quests'); // 'quests' or 'challenges'

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch quest submissions
            const questResponse = await fetch('/api/quests/submissions/all', {
                headers: { 'x-auth-token': token }
            });

            if (questResponse.ok) {
                const questData = await questResponse.json();
                setSubmissions(questData);
            }

            // Fetch challenge submissions
            const challengeResponse = await fetch('/api/challenges/submissions/all', {
                headers: { 'x-auth-token': token }
            });

            if (challengeResponse.ok) {
                const challengeData = await challengeResponse.json();
                setChallengeSubmissions(challengeData);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (submissionId, type = 'quest') => {
        console.log('🚀 FRONTEND: handleApprove called with submissionId:', submissionId, 'type:', type);
        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'quest' 
                ? `/api/quests/submissions/${submissionId}/review`
                : `/api/challenges/submissions/${submissionId}/review`;
            
            console.log('🚀 FRONTEND: Making API call to approve submission:', submissionId, 'endpoint:', endpoint);
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: 'approved' })
            });
            console.log('🚀 FRONTEND: API response status:', response.status);

            if (response.ok) {
                fetchSubmissions();
                setSelectedSubmission(null);
                alert('Submission approved successfully!');
            } else {
                const error = await response.json();
                alert(error.msg || 'Failed to approve submission');
            }
        } catch (error) {
            console.error('Error approving submission:', error);
            alert('Network error. Please try again.');
        }
    };

    const handleReject = async (submissionId, type = 'quest') => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'quest' 
                ? `/api/quests/submissions/${submissionId}/review`
                : `/api/challenges/submissions/${submissionId}/review`;
            
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    status: 'rejected',
                    rejection_reason: reason
                })
            });

            if (response.ok) {
                fetchSubmissions();
                setSelectedSubmission(null);
                alert('Submission rejected.');
            } else {
                const error = await response.json();
                alert(error.msg || 'Failed to reject submission');
            }
        } catch (error) {
            console.error('Error rejecting submission:', error);
            alert('Network error. Please try again.');
        }
    };

    const filteredSubmissions = submissions.filter(s => {
        if (filter === 'all') return true;
        return s.status === filter;
    });

    const filteredChallengeSubmissions = challengeSubmissions.filter(s => {
        if (filter === 'all') return true;
        return s.status === filter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Submission Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-lg font-bold">Pending</h3>
                            <p className="text-lg sm:text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                                {submissions.filter(s => s.status === 'pending').length + challengeSubmissions.filter(s => s.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-lg font-bold">Approved</h3>
                            <p className="text-lg sm:text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                                {submissions.filter(s => s.status === 'approved').length + challengeSubmissions.filter(s => s.status === 'approved').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-red-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-lg font-bold">Rejected</h3>
                            <p className="text-lg sm:text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors">
                                {submissions.filter(s => s.status === 'rejected').length + challengeSubmissions.filter(s => s.status === 'rejected').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-lg font-bold">Total</h3>
                            <p className="text-lg sm:text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                                {submissions.length + challengeSubmissions.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Submissions Review</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Review and approve quest and challenge submissions</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filter === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filter === 'approved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filter === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Rejected
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${filter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Submission Type Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('quests')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition whitespace-nowrap ${activeTab === 'quests'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Quest Submissions ({filteredSubmissions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('challenges')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition whitespace-nowrap ${activeTab === 'challenges'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Challenge Submissions ({filteredChallengeSubmissions.length})
                    </button>
                </div>

                {/* Quest Submissions */}
                {activeTab === 'quests' && (
                    filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                        <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} quest submissions found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredSubmissions.map(submission => (
                            <div key={submission._id} className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                            <h4 className="text-base sm:text-lg font-bold">{submission.quest_id?.title || 'Unknown Quest'}</h4>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Quest</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {submission.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                                {submission.user_id?.username || 'Unknown User'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                                                {submission.quest_id?.points || 0} points
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                {new Date(submission.submitted_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs">
                                                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                                {submission.user_id?.role || 'user'}
                                            </span>
                                        </div>
                                        {submission.reflection_text && (
                                            <p className="text-sm text-gray-600 mt-2 italic">"{submission.reflection_text}"</p>
                                        )}
                                        {submission.status === 'rejected' && submission.rejection_reason && (
                                            <p className="text-sm text-red-600 mt-2">
                                                <strong>Rejection Reason:</strong> {submission.rejection_reason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-1 sm:gap-2 self-start sm:self-auto">
                                        <button
                                                onClick={() => setSelectedSubmission({...submission, type: 'quest'})}
                                            className="p-1 sm:p-2 hover:bg-blue-50 hover:shadow-md rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-400 transform hover:scale-105"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 hover:text-blue-700" />
                                        </button>
                                        {submission.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        console.log('🚀 BUTTON CLICKED: Approve button clicked for submission:', submission._id);
                                                        console.log('🚀 BUTTON CLICKED: Submission status:', submission.status);
                                                        console.log('🚀 BUTTON CLICKED: Event:', e);
                                                            handleApprove(submission._id, 'quest');
                                                    }}
                                                    className="p-1 sm:p-2 hover:bg-green-50 hover:shadow-md rounded-lg transition-all duration-200 border border-green-200 hover:border-green-400 transform hover:scale-105"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 hover:text-green-700" />
                                                </button>
                                                <button
                                                        onClick={() => handleReject(submission._id, 'quest')}
                                                    className="p-1 sm:p-2 hover:bg-red-50 hover:shadow-md rounded-lg transition-all duration-200 border border-red-200 hover:border-red-400 transform hover:scale-105"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 hover:text-red-700" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    )
                )}

                {/* Challenge Submissions */}
                {activeTab === 'challenges' && (
                    filteredChallengeSubmissions.length === 0 ? (
                        <div className="text-center py-12">
                            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} challenge submissions found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredChallengeSubmissions.map(submission => (
                                <div key={submission._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h4 className="text-lg font-bold">{submission.challenge_id?.title || 'Unknown Challenge'}</h4>
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Challenge</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {submission.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {submission.user_id?.username || 'Unknown User'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Award className="w-4 h-4" />
                                                    {submission.challenge_id?.points || 0} points
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Shield className="w-4 h-4" />
                                                    {submission.user_id?.role || 'user'}
                                                </span>
                                            </div>
                                            {submission.reflection_text && (
                                                <p className="text-sm text-gray-600 mt-2 italic">"{submission.reflection_text}"</p>
                                            )}
                                            {submission.status === 'rejected' && submission.rejection_reason && (
                                                <p className="text-sm text-red-600 mt-2">
                                                    <strong>Rejection Reason:</strong> {submission.rejection_reason}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedSubmission({...submission, type: 'challenge'})}
                                                className="p-2 hover:bg-blue-50 hover:shadow-md rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-400 transform hover:scale-105"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                                            </button>
                                            {submission.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(submission._id, 'challenge')}
                                                        className="p-2 hover:bg-green-50 hover:shadow-md rounded-lg transition-all duration-200 border border-green-200 hover:border-green-400 transform hover:scale-105"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5 text-green-600 hover:text-green-700" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(submission._id, 'challenge')}
                                                        className="p-2 hover:bg-red-50 hover:shadow-md rounded-lg transition-all duration-200 border border-red-200 hover:border-red-400 transform hover:scale-105"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5 text-red-600 hover:text-red-700" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Submission Details Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                            <h3 className="text-lg sm:text-2xl font-bold">Submission Details</h3>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">
                                    {selectedSubmission.type === 'quest' ? 'Quest' : 'Challenge'}
                                </h4>
                                <p className="text-lg">
                                    {selectedSubmission.type === 'quest' 
                                        ? selectedSubmission.quest_id?.title 
                                        : selectedSubmission.challenge_id?.title}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-2 inline-block ${
                                    selectedSubmission.type === 'quest' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-purple-100 text-purple-700'
                                }`}>
                                    {selectedSubmission.type === 'quest' ? 'Quest' : 'Challenge'}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">Submitted By</h4>
                                <p>{selectedSubmission.user_id?.username} ({selectedSubmission.user_id?.email})</p>
                                <p className="text-sm text-gray-500">Role: {selectedSubmission.user_id?.role}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">Reflection</h4>
                                <p className="text-gray-600">{selectedSubmission.reflection_text || 'No reflection provided'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">Proof Photo</h4>
                                {selectedSubmission.photo_url ? (
                                    <img
                                        src={selectedSubmission.photo_url}
                                        alt={`${selectedSubmission.type} proof`}
                                        className="w-full max-h-96 object-contain border rounded-lg"
                                        onError={(e) => {
                                            console.error('Image failed to load:', selectedSubmission.photo_url);
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : (
                                    <p className="text-gray-500">No photo uploaded</p>
                                )}
                                {selectedSubmission.photo_url && (
                                    <p className="text-gray-500 text-sm mt-2" style={{display: 'none'}}>
                                        Failed to load image: {selectedSubmission.photo_url}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-700">Status:</h4>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedSubmission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        selectedSubmission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {selectedSubmission.status.toUpperCase()}
                                </span>
                            </div>
                            {selectedSubmission.status === 'rejected' && selectedSubmission.rejection_reason && (
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-1">Rejection Reason</h4>
                                    <p className="text-red-600">{selectedSubmission.rejection_reason}</p>
                                </div>
                            )}

                            {selectedSubmission.status === 'pending' && (
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                    <button
                                        onClick={(e) => {
                                            console.log('🚀 MODAL BUTTON CLICKED: Approve button clicked for submission:', selectedSubmission._id);
                                            console.log('🚀 MODAL BUTTON CLICKED: Submission status:', selectedSubmission.status);
                                            console.log('🚀 MODAL BUTTON CLICKED: Event:', e);
                                            handleApprove(selectedSubmission._id, selectedSubmission.type);
                                        }}
                                        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Submission
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedSubmission._id, selectedSubmission.type)}
                                        className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Reject Submission
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- POST MODAL ---
const PostModal = ({ post, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: post?.title || '',
        content: post?.content || '',
        category: post?.category || 'Updates',
        tags: post?.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-bold">{post ? 'Edit Post' : 'Create New Post'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            placeholder="Enter post title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                        >
                            <option value="Updates">Updates</option>
                            <option value="Tips">Tips</option>
                            <option value="Events">Events</option>
                            <option value="Success Stories">Success Stories</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Content</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            rows="4"
                            placeholder="Write your post content..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            placeholder="e.g., environment, tips, community"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Upload an image for this post</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {post ? 'Update Post' : 'Create Post'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- CHALLENGE MODAL ---
const ChallengeModal = ({ challenge, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: challenge?.title || '',
        content: challenge?.description || '',
        target: challenge?.target || 100,
        points: challenge?.points || 50,
        duration: challenge?.duration || '2-3 weeks',
        location: challenge?.location || 'HAU Campus',
        badgeTitle: challenge?.badgeTitle || '',
        badge: null,
        badgePreview: challenge?.badge_url || null
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                badge: file,
                badgePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-bold">Create Community Challenge</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                            placeholder="Enter challenge title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Description</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                            rows="4"
                            placeholder="Describe the community challenge..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Target Goal</label>
                            <input
                                type="number"
                                required
                                value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                                placeholder="100"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Reward Points</label>
                            <input
                                type="number"
                                required
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                                placeholder="50"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Duration</label>
                            <input
                                type="text"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                                placeholder="2-3 weeks"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                                placeholder="HAU Campus"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Badge Title</label>
                        <input
                            type="text"
                            value={formData.badgeTitle}
                            onChange={(e) => setFormData({ ...formData, badgeTitle: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                            placeholder="Enter badge title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Badge</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload a badge image for participants who complete this challenge</p>
                        
                        {formData.badgePreview && (
                            <div className="mt-3">
                                <p className="text-sm font-semibold mb-2">Badge Preview:</p>
                                <img
                                    src={formData.badgePreview}
                                    alt="Badge preview"
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition font-semibold"
                        >
                            {challenge ? 'Update Challenge' : 'Create Challenge'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, logout } = useUser();
    const [users, setUsers] = useState([]);
    const [quests, setQuests] = useState([]);
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeQuests: 0,
        pendingPartners: 0,
        pendingSubmissions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Protect against unauthorized access and pending role requests
        if (!user) return;

        if (user.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            logout();
            window.location.href = '/';
            return;
        }

        // Block access if user has pending role request (they're still technically 'user' role)
        if (user.requested_role && !user.is_approved) {
            alert('Your account approval is still pending. Redirecting to dashboard.');
            window.location.href = '/dashboard';
            return;
        }

        if (user.role === 'admin' && user.is_approved) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch users
            const usersRes = await fetch('/api/admin/users', {
                headers: { 'x-auth-token': token }
            });
            const usersData = await usersRes.json();
            setUsers(usersData);

            // Fetch quests
            const questsRes = await fetch('/api/quests', {
                headers: { 'x-auth-token': token }
            });
            const questsData = await questsRes.json();
            setQuests(questsData);

            // Fetch posts
            const postsRes = await fetch('/api/posts', {
                headers: { 'x-auth-token': token }
            });
            const postsData = await postsRes.json();
            setPosts(postsData);

            // Calculate stats - include both pending partner AND admin requests
            const pendingRequests = usersData.filter(u => u.requested_role && !u.is_approved).length;
            const activeQuests = questsData.filter(q => q.isActive).length;

            // Fetch pending submissions count
            const submissionsRes = await fetch('/api/quests/submissions/all', {
                headers: { 'x-auth-token': token }
            });
            const submissionsData = await submissionsRes.json();
            const pendingSubmissions = submissionsData.filter(s => s.status === 'pending').length;

            setStats({
                totalUsers: usersData.length,
                activeQuests: activeQuests,
                pendingPartners: pendingRequests,
                pendingSubmissions: pendingSubmissions
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleApprovePartner = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/users/${userId}/approve`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error approving partner:', error);
        }
    };

    const handleRejectPartner = async (userId) => {
        if (!confirm('Are you sure you want to reject this role request? The user will become a regular user.')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/users/${userId}/reject`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error rejecting role request:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteQuest = async (questId) => {
        if (!confirm('Are you sure you want to delete this quest?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/quests/${questId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting quest:', error);
        }
    };

    const handleDeleteChallenge = async (challengeId) => {
        if (!confirm('Are you sure you want to delete this challenge?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/challenges/${challengeId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete challenge');
            }
            
            // Refresh the challenges list
            fetchData();
            alert('Challenge deleted successfully!');
        } catch (error) {
            console.error('Error deleting challenge:', error);
            alert(`Failed to delete challenge: ${error.message}`);
        }
    };

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="pt-24 text-center">
                <p className="text-red-600 font-semibold">Access Denied. Admin privileges required.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="pt-24 text-center">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Filter for users with pending role requests (partner or admin)
    const pendingPartners = users.filter(u => u.requested_role && !u.is_approved);

    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-8 rounded-xl shadow-sm mb-6 sm:mb-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                <h2 className="text-2xl sm:text-4xl font-bold text-white">Admin Dashboard</h2>
                                <span className="px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/20 text-white backdrop-blur-sm self-start">
                                    Platform Administrator
                                </span>
                            </div>
                            <p className="text-white/90 text-sm sm:text-lg">Welcome back, {user.username}! Manage the HAU Eco-Quest platform.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="users" label="Users" icon={<Users className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quests" label="Quests" icon={<BookOpen className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="community" label="Community" icon={<FileText className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="submissions" label="Submissions" icon={<FileCheck className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notifications" label="Notifications" icon={<Bell className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab stats={stats} setActiveTab={setActiveTab} users={users} />}
                {activeTab === 'users' && <UsersTab users={users} pendingPartners={pendingPartners} onApprove={handleApprovePartner} onReject={handleRejectPartner} onDeleteUser={handleDeleteUser} />}
                {activeTab === 'quests' && <QuestsTab quests={quests} setQuests={setQuests} />}
                {activeTab === 'community' && <CommunityTab posts={posts} setPosts={setPosts} />}
                {activeTab === 'submissions' && <SubmissionsTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
            </main>
        </div>
    );
};

export default AdminDashboard;

