//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Search, Droplets, TreePine, Recycle, Sun, Leaf, Building, Clock, Users, Award, Lightbulb, BookOpen, Smile, Camera, Handshake, Sparkles, Filter } from 'lucide-react';
import QuestDetailsPage from './QuestDetailsPage';
import { questAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';


// --- QUEST CARD COMPONENT ---
const QuestCard = ({ icon, title, description, difficulty, points, duration, participants, progress, color, onViewDetails, questData, user, imageUrl }) => {
  const difficultyStyles = {
    Easy: 'bg-green-100 text-green-800 border border-green-300',
    Medium: 'bg-amber-100 text-amber-800 border border-amber-300',
    Hard: 'bg-red-100 text-red-800 border border-red-300',
  };
 
  const colorVariants = {
    green: { gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-600', hover: 'hover:bg-green-700' },
    yellow: { gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-600', hover: 'hover:bg-yellow-700' },
    blue: { gradient: 'from-blue-400 to-cyan-500', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    cyan: { gradient: 'from-cyan-400 to-teal-500', bg: 'bg-cyan-600', hover: 'hover:bg-cyan-700' },
    lime: { gradient: 'from-lime-400 to-green-500', bg: 'bg-lime-600', hover: 'hover:bg-lime-700' },
    indigo: { gradient: 'from-indigo-400 to-purple-500', bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  };
  const activeColor = colorVariants[color] || colorVariants.green;


  const currentParticipants = questData?.completions?.length || participants || 0;
  const maxParticipants = questData?.maxParticipants || 100;
  const isQuestFull = currentParticipants >= maxParticipants;


  const getButtonText = () => {
    if (!user) return 'Login to Start';
    if (user.role === 'admin' || user.role === 'partner') return 'View Quest';
    if (isQuestFull) return 'Quest Full';
    if (questData.existingSubmission) {
      if (questData.existingSubmission.status === 'pending') return 'In Progress';
      if (questData.existingSubmission.status === 'approved') return 'Completed';
      if (questData.existingSubmission.status === 'rejected') return 'Try Again';
    }
    return 'Start Quest';
  };


  const getButtonColor = () => {
    if (isQuestFull && user && user.role === 'user') {
      return 'bg-gray-500 text-white cursor-not-allowed hover:bg-gray-500';
    }
   
    // Get category-based colors
    const categoryColorMap = {
      green: {
        solid: 'bg-green-500 text-white hover:bg-green-600',
        outline: 'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700'
      },
      yellow: {
        solid: 'bg-yellow-500 text-white hover:bg-yellow-600',
        outline: 'bg-transparent border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800'
      },
      blue: {
        solid: 'bg-blue-500 text-white hover:bg-blue-600',
        outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
      },
      cyan: {
        solid: 'bg-cyan-500 text-white hover:bg-cyan-600',
        outline: 'bg-transparent border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700'
      },
      lime: {
        solid: 'bg-lime-500 text-white hover:bg-lime-600',
        outline: 'bg-transparent border-2 border-lime-600 text-lime-600 hover:bg-lime-50 hover:text-lime-700'
      },
      indigo: {
        solid: 'bg-indigo-500 text-white hover:bg-indigo-600',
        outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
      },
    };
   
    const currentColor = categoryColorMap[color] || categoryColorMap.green;
   
    if (user && (user.role === 'admin' || user.role === 'partner')) {
      return currentColor.outline;
    }
    if (questData.existingSubmission) {
      if (questData.existingSubmission.status === 'pending') return 'bg-amber-500 text-white hover:bg-amber-600';
      if (questData.existingSubmission.status === 'approved') return currentColor.outline;
      if (questData.existingSubmission.status === 'rejected') return 'bg-red-600 text-white hover:bg-red-700';
    }
   
    return currentColor.solid;
  };


  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all group border border-gray-200">
      {/* Image Section with Background Image */}
      <div className="h-48 relative overflow-hidden">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeColor.gradient}`}>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </div>
        )}
       
        {/* Category Icon and Difficulty Badge - Positioned at bottom left and top right */}
        <div className="absolute bottom-3 left-3">
          <div className={`w-12 h-12 rounded-xl bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white border-opacity-50`}>
            <div className={`text-${color}-600`}>
              {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
          </div>
        </div>
       
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${difficultyStyles[difficulty]} bg-white bg-opacity-90 backdrop-blur-sm`}>
            {difficulty}
          </span>
        </div>
      </div>


      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
       
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500"/>
            <span className="font-semibold">{points} pts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-500"/>
            <span className="font-semibold">{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-500"/>
            <span className="font-semibold">{participants}/{maxParticipants}</span>
          </div>
        </div>


        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span className="font-medium">{participants} / {maxParticipants} joined</span>
            <span className="text-green-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className={`bg-gradient-to-r ${activeColor.gradient} h-2 rounded-full transition-all duration-300`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>


        <button
        onClick={() => onViewDetails(questData)}
        disabled={isQuestFull && user && user.role === 'user'}
        className={`w-full ${getButtonColor()} font-bold py-3 px-4 rounded-lg transition-all shadow-md ${
          isQuestFull && user && user.role === 'user'
            ? 'cursor-not-allowed opacity-60'
            : 'hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
        >
        {getButtonText()}
      </button>
      </div>
    </div>
  );
};


const GuidelineCard = ({ icon, title, description, iconColor }) => (
  <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
    <div className={`mx-auto w-14 h-14 flex items-center justify-center rounded-xl mb-4`} style={{ backgroundColor: `${iconColor}20` }}>
      <div style={{ color: iconColor }}>
        {icon}
      </div>
    </div>
    <h4 className="font-bold text-gray-900 mb-2 text-base">{title}</h4>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);


// --- MAIN PAGE COMPONENT ---
const QuestsPage = ({ onPageChange }) => {
    const { user } = useUser();
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [todayQuest, setTodayQuest] = useState(null);


    useEffect(() => {
        fetchQuests();
    }, [user]);


    const fetchQuests = async () => {
        try {
            const questsData = await questAPI.getAllQuests();
           
            let userSubmissions = [];
            if (user) {
                try {
                    userSubmissions = await questAPI.getMySubmissions();
                } catch (error) {
                    console.error('Error fetching user submissions:', error);
                }
            }
           
            const transformedQuests = questsData.map(quest => {
                const userSubmission = userSubmissions.find(sub => sub.quest_id?._id === quest._id);
               
                return {
                    ...quest,
                    id: quest._id,
                    icon: getCategoryIcon(quest.category),
                    color: getCategoryColor(quest.category),
                    participants: quest.completions?.length || 0,
                    progress: ((quest.completions?.length || 0) / (quest.maxParticipants || 50)) * 100,
                    submissionStatus: userSubmission?.status || null,
                    existingSubmission: userSubmission || null,
                    imageUrl: quest.imageUrl || null
                };
            });
           
            setQuests(transformedQuests);
           
            try {
                const dailyQuestRes = await fetch('/api/daily/quest');
                const dailyQuestData = await dailyQuestRes.json();
                if (dailyQuestData.quest) {
                    const transformedDailyQuest = {
                        ...dailyQuestData.quest,
                        id: dailyQuestData.quest._id,
                        icon: getCategoryIcon(dailyQuestData.quest.category),
                        color: getCategoryColor(dailyQuestData.quest.category),
                        participants: dailyQuestData.quest.completions?.length || 0,
                        progress: ((dailyQuestData.quest.completions?.length || 0) / (dailyQuestData.quest.maxParticipants || 50)) * 100,
                        isDailyQuest: true,
                        imageUrl: dailyQuestData.quest.imageUrl || null
                    };
                    setTodayQuest(transformedDailyQuest);
                }
            } catch (error) {
                console.error('Error fetching daily quest:', error);
                const activeQuests = transformedQuests.filter(q => q.isActive);
                if (activeQuests.length > 0) {
                    setTodayQuest(activeQuests[0]);
                }
            }
           
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quests:', error);
            setLoading(false);
        }
    };


    const getCategoryIcon = (category) => {
        const icons = {
            'Gardening & Planting': <TreePine className="w-6 h-6"/>,
            'Recycling & Waste': <Recycle className="w-6 h-6"/>,
            'Energy Conservation': <Sun className="w-6 h-6"/>,
            'Water Conservation': <Droplets className="w-6 h-6"/>,
            'Education & Awareness': <BookOpen className="w-6 h-6"/>,
            'Transportation': <Building className="w-6 h-6"/>
        };
        return icons[category] || <Leaf className="w-6 h-6"/>;
    };


    const getCategoryColor = (category) => {
        const colors = {
            'Gardening & Planting': 'green',
            'Recycling & Waste': 'blue',
            'Energy Conservation': 'yellow',
            'Water Conservation': 'cyan',
            'Education & Awareness': 'indigo',
            'Transportation': 'lime'
        };
        return colors[category] || 'green';
    };


    const handleViewDetails = (questData) => {
        if (!user) {
            onPageChange('login');
            return;
        }
        setSelectedQuest(questData);
    };


    const handleBack = () => {
        setSelectedQuest(null);
    };


    const handleQuestSubmission = () => {
        fetchQuests();
        console.log('Quest submitted successfully!');
    };


    const filteredQuests = quests.filter(quest => {
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || quest.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'All' || quest.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });


    if (loading) {
        return (
            <div className="font-sans bg-gray-50 text-gray-800 min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading quests...</p>
                </div>
            </div>
        );
    }


    if (selectedQuest) {
        return <QuestDetailsPage quest={selectedQuest} onBack={handleBack} onSubmissionSuccess={handleQuestSubmission} userRole={user?.role} />;
    }


  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <main className="pt-20 pb-12">
        {/* Page Header - Compact */}
        <section className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">Quests</h1>
                  <p className="text-gray-600 text-sm">Complete quests, earn rewards, and make an impact</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Filters Bar */}
        <section className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search quests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>


              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {['All', 'Gardening', 'Recycling', 'Energy', 'Water'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'All' ? 'All' : cat === 'Gardening' ? 'Gardening & Planting' : cat === 'Recycling' ? 'Recycling & Waste' : cat === 'Energy' ? 'Energy Conservation' : 'Water Conservation')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                      (selectedCategory === 'All' && cat === 'All') ||
                      (selectedCategory === 'Gardening & Planting' && cat === 'Gardening') ||
                      (selectedCategory === 'Recycling & Waste' && cat === 'Recycling') ||
                      (selectedCategory === 'Energy Conservation' && cat === 'Energy') ||
                      (selectedCategory === 'Water Conservation' && cat === 'Water')
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>


              {/* Difficulty Dropdown */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All">All Difficulty Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </section>


        {/* Today's Quest Banner */}
        {todayQuest && (
          <section className="container mx-auto px-6 py-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 relative overflow-hidden border-2 border-blue-400 shadow-xl">
              <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black">
                DAILY QUEST
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                    {todayQuest.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{todayQuest.title}</h3>
                    <p className="text-blue-100 text-sm">{todayQuest.description?.substring(0, 120)}...</p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(todayQuest)}
                  className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap"
                >
                  {user ? 'Accept Quest' : 'Login to Start'}
                </button>
              </div>
            </div>
          </section>
        )}


        {/* Available Quests Section */}
        <section className="container mx-auto px-6 py-8 relative">
          {/* Discord-inspired decorative background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-15 blur-3xl"></div>
          </div>
         
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Quests</h2>
              <span className="text-gray-600 text-sm font-semibold">{filteredQuests.length} quests available</span>
            </div>


            {/* Quest Grid */}
            {filteredQuests.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 p-16 rounded-xl text-center shadow-lg">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Quests Found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'Try adjusting your filters'
                    : 'No quests available at the moment'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredQuests.map((quest) => (
                  <QuestCard key={quest.id} {...quest} onViewDetails={handleViewDetails} questData={quest} user={user} imageUrl={quest.imageUrl} />
                ))}
              </div>
            )}
          </div>
        </section>
       
        {/* QUEST GUIDELINES SECTION */}
        <section className="container mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left side - Placeholder Image */}
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full"></div>
                </div>
                <div className="relative text-center text-white z-10">
                  <div className="w-48 h-48 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center border-4 border-white border-opacity-30">
                    <div className="text-center">
                      <Sparkles className="w-20 h-20 mx-auto mb-3" />
                      <span className="text-2xl font-black">Quest</span>
                      <br />
                      <span className="text-lg font-bold">Guidelines</span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-white opacity-90">Make Every Action Count</p>
                </div>
              </div>


              {/* Right side - Guidelines */}
              <div className="p-10 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 mb-3">Quest Guidelines</h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Follow these principles to ensure your environmental impact is genuine and verified
                  </p>
                </div>


                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-7 h-7 text-green-600"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Real Impact</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Ensure your actions contribute directly to the quest's environmental goal</p>
                    </div>
                  </div>


                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Camera className="w-7 h-7 text-blue-600"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Verify Progress</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Document your completion clearly with photos or videos for verification</p>
                    </div>
                  </div>


                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Handshake className="w-7 h-7 text-red-600"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Collaborate Fairly</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Ensure all team members contribute equally to collaborative quests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


        {/* Footer */}
        <footer className="bg-green-700 text-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/vite.svg"
                alt="HAU Eco-Quest Logo"
                className="h-8 w-8 bg-white rounded-full p-1"
              />
              <h3 className="text-2xl font-bold">HAU Eco-Quest</h3>
            </div>
            <p className="text-sm text-green-100">
              Empowering students to become environmental champions through
              engaging sustainability adventures. Join the movement to save our
              planet!
            </p>
          </div>


          {/* Adventure Paths */}
          <div>
            <h4 className="font-bold mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Browse Epic Quests</button></li>
              <li><button onClick={() => onPageChange('community')} className="hover:text-white">Hero Community</button></li>
              <li><button onClick={() => onPageChange('leaderboard')} className="hover:text-white">Hall of Fame</button></li>
            </ul>
          </div>


          {/* Support Guild */}
          <div>
            <h4 className="font-bold mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><button onClick={() => onPageChange('contactquestmasters')} className="hover:text-white">Contact Quest Masters</button></li>
              <li><button onClick={() => onPageChange('alliancepartners')} className="hover:text-white">Alliance Partners</button></li>
            </ul>
          </div>


          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect with Us</h4>
            <div className="bg-green-600 p-4 rounded-lg text-sm">
              <p>eco-quest@hau.edu.ph</p>
              <p>+63 (2) 123-4567</p>
              <p>HAU Main Campus</p>
              <div className="flex gap-4 mt-4">
                <a href="#"><img src={FacebookIcon} alt="Facebook" className="w-6 h-6" /></a>
                <a href="#"><img src={InstagramIcon} alt="Instagram" className="w-6 h-6" /></a>
                <a href="#"><img src={TiktokIcon} alt="Instagram" className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
        </div>


        <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-8 pt-6 text-green-200 text-sm">
          <p>© 2025 HAU Eco-Quest. All rights reserved. Built with for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
};




export default QuestsPage;





