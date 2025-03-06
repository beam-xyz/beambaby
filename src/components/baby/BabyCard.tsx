
import React from 'react';
import { Baby, useBaby } from '@/context/BabyContext';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BabyCardProps {
  baby: Baby;
  onEditClick?: () => void;
}

const BabyCard: React.FC<BabyCardProps> = ({ baby, onEditClick }) => {
  const { currentBaby, setCurrentBaby, deleteBaby } = useBaby();
  
  const isActive = currentBaby?.id === baby.id;
  
  const handleSelect = () => {
    if (!isActive) {
      setCurrentBaby(baby.id);
      toast.success(`Switched to ${baby.name}`);
    }
  };
  
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    
    let years = today.getFullYear() - birthDateObj.getFullYear();
    let months = today.getMonth() - birthDateObj.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
  };
  
  const handleDelete = () => {
    deleteBaby(baby.id);
    toast.success(`Deleted ${baby.name}`);
  };
  
  return (
    <div 
      className={cn(
        "relative p-3 sm:p-5 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
        isActive 
          ? "glass-morphism scale-[1.02] shadow-lg" 
          : "bg-white border border-border hover:shadow-md",
        `hover:border-baby-${baby.color}`
      )}
      onClick={handleSelect}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-baby-blue" 
           style={{ backgroundColor: `var(--baby-${baby.color})` }} />
      
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={cn(
          "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center",
          `bg-baby-${baby.color}`
        )}>
          {baby.imageUrl ? (
            <img 
              src={baby.imageUrl} 
              alt={baby.name} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {baby.name.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-medium truncate">{baby.name}</h3>
          <div className="flex flex-col sm:flex-row sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <span>{calculateAge(baby.birthDate)}</span>
            <span className="hidden sm:inline">•</span>
            <span className="truncate">{format(baby.birthDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          <button 
            className="p-1.5 sm:p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick?.();
            }}
          >
            <Edit size={16} className="text-muted-foreground" />
          </button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button 
                className="p-1.5 sm:p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 size={16} className="text-muted-foreground" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[calc(100%-2rem)] p-4 sm:p-6">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {baby.name}'s profile and all associated data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {isActive && (
        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-primary text-white animate-pulse">
            Active
          </span>
        </div>
      )}
    </div>
  );
};

export default BabyCard;
