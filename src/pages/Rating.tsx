
import React from 'react';
import Layout from '@/components/layout/Layout';
import DailyRating from '@/components/tracking/DailyRating';
import { useBaby } from '@/context/BabyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const Rating = () => {
  const { currentBaby, getTodaysRating } = useBaby();
  const todayRating = getTodaysRating();
  
  return (
    <Layout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Daily Rating</h1>
        <p className="text-muted-foreground">
          How was your baby's day today?
        </p>
      </div>
      
      {!currentBaby ? (
        <div className="my-12 text-center glass-morphism p-8 rounded-lg animate-scale-in">
          <h2 className="text-xl font-medium mb-4">Select a Baby</h2>
          <p className="text-muted-foreground">
            Choose a baby from your profiles to rate their day
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-in">
          <Card className="border border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-baby-peach/10">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-baby-peach" />
                Daily Mood Rating
              </CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <DailyRating />
              
              {todayRating && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Current Rating: {todayRating}/10</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Why Rate Your Baby's Day?</h3>
            <p className="text-sm text-muted-foreground">
              Tracking daily ratings helps you recognize patterns in your baby's mood and behavior.
              You can correlate ratings with sleep, feeding, and other activities to better understand what affects your baby's well-being.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Rating;
