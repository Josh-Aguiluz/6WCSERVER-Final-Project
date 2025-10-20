//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import {
    BookOpen, BarChart, Users, TrendingUp, Plus, Edit, Trash2,
    Search, Calendar, MapPin, Award, Target, CheckCircle, Clock,
    FileText, Share2, Eye, MessageCircle, Heart, X, Save, Camera,
    TrendingDown, Activity, Zap, Bell
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, value, label, bgColor, trend }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-3 sm:gap-4">
            <div className={`${bgColor} p-3 sm:p-4 rounded-xl`}>{icon}</div>
            <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">{label}</p>
                {trend && <p className="text-xs text-green-600 font-semibold mt-2">↑ {trend}</p>}
            </div>
        </div>
    </div>
);

const TabButton = ({ id, label, icon, activeTab, setActiveTab, badge }) => (
    <button
        data-tab={id}
        onClick={() => setActiveTab(id)}
        className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm ${activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-green-600'
            }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
        {badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold">
                {badge}
            </span>
        )}
    </button>
);

// --- CHART COMPONENTS ---
const SimpleBarChart = ({ data, title, color = 'green' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const colorClasses = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500'
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-16 sm:w-20 text-xs sm:text-sm font-semibold text-gray-700">{item.label}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 sm:h-4 relative overflow-hidden">
                            <div 
                                className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <div className="w-10 sm:w-12 text-xs sm:text-sm font-bold text-gray-800">{item.value}</div>
                    </div>
                ))}
            </div>
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
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="h-24 sm:h-32 relative">
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
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative" style={{ width: size * 0.8, height: size * 0.8 }}>
                    <svg width={size * 0.8} height={size * 0.8} className="transform -rotate-90">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const circumference = 2 * Math.PI * 36;
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -cumulativePercentage * circumference / 100;
                            
                            cumulativePercentage += percentage;
                            
                            return (
                                <circle
                                    key={index}
                                    cx="48"
                                    cy="48"
                                    r="36"
                                    fill="none"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="16"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-lg sm:text-2xl font-bold text-gray-800">{total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: colors[index % colors.length] }}
                            ></div>
                            <span className="text-xs sm:text-sm text-gray-700">{item.label}</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
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
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 sm:gap-4 flex-wrap">
                    {categories.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: colors[index] }}
                            ></div>
                            <span className="text-xs sm:text-sm text-gray-600">{category}</span>
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

