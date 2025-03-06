
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useBaby } from '@/context/BabyContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddBabyForm from '@/components/baby/AddBabyForm';
import BabyCard from '@/components/baby/BabyCard';

const Index = () => {
  const { babies, currentBaby } = useBaby();
  
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  
  return (
    <Layout>
      {babies.length === 0 ? (
        <div className="my-12 max-w-md mx-auto text-center glass-morphism p-8 rounded-lg animate-scale-in">
          <h2 className="text-2xl font-semibold mb-4">Welcome to BabyTrack</h2>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first baby
          </p>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>Add Your Baby</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Baby</DialogTitle>
                <DialogDescription>
                  Enter your baby's details below.
                </DialogDescription>
              </DialogHeader>
              <AddBabyForm onSuccess={() => setAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your baby's daily activities
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Baby Profiles</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <PlusCircle size={16} />
                    <span>Add Baby</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Baby</DialogTitle>
                    <DialogDescription>
                      Enter your baby's details below.
                    </DialogDescription>
                  </DialogHeader>
                  <AddBabyForm />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 gap-4 animate-slide-in">
              {babies.map((baby) => (
                <BabyCard key={baby.id} baby={baby} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
