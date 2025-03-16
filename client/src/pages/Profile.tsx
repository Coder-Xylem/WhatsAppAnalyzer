
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { User, Settings } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{user?.username}</h3>
                  <p className="text-gray-500">Member since {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <h4 className="font-medium">Username</h4>
                    <p className="text-gray-600">{user?.username}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <h4 className="font-medium">Account Type</h4>
                    <p className="text-gray-600">Standard</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div>
                    <h4 className="font-medium">Member Status</h4>
                    <p className="text-gray-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
