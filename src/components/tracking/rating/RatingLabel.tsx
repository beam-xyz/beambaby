
import React from 'react';

interface RatingLabelProps {
  rating: number;
}

const RatingLabel: React.FC<RatingLabelProps> = ({ rating }) => {
  const getRatingLabel = (value: number) => {
    if (value <= 3) return "Tough day";
    if (value <= 6) return "Average day";
    if (value <= 8) return "Good day";
    return "Great day!";
  };
  
  const getRatingColor = (value: number) => {
    if (value <= 3) return "bg-red-100 text-red-700";
    if (value <= 6) return "bg-orange-100 text-orange-700";
    if (value <= 8) return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="mb-3">
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRatingColor(rating)}`}>
        {getRatingLabel(rating)}
      </span>
    </div>
  );
};

export default RatingLabel;
