
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useBaby, Baby } from '@/context/BabyContext';
import BabyCard from '@/components/baby/BabyCard';
import AddBabyForm from '@/components/baby/AddBabyForm';
import ThemeSelector from '@/components/settings/ThemeSelector';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Settings = () => {
  const { babies } = useBaby();
  const [editingBaby, setEditingBaby] = useState<Baby | null>(null);
  
  return (
    <Layout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your baby profiles and app preferences
        </p>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Baby Profiles</CardTitle>
                <CardDescription>
                  Add, edit, or remove babies from your tracker
                </CardDescription>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
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
          </CardHeader>
          <CardContent>
            {babies.length === 0 ? (
              <div className="text-center py-8 bg-secondary rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Babies Added</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first baby
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-slide-in">
                {babies.map((baby) => (
                  <BabyCard 
                    key={baby.id} 
                    baby={baby} 
                    onEditClick={() => setEditingBaby(baby)}
                  />
                ))}
              </div>
            )}
            
            <Dialog open={!!editingBaby} onOpenChange={(open) => !open && setEditingBaby(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Baby</DialogTitle>
                  <DialogDescription>
                    Update your baby's details below.
                  </DialogDescription>
                </DialogHeader>
                {editingBaby && (
                  <AddBabyForm 
                    baby={editingBaby} 
                    isEditing 
                    onSuccess={() => setEditingBaby(null)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how BabyTrack looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your tracking data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your data is stored locally on your device. To clear all data, click the button below.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Clear All Data
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About BabyTrack</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              BabyTrack is a simple and intuitive tool for parents to track their babies' daily activities.
              Version 1.0.0
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
