import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Leaf, Droplet, ScissorsLineDashed } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'harvest':
      return <ScissorsLineDashed className="h-4 w-4 text-emerald-600" />;
    case 'treatment':
      return <Leaf className="h-4 w-4 text-amber-600" />;
    case 'nutrient':
      return <Droplet className="h-4 w-4 text-blue-600" />;
    default:
      return null;
  }
};

const getActivityBgColor = (type) => {
  switch (type) {
    case 'harvest':
      return 'bg-emerald-500';
    case 'treatment':
      return 'bg-amber-500';
    case 'nutrient':
      return 'bg-blue-500';
    default:
      return 'bg-slate-500';
  }
};

export const LatestActivity = ({ activities }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Latest Activity
          </CardTitle>
          <CardDescription>
            Recent updates and management records for this coconut tree
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="">
          {activities.length > 0 ? (
            activities.map((activity, index) => {
              let description = 'No description available';
              if (activity.type === 'harvest') {
                description = `Harvested ${activity.coconut_count} coconuts (${
                  activity.total_weight
                } kg). Estimated value: ${activity.estimated_value || 'N/A'}.`;
              } else if (activity.type === 'treatment') {
                description = `Applied ${
                  activity.product || 'N/A'
                } treatment. Amount: ${activity.amount || 'N/A'} ${
                  activity.unit || ''
                }.`;
              } else if (activity.type === 'nutrient') {
                description = `Applied ${activity.amount || 'N/A'}
                of ${activity.product || 'N/A'}. Method: ${
                  activity.application_method || 'N/A'
                }.`;
              }
              return (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-slate-200"
                >
                  <div
                    className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${getActivityBgColor(
                      activity.type,
                    )}`}
                  ></div>
                  <div className="flex flex-col gap-1 pb-6">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      <span className="font-semibold text-slate-800">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(activity.date))} ago
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No recent activity found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
