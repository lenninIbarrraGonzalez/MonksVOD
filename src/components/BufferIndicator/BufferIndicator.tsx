interface BufferIndicatorProps {
  isVisible: boolean;
}

export function BufferIndicator({ isVisible }: BufferIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-monks-purple/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-monks-purple-light border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-medium text-shadow animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
