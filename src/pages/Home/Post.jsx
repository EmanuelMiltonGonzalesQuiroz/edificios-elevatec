import React from 'react';

const Post = ({ title, description, image }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full sm:max-w-lg my-4">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-700 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Post;
