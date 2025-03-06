
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
        "relative p-5 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
        isActive 
          ? "glass-morphism scale-[1.02] shadow-lg" 
          : "bg-white border border-border hover:shadow-md",
        `hover:border-baby-${baby.color}`
      )}
      onClick={handleSelect}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-baby-blue" 
           style={{ backgroundColor: `var(--baby-${baby.color})` }} />
      
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          `bg-baby-${baby.color}`
        )}>
          {baby.imageUrl ? (
            <img 
              src={baby.imageUrl} 
              alt={baby.name} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-2xl font-bold text-primary">
              {baby.name.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium">{baby.name}</h3>
          <div className="flex flex-col sm:flex-row sm:gap-3 text-sm text-muted-foreground">
            <span>{calculateAge(baby.birthDate)}</span>
            <span className="hidden sm:inline">•</span>
            <span>{format(baby.birthDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="p-2 rounded-full hover:bg-secondary transition-colors"
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
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 size={16} className="text-muted-foreground" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {baby.name}'s profile and all associated data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
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
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 text-xs rounded-full bg-primary text-white animate-pulse">
            Active
          </span>
        </div>
      )}
    </div>
  );
};

export default BabyCard;
