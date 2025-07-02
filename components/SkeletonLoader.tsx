import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'avatar' | 'message' | 'input';
  className?: string;
}

export default function SkeletonLoader({ type = 'text', className = '' }: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-700 rounded';
  
  switch (type) {
    case 'avatar':
      return (
        <div className={`w-40 h-52 ${baseClasses} ${className}`}>
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>
        </div>
      );
    
    case 'message':
      return (
        <div className={`w-3/4 h-16 ${baseClasses} ${className}`}>
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl"></div>
        </div>
      );
    
    case 'input':
      return (
        <div className={`w-full h-12 ${baseClasses} ${className}`}>
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg"></div>
        </div>
      );
    
    case 'text':
    default:
      return (
        <div className={`w-full h-4 ${baseClasses} ${className}`}>
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded"></div>
        </div>
      );
  }
}

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="w-3/4 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl"></div>
      <div className="w-1/2 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl self-end"></div>
      <div className="w-2/3 h-14 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl"></div>
    </div>
  );
}

export function AvatarSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-40 h-52 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg animate-pulse mb-4"></div>
      <div className="w-32 h-4 bg-gradient-to-r from-gray-600 to-gray-800 rounded animate-pulse mb-2"></div>
      <div className="w-48 h-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded animate-pulse"></div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex-1 flex flex-col gap-3">
        <MessageSkeleton />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg animate-pulse"></div>
        <div className="w-20 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
} 