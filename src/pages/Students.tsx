
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserPlus, Calendar } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);

  useEffect(() => {
    // Load students from localStorage
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      const studentList = JSON.parse(storedStudents);
      setStudents(studentList);
      setFilteredStudents(studentList);
    }
  }, []);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const getAttendanceStats = (studentId: string) => {
    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const studentRecords = records.filter((record: any) => record.studentId === studentId);
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentRecords = studentRecords.filter((record: any) => 
      new Date(record.timestamp) >= last7Days
    );
    
    return {
      total: studentRecords.length,
      recent: recentRecords.length,
      percentage: Math.round((recentRecords.length / 7) * 100)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students Database</h1>
          <p className="text-gray-600">Manage and view student information</p>
        </div>

        {/* Search and Actions */}
        <Card className="mb-6 bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Today
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {students.filter(student => {
                  const stats = getAttendanceStats(student.studentId);
                  return stats.recent > 0;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Programs
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(students.map(s => s.program)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Student Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const stats = getAttendanceStats(student.studentId);
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {student.studentId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.program} • {student.year}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.faculty}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant={stats.percentage >= 70 ? "default" : "destructive"}
                          className={stats.percentage >= 70 ? "bg-green-100 text-green-800" : ""}
                        >
                          {stats.percentage}% (7 days)
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {stats.recent}/7 days present
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No students found</p>
                  <p>Start scanning student cards to build the database</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
