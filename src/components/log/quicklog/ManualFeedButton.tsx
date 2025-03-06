
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { 
  DialogTrigger,
} from "@/components/ui/dialog";

interface ManualFeedButtonProps {
  disabled: boolean;
}

const ManualFeedButton: React.FC<ManualFeedButtonProps> = ({ disabled }) => {
  return (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="h-9 text-xs sm:text-sm w-full"
        disabled={disabled}
      >
        <CalendarPlus size={14} className="mr-1" />
        Manual Feed
      </Button>
    </DialogTrigger>
  );
};

export default ManualFeedButton;
