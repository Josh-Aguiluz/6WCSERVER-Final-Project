import React, { useState, useRef, useEffect } from 'react';
import {
  Menu, X, User, LogOut, Shield, Trash2, Trophy,
  ChevronDown, BookOpen, MessageCircle, Crown, Home, Sparkles, Bell
} from 'lucide-react';
import { useUser } from "../context/UserContext";
import { notificationAPI } from "../utils/api";

export function Navigation({ currentPage, onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const { user, logout: userLogout, deleteAccount } = useUser() || {};

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const result = await deleteAccount();
      if (result.success) {
        alert('Account deleted successfully');
        onPageChange('home');
      } else {
        alert('Failed to delete account');
      }
    }
  };

  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const mobileNotificationRef = useRef(null); // <-- FIX: 1. Added new ref for mobile dropdown

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      
      // <-- FIX: 2. Updated click outside logic to check both refs
      // Check if click is outside the desktop dropdown
      const isOutsideDesktop = notificationDropdownRef.current
        ? !notificationDropdownRef.current.contains(event.target)
        : true;

      // Check if click is outside the mobile notification container
      const isOutsideMobile = mobileNotificationRef.current
        ? !mobileNotificationRef.current.contains(event.target)
        : true;

      // Only close if the click is outside BOTH
      if (isOutsideDesktop && isOutsideMobile) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    // Add all refs to the dependency array
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, notificationDropdownRef, mobileNotificationRef]); // <-- FIX: 2. Added new ref to dependency array

  // Fetch unread notifications
  useEffect(() => {
    if (user) {
      fetchUnreadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadNotifications = async () => {
    try {
      console.log('Fetching notifications...');
      const notificationsData = await notificationAPI.getNotifications();
      console.log('Notifications data:', notificationsData);
      const unreadCount = notificationsData.filter(n => !n.is_read).length;
      console.log('Unread count:', unreadCount);
      setUnreadNotifications(unreadCount);
      setNotifications(notificationsData.slice(0, 5)); // Show only 5 most recent for dropdown
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const navItems = user ? [
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ] : [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ];

  // Helper function to get avatar image
  const getAvatarImage = (avatarTheme) => {
    const avatarMap = {
      'Leaf': '/assets/avatars-headers/leaf-avatar.png',
      'Sun': '/assets/avatars-headers/sun-avatar.png',
      'Tree': '/assets/avatars-headers/tree-avatar.png',
      'Water': '/assets/avatars-headers/water-avatar.png',
      'Girl Avatar 1': '/assets/avatars-headers/leaf-avatar.png', // Legacy support
      'Girl Avatar 2': '/assets/avatars-headers/sun-avatar.png', // Legacy support
      'Boy Avatar 1': '/assets/avatars-headers/tree-avatar.png', // Legacy support
      'Boy Avatar 2': '/assets/avatars-headers/water-avatar.png', // Legacy support
    };
    return avatarMap[avatarTheme] || '/assets/avatars-headers/leaf-avatar.png';
  };

  const avatars = [
    { name: "Leaf", gender: "Nature", color: "text-green-500", bg: "bg-green-100" },
    { name: "Sun", gender: "Energy", color: "text-yellow-500", bg: "bg-yellow-100" },
    { name: "Tree", gender: "Growth", color: "text-green-600", bg: "bg-green-50" },
    { name: "Water", gender: "Life", color: "text-blue-500", bg: "bg-blue-100" },
  ];
  const selectedAvatar = avatars.find((a) => a.name === (user?.avatar_theme || "Leaf"));
  const defaultAvatarStyle = { bg: "bg-green-100", color: "text-green-500" };
  const currentAvatarStyle = selectedAvatar || defaultAvatarStyle;

  const getProfileDropdown = () => {
    if (!user) return null;

    const points = user.points || 0;
    const level = Math.floor(points / 100) + 1;
    const roleIcon = user.role === 'admin' ? '👑' : user.role === 'partner' ? '🤝' : '⭐';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-3 bg-white hover:bg-gray-50 rounded-full px-3 py-2 transition-all shadow-md border border-gray-200"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              {getAvatarImage(user?.avatar_theme) ? (
                <img 
                  src={getAvatarImage(user?.avatar_theme)} 
                  alt={user?.username || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full ${currentAvatarStyle.bg} flex items-center justify-center`} style={{display: getAvatarImage(user?.avatar_theme) ? 'none' : 'flex'}}>
                <User className={`w-6 h-6 ${currentAvatarStyle.color}`} />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              {level}
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-900">{user.username || 'User'}</span>
              <span>{roleIcon}</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {points.toLocaleString()} pts
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50">
            <button
              onClick={() => { onPageChange('profile'); setProfileDropdownOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full rounded-lg mx-1"
            >
              <User className="w-4 h-4" /> View Profile
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => { userLogout?.(); onPageChange('home'); setProfileDropdownOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full rounded-lg mx-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => { handleDeleteAccount(); setProfileDropdownOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg mx-1"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => onPageChange('home')} className="flex items-center space-x-3">
            <img
              src="/assets/hau-eco-quest-logo.png"
              alt="HAU Eco-Quest Logo"
              className="w-10 h-10 rounded-xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center" style={{display: 'none'}}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">HAU Eco-Quest</span>
          </button>

          {/* FIX: Desktop Navigation Links. 'hidden' on mobile, 'flex' on medium screens and up. */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            
            {/* Notification Icon */}
            {user && (
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <div className="flex gap-2">
                          {unreadNotifications > 0 && (
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                  await notificationAPI.markAllAsRead();
                                  await fetchUnreadNotifications();
                                } catch (error) {
                                  console.error('Error marking all as read:', error);
                                }
                              }}
                              className="text-xs text-green-600 hover:text-green-700 font-semibold z-50 relative px-2 py-1"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.is_read ? 'bg-blue-50' : ''
                            }`}
                            onClick={async () => {
                              // Mark as read
                              if (!notification.is_read) {
                                try {
                                  await notificationAPI.markAsRead(notification._id);
                                  fetchUnreadNotifications();
                                } catch (error) {
                                  console.error('Error marking as read:', error);
                                }
                              }
                              
                              // Navigate based on notification type
                              if (notification.type === 'post_liked' || notification.type === 'post_commented') {
                                // Navigate to community page for post notifications
                                onPageChange('community');
                                setNotificationDropdownOpen(false);
                              } else if (notification.type === 'submission_approved' || notification.type === 'submission_rejected') {
                                // Navigate to quests page for quest notifications
                                onPageChange('quests');
                                setNotificationDropdownOpen(false);
                              } else if (notification.type === 'role_approved') {
                                // Navigate to profile page for role approval
                                onPageChange('profile');
                                setNotificationDropdownOpen(false);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${!notification.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button
                          onClick={(e) => {
                            // --- START: UPDATED LOGIC ---
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('View all notifications clicked (Desktop)');

                            const dashboardPage = user.role === 'admin' ? 'admin-dashboard' :
                                                  user.role === 'partner' ? 'partner-dashboard' :
                                                  'dashboard';

                            // Navigate first
                            onPageChange(dashboardPage);

                            setTimeout(() => {
                              // Robust looped check to wait for tab to render
                              const tryClick = () => {
                                const tab = document.querySelector('[data-tab="notifications"]') ||
                                            document.querySelector('button[data-tab="notifications"]') ||
                                            document.querySelector('[role="tab"][data-value="notifications"]') ||
                                            document.querySelector('button:has-text("Notifications")'); // Kept your original robust selector
                                if (tab) {
                                  console.log('Notifications tab found, clicking it');
                                  tab.click();
                                } else {
                                  console.log('Waiting for notifications tab to render...');
                                  setTimeout(tryClick, 300);
                                }
                              };
                              tryClick();
                            }, 1000); // Using the slightly longer initial delay from mobile

                            // Close dropdown *after* navigation logic starts
                            setTimeout(() => {
                              setNotificationDropdownOpen(false);
                            }, 300);
                            // --- END: UPDATED LOGIC ---
                          }}
                          className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FIX: Desktop User/Auth section. 'hidden' on mobile, 'flex' on medium screens and up. */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {!user.requested_role && user.role === 'user' && (
                  <button onClick={() => onPageChange('dashboard')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    Dashboard
                  </button>
                )}
                {!user.requested_role && user.role === 'partner' && (
                  <button onClick={() => onPageChange('partner-dashboard')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Shield className="w-4 h-4" /> Partner
                  </button>
                )}
                {!user.requested_role && user.role === 'admin' && (
                  <button onClick={() => onPageChange('admin-dashboard')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Shield className="w-4 h-4" /> Admin
                  </button>
                )}
                {user.requested_role && !user.is_approved && (
                  <div className="flex items-center gap-2 bg-amber-100 text-amber-700 border border-amber-300 px-4 py-2 rounded-full font-bold text-sm">
                    <Shield className="w-4 h-4" /> Pending Approval
                  </div>
                )}
                {getProfileDropdown()}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={() => onPageChange('login')} className="font-bold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                  Login
                </button>
                <button onClick={() => onPageChange('signup')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* FIX: Mobile Burger Menu Button. Hidden on medium screens and up. */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onPageChange(item.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      isActive ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              
              {/* Mobile Notifications Button */}
              {user && (
                <div className="border-t border-gray-200 my-2"></div>
              )}
              {user && (
                // <-- FIX: 3. Added ref to this wrapper div
                <div ref={mobileNotificationRef} className="relative px-4 py-2"> 
                  <button
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg font-bold text-sm text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    {unreadNotifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadNotifications > 99 ? '99+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {/* Mobile Notification Dropdown */}
                  {notificationDropdownOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[90%] max-w-sm bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden flex flex-col">
                      {/* Header with Mark All as Read - NOT scrollable */}
                      <div className="p-3 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                          {unreadNotifications > 0 && (
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Mark all as read clicked (mobile)');
                                try {
                                  await notificationAPI.markAllAsRead();
                                  await fetchUnreadNotifications();

                                  // ✅ small delay to ensure dropdown updates visually before closing
                                  setTimeout(() => {
                                    setNotificationDropdownOpen(false);
                                  }, 300);
                                } catch (error) {
                                  console.error('Error marking all as read:', error);
                                }
                              }}
                              className="text-xs text-green-600 hover:text-green-700 font-semibold px-3 py-2 hover:bg-green-50 rounded transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Scrollable notification list */}
                      <div className="flex-1 overflow-y-auto max-h-48">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notification.is_read ? 'bg-blue-50' : ''
                              }`}
                              onClick={async () => {
                                // Mark as read
                                if (!notification.is_read) {
                                  try {
                                    await notificationAPI.markAsRead(notification._id);
                                    fetchUnreadNotifications();
                                  } catch (error) {
                                    console.error('Error marking as read:', error);
                                  }
                                }
                                
                                // Navigate based on notification type
                                if (notification.type === 'post_liked' || notification.type === 'post_commented') {
                                  onPageChange('community');
                                  setNotificationDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                } else if (notification.type === 'submission_approved' || notification.type === 'submission_rejected') {
                                  onPageChange('quests');
                                  setNotificationDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                } else if (notification.type === 'role_approved') {
                                  onPageChange('profile');
                                  setNotificationDropdownOpen(false);
                                  setMobileMenuOpen(false);
                                }
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 truncate">{notification.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Footer with View All - NOT scrollable */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center flex-shrink-0 bg-white">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('View all notifications clicked (mobile)');

                              const dashboardPage = user.role === 'admin' ? 'admin-dashboard' :
                                                    user.role === 'partner' ? 'partner-dashboard' :
                                                    'dashboard';

                              // Navigate first, but delay closing so logic executes
                              onPageChange(dashboardPage);

                              setTimeout(() => {
                                // Robust looped check so it waits until dashboard renders
                                const tryClick = () => {
                                  const tab = document.querySelector('[data-tab="notifications"]') ||
                                              document.querySelector('button[data-tab="notifications"]') ||
                                              document.querySelector('[role="tab"][data-value="notifications"]');
                                  if (tab) {
                                    console.log('Notifications tab found, clicking it');
                                    tab.click();
                                  } else {
                                    console.log('Waiting for notifications tab to render...');
                                    setTimeout(tryClick, 300);
                                  }
                                };
                                tryClick();
                              }, 700);

                              // ✅ Close dropdown *after* navigation logic starts
                              setTimeout(() => {
                                setNotificationDropdownOpen(false);
                                setMobileMenuOpen(false);
                              }, 300);
                            }}
                            className="text-sm text-green-600 hover:text-green-700 font-semibold w-full py-2 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            View all notifications
                          </button>

                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {!user.requested_role && (user.role === 'user' || user.role === 'partner' || user.role === 'admin') && (
                    <button
                      onClick={() => {
                        const page = user.role === 'admin' ? 'admin-dashboard' :
                          user.role === 'partner' ? 'partner-dashboard' :
                            'dashboard';
                        onPageChange(page);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                    >
                      <Shield className="w-5 h-5" /> Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { onPageChange('profile'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                  >
                    <User className="w-5 h-5" /> Profile
                  </button>
                  <button
                    onClick={() => { userLogout?.(); onPageChange('home'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                  
                  {/* FIX: ADDED DELETE ACCOUNT BUTTON FOR MOBILE */}
                  <button
                    onClick={() => { handleDeleteAccount(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                  >
                    <Trash2 className="w-5 h-5" /> Delete Account
                  </button>
                  {/* END FIX */}

                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => { onPageChange('login'); setMobileMenuOpen(false); }}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-bold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onPageChange('signup'); setMobileMenuOpen(false); }}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}