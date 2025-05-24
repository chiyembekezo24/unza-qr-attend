
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Users, Calendar, TrendingUp } from 'lucide-react';
import { QrScanner } from '@/components/QrScanner';
import { AttendanceStats } from '@/components/AttendanceStats';
import { RecentAttendance } from '@/components/RecentAttendance';

const Dashboard = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    // Load initial data
    const storedAttendance = localStorage.getItem('attendanceRecords');
    const storedStudents = localStorage.getItem('students');
    
    if (storedAttendance) {
      const records = JSON.parse(storedAttendance);
      const today = new Date().toDateString();
      const todayRecords = records.filter((record: any) => 
        new Date(record.timestamp).toDateString() === today
      );
      setAttendanceCount(todayRecords.length);
    }
    
    if (storedStudents) {
      const students = JSON.parse(storedStudents);
      setTotalStudents(students.length);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            University of Zambia
          </h1>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Student Attendance Tracker
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <QrCode className="w-5 h-5" />
              Scan Student Card
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today's Attendance
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{attendanceCount}</div>
              <p className="text-xs text-gray-500">Students checked in today</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
              <p className="text-xs text-gray-500">Registered students</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Attendance Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalStudents > 0 ? Math.round((attendanceCount / totalStudents) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-500">Today's rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceStats />
          <RecentAttendance />
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <QrScanner
            onClose={() => setShowScanner(false)}
            onScan={(data) => {
              setAttendanceCount(prev => prev + 1);
              setShowScanner(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
