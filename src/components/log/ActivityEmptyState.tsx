
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ActivityEmptyStateProps {
  message: string;
}

const ActivityEmptyState: React.FC<ActivityEmptyStateProps> = ({ message }) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4 text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
      </CardContent>
    </Card>
  );
};

export default ActivityEmptyState;
