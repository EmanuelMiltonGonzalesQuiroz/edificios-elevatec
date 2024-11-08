import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import PostFeed from './PostFeed';

const Home = () => {
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
      <main className="flex-grow flex flex-col items-center p-4 mx-auto">
        <PostFeed filters={filters} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
