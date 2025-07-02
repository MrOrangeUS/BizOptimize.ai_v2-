"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PageTransition = ({ children }) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    const handleStart = () => {
      setIsTransitioning(true);
    };

    const handleComplete = () => {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Match animation duration
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children);
    }
  }, [children, isTransitioning]);

  return (
    <div className="relative">
      {/* Scan line overlay during transition */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-alien-black">
          <div className="scan-wipe h-full w-full bg-gradient-to-r from-alien-green via-alien-cyan to-alien-purple opacity-20" />
          
          {/* Loading text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="alien-title text-2xl mb-4">INITIALIZING</h2>
              <div className="flex space-x-2 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-alien-green rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content with scan-wipe animation */}
      <div className={`${isTransitioning ? 'scan-wipe' : ''}`}>
        {displayChildren}
      </div>
    </div>
  );
};

// Higher-order component for page transitions
export const withPageTransition = (Component) => {
  return function WrappedComponent(props) {
    return (
      <PageTransition>
        <Component {...props} />
      </PageTransition>
    );
  };
};

// Custom hook for manual page transitions
export const usePageTransition = () => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithTransition = (href) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      router.push(href);
    }, 400); // Half of transition duration
  };

  return { isTransitioning, navigateWithTransition };
};

// Manual transition trigger component
export const TransitionTrigger = ({ href, children, className = '' }) => {
  const { navigateWithTransition } = usePageTransition();

  const handleClick = (e) => {
    e.preventDefault();
    navigateWithTransition(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default PageTransition; 