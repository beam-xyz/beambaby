
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ManualFeedButtonProps {
  disabled: boolean;
  className?: string;
}

const ManualFeedButton: React.FC<ManualFeedButtonProps> = ({ disabled, className }) => {
  return (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className={cn("text-xs", className)}
        disabled={disabled}
      >
        <Plus size={14} className="mr-1" />
        Manual Feed
      </Button>
    </DialogTrigger>
  );
};

export default ManualFeedButton;
