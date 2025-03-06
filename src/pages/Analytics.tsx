
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useBaby } from '@/context/BabyContext';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';
import BabyCard from '@/components/baby/BabyCard';
import { format } from 'date-fns';

const Analytics = () => {
  const { babies, currentBaby, naps, feeds, getTodaysNapTotal, getTodaysFeedTotal, getTodaysRating } = useBaby();
  
  const todayNapTotal = getTodaysNapTotal();
  const todayFeedTotal = getTodaysFeedTotal();
  const todayRating = getTodaysRating();
  
  const statsCards = [
    {
      title: "Today's Nap",
      value: todayNapTotal > 0 ? `${(todayNapTotal / 60).toFixed(1)} hours` : 'No data',
      color: "bg-baby-lavender"
    },
    {
      title: "Today's Feed",
      value: todayFeedTotal > 0 ? `${todayFeedTotal} oz` : 'No data',
      color: "bg-baby-mint"
    },
    {
      title: "Today's Rating",
      value: todayRating ? `${todayRating}/10` : 'Not rated',
      color: "bg-baby-peach"
    }
  ];
  
  return (
    <Layout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View trends and statistics for your baby
        </p>
      </div>
      
      {babies.length === 0 ? (
        <div className="my-12 text-center glass-morphism p-8 rounded-lg animate-scale-in">
          <h2 className="text-xl font-medium mb-4">No Data Available</h2>
          <p className="text-muted-foreground">
            Add a baby from the dashboard to start seeing analytics
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {!currentBaby ? (
            <div className="text-center py-8 glass-morphism rounded-lg animate-slide-in">
              <h2 className="text-xl font-medium mb-2">Select a Baby</h2>
              <p className="text-muted-foreground">
                Choose a baby from your profiles to view analytics
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-in">
              <h2 className="text-2xl font-semibold">
                Today's Stats <span className="text-sm text-muted-foreground font-normal">({format(new Date(), 'MMMM d, yyyy')})</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsCards.map((card, index) => (
                  <div 
                    key={index}
                    className={`${card.color} p-6 rounded-xl transition-all duration-300 hover:shadow-md`}
                  >
                    <h3 className="text-lg font-medium mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <AnalyticsCard />
              </div>
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold">Baby Profiles</h2>
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

export default Analytics;
