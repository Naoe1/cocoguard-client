import { TableOverview } from '@/components/ui/TableOverview';
import { useCoconut } from '../api/GetCoconut';
import { useCoconutStats } from '../api/GetCoconutStats';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/shared/components/ui/card';

import { ScissorsLineDashed } from 'lucide-react';
import { LatestActivity } from './LatestActivity';

export const CoconutView = ({ coconutId }) => {
  const coconutQuery = useCoconut({ coconutId });
  const statsQuery = useCoconutStats({ coconutId });
  if (coconutQuery.isLoading || statsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        Loading
      </div>
    );
  }

  const coconut = coconutQuery?.data?.data;
  const stats = statsQuery?.data?.data;

  if (coconutQuery.isError && coconutQuery.error.response?.status === 404) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        Coconut not found.
      </div>
    );
  }

  if (coconutQuery.isError || statsQuery.isError) {
    const error = coconutQuery.error || statsQuery.error;
    return (
      <div className="flex h-48 w-full items-center justify-center text-red-600">
        Error loading data: {error.message}
      </div>
    );
  }

  const latestOverallActivities = stats?.latestOverallActivities || [];

  const harvestColumns = [
    {
      label: 'Date',
      key: 'harvest_date',
    },
    { label: 'Count', key: 'coconut_count' },
    { label: 'Weight (kg)', key: 'total_weight' },
    { label: 'Est. Value', key: 'estimated_value' },
  ];

  const treatmentColumns = [
    {
      label: 'Date',
      key: 'date_applied',
      format: (date) => new Date(date).toLocaleDateString(),
    },
    { label: 'Type', key: 'type' },
    { label: 'Product', key: 'product' },
    { label: 'Amount', key: 'amount' },
    {
      label: 'End Date',
      key: 'end_date',
      format: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
    },
  ];

  const nutrientColumns = [
    {
      label: 'Date',
      key: 'date_applied',
      format: (date) => new Date(date).toLocaleDateString(),
    },
    { label: 'Product', key: 'product' },
    { label: 'Amount', key: 'amount' },
    { label: 'Method', key: 'application_method' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <Card className="pt-0">
            <div className="rounded-t-lg h-20 bg-gradient-to-r from-green-500 to-emerald-600 relative">
              <div className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center">
                <ScissorsLineDashed className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <CardHeader className="pt-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    {coconut.tree_code}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Planted:{' '}
                    {new Date(coconut.planting_date).toLocaleDateString()}
                  </CardDescription>
                </div>
                {coconut.status === 'Diseased' ? (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Unhealthy
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    Healthy
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Height
                  </p>
                  <p className="text-base font-semibold">{coconut.height} m</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Trunk Diameter
                  </p>
                  <p className="text-base font-semibold">
                    {coconut.trunk_diameter} cm
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Estimated Yield
                  </p>
                  <p className="text-base font-semibold">
                    {coconut.estimated_yield_kg} kg
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Age
                  </p>
                  <p className="text-base font-semibold">
                    {(() => {
                      const plantingDate = new Date(coconut.planting_date);
                      const today = new Date();
                      const ageInMilliseconds = today - plantingDate;
                      const ageInYears = Math.floor(
                        ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25),
                      );
                      return `${ageInYears} year${ageInYears !== 1 ? 's' : ''}`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 border-t border-slate-100 pt-4">
              <p className="font-medium text-sm text-slate-700">
                Quick Actions:
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <LatestActivity activities={latestOverallActivities} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <TableOverview
              data={stats.latestHarvests || []}
              columns={harvestColumns}
              title={'Recent Harvests'}
              viewMoreLink={`/app/coconuts/harvests?coconutId=${coconutId}`}
              emptyMessage="No recent harvests recorded."
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <TableOverview
              data={stats.latestTreatments || []}
              columns={treatmentColumns}
              title={'Recent Treatments'}
              viewMoreLink={`/app/coconuts/treatments?coconutId=${coconutId}`}
              emptyMessage="No recent treatments recorded."
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <TableOverview
              data={stats.latestNutrients || []}
              columns={nutrientColumns}
              title={'Recent Nutrients Applied'}
              viewMoreLink={`/app/coconuts/nutrients?coconutId=${coconutId}`}
              emptyMessage="No recent nutrient applications recorded."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
