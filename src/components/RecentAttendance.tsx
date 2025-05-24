
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export const RecentAttendance = () => {
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

  useEffect(() => {
    // Load recent attendance records
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      const records = JSON.parse(storedRecords);
      const sortedRecords = records
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
      setRecentRecords(sortedRecords);
    }
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Recent Check-ins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {recentRecords.length > 0 ? (
            recentRecords.map((record, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {record.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {record.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {record.studentId} • {record.program}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatTime(record.timestamp)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No attendance records yet</p>
              <p className="text-sm">Start scanning student cards to see recent check-ins</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