// --- QUEST FORM MODAL ---
const QuestModal = ({ quest, onClose, onSave }) => {
    const [formData, setFormData] = useState(quest || {
        title: '',
        category: 'Gardening & Planting',
        difficulty: 'Medium',
        points: 50,
        description: '',
        location: '',
        date: '',
        maxParticipants: 50,
        requirements: '',
        objectives: [''],
        submissionRequirements: ['']
    });
    const [objectives, setObjectives] = useState(quest?.objectives || ['']);
    const [submissionRequirements, setSubmissionRequirements] = useState(quest?.submissionRequirements || ['']);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(quest?.image_url || null);

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
            photo: selectedFile,
            objectives: objectives.filter(obj => obj.trim() !== ''),
            submissionRequirements: submissionRequirements.filter(req => req.trim() !== '')
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
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
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

// --- COMMUNITY CHALLENGE MODAL ---
const ChallengeModal = ({ challenge, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: challenge?.title || '',
        description: challenge?.description || '',
        content: challenge?.content || '',
        target: challenge?.target || 100,
        points: challenge?.points || 50,
        duration: challenge?.duration || '2-3 weeks',
        location: challenge?.location || 'HAU Campus',
        category: challenge?.category || 'Environmental',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-bold">{challenge ? 'Edit Challenge' : 'Create Community Challenge'}</h3>
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            placeholder="e.g., Plant 1,000 Trees Challenge"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Description</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
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
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
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

// --- COMMUNITY POST MODAL ---
const PostModal = ({ post, onClose, onSave }) => {
    const [formData, setFormData] = useState(post || {
        title: '',
        category: 'Updates',
        content: '',
        tags: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
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
                            placeholder="e.g., Tips for Sustainable Living"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                        >
                            <option>Updates</option>
                            <option>Environmental Tips</option>
                            <option>Success Stories</option>
                            <option>Events</option>
                            <option>News</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Content</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            rows="8"
                            placeholder="Write your post content here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-300"
                            placeholder="e.g., sustainability, recycling, climate"
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
                            <Share2 className="w-5 h-5" />
                            {post ? 'Update Post' : 'Publish Post'}
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

// --- OVERVIEW TAB ---
const OverviewTab = ({ quests, posts, setActiveTab }) => {
    const activeQuests = quests.filter(q => q.isActive).length;
    const totalParticipants = quests.reduce((sum, q) => sum + (q.completions?.length || 0), 0);
    const totalPoints = quests.reduce((sum, q) => sum + q.points, 0);

    // Generate chart data from real quest data based on creation dates
    const getWeeklyActivity = (quests, isThisWeek = true) => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + (isThisWeek ? 0 : -7));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(day => {
            const dayIndex = days.indexOf(day);
            const dayStart = new Date(weekStart);
            dayStart.setDate(weekStart.getDate() + dayIndex);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            
            const questsOnDay = quests.filter(quest => {
                const questDate = new Date(quest.created_at);
                return questDate >= dayStart && questDate <= dayEnd;
            }).length;
            
            return { label: day, value: questsOnDay };
        });
    };

    const weeklyProgressData = getWeeklyActivity(quests, true);
    const lastWeekData = getWeeklyActivity(quests, false);

    const categoryData = quests.reduce((acc, quest) => {
        const category = quest.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category]++;
        return acc;
    }, {});

    const categoryChartData = Object.entries(categoryData).map(([label, value]) => ({
        label: label.split(' ')[0], // Shorten category names
        value
    }));

    const questStatusData = [
        { label: 'Active', value: activeQuests },
        { label: 'Completed', value: quests.filter(q => q.completions && q.completions.length > 0).length },
        { label: 'Draft', value: quests.filter(q => q.status === 'draft').length }
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<BookOpen className="w-6 h-6 text-green-500" />}
                    value={activeQuests}
                    label="Active Quests"
                    bgColor="bg-green-50"
                    trend="12% this month"
                />
                <StatCard
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    value={totalParticipants}
                    label="Total Participants"
                    bgColor="bg-blue-50"
                    trend="8% this week"
                />
                <StatCard
                    icon={<Award className="w-6 h-6 text-yellow-500" />}
                    value={totalPoints}
                    label="Points Awarded"
                    bgColor="bg-yellow-50"
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                    value="95%"
                    label="Success Rate"
                    bgColor="bg-purple-50"
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 py-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Quest Completed</p>
                                <p className="text-xs text-gray-500">Campus Tree Planting finished</p>
                            </div>
                            <p className="text-xs text-gray-400">2h ago</p>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                            <Users className="w-5 h-5 text-blue-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">New Participants</p>
                                <p className="text-xs text-gray-500">12 students joined your quest</p>
                            </div>
                            <p className="text-xs text-gray-400">5h ago</p>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                            <Heart className="w-5 h-5 text-red-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Post Engagement</p>
                                <p className="text-xs text-gray-500">Your post received 45 likes</p>
                            </div>
                            <p className="text-xs text-gray-400">1d ago</p>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                            <Award className="w-5 h-5 text-yellow-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Quest Approved</p>
                                <p className="text-xs text-gray-500">Your new quest was approved</p>
                            </div>
                            <p className="text-xs text-gray-400">3d ago</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setActiveTab('quests')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <Plus className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold">Create Quest</p>
                                <p className="text-xs text-gray-500">Add a new environmental quest</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('community')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold">Create Post</p>
                                <p className="text-xs text-gray-500">Share updates with community</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <BarChart className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold">View Analytics</p>
                                <p className="text-xs text-gray-500">Check quest performance</p>
                            </div>
                        </button>
                    </div>
                </div>
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
    const [statusFilter, setStatusFilter] = useState('all');

    const handleSaveQuest = async (questData) => {
        try {
            const token = localStorage.getItem('token');

            // Use FormData if there's a photo, otherwise use JSON
            if (questData.photo) {
                const formData = new FormData();
                formData.append('title', questData.title);
                formData.append('description', questData.description);
                formData.append('category', questData.category);
                formData.append('difficulty', questData.difficulty);
                formData.append('points', questData.points);
                formData.append('duration', questData.date);
                formData.append('location', questData.location);
                formData.append('objectives', JSON.stringify(questData.objectives || [questData.description]));
                formData.append('submissionRequirements', JSON.stringify(questData.submissionRequirements || ['Photo proof required']));
                formData.append('maxParticipants', questData.maxParticipants);
                formData.append('photo', questData.photo);

                const response = await fetch('/api/quests', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to create quest');
                const newQuest = await response.json();
                setQuests([newQuest, ...quests]);
            } else {
                const payload = {
                    title: questData.title,
                    description: questData.description,
                    category: questData.category,
                    difficulty: questData.difficulty,
                    points: questData.points,
                    duration: questData.date,
                    location: questData.location,
                    objectives: questData.objectives || [questData.description],
                    submissionRequirements: questData.submissionRequirements || ['Photo proof required'],
                    maxParticipants: questData.maxParticipants
                };

                if (editingQuest) {
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
                    const response = await fetch('/api/quests', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) throw new Error('Failed to create quest');
                    const newQuest = await response.json();
                    setQuests([newQuest, ...quests]);
                }
            }

            setShowModal(false);
            setEditingQuest(null);
        } catch (error) {
            console.error('Error saving quest:', error);
            alert('Failed to save quest. Please try again.');
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

    const filteredQuests = quests.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             q.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || 
                             (statusFilter === 'active' && q.isActive) ||
                             (statusFilter === 'inactive' && !q.isActive);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Get unique categories for filter
    const categories = [...new Set(quests.map(q => q.category))];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Quest Management</h3>
                        <p className="text-sm text-gray-500">Create and manage your environmental quests</p>
                    </div>
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

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* Search Bar - Left */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
                        />
                    </div>
                    
                    {/* Filters - Right */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
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
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No quests found. Create your first quest!</p>
                        </div>
                    ) : (
                        filteredQuests.map(quest => (
                            <div key={quest._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h4 className="text-lg font-bold">{quest.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${quest.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {quest.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                    quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {quest.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-4 h-4" />
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
                                                <MapPin className="w-4 h-4" />
                                                {quest.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {quest.duration}
                                            </span>
                                        </div>
                                        {quest.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{quest.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingQuest(quest);
                                                setShowModal(true);
                                            }}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuest(quest._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition"
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

// --- COMMUNITY TAB ---
const CommunityTab = ({ posts, setPosts }) => {
    const [showModal, setShowModal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editingChallenge, setEditingChallenge] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [challenges, setChallenges] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'posts', 'challenges'
    const [loading, setLoading] = useState(true);

    const handleSavePost = async (postData) => {
        try {
            const token = localStorage.getItem('token');

            if (editingPost) {
                // For updates, use JSON for now
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
                // For new posts, use FormData to handle file uploads
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

    const handleDeletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            setPosts(posts.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleSaveChallenge = async (challengeData) => {
        try {
            const token = localStorage.getItem('token');
            
            if (editingChallenge) {
                // Update existing challenge
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

                const response = await fetch(`/api/challenges/${editingChallenge._id}`, {
                    method: 'PUT',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to update challenge');
                }
                
                const updatedChallenge = await response.json();
                setChallenges(challenges.map(c => c._id === editingChallenge._id ? updatedChallenge : c));
                alert('Challenge updated successfully!');
            } else {
                // Create new challenge
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

            const response = await fetch('/api/challenges', {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to create challenge');
                }
                
            const newChallenge = await response.json();
            setChallenges([newChallenge, ...challenges]);
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
            fetchChallenges();
            alert('Challenge deleted successfully!');
        } catch (error) {
            console.error('Error deleting challenge:', error);
            alert(`Failed to delete challenge: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchChallenges();
        setLoading(false);
    }, []);

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredChallenges = challenges.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Community Content</h3>
                        <p className="text-sm text-gray-500">Manage your blog posts and community challenges</p>
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

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* Search Bar - Left */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
                        />
                    </div>
                    
                    {/* Filters - Right */}
                    <div className="flex gap-2 flex-wrap">
                            {['All', 'Posts', 'Challenges'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter.toLowerCase())}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                        activeFilter === filter.toLowerCase()
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
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
                                                        className="p-2 hover:bg-red-50 rounded-lg transition"
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
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition"
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
                <QuestModal
                    onClose={() => setShowQuestModal(false)}
                    onSave={handleCreateDailyQuest}
                />
            )}

            {/* Daily Challenge Modal */}
            {showChallengeModal && (
                <PostModal
                    onClose={() => setShowChallengeModal(false)}
                    onSave={handleCreateDailyChallenge}
                />
            )}
        </div>
    );
};

// --- MAIN PARTNER DASHBOARD ---
const PartnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, logout } = useUser();

    const [quests, setQuests] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Protect against unauthorized access and pending role requests
        if (!user) return;

        if (user.role !== 'partner') {
            alert('Access denied. Partner privileges required.');
            logout();
            window.location.href = '/';
            return;
        }

        // Block access if user has pending role request (they're still technically 'user' role)
        if (user.requested_role && !user.is_approved) {
            alert('Your partner application is still pending approval. Redirecting to dashboard.');
            window.location.href = '/dashboard';
            return;
        }

        if (user.role === 'partner' && user.is_approved) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch quests
            const questsRes = await fetch('/api/quests', {
                headers: { 'x-auth-token': token }
            });
            const questsData = await questsRes.json();
            const userQuests = questsData.filter(q => q.createdBy?._id === user?._id || q.createdBy === user?._id);
            setQuests(userQuests);

            // Fetch posts
            const postsRes = await fetch('/api/posts', {
                headers: { 'x-auth-token': token }
            });
            const postsData = await postsRes.json();
            const userPosts = postsData.filter(p => p.author?._id === user?._id || p.author === user?._id);
            setPosts(userPosts);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (user.role !== 'partner' && user.role !== 'admin') {
        return (
            <div className="pt-24 text-center">
                <p className="text-red-600 font-semibold">Access Denied. Partner or Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-8 rounded-xl shadow-sm mb-6 sm:mb-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                <h2 className="text-2xl sm:text-4xl font-bold text-white">Partner Dashboard</h2>
                                <span className="px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/20 text-white backdrop-blur-sm self-center sm:self-auto">
                                    Environmental Partner
                                </span>
                            </div>
                            <p className="text-white/90 text-sm sm:text-lg">Welcome back, {user.username}! Manage your environmental initiatives.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quests" label="My Quests" icon={<BookOpen className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} badge={quests.filter(q => q.isActive).length} />
                    <TabButton id="community" label="Community" icon={<FileText className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notifications" label="Notifications" icon={<Bell className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab quests={quests} posts={posts} setActiveTab={setActiveTab} />}
                {activeTab === 'quests' && <QuestsTab quests={quests} setQuests={setQuests} />}
                {activeTab === 'community' && <CommunityTab posts={posts} setPosts={setPosts} />}
                {activeTab === 'notifications' && <NotificationsTab />}
            </main>
        </div>
    );
};

export default PartnerDashboard;

