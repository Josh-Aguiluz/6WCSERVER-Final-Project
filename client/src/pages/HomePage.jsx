import React from 'react';

// Helper component for Stat Cards for cleaner code (No change needed)
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center gap-4 shadow-md border border-white">
    {icon}
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

// Helper component for Quest/Event Cards (No change needed)
const InfoCard = ({ icon, category, title, description, tags, buttonText, buttonColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-green-100 p-3 rounded-full">{icon}</div>
      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{category}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {tags && tags.map(tag => (
          <span key={tag} className="text-xs text-gray-500">{tag}</span>
        ))}
      </div>
      <button className={`${buttonColor} text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105`}>
        {buttonText}
      </button>
    </div>
  </div>
);


const HomePage = () => {
  // SVG Icons for reusability (No change needed here)
  const icons = {
    tree: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    recycle: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m-1 12V12a2 2 0 00-2-2H9a2 2 0 00-2 2v8m4-12V8m0 4h.01M17 20V12a2 2 0 00-2-2H9" /></svg>,
    leaf: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    waste: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    solar: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    planet: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.318a9 9 0 108.592 8.592M17.296 15.682A9 9 0 008.408 6.704" /></svg>,
    workshop: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    bulb: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  };

  return (
    {/* The background is handled by the body class in index.css */}
    <div className="font-sans"> 
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">HAU Eco-Quest</h1>
          <nav className="hidden md:flex items-center gap-8 text-green-700 font-medium">
            <a href="#" className="hover:text-green-900">Quests</a>
            <a href="#" className="hover:text-green-900">Events</a>
            <a href="#" className="hover:text-green-900">Leaderboard</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#" className="text-green-700 font-medium hover:text-green-900">Login</a>
            {/* REPLACED bg-[--color-secondary-green] with bg-secondary-green */}
            <button className="bg-secondary-green text-white px-5 py-2 rounded-full font-bold hover:bg-green-700 transition-colors">Join Adventure</button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-green-300 to-green-500 text-center py-40 px-4 text-white">
          <div className="absolute inset-0 bg-green-400/30"></div>
          <div className="relative z-5">
            {/* REPLACED text-[--color-dark-green] with text-dark-green */}
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4">Join the Journey Towards a <span className="text-dark-green bg-white/90 px-4 rounded-md">Greener World</span></h2>
            <p className="max-w-3xl mx-auto mb-8 text-lg text-green-100">
              Embark on an exciting journey to make a positive impact on our planet. Join thousands of eco-heroes at HAU in the ultimate sustainability adventure!
            </p>
            <div className="flex justify-center gap-4">
              {/* REPLACED text-[--color-secondary-green] with text-secondary-green */}
              <button className="bg-white text-secondary-green font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">Start Your Adventure</button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors">Explore Quests</button>
            </div>
          </div>
        </section>

        {/* Stats Section (No change needed) */}
        <section className="relative -mt-16 z-10 px-4">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={icons.tree} value="2,547" label="Trees Planted" />
            <StatCard icon={icons.recycle} value="15.2 tons" label="Waste Recycled" />
            <StatCard icon={icons.leaf} value="1,248" label="Quests Completed" />
            <StatCard icon={icons.users} value="3,891" label="Active Members" />
          </div>
        </section>

        {/* Featured Eco Quests Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Eco Quests</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Join these amazing environmental adventures and make a real difference while having fun!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              <InfoCard
                icon={icons.tree}
                category="NATURE"
                title="Tree Planting"
                description="Plant trees around campus and help create a greener environment for future generations."
                tags={['German', '2D 1H Remaining']}
                buttonText="Join Quest"
                {/* REPLACED bg-[--color-primary-green] with bg-primary-green */}
                buttonColor="bg-primary-green hover:bg-green-600"
              />
              <InfoCard
                icon={icons.waste}
                category="RECYCLE"
                title="Waste Management"
                description="Learn proper waste sorting and help us set up a new recycling system on campus."
                tags={['English', '5D 4H Remaining']}
                buttonText="Join Quest"
                {/* REPLACED bg-[--color-primary-green] with bg-primary-green */}
                buttonColor="bg-primary-green hover:bg-green-600"
              />
              <InfoCard
                icon={icons.solar}
                category="ENERGY"
                title="Solar Panel Setup"
                description="Help install solar panels and learn about renewable energy solutions."
                tags={['English', '1W 2D Remaining']}
                buttonText="Join Quest"
                {/* REPLACED bg-[--color-primary-green] with bg-primary-green */}
                buttonColor="bg-primary-green hover:bg-green-600"
              />
            </div>
            {/* REPLACED text-[--color-secondary-green] with text-secondary-green */}
            <button className="mt-12 text-secondary-green font-bold hover:underline">View All Quests</button>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="bg-green-50/50 py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Join our community events and connect with fellow eco-heroes!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <InfoCard
                icon={icons.planet}
                category="COMMUNITY"
                title="Earth Day Festival"
                description="April 22, 2026 | HAU Grounds"
                tags={['148 registered']}
                buttonText="Learn More"
                {/* REPLACED bg-[--color-accent-orange] with bg-accent-orange */}
                buttonColor="bg-accent-orange hover:bg-orange-600"
              />
              <InfoCard
                icon={icons.workshop}
                category="WORKSHOP"
                title="Sustainability Workshop"
                description="May 15, 2026 | N-Building"
                tags={['92 registered']}
                buttonText="Learn More"
                {/* REPLACED bg-[--color-accent-orange] with bg-accent-orange */}
                buttonColor="bg-accent-orange hover:bg-orange-600"
              />
            </div>
            {/* REPLACED text-[--color-secondary-green] with text-secondary-green */}
            <button className="mt-12 text-secondary-green font-bold hover:underline">View All Events</button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center flex flex-col items-center">
              {icons.bulb}
              <h2 className="text-3xl font-bold text-gray-800 my-4">Ready to Become an Eco-Hero?</h2>
              <p className="text-gray-600 mb-8">Join thousands of others in making a difference. Start your journey today and earn rewards while saving the planet!</p>
              <div className="flex gap-4">
                {/* REPLACED bg-[--color-primary-green] with bg-primary-green */}
                <button className="bg-primary-green text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-colors">Join the Movement</button>
                <button className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Learn More</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* REPLACED bg-[--color-footer-green] with bg-footer-green */}
      <footer className="bg-footer-green text-green-100 pt-16 pb-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-2">HAU Eco-Quest</h3>
            <p className="text-sm text-green-200">A community-driven platform to promote sustainability and environmental awareness on our planet.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Beginner Quests</a></li>
              <li><a href="#" className="hover:text-white">Recycling Challenges</a></li>
              <li><a href="#" className="hover:text-white">Energy Savers</a></li>
              <li><a href="#" className="hover:text-white">Nature Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Eco-Quest</a></li>
              <li><a href="#" className="hover:text-white">Our Mission</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Quest T&Cs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Connect with Us</h4>
            <div className="bg-green-600/50 p-4 rounded-lg">
                <p className="text-sm">eco-quest@hau.edu.ph</p>
                <p className="text-sm">(012) 345-6789</p>
                <div className="flex gap-4 mt-4">
                  {/* Placeholder for social icons */}
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center border-t border-green-600 mt-8 pt-6 text-sm text-green-300">
          <p>© 2024 HAU Eco-Quest. All rights reserved. Built with ❤️ by an eco-hero in future.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;