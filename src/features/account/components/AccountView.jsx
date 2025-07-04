import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { UpdateAccount } from './UpdateAccount';
import { User } from 'lucide-react';

export const AccountView = () => {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-3">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </div>
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-xl font-semibold">
            Profile Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Keep your personal information up to date
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <UpdateAccount />
        </CardContent>
      </Card>
    </div>
  );
};
