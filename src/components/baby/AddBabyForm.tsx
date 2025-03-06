
import React, { useState } from 'react';
import { useBaby, Baby } from '@/context/BabyContext';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface AddBabyFormProps {
  onSuccess?: () => void;
  baby?: Baby;
  isEditing?: boolean;
}

const colorOptions: { value: Baby['color']; label: string }[] = [
  { value: 'blue', label: 'Blue' },
  { value: 'pink', label: 'Pink' },
  { value: 'mint', label: 'Mint' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'peach', label: 'Peach' },
];

const AddBabyForm: React.FC<AddBabyFormProps> = ({ 
  onSuccess, 
  baby, 
  isEditing = false 
}) => {
  const { addBaby, editBaby } = useBaby();
  
  const [name, setName] = useState(baby?.name || '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    baby?.birthDate || undefined
  );
  const [color, setColor] = useState<Baby['color']>(baby?.color || 'blue');
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!birthDate) {
      setDateError('Birth date is required');
      isValid = false;
    } else {
      setDateError('');
    }
    
    if (!isValid) return;
    
    if (isEditing && baby) {
      editBaby(baby.id, { name, birthDate, color });
      toast.success(`Updated ${name}'s details`);
    } else {
      addBaby({ name, birthDate: birthDate!, color });
      toast.success(`Added ${name}`);
    }
    
    // Reset form
    if (!isEditing) {
      setName('');
      setBirthDate(undefined);
      setColor('blue');
    }
    
    onSuccess?.();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Baby's Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter baby's name"
          className={cn(nameError && "border-destructive")}
        />
        {nameError && <p className="text-sm text-destructive">{nameError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthDate">
          Birth Date <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground",
                dateError && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? format(birthDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {dateError && <p className="text-sm text-destructive">{dateError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>Color Theme</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-200",
                color === option.value && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: `var(--baby-${option.value})` }}
              onClick={() => setColor(option.value)}
              title={option.label}
            />
          ))}
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        {onSuccess && (
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            className="mr-2"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {isEditing ? 'Update' : 'Add'} Baby
        </Button>
      </div>
    </form>
  );
};

export default AddBabyForm;
