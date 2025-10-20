import React, { useState } from 'react';
import {
    ChevronLeft, TreePine, Award, Clock, Users, MapPin, CheckCircle, Upload, XCircle, Heart,
    ClipboardList, Camera, AlertTriangle, UploadCloud, FileText, Sprout, Eye
} from 'lucide-react';

// --- HELPER COMPONENTS ---

// Reusable Stat Component
const StatItem = ({ icon, value, label, iconColor }) => (
    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
        <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
        <div>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

// Quest Submission Form Component
const QuestSubmissionForm = ({ questId, onSubmissionSuccess, existingSubmission, questData }) => {
    const [file, setFile] = useState(null);
    const [reflection, setReflection] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if quest is full
    const currentParticipants = questData?.completions?.length || 0;
    const maxParticipants = questData?.maxParticipants || 100;
    const isQuestFull = currentParticipants >= maxParticipants;

    // --- CHANGE: Minimum word count constant removed ---

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- CHANGE: Minimum word count validation removed ---

        if (!file) {
            alert('Please upload a photo as proof of completion.');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('reflection_text', reflection);
            formData.append('photo', file);

            const response = await fetch(`/api/quests/${questId}/submit`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                if (onSubmissionSuccess) {
                    onSubmissionSuccess();
                }
            } else {
                alert(data.msg || 'Failed to submit quest. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quest:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- CHANGE: Submission is ready if reflection has any content and a file is present ---
    const isSubmissionReady = reflection.trim().length > 0 && file;

    // Check if quest is full
    if (isQuestFull) {
        return (
            <div className="bg-gray-50 border border-gray-300 p-4 sm:p-6 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Quest Completed!</h4>
                <p className="text-gray-700">This quest has reached maximum capacity ({maxParticipants} participants). No more submissions are being accepted.</p>
                <p className="text-sm text-gray-500 mt-2">Check out other available quests!</p>
            </div>
        );
    }

    // Check if submission already exists
    if (existingSubmission) {
        const statusColors = {
            'pending': 'bg-yellow-50 border-yellow-300 text-yellow-800',
            'approved': 'bg-green-50 border-green-300 text-green-800',
            'rejected': 'bg-red-50 border-red-300 text-red-800'
        };
        const statusColor = statusColors[existingSubmission.status] || statusColors['pending'];

        return (
            <div className={`${statusColor} border p-4 sm:p-6 rounded-xl text-center`}>
                <Clock className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-lg sm:text-xl font-bold mb-2">Quest {existingSubmission.status === 'pending' ? 'In Progress' : existingSubmission.status === 'approved' ? 'Completed' : 'Submission Rejected'}</h4>
                <p className="mb-2">
                    {existingSubmission.status === 'pending' && 'Your submission is being reviewed by the Quest Master.'}
                    {existingSubmission.status === 'approved' && 'Congratulations! Your quest has been approved and points awarded.'}
                    {existingSubmission.status === 'rejected' && `Your submission was rejected. Reason: ${existingSubmission.rejection_reason || 'No reason provided'}`}
                </p>
                <p className="text-sm opacity-75">Submitted on {new Date(existingSubmission.submitted_at).toLocaleDateString()}</p>
                {existingSubmission.status === 'rejected' && (
                    <button
                        onClick={() => {
                            setFile(null);
                            setReflection('');
                            setIsSubmitted(false);
                        }}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Submit Again
                    </button>
                )}
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="bg-green-50 border border-green-300 p-4 sm:p-6 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-lg sm:text-xl font-bold text-green-800 mb-2">Quest Submitted!</h4>
                <p className="text-green-700">Your evidence has been sent to the Quest Master for review. You'll receive your points soon!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-green-600" />
                Proof Submission
            </h3>

            {/* 1. Reflection Textarea */}
            <div>
                {/* --- CHANGE: Updated label to remove word count mention --- */}
                <label htmlFor="reflection" className="block text-sm font-semibold mb-2 text-gray-700">
                    Reflection
                </label>
                <textarea
                    id="reflection"
                    name="reflection"
                    rows="4"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Share your thoughts on the impact of this quest..."
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    required
                ></textarea>
                {/* --- CHANGE: Word count display removed --- */}
            </div>

            {/* 2. File Upload */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Upload Photo Proof (Geo-tagged evidence)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-green-400 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="quest-photo-upload"
                        required
                    />
                    <label 
                        htmlFor="quest-photo-upload" 
                        className="cursor-pointer block"
                    >
                        {file ? (
                            <div className="space-y-3 sm:space-y-4">
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt="Quest proof preview" 
                                    className="max-h-32 sm:max-h-48 mx-auto rounded-lg"
                                />
                                <p className="text-xs sm:text-sm text-green-600">Click to change photo</p>
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-base sm:text-lg font-semibold text-gray-700">Choose File</p>
                                    <p className="text-xs sm:text-sm text-gray-500">Max 5MB. Must clearly show the completed action.</p>
                                </div>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className={`w-full flex justify-center items-center gap-2 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-colors ${isSubmissionReady && !isSubmitting
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                disabled={!isSubmissionReady || isSubmitting}
            >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Quest for Review'}
            </button>
        </form>
    );
};


// --- MAIN PAGE COMPONENT ---

const QuestDetailsPage = ({ quest, onBack, onSubmissionSuccess, userRole }) => {
    // Fallback and Destructuring with Mock Data from QuestsPage
    const {
        title, description, difficulty, points, duration, participants,
        color, icon, category: propCategory, location: propLocation
    } = quest;

    // Check if user is admin or partner (view-only mode)
    const isViewOnly = userRole === 'admin' || userRole === 'partner';

    const category = propCategory || "General Quest";
    const location = propLocation || "HAU Campus";

    // --- CHANGE: Process objectives to remove the word count from the text ---
    // This will dynamically remove "(50-word)" from any objective text that contains it.
    const originalObjectives = quest.objectives || ["Complete the primary task as outlined in the quest description.", "Document your progress with photo evidence.", "Submit a reflection on the experience."];
    const objectives = originalObjectives.map(obj => obj.replace(/a short \(50-word\) /i, 'a '));

    const submissionRequirements = quest.submissionRequirements || ["One high-resolution photo.", "A log or text summary of your results.", "Adherence to HAU Eco-Quest guidelines."];

    // Determine quest status based on user's submission and quest capacity
    const getQuestStatus = () => {
        // Check if quest is full (reached max participants)
        const currentParticipants = quest.completions?.length || participants || 0;
        const maxParticipants = quest.maxParticipants || 100;

        if (currentParticipants >= maxParticipants) return 'Completed';

        // Check user's submission status
        if (quest.submissionStatus === 'approved') return 'Completed';
        if (quest.submissionStatus === 'pending') return 'Under Review';
        if (quest.submissionStatus === 'rejected') return 'Rejected';
        return 'In Progress';
    };

    const status = getQuestStatus();

    // Determine status styling
    let statusStyle = 'bg-gray-100 text-gray-700';
    if (status === 'In Progress') {
        statusStyle = 'bg-blue-100 text-blue-700';
    } else if (status === 'Completed') {
        statusStyle = 'bg-green-100 text-green-700';
    } else if (status === 'Under Review') {
        statusStyle = 'bg-yellow-100 text-yellow-700';
    } else if (status === 'Rejected') {
        statusStyle = 'bg-red-100 text-red-700';
    }

    // Determine difficulty styling
    const difficultyStyles = {
        Easy: 'bg-green-100 text-green-600',
        Medium: 'bg-yellow-100 text-yellow-600',
        Hard: 'bg-red-100 text-red-600',
    };
    const diffStyle = difficultyStyles[difficulty] || difficultyStyles.Medium;

    return (
        <div className="font-sans bg-gray-50 text-gray-900 min-h-screen">
            <main className="pt-16 sm:pt-20 pb-8 sm:pb-12">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-green-600 font-semibold mb-6 sm:mb-8 hover:text-green-700 transition-colors text-sm sm:text-base"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            Back to All Quests
                        </button>

                        {/* Quest Header and Stats */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-xl bg-green-100">
                                    {/* Using a generic icon if the prop doesn't pass a valid element */}
                                    {icon || <TreePine className="w-8 h-8 text-green-700" />}
                                </div>
                                <div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${diffStyle} mr-2`}>
                                        {difficulty}
                                    </span>
                                    <span className="text-sm text-gray-500">{category}</span>
                                </div>
                            </div>
                        </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h1>
                            <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 sm:mb-6">
                            <StatItem
                                icon={<Award className="w-5 h-5 text-yellow-500" />}
                                value={`${points}`}
                                label="Reward Points"
                                iconColor="bg-yellow-100"
                            />
                            <StatItem
                                icon={<Clock className="w-5 h-5 text-blue-500" />}
                                value={duration}
                                label="Estimated Time"
                                iconColor="bg-blue-100"
                            />
                            <StatItem
                                icon={<Users className="w-5 h-5 text-purple-500" />}
                                value={participants}
                                label="Participants"
                                iconColor="bg-purple-100"
                            />
                            <StatItem
                                icon={<MapPin className="w-5 h-5 text-red-500" />}
                                value={location.split(' ')[0]}
                                label="Location"
                                iconColor="bg-red-100"
                            />
                        </div>

                            {/* Status Bar: Now shows In Progress automatically */}
                            <div className={`p-3 sm:p-4 rounded-xl text-sm sm:text-base font-bold flex items-center justify-between ${statusStyle}`}>
                                <span>Current Status:</span>
                                <span className="flex items-center gap-2">
                                    {status === 'In Progress' ? <Sprout className="w-4 h-4 sm:w-5 sm:h-5" /> : <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    {status}
                                </span>
                            </div>

                        {/* ACCEPT QUEST BUTTON REMOVED AS REQUESTED */}

                    </div>

                        {/* --- Single Column Content (Objectives, Requirements, Submission) --- */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* 1. Quest Objectives */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-green-600" />
                                    Quest Objectives
                                </h3>
                                <ul className="space-y-3">
                                    {objectives.map((obj, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-700">
                                            <CheckCircle className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                                            <span className="leading-relaxed">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 2. Submission Requirements */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-blue-600" />
                                    Submission Requirements
                                </h3>
                                <ul className="space-y-3">
                                    {submissionRequirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-700">
                                            <AlertTriangle className="w-5 h-5 mt-1 text-red-500 flex-shrink-0" />
                                            <span className="leading-relaxed">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 3. Quest Submission Form or View-Only Message */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                                {isViewOnly ? (
                                    <div className="bg-blue-50 border-2 border-blue-200 p-6 sm:p-8 rounded-2xl text-center">
                                        <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
                                        <h4 className="text-xl sm:text-2xl font-black text-blue-800 mb-3">View Only Mode</h4>
                                        <p className="text-base sm:text-lg text-blue-700 mb-4 sm:mb-6">
                                            As {userRole === 'admin' ? 'an administrator' : 'a partner'}, you can view this quest but cannot participate.
                                            Your role is to monitor progress and {userRole === 'admin' ? 'approve submissions' : 'create quests'}.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                                                <p className="text-2xl sm:text-3xl font-black text-blue-600 mb-2">{participants || 0}</p>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-600">Total Participants</p>
                                            </div>
                                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                                                <p className="text-2xl sm:text-3xl font-black text-green-600 mb-2">{points}</p>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-600">Points Reward</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <QuestSubmissionForm
                                        questId={quest._id}
                                        onSubmissionSuccess={onSubmissionSuccess}
                                        existingSubmission={quest.existingSubmission}
                                        questData={quest}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default QuestDetailsPage;