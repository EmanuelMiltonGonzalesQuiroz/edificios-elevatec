import React, { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import PostFeed from './PostFeed'; // Componente para mostrar publicaciones

const Home = () => {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 w-full sm:w-3/4 lg:w-1/2 mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <PostFeed /> {/* Componente que muestra las publicaciones */}
        </Suspense>
      </main>
      <Footer /> {/* Pie de página fijo */}
    </div>
  );
};

export default Home;
