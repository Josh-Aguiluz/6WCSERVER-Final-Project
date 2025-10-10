//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";
import { BookOpen, PlusCircle, User, Settings, BarChart, TreePine, Recycle, Droplets, Sun, Zap, Activity, Badge, Trophy, CheckCircle, Clock, List, ChevronRight, Award, UserCircle, Users, Crown, Building, Target, MapPin, Calendar, Search, TrendingUp, TrendingDown } from 'lucide-react';

// --- ALL HELPER COMPONENTS ARE NOW DEFINED AT THE TOP LEVEL ---

const StatCard = ({ icon, value, label, change }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600 font-semibold">{label}</p>
            </div>
        </div>
        {change && <p className="text-xs text-green-600 mt-2 font-semibold">{change}</p>}
    </div>
);
const QuickLink = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all text-left">
        <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
);
const ActivityItem = ({ icon, title, subtitle, time, points }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-gray-500">{time}</p>
            {points && <p className="text-xs font-bold text-green-600">{points}</p>}
        </div>
    </div>
);
const QuestStat = ({ icon, value, label }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
        <div className="mx-auto w-fit mb-3">{icon}</div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-600 font-semibold">{label}</p>
    </div>
);
const GoalItem = ({ title, value, progress, label }) => (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between font-semibold text-sm mb-2">
            <p className="text-gray-800">{title}</p>
            <p className="text-green-600">{value}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-gray-600">{label}</p>
    </div>
);
const CategoryProgress = ({ icon, title, value, progress }) => (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-6">{icon}</div>
            <p className="font-semibold text-sm flex-1 text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{value}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);
const ImpactCard = ({ icon, value, label, color }) => (
    <div className={`p-6 rounded-2xl text-center shadow-lg ${color}`}>
        <div className="mx-auto w-fit mb-3">{icon}</div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/90">{label}</p>
    </div>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-sm font-semibold text-gray-700">{item.label}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                            <div 
                                className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <div className="w-12 text-sm font-bold text-gray-800">{item.value}</div>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-center gap-6">
                <div className="relative" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const circumference = 2 * Math.PI * 45; // radius = 45
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
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{total}</div>
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
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AchievementSection = ({ achievements }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
                {achievements.length > 0 ? (
                    achievements.slice(0, 3).map((achievement, index) => (
                        <ActivityItem 
                            key={index}
                            icon={<Badge className="text-green-500"/>} 
                            title={achievement.badge_id?.name || 'Achievement'} 
                            subtitle={achievement.badge_id?.description || 'Great job!'} 
                            time={new Date(achievement.earned_at).toLocaleDateString()} 
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No achievements yet. Complete quests to earn badges!</p>
                )}
            </div>
            <button className="font-semibold text-green-600 mt-4 text-sm hover:underline">View All Badges</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Badge Collection</h3>
            <div className="bg-purple-50 text-purple-800 p-6 rounded-xl text-center">
                <p className="text-5xl font-bold">{achievements.length}</p>
                <p className="font-semibold">Badges Earned</p>
                <p className="text-xs">Out of 35 available badges</p>
            </div>
            <div className="mt-4 space-y-3">
                <p className="font-semibold text-sm">Next Badges to Unlock</p>
                {achievements.length > 0 ? (
                    achievements.slice(0, 2).map((achievement, index) => (
                        <GoalItem 
                            key={index}
                            title={achievement.badge_id?.name || 'Next Badge'} 
                            value={`${achievement.current || 0}/${achievement.target || 10}`} 
                            progress={achievement.progress || 0} 
                            label={achievement.badge_id?.description || 'Complete quests to unlock'} 
                        />
                    ))
                ) : (
                    <>
                        <GoalItem title="First Quest" value="0/1" progress={0} label="Complete your first quest" />
                        <GoalItem title="Quest Master" value="0/5" progress={0} label="Complete 5 quests" />
                    </>
                )}
            </div>
        </div>
    </div>
);

const OverviewTabContent = ({ dashboardData, onPageChange, userData }) => {
    // Generate chart data from dashboard data
    const weeklyProgressData = [
        { label: 'Mon', value: Math.floor(Math.random() * 20) + 5 },
        { label: 'Tue', value: Math.floor(Math.random() * 20) + 8 },
        { label: 'Wed', value: Math.floor(Math.random() * 20) + 12 },
        { label: 'Thu', value: Math.floor(Math.random() * 20) + 6 },
        { label: 'Fri', value: Math.floor(Math.random() * 20) + 15 },
        { label: 'Sat', value: Math.floor(Math.random() * 20) + 10 },
        { label: 'Sun', value: Math.floor(Math.random() * 20) + 7 }
    ];

    const categoryData = [
        { label: 'Recycling', value: dashboardData.categoryProgress['Recycling & Waste']?.completed || 0 },
        { label: 'Energy', value: dashboardData.categoryProgress['Energy Conservation']?.completed || 0 },
        { label: 'Water', value: dashboardData.categoryProgress['Water Conservation']?.completed || 0 },
        { label: 'Gardening', value: dashboardData.categoryProgress['Gardening & Planting']?.completed || 0 },
        { label: 'Education', value: dashboardData.categoryProgress['Education & Awareness']?.completed || 0 }
    ];

    const questTypeData = [
        { label: 'Completed', value: dashboardData.questsCompleted },
        { label: 'In Progress', value: dashboardData.questsInProgress },
        { label: 'Available', value: dashboardData.availableQuests }
    ];

    return (
        <div className="space-y-8">
            {/* User Level Display */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl shadow-sm text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Level {userData.level}</h3>
                        <p className="text-white/90">Environmental Champion</p>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-white/80 mb-1">
                                <span>Progress to Level {userData.level + 1}</span>
                                <span>{userData.points % 100} / 100 points</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${((userData.points % 100) / 100) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{userData.points}</div>
                        <div className="text-sm text-white/80">Total Points</div>
                    </div>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} value={dashboardData.questsCompleted} label="Quests Completed" change="+1 this month" />
                <StatCard icon={<Award className="w-8 h-8 text-orange-500" />} value={dashboardData.badgesEarned} label="Badges Earned" change="+0 new" />
                <StatCard icon={<Trophy className="w-8 h-8 text-yellow-500" />} value={dashboardData.ecoPoints} label="Eco Points" change="+150 this week" />
            </div>

            {/* Dashboard Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LineChart 
                    data={weeklyProgressData} 
                    title="Weekly Progress" 
                    color="green" 
                />
                <DonutChart 
                    data={questTypeData} 
                    title="Quest Distribution" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SimpleBarChart 
                    data={categoryData} 
                    title="Category Progress" 
                    color="blue" 
                />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Quick Adventures</h3>
                    <div className="space-y-3">
                        <QuickLink icon={<BookOpen className="w-5 h-5 text-blue-500" />} title="Browse Quests" subtitle="Discover new adventures" onClick={() => onPageChange('quests')} />
                        <QuickLink icon={<User className="w-5 h-5 text-green-500" />} title="View Community" subtitle="Connect with Eco-Heroes" onClick={() => onPageChange('community')} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {dashboardData.recentActivity.length > 0 ? (
                        dashboardData.recentActivity.map((activity, index) => (
                            <ActivityItem 
                                key={index}
                                icon={activity.icon} 
                                title={activity.title} 
                                subtitle={activity.subtitle} 
                                time={activity.time} 
                                points={activity.points} 
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- QUESTS TAB ---
const QuestsTab = ({ onPageChange }) => {
    const [quests, setQuests] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuests();
        fetchUserSubmissions();
    }, []);

    const fetchQuests = async () => {
        try {
            const { questAPI } = await import('../utils/api');
            const data = await questAPI.getAllQuests();
            setQuests(data);
        } catch (error) {
            console.error('Error fetching quests:', error);
        }
    };

    const fetchUserSubmissions = async () => {
        try {
            const { questAPI } = await import('../utils/api');
            const data = await questAPI.getMySubmissions();
            setUserSubmissions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user submissions:', error);
            setLoading(false);
        }
    };

    const handleStartQuest = (questId) => {
        onPageChange('quest-details', questId);
    };

    // Calculate quest progress
    const completedQuests = userSubmissions.filter(s => s.status === 'approved').length;
    const inProgressQuests = userSubmissions.filter(s => s.status === 'pending').length;
    const availableQuests = quests.filter(q => 
        !userSubmissions.some(s => s.quest_id._id === q._id)
    ).length;

    const filteredQuests = quests.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quest Progress Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6">Quest Progress</h3>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold">{completedQuests}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold">{inProgressQuests}</p>
                        <p className="text-sm text-gray-500">In Progress</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <List className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-2xl font-bold">{availableQuests}</p>
                        <p className="text-sm text-gray-500">Available</p>
                    </div>
                </div>
                
                <h4 className="font-semibold mb-4">Progress by Category</h4>
                <div className="space-y-3">
                    {Object.entries(quests.reduce((acc, quest) => {
                        const category = quest.category;
                        if (!acc[category]) {
                            acc[category] = { total: 0, completed: 0 };
                        }
                        acc[category].total++;
                        if (userSubmissions.some(s => s.quest_id._id === quest._id && s.status === 'approved')) {
                            acc[category].completed++;
                        }
                        return acc;
                    }, {})).map(([category, progress]) => {
                        const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                        const getCategoryIcon = (cat) => {
                            const icons = {
                                'Recycling & Waste': <Recycle className="w-5 h-5 text-blue-500"/>,
                                'Energy Conservation': <Sun className="w-5 h-5 text-yellow-500"/>,
                                'Water Conservation': <Droplets className="w-5 h-5 text-cyan-500"/>,
                                'Gardening & Planting': <TreePine className="w-5 h-5 text-green-500"/>,
                                'Education & Awareness': <BookOpen className="w-5 h-5 text-purple-500"/>,
                                'Transportation': <Building className="w-5 h-5 text-indigo-500"/>
                            };
                            return icons[cat] || <TreePine className="w-5 h-5 text-green-500"/>;
                        };
                        return (
                            <div key={category} className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5">{getCategoryIcon(category)}</div>
                                    <p className="font-semibold text-sm flex-1">{category}</p>
                                    <p className="text-xs text-gray-500">{progress.completed} of {progress.total} quests</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Available Quests</h3>
                        <p className="text-sm text-gray-500">Start new environmental quests and track your progress</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredQuests.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No quests found. Check back later for new quests!</p>
                        </div>
                    ) : (
                        filteredQuests.map(quest => (
                            <div key={quest._id} className="border rounded-xl p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h4 className="text-lg font-bold">{quest.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                quest.isActive 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {quest.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
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
                                            onClick={() => handleStartQuest(quest._id)}
                                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Start Quest
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
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
                                className={`p-4 rounded-lg border transition ${
                                    notification.is_read ? 'bg-gray-50' : 'bg-white shadow-sm'
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

// --- ACHIEVEMENTS TAB ---
const AchievementsTab = () => {
    const [badgeData, setBadgeData] = useState({
        totalBadges: 0,
        earnedBadges: 0,
        badgeProgress: [],
        nextBadges: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBadgeData();
    }, []);

    const fetchBadgeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(localStorage.getItem('user'))._id;
            
            const response = await fetch(`/api/badges/user/${userId}/progress`, {
                headers: { 'x-auth-token': token }
            });
            
            if (response.ok) {
                const data = await response.json();
                setBadgeData(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching badge data:', error);
            setLoading(false);
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
            {/* Badge Collection Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Badge Collection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-6 rounded-xl text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">{badgeData.earnedBadges}</div>
                        <div className="text-sm text-purple-600 mb-1">Badges Earned</div>
                        <div className="text-xs text-gray-500">Out of {badgeData.totalBadges} available badges</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{Math.round((badgeData.earnedBadges / badgeData.totalBadges) * 100)}%</div>
                        <div className="text-sm text-green-600 mb-1">Completion Rate</div>
                        <div className="text-xs text-gray-500">Keep going to earn more badges!</div>
                    </div>
                </div>
            </div>

            {/* Next Badges to Unlock */}
            {badgeData.nextBadges.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h3 className="text-xl font-bold mb-4">Next Badges to Unlock</h3>
                    <div className="space-y-4">
                        {badgeData.nextBadges.map((badge, index) => (
                            <div key={badge._id} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{badge.name}</h4>
                                        <p className="text-sm text-gray-600">{badge.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold">{badge.current}/{badge.target}</div>
                                        <div className="text-xs text-gray-500">{badge.progress}%</div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${badge.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Badges Progress */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">All Badges Progress</h3>
                <div className="space-y-3">
                    {badgeData.badgeProgress.map((badge, index) => (
                        <div key={badge._id} className={`border rounded-lg p-3 ${badge.isEarned ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${badge.isEarned ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    {badge.isEarned ? <Trophy className="w-4 h-4 text-white" /> : <Trophy className="w-4 h-4 text-gray-500" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${badge.isEarned ? 'text-green-800' : 'text-gray-700'}`}>
                                        {badge.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">{badge.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold">{badge.current}/{badge.target}</div>
                                    <div className="text-xs text-gray-500">{badge.progress}%</div>
                                </div>
                            </div>
                            {!badge.isEarned && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div 
                                        className="bg-orange-400 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${badge.progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProgressTabContent = ({ dashboardData, userData, levelProgress }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border text-center">
                    <h3 className="text-xl font-bold mb-2">Level {userData.level}</h3>
                    <p className="text-gray-500 text-sm mb-4">Environmental Champion</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(levelProgress || 0, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{Math.max(100 - (userData.points % 100), 0)} more points to next level</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h3 className="text-xl font-bold mb-4">Streaks & Goals</h3>
                    <GoalItem 
                        title="Day Streak" 
                        value={dashboardData.currentStreak || 0} 
                        progress={Math.min((dashboardData.currentStreak || 0) / 30 * 100, 100)} 
                        label={`Longest Streak: ${dashboardData.longestStreak || 0} days`} 
                    />
                    <GoalItem 
                        title="Energy Conservation" 
                        value={`${dashboardData.goals?.energy_conservation?.current || 0}/${dashboardData.goals?.energy_conservation?.target || 10}`} 
                        progress={Math.min(((dashboardData.goals?.energy_conservation?.current || 0) / (dashboardData.goals?.energy_conservation?.target || 10)) * 100, 100)} 
                        label="Complete energy conservation quests" 
                    />
                    <GoalItem 
                        title="Water Saved" 
                        value={`${dashboardData.goals?.water_saved?.current || 0}/${dashboardData.goals?.water_saved?.target || 500}L`} 
                        progress={Math.min(((dashboardData.goals?.water_saved?.current || 0) / (dashboardData.goals?.water_saved?.target || 500)) * 100, 100)} 
                        label="Save water through conservation" 
                    />
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Quest Progress</h3>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <QuestStat icon={<CheckCircle className="w-8 h-8 text-green-500" />} value={dashboardData.questsCompleted} label="Completed" />
                    <QuestStat icon={<Clock className="w-8 h-8 text-blue-500" />} value={dashboardData.questsInProgress} label="In Progress" />
                    <QuestStat icon={<List className="w-8 h-8 text-gray-500" />} value={dashboardData.availableQuests} label="Available" />
                </div>
                <h4 className="font-semibold mb-4">Progress by Category</h4>
                {Object.entries(dashboardData.categoryProgress).map(([category, progress]) => {
                    const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                    const getCategoryIcon = (cat) => {
                        const icons = {
                            'Recycling & Waste': <Recycle className="w-5 h-5 text-blue-500"/>,
                            'Energy Conservation': <Sun className="w-5 h-5 text-yellow-500"/>,
                            'Water Conservation': <Droplets className="w-5 h-5 text-cyan-500"/>,
                            'Gardening & Planting': <TreePine className="w-5 h-5 text-green-500"/>,
                            'Education & Awareness': <BookOpen className="w-5 h-5 text-purple-500"/>,
                            'Transportation': <Building className="w-5 h-5 text-indigo-500"/>
                        };
                        return icons[cat] || <TreePine className="w-5 h-5 text-green-500"/>;
                    };
                    return (
                        <CategoryProgress 
                            key={category}
                            icon={getCategoryIcon(category)} 
                            title={category} 
                            value={`${progress.completed} of ${progress.total} quests`} 
                            progress={progressPercent} 
                        />
                    );
                })}
            </div>
        </div>
        <AchievementSection achievements={dashboardData.achievements} />
    </div>
);

// TabButton component
const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => (
    <button
        data-tab={id}
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
            activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
    >
        {icon}
        {label}
    </button>
);

// Pending Approval Component
const PendingApprovalCard = ({ user }) => {
    const roleTitle = user.requested_role === 'partner' ? 'Environmental Partner' : 'Admin';
    const roleIcon = user.requested_role === 'partner' ? 
        <Users className="w-8 h-8 text-yellow-500" /> : 
        <Crown className="w-8 h-8 text-red-500" />;
    
    return (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-lg mb-8 text-white">
            <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-full">
                    {roleIcon}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">🕐 Role Request Pending</h2>
                    <p className="text-white/90 mb-1">
                        Your <strong>{roleTitle}</strong> request is being reviewed by our administrators.
                    </p>
                    <p className="text-white/80 text-sm">
                        You'll receive access to additional features once your request is approved.
                        In the meantime, you can still participate in quests and earn points!
                    </p>
                </div>
                <div className="text-center">
                    <div className="bg-white/20 px-4 py-2 rounded-full mb-2">
                        <Clock className="w-6 h-6 mx-auto" />
                    </div>
                    <p className="text-sm font-semibold">Awaiting Approval</p>
                </div>
            </div>
        </div>
    );
};

// Role Request Component
const RoleRequestCard = ({ user, onRequestRole }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleRequest = async () => {
        if (!selectedRole) return;
        
        setLoading(true);
        try {
            const result = await onRequestRole(selectedRole);
            
            if (result.success) {
                setShowModal(false);
                setSelectedRole('');
                const roleTitle = selectedRole === 'partner' ? 'Partner' : 'Admin';
                alert(`✅ Request sent! Your ${roleTitle} request has been submitted successfully. You will be notified when an admin reviews your request.`);
                window.location.reload();
            } else {
                console.error('Role request failed:', result.error);
                alert(`❌ ${result.error || 'Failed to submit role request'}`);
            }
        } catch (error) {
            console.error('Role request error:', error);
            alert(`❌ Network error: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl shadow-sm mb-6 text-white sticky top-20 z-30">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">🚀 Upgrade Your Account</h3>
                        <p className="text-white/90 text-sm">
                            Ready for more responsibilities? Request Partner or Admin access!
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition text-sm"
                    >
                        Request Role
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-4">Request Role Upgrade</h3>
                            <p className="text-gray-600 mb-6">
                                Choose the role you'd like to request. Your request will be reviewed by administrators.
                            </p>

                            <div className="space-y-3 mb-6">
                                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="partner"
                                        checked={selectedRole === 'partner'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-5 h-5 text-purple-500" />
                                            <span className="font-semibold">Environmental Partner</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Create and manage environmental quests, access analytics dashboard
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={selectedRole === 'admin'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Crown className="w-5 h-5 text-red-500" />
                                            <span className="font-semibold">Platform Administrator</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Full platform control, user management, content approval
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRoleRequest}
                                    disabled={!selectedRole || loading}
                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Avatar mapping
const getAvatarStyles = (avatarName) => {
    const avatars = {
        "Girl Avatar 1": { color: "text-pink-500", bg: "bg-pink-100" },
        "Girl Avatar 2": { color: "text-pink-400", bg: "bg-pink-50" },
        "Boy Avatar 1": { color: "text-blue-500", bg: "bg-blue-100" },
        "Boy Avatar 2": { color: "text-blue-400", bg: "bg-blue-50" },
    };
    return avatars[avatarName] || avatars["Girl Avatar 1"]; // Default avatar
};

// Header theme mapping
const getHeaderTheme = (themeName) => {
    const themes = {
        orange: "from-orange-400 to-pink-500",
        green: "from-green-400 to-emerald-600",
        blue: "from-blue-400 to-indigo-500",
    };
    return themes[themeName] || themes.orange; // Default theme
};

const DashboardHeader = ({ userData, levelProgress, avatarStyle, headerTheme }) => (
    <div className={`bg-gradient-to-r ${headerTheme} p-8 rounded-xl shadow-sm mb-8 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
                <div className={`w-24 h-24 rounded-full ${avatarStyle.bg} flex items-center justify-center shadow-lg border-4 border-white/20`}>
                    <UserCircle className={`w-20 h-20 ${avatarStyle.color}`} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-bold w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    {userData.level}
                </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-4xl font-bold text-white">Welcome back, {userData.name}! 👋</h2>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm">
                        Environmental Champion
                    </span>
                </div>
                <p className="text-white/90 text-lg mb-4">{userData.title}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex justify-between text-sm text-white/90 mb-2">
                        <span className="font-semibold">Progress to Level {userData.level + 1}</span>
                        <span className="font-bold">{userData.points % 100} / 100 eco-points</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-3">
                        <div className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${Math.min(levelProgress || 0, 100)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Dashboard Component ---
const DashboardPage = ({ onPageChange }) => { // Added onPageChange prop
    const { user, logout, requestRole } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState({
        questsCompleted: 0,
        badgesEarned: 0,
        ecoPoints: 0,
        questsInProgress: 0,
        availableQuests: 0,
        recentActivity: [],
        achievements: [],
        categoryProgress: {},
        currentStreak: 0,
        longestStreak: 0,
        weeklyPoints: 0,
        monthlyQuests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        } else {
            setLoading(false); // If no user, stop loading
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token };

            // Fetch user dashboard data
            const dashboardRes = await fetch('/api/dashboard/user', { headers });
            const dashboardData = await dashboardRes.json();
            
            if(!dashboardRes.ok) {
                throw new Error(dashboardData.msg || "Failed to fetch dashboard data");
            }

            console.log('Dashboard data loaded:', dashboardData);

            // Create recent activity from actual data
            const recentActivity = [
                ...(dashboardData.submissions || []).slice(0, 3).map(s => ({
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                    title: `Completed '${s.quest?.title || 'a quest'}'`,
                    subtitle: `You earned ${s.points_earned || 0} points`,
                    time: new Date(s.submitted_at).toLocaleDateString(),
                    points: `+${s.points_earned || 0} points`
                })),
                ...(dashboardData.posts || []).slice(0, 2).map(p => ({
                    icon: <User className="w-5 h-5 text-blue-500" />,
                    title: `Posted: ${p.title}`,
                    subtitle: 'Shared with the community',
                    time: new Date(p.created_at).toLocaleDateString()
                }))
            ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

            // Update dashboard data with real backend data
            setDashboardData({
                questsCompleted: dashboardData.submissions?.length || 0,
                badgesEarned: dashboardData.badges?.earned || 0,
                ecoPoints: dashboardData.user?.points || 0,
                questsInProgress: dashboardData.questsInProgress || 0,
                availableQuests: dashboardData.availableQuests || 0,
                recentActivity: recentActivity,
                achievements: dashboardData.badges?.progress || [],
                categoryProgress: dashboardData.categoryProgress || {},
                currentStreak: dashboardData.user?.streaks?.current_streak || 0,
                longestStreak: dashboardData.user?.streaks?.longest_streak || 0,
                weeklyPoints: dashboardData.weeklyPoints || 0,
                monthlyQuests: dashboardData.monthlyQuests || 0,
                goals: dashboardData.user?.goals || {
                    energy_conservation: { current: 0, target: 10 },
                    water_saved: { current: 0, target: 500 },
                    trees_planted: { current: 0, target: 5 }
                }
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };
    
    // --- FIX START ---
    // This is the main cause of the white screen.
    // If the user is not loaded yet, we should show a loading indicator.
    if (loading) {
        return (
            <div className="pt-24 text-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p>Please log in to view your dashboard.</p>
            </div>
        );
    }

    // This block was causing the crash. We create a safe `userData` object with defaults.
    const userData = {
        name: user.username || 'Eco Hero',
        title: 'Environmental Champion', // This can be dynamic later
        level: Math.floor((user.points || 0) / 100) + 1,
        points: user.points || 0,
        pointsToNextLevel: 100, // This should come from your backend if it's dynamic
        avatar: user.avatar || 'Girl Avatar 1', // Provide a default
        headerTheme: user.headerTheme || 'orange', // Provide a default
    };
    
    const avatarStyle = getAvatarStyles(userData.avatar);
    const headerTheme = getHeaderTheme(userData.headerTheme);
    const levelProgress = ((userData.points % 100) / 100) * 100;
    // --- FIX END ---
    
    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-6 pt-24 pb-12">
                {user.requested_role && !user.is_approved && (
                    <PendingApprovalCard user={user} />
                )}
                
                {user.role === 'user' && !user.requested_role && (
                    <RoleRequestCard user={user} onRequestRole={requestRole} />
                )}
                
                <DashboardHeader userData={userData} levelProgress={levelProgress} avatarStyle={avatarStyle} headerTheme={headerTheme} />
                
                {/* Navigation Tabs */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 inline-flex items-center gap-3 mb-8">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quests" label="Quests" icon={<BookOpen className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="achievements" label="Achievements" icon={<Trophy className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notifications" label="Notifications" icon={<Users className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <OverviewTabContent dashboardData={dashboardData} onPageChange={onPageChange} userData={userData} />
                        <ProgressTabContent dashboardData={dashboardData} userData={userData} levelProgress={levelProgress} />
                    </div>
                )}
                {activeTab === 'quests' && <QuestsTab onPageChange={onPageChange} />}
                {activeTab === 'achievements' && <AchievementsTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
            </main>
        </div>
    );
};

export default DashboardPage;
