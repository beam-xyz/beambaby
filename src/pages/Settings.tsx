
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ThemeSelector from '@/components/settings/ThemeSelector';
import AddBabyForm from '@/components/baby/AddBabyForm';
import { useBaby } from '@/context/BabyContext';
import BabyCard from '@/components/baby/BabyCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [addBabyDialogOpen, setAddBabyDialogOpen] = React.useState(false);
  const [editBabyDialogOpen, setEditBabyDialogOpen] = React.useState(false);
  const { babies, currentBaby } = useBaby();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle size={36} className="text-muted-foreground" />
                <div>
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || 'email@example.com'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Section */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Customize the appearance of the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Babies Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Babies</CardTitle>
                <CardDescription>
                  Manage babies in your account
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setAddBabyDialogOpen(true)}>
                Add Baby
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {babies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No babies added yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setAddBabyDialogOpen(true)}
                >
                  Add Your First Baby
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {babies.map(baby => (
                  <BabyCard 
                    key={baby.id} 
                    baby={baby} 
                    isActive={currentBaby?.id === baby.id} 
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Baby Dialog */}
      <Dialog open={addBabyDialogOpen} onOpenChange={setAddBabyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Baby</DialogTitle>
          </DialogHeader>
          <AddBabyForm onSuccess={() => setAddBabyDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Baby Dialog */}
      <Dialog open={editBabyDialogOpen} onOpenChange={setEditBabyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Baby</DialogTitle>
          </DialogHeader>
          {currentBaby && (
            <AddBabyForm 
              baby={currentBaby} 
              isEditing={true} 
              onSuccess={() => setEditBabyDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Settings;
