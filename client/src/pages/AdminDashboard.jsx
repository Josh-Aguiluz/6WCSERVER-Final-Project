//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Users, BookOpen, BarChart, Shield, CheckCircle, XCircle, Edit, Trash2, Plus, Search, Filter, Calendar, MapPin, Award, X, Save, Clock, Eye, FileCheck, Heart, MessageCircle, FileText, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, value, label, bgColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            <div className={`${bgColor} p-4 rounded-xl`}>{icon}</div>
            <div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600 font-semibold">{label}</p>
            </div>
        </div>
    </div>
);

const QuickAction = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all w-full text-left">
        <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{title}</p>
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
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all text-sm ${activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-green-600'
            }`}
    >
        {icon}
        {label}
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
    
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
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
const OverviewTab = ({ stats, setActiveTab }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users className="w-6 h-6 text-blue-500" />} value={stats.totalUsers} label="Total Users" bgColor="bg-blue-50" />
            <StatCard icon={<BookOpen className="w-6 h-6 text-green-500" />} value={stats.activeQuests} label="Active Quests" bgColor="bg-green-50" />
            <StatCard icon={<Shield className="w-6 h-6 text-yellow-500" />} value={stats.pendingPartners} label="Pending Role Requests" bgColor="bg-yellow-50" />
            <StatCard icon={<FileCheck className="w-6 h-6 text-orange-500" />} value={stats.pendingSubmissions} label="Pending Submissions" bgColor="bg-orange-50" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GroupedBarChart 
                data={[
                    [
                        { label: 'Mon', value: Math.floor(stats.totalUsers * 0.1) + 2 },
                        { label: 'Tue', value: Math.floor(stats.totalUsers * 0.15) + 3 },
                        { label: 'Wed', value: Math.floor(stats.totalUsers * 0.2) + 4 },
                        { label: 'Thu', value: Math.floor(stats.totalUsers * 0.12) + 2 },
                        { label: 'Fri', value: Math.floor(stats.totalUsers * 0.25) + 5 },
                        { label: 'Sat', value: Math.floor(stats.totalUsers * 0.18) + 3 },
                        { label: 'Sun', value: Math.floor(stats.totalUsers * 0.1) + 1 }
                    ],
                    [
                        { label: 'Mon', value: Math.floor(stats.totalUsers * 0.12) + 3 },
                        { label: 'Tue', value: Math.floor(stats.totalUsers * 0.18) + 4 },
                        { label: 'Wed', value: Math.floor(stats.totalUsers * 0.22) + 5 },
                        { label: 'Thu', value: Math.floor(stats.totalUsers * 0.15) + 3 },
                        { label: 'Fri', value: Math.floor(stats.totalUsers * 0.28) + 6 },
                        { label: 'Sat', value: Math.floor(stats.totalUsers * 0.2) + 4 },
                        { label: 'Sun', value: Math.floor(stats.totalUsers * 0.12) + 2 }
                    ]
                ]} 
                title="Weekly Platform Activity" 
                categories={['This Week', 'Last Week']}
                colors={['#3B82F6', '#10B981']}
            />
            <DonutChart 
                data={[
                    { label: 'Users', value: stats.totalUsers - stats.pendingPartners },
                    { label: 'Partners', value: Math.floor(stats.totalUsers * 0.1) },
                    { label: 'Admins', value: Math.floor(stats.totalUsers * 0.02) },
                    { label: 'Pending', value: stats.pendingPartners }
                ]} 
                title="User Role Distribution" 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimpleBarChart 
                data={[
                    { label: 'Active', value: stats.activeQuests },
                    { label: 'Completed', value: Math.floor(stats.activeQuests * 0.7) },
                    { label: 'Draft', value: Math.floor(stats.activeQuests * 0.3) }
                ]} 
                title="Quest Status Overview" 
                color="green" 
            />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickAction
                        icon={<Users className="w-6 h-6 text-blue-500" />}
                        title="Manage Users"
                        subtitle="View and manage user accounts"
                        onClick={() => setActiveTab('users')}
                    />
                    <QuickAction
                        icon={<BookOpen className="w-6 h-6 text-green-500" />}
                        title="Manage Quests"
                        subtitle="Create and edit quests"
                        onClick={() => setActiveTab('quests')}
                    />
                    <QuickAction
                        icon={<BarChart className="w-6 h-6 text-purple-500" />}
                        title="View Analytics"
                        subtitle="System performance metrics"
                        onClick={() => setActiveTab('analytics')}
                    />
                    <QuickAction
                        icon={<Calendar className="w-6 h-6 text-orange-500" />}
                        title="Create Daily Quest"
                        subtitle="Set today's featured quest"
                        onClick={() => setActiveTab('daily')}
                    />
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

// --- USER PROFILE MODAL ---
const UserProfileModal = ({ user, onClose }) => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">User Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className={`w-20 h-20 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            {getRoleIcon(user.role)}
                        </div>
                        <h4 className="text-2xl font-bold">{user.username}</h4>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'partner'
                                    ? 'bg-purple-100 text-purple-700'
                                    : user.role === 'admin'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                {user.role}
                            </span>
                            {user.requested_role && !user.is_approved && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                    Pending {user.requested_role}
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
                            <p className="text-2xl font-bold text-green-600">{user.eco_score || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-blue-600" />
                                <h5 className="font-semibold text-sm text-blue-700">Points</h5>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{user.points || 0}</p>
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
                                    <span className="font-semibold text-gray-800">{user.hau_affiliation || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Avatar Theme:</span>
                                    <span className="font-semibold text-gray-800">{user.avatar_theme || 'Default'}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Header Theme:</span>
                                    <span className="font-semibold text-gray-800">{user.header_theme || 'Default'}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Approval Status:</span>
                                    <span className={`font-semibold flex items-center gap-1 ${user.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {user.is_approved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        {user.is_approved ? 'Approved' : 'Pending'}
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
                                    <span className="font-semibold text-gray-800">{user.questsCompleted?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Member Since:</span>
                                    <span className="font-semibold text-gray-800">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                                    <span className="text-gray-600">Last Active:</span>
                                    <span className="font-semibold text-gray-800">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
            {/* User Statistics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DonutChart 
                    data={roleChartData} 
                    title="User Role Distribution" 
                />
                <SimpleBarChart 
                    data={statusChartData} 
                    title="User Status Overview" 
                    color="blue" 
                />
            </div>

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">User Management</h3>
                        <p className="text-sm text-gray-500">Manage all user accounts and roles</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterRole('all')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterRole === 'all'
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All Roles
                            </button>
                            <button
                                onClick={() => setFilterRole('student')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterRole === 'student'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Students
                            </button>
                            <button
                                onClick={() => setFilterRole('partner')}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterRole === 'partner'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Partners
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Points</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold">{user.username}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'partner'
                                                ? 'bg-purple-100 text-purple-700'
                                                : user.role === 'admin'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.points || 0}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition"
                                                title="View Profile"
                                            >
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteUser(user._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition"
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, image: selectedFile });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{quest ? 'Edit Quest' : 'Create New Quest'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Campus Tree Planting"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Gardening & Planting</option>
                                <option>Recycling & Waste</option>
                                <option>Energy Conservation</option>
                                <option>Water Conservation</option>
                                <option>Education & Awareness</option>
                                <option>Transportation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Points Reward</label>
                            <input
                                type="number"
                                required
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Max Participants</label>
                            <input
                                type="number"
                                required
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="4"
                            placeholder="Describe the quest objectives and activities..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Objectives</label>
                        <textarea
                            value={formData.objectives}
                            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="List quest objectives..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Submission Requirements</label>
                        <textarea
                            value={formData.submissionRequirements}
                            onChange={(e) => setFormData({ ...formData, submissionRequirements: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="List submission requirements..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="quest-image-upload"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="quest-image-upload"
                                className={`cursor-pointer block text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {previewUrl ? (
                                    <div className="space-y-3">
                                        <img
                                            src={previewUrl}
                                            alt="Quest preview"
                                            className="max-h-48 mx-auto rounded-lg shadow-md"
                                        />
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <p className="text-sm text-green-600 font-medium">Image ready for upload</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Upload quest image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>
                        {selectedFile && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                <p className="text-xs text-green-700">
                                    <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
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

    const handleSaveQuest = async (questData) => {
        try {
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
                    objectives: questData.objectives ? [questData.objectives] : [],
                    submissionRequirements: questData.submissionRequirements ? [questData.submissionRequirements] : ['Photo proof required'],
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
                // For new quests, use FormData to handle file uploads
                const formData = new FormData();
                formData.append('title', questData.title);
                formData.append('description', questData.description);
                formData.append('category', questData.category);
                formData.append('difficulty', questData.difficulty);
                formData.append('points', questData.points);
                formData.append('duration', questData.duration);
                formData.append('location', questData.location);
                formData.append('objectives', JSON.stringify(questData.objectives ? [questData.objectives] : []));
                formData.append('submissionRequirements', JSON.stringify(questData.submissionRequirements ? [questData.submissionRequirements] : ['Photo proof required']));
                formData.append('maxParticipants', questData.maxParticipants);

                if (questData.image) {
                    formData.append('image', questData.image);
                }

                const response = await fetch('/api/quests', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to create quest');
                }
                const newQuest = await response.json();
                setQuests([newQuest, ...quests]);
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

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Quest Management</h3>
                    <button
                        onClick={() => {
                            setEditingQuest(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quest
                    </button>
                </div>

                <div className="space-y-4">
                    {quests.map(quest => (
                        <div key={quest._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold">{quest.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${quest.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {quest.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            {quest.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="w-4 h-4" />
                                            {quest.points} points
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {quest.completions?.length || 0} participants
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {quest.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => {
                                            setEditingQuest(quest);
                                            setShowModal(true);
                                        }}
                                        className="p-2 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                                    >
                                        <Edit className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuest(quest._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
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
                    ))}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-500">Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{quests.length}</p>
                            <p className="text-sm text-gray-500">Total Quests</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{analyticsData.totalEngagement}</p>
                            <p className="text-sm text-gray-500">Quest Completions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <BarChart className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{analyticsData.averagePoints}</p>
                            <p className="text-sm text-gray-500">Avg Points/User</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SimpleBarChart 
                    data={categoryChartData} 
                    title="Quest Category Performance" 
                    color="green" 
                />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Platform Health</h3>
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
    const [searchTerm, setSearchTerm] = useState('');
    const [postFilter, setPostFilter] = useState('all'); // all, admin, partner, user

    const handleSavePost = async (postData) => {
        try {
            const token = localStorage.getItem('token');

            if (editingPost) {
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

                if (!response.ok) throw new Error('Failed to update post');
                const updatedPost = await response.json();
                setPosts(posts.map(p => p._id === editingPost._id ? updatedPost : p));
            } else {
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
            const response = await fetch('/api/challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    ...challengeData,
                    isActive: true,
                    current_progress: 0,
                    participants: []
                })
            });

            if (!response.ok) throw new Error('Failed to create challenge');
            alert('Community challenge created successfully!');
            setShowChallengeModal(false);
        } catch (error) {
            console.error('Error creating challenge:', error);
            alert('Failed to create challenge. Please try again.');
        }
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

    // Separate posts by author role for admin controls
    const adminPosts = posts.filter(p => p.author?.role === 'admin');
    const partnerPosts = posts.filter(p => p.author?.role === 'partner');
    const userPosts = posts.filter(p => p.author?.role === 'user');

    return (
        <div className="space-y-6">
            {/* Admin Post Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Users className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Admin Posts</h3>
                            <p className="text-2xl font-bold text-red-600">{adminPosts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Partner Posts</h3>
                            <p className="text-2xl font-bold text-blue-600">{partnerPosts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">User Posts</h3>
                            <p className="text-2xl font-bold text-green-600">{userPosts.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Community Content Management</h3>
                        <p className="text-sm text-gray-500">Manage all community posts and challenges</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingPost(null);
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Create Post
                        </button>
                        <button
                            onClick={() => setShowChallengeModal(true)}
                            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                        >
                            <Users className="w-4 h-4" />
                            Create Challenge
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPostFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${postFilter === 'all'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Posts
                        </button>
                        <button
                            onClick={() => setPostFilter('admin')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${postFilter === 'admin'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Admin Posts
                        </button>
                        <button
                            onClick={() => setPostFilter('partner')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${postFilter === 'partner'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Partner Posts
                        </button>
                        <button
                            onClick={() => setPostFilter('user')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${postFilter === 'user'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            User Posts
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No posts found. Create your first post!</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
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
                                            onClick={() => {
                                                setEditingPost({ ...post, tags: post.tags?.join(', ') || '' });
                                                setShowModal(true);
                                            }}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                                        >
                                            <Edit className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
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
                    onClose={() => setShowChallengeModal(false)}
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
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
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
                                className={`p-4 rounded-lg border transition ${notification.is_read ? 'bg-gray-50' : 'bg-white shadow-sm'
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

// --- DAILY MANAGEMENT TAB ---
const DailyTab = () => {
    const [dailyQuest, setDailyQuest] = useState(null);
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [showQuestModal, setShowQuestModal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyContent();
    }, []);

    const fetchDailyContent = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch today's quest
            const questRes = await fetch('/api/daily/quest');
            const questData = await questRes.json();
            setDailyQuest(questData.quest);

            // Fetch today's challenge
            const challengeRes = await fetch('/api/daily/challenge');
            const challengeData = await challengeRes.json();
            setDailyChallenge(challengeData.challenge);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching daily content:', error);
            setLoading(false);
        }
    };

    const handleCreateDailyQuest = async (questData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/daily/quest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(questData)
            });

            if (response.ok) {
                const newQuest = await response.json();
                setDailyQuest(newQuest);
                setShowQuestModal(false);
                alert('Daily quest created successfully!');
            } else {
                const error = await response.json();
                alert(error.msg || 'Failed to create daily quest');
            }
        } catch (error) {
            console.error('Error creating daily quest:', error);
            alert('Network error. Please try again.');
        }
    };

    const handleCreateDailyChallenge = async (challengeData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/daily/challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(challengeData)
            });

            if (response.ok) {
                const newChallenge = await response.json();
                setDailyChallenge(newChallenge);
                setShowChallengeModal(false);
                alert('Daily challenge created successfully!');
            } else {
                const error = await response.json();
                alert(error.msg || 'Failed to create daily challenge');
            }
        } catch (error) {
            console.error('Error creating daily challenge:', error);
            alert('Network error. Please try again.');
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
        <div className="space-y-8">
            {/* Today's Quest Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Today's Quest</h3>
                    {!dailyQuest && (
                        <button
                            onClick={() => setShowQuestModal(true)}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Create Daily Quest
                        </button>
                    )}
                </div>

                {dailyQuest ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-bold text-green-800 mb-2">{dailyQuest.title}</h4>
                        <p className="text-green-700 text-sm mb-2">{dailyQuest.description}</p>
                        <div className="flex items-center gap-4 text-xs text-green-600">
                            <span>Category: {dailyQuest.category}</span>
                            <span>Points: {dailyQuest.points}</span>
                            <span>Difficulty: {dailyQuest.difficulty}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No daily quest created for today</p>
                    </div>
                )}
            </div>

            {/* Today's Community Challenge Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Today's Community Challenge</h3>
                    {!dailyChallenge && (
                        <button
                            onClick={() => setShowChallengeModal(true)}
                            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Create Daily Challenge
                        </button>
                    )}
                </div>

                {dailyChallenge ? (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-bold text-purple-800 mb-2">{dailyChallenge.title}</h4>
                        <p className="text-purple-700 text-sm">{dailyChallenge.content}</p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No community challenge created for today</p>
                    </div>
                )}
            </div>

            {/* Daily Quest Modal */}
            {showQuestModal && (
                <DailyQuestModal
                    onClose={() => setShowQuestModal(false)}
                    onSave={handleCreateDailyQuest}
                />
            )}

            {/* Daily Challenge Modal */}
            {showChallengeModal && (
                <DailyChallengeModal
                    onClose={() => setShowChallengeModal(false)}
                    onSave={handleCreateDailyChallenge}
                />
            )}
        </div>
    );
};

// --- DAILY QUEST MODAL ---
const DailyQuestModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Gardening & Planting',
        difficulty: 'Medium',
        points: 100,
        duration: '1 day',
        location: 'HAU Campus',
        objectives: '',
        submissionRequirements: '',
        maxParticipants: 100
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Create Today's Quest</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Today's Campus Clean-up Challenge"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="Describe today's special quest..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Gardening & Planting</option>
                                <option>Recycling & Waste</option>
                                <option>Energy Conservation</option>
                                <option>Water Conservation</option>
                                <option>Education & Awareness</option>
                                <option>Transportation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Points Reward</label>
                            <input
                                type="number"
                                required
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                        >
                            Create Daily Quest
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

// --- SUBMISSIONS TAB ---
const SubmissionsTab = ({ onApprove, onReject }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/quests/submissions/all', {
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (submissionId) => {
        console.log('🚀 FRONTEND: handleApprove called with submissionId:', submissionId);
        try {
            const token = localStorage.getItem('token');
            console.log('🚀 FRONTEND: Making API call to approve submission:', submissionId);
            const response = await fetch(`/api/quests/submissions/${submissionId}/review`, {
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

    const handleReject = async (submissionId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/quests/submissions/${submissionId}/review`, {
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Pending</h3>
                            <p className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">{submissions.filter(s => s.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Approved</h3>
                            <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">{submissions.filter(s => s.status === 'approved').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Rejected</h3>
                            <p className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors">{submissions.filter(s => s.status === 'rejected').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <FileCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Total</h3>
                            <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{submissions.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Quest Submissions</h3>
                        <p className="text-sm text-gray-500">Review and approve quest completions</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filter === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filter === 'approved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filter === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Rejected
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                        <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No {filter !== 'all' ? filter : ''} submissions found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredSubmissions.map(submission => (
                            <div key={submission._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h4 className="text-lg font-bold">{submission.quest_id?.title || 'Unknown Quest'}</h4>
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
                                                {submission.quest_id?.points || 0} points
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
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="p-2 hover:bg-blue-50 hover:shadow-md rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-400 transform hover:scale-105"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                                        </button>
                                        {submission.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        console.log('🚀 BUTTON CLICKED: Approve button clicked for submission:', submission._id);
                                                        console.log('🚀 BUTTON CLICKED: Submission status:', submission.status);
                                                        console.log('🚀 BUTTON CLICKED: Event:', e);
                                                        handleApprove(submission._id);
                                                    }}
                                                    className="p-2 hover:bg-green-50 hover:shadow-md rounded-lg transition-all duration-200 border border-green-200 hover:border-green-400 transform hover:scale-105"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5 text-green-600 hover:text-green-700" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(submission._id)}
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
                )}
            </div>

            {/* Submission Details Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Submission Details</h3>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">Quest</h4>
                                <p className="text-lg">{selectedSubmission.quest_id?.title}</p>
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
                                        src={`http://localhost:5000/${selectedSubmission.photo_url}`}
                                        alt="Quest proof"
                                        className="w-full max-h-96 object-contain border rounded-lg"
                                    />
                                ) : (
                                    <p className="text-gray-500">No photo uploaded</p>
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
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={(e) => {
                                            console.log('🚀 MODAL BUTTON CLICKED: Approve button clicked for submission:', selectedSubmission._id);
                                            console.log('🚀 MODAL BUTTON CLICKED: Submission status:', selectedSubmission.status);
                                            console.log('🚀 MODAL BUTTON CLICKED: Event:', e);
                                            handleApprove(selectedSubmission._id);
                                        }}
                                        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Submission
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedSubmission._id)}
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
    const [formData, setFormData] = useState(post || {
        title: '',
        content: '',
        category: 'Updates',
        tags: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(post?.image_url || null);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, image: selectedFile });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{post ? 'Edit Post' : 'Create New Post'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter post title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., environment, tips, community"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="post-image-upload"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="post-image-upload"
                                className={`cursor-pointer block text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {previewUrl ? (
                                    <div className="space-y-3">
                                        <img
                                            src={previewUrl}
                                            alt="Post preview"
                                            className="max-h-48 mx-auto rounded-lg shadow-md"
                                        />
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <p className="text-sm text-green-600 font-medium">Image ready for upload</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Upload post image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>
                        {selectedFile && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                <p className="text-xs text-green-700">
                                    <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
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
const ChallengeModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Create Community Challenge</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter challenge title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Description</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                            placeholder="Describe the community challenge..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition font-semibold"
                        >
                            Create Challenge
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

// --- DAILY CHALLENGE MODAL ---
const DailyChallengeModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Create Today's Community Challenge</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., Share Your Green Tip of the Day"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Description</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                            placeholder="Describe today's community challenge..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition font-semibold"
                        >
                            Create Daily Challenge
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
            <main className="container mx-auto px-6 pt-24 pb-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-xl shadow-sm mb-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
                    </div>
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="text-4xl font-bold text-white">Admin Dashboard</h2>
                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm">
                                    Platform Administrator
                                </span>
                            </div>
                            <p className="text-white/90 text-lg">Welcome back, {user.username}! Manage the HAU Eco-Quest platform.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 inline-flex items-center gap-3 mb-8 flex-wrap">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="users" label="Users" icon={<Users className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quests" label="Quests" icon={<BookOpen className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="community" label="Community" icon={<FileText className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="submissions" label="Submissions" icon={<FileCheck className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="daily" label="Daily" icon={<Calendar className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notifications" label="Notifications" icon={<Users className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="analytics" label="Analytics" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab stats={stats} setActiveTab={setActiveTab} />}
                {activeTab === 'users' && <UsersTab users={users} pendingPartners={pendingPartners} onApprove={handleApprovePartner} onReject={handleRejectPartner} onDeleteUser={handleDeleteUser} />}
                {activeTab === 'quests' && <QuestsTab quests={quests} setQuests={setQuests} />}
                {activeTab === 'community' && <CommunityTab posts={posts} setPosts={setPosts} />}
                {activeTab === 'submissions' && <SubmissionsTab />}
                {activeTab === 'daily' && <DailyTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'analytics' && <AnalyticsTab stats={stats} users={users} quests={quests} />}
            </main>
        </div>
    );
};

export default AdminDashboard;

