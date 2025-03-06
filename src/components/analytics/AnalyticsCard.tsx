
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaby, Nap, Feed } from '@/context/BabyContext';
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, isSameDay, differenceInMinutes } from 'date-fns';

interface ChartData {
  name: string;
  nap?: number;
  feed?: number;
  rating?: number;
}

const AnalyticsCard: React.FC = () => {
  const { currentBaby, naps, feeds, ratings } = useBaby();
  
  const prepareWeeklyData = (): ChartData[] => {
    if (!currentBaby) return [];
    
    const today = new Date();
    const data: ChartData[] = [];
    
    // Create data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'EEE');
      
      // Calculate nap time
      const dayNaps = naps.filter(
        nap => nap.babyId === currentBaby.id && 
        isSameDay(new Date(nap.date), date) &&
        nap.endTime
      );
      
      const napMinutes = dayNaps.reduce((total, nap) => {
        if (!nap.endTime) return total;
        return total + differenceInMinutes(new Date(nap.endTime), new Date(nap.startTime));
      }, 0);
      
      // Calculate feed amount
      const dayFeeds = feeds.filter(
        feed => feed.babyId === currentBaby.id && 
        isSameDay(new Date(feed.date), date)
      );
      
      const feedAmount = dayFeeds.reduce((total, feed) => total + feed.amount, 0);
      
      // Get day rating
      const dayRating = ratings.find(
        rating => rating.babyId === currentBaby.id && 
        isSameDay(new Date(rating.date), date)
      );
      
      data.push({
        name: dateStr,
        nap: napMinutes / 60, // Convert to hours
        feed: feedAmount,
        rating: dayRating?.rating
      });
    }
    
    return data;
  };
  
  const weeklyData = prepareWeeklyData();
  
  const formatNapTooltip = (value: number) => {
    return `${value.toFixed(1)} hours`;
  };
  
  const formatFeedTooltip = (value: number) => {
    return `${value} oz`;
  };
  
  return (
    <Card className="w-full transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>View trends over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="naps" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="naps">Naps</TabsTrigger>
            <TabsTrigger value="feeds">Feeds</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="naps" className="pt-4">
            <div className="h-[300px] w-full">
              {currentBaby ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={formatNapTooltip} />
                    <Legend />
                    <Bar dataKey="nap" fill="#8884d8" name="Nap Time" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Add a baby to see analytics
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="feeds" className="pt-4">
            <div className="h-[300px] w-full">
              {currentBaby ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Ounces', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={formatFeedTooltip} />
                    <Legend />
                    <Bar dataKey="feed" fill="#82ca9d" name="Feed Amount" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Add a baby to see analytics
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ratings" className="pt-4">
            <div className="h-[300px] w-full">
              {currentBaby ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#ff7300" name="Daily Rating" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Add a baby to see analytics
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
