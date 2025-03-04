import React, { useState, useEffect, useRef, useCallback } from "react";

// Function to generate post data
const generatePosts = (count, startId = 1) => {
    return Array.from({ length: count }, (_, i) => ({
        id: startId + i,
        title: `Post Title ${startId + i}`,
        content: `This is a sample post.`,
        image: `/image${(startId + i) % 5 + 1}.jpg` // Load from public folder
    }));
};

const PostGrid = () => {
    const [posts, setPosts] = useState(generatePosts(10));
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef();

    // Load more posts
    const loadMorePosts = () => {
        setIsLoading(true);
        setTimeout(() => {
            setPosts((prev) => [...prev, ...generatePosts(10, prev.length + 1)]);
            setIsLoading(false);
        }, 1000);
    };

    // Detect when the last post is in view
    const lastPostRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMorePosts();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-center">Infinite Scroll Posts</h2>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        ref={index === posts.length - 1 ? lastPostRef : null}
                        className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center"
                    >
                        {/* Force image width to 100px */}
                        <div className="flex justify-center items-center w-full">
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-[100px] h-auto object-contain"
                            />
                        </div>

                        <div className="p-4 text-center">
                            <h3 className="text-lg font-bold">{post.title}</h3>
                            <p className="text-gray-600 mt-2">{post.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isLoading && (
                <div className="text-center mt-4 text-gray-600">
                    Loading more posts...
                </div>
            )}
        </div>
    );
};

export default PostGrid;
