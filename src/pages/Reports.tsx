
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Users } from 'lucide-react';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [programData, setProgramData] = useState<any[]>([]);

  useEffect(() => {
    generateReportData();
  }, [timeRange]);

  const generateReportData = () => {
    // Generate mock attendance trend data
    const days = [];
    const numDays = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        attendance: Math.floor(Math.random() * 50) + 30
      });
    }
    setAttendanceData(days);

    // Generate program distribution data
    const programs = [
      { name: 'Computer Science', value: 35, color: '#3b82f6' },
      { name: 'Engineering', value: 28, color: '#10b981' },
      { name: 'Medicine', value: 20, color: '#f59e0b' },
      { name: 'Business', value: 17, color: '#ef4444' }
    ];
    setProgramData(programs);
  };

  const exportReport = () => {
    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const csv = 'Student ID,Name,Program,Date,Time\n' + 
      records.map((record: any) => 
        `${record.studentId},${record.name},${record.program},${new Date(record.timestamp).toLocaleDateString()},${new Date(record.timestamp).toLocaleTimeString()}`
      ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Reports</h1>
          <p className="text-gray-600">Analyze attendance patterns and trends</p>
        </div>

        {/* Controls */}
        <Card className="mb-6 bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Daily Attendance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(attendanceData.reduce((sum, day) => sum + day.attendance, 0) / attendanceData.length || 0)}
              </div>
              <p className="text-xs text-gray-500">Students per day</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Peak Attendance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.max(...attendanceData.map(day => day.attendance))}
              </div>
              <p className="text-xs text-gray-500">Highest single day</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Attendance Rate
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">87%</div>
              <p className="text-xs text-gray-500">Overall rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Check-ins
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {attendanceData.reduce((sum, day) => sum + day.attendance, 0)}
              </div>
              <p className="text-xs text-gray-500">In selected period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Program Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={programData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {programData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
