
import React from 'react';

interface RatingButtonsProps {
  currentRating?: number;
  onRatingSelect: (value: number) => void;
  disabled: boolean;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({ 
  currentRating, 
  onRatingSelect, 
  disabled 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {[...Array(10)].map((_, index) => (
        <button
          key={index}
          className={`w-8 h-8 rounded-full transition-all duration-200 ${
            index + 1 === currentRating
              ? "bg-primary text-white scale-110"
              : "bg-secondary hover:bg-secondary/80"
          }`}
          onClick={() => onRatingSelect(index + 1)}
          disabled={disabled}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default RatingButtons;
