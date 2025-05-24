import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QrScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateQrScan = () => {
    // Simulate scanning a UNZA student card QR code
    const mockStudentData = {
      studentId: "UNZA2024" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      name: "John Doe",
      program: "Computer Science",
      year: "3rd Year",
      faculty: "School of Engineering"
    };
    
    const qrData = JSON.stringify(mockStudentData);
    setScanResult(qrData);
    setStudentInfo(mockStudentData);
    
    // Record attendance
    recordAttendance(mockStudentData, qrData);
    
    toast({
      title: "Student Card Scanned!",
      description: `Welcome ${mockStudentData.name}`,
    });
  };

  const recordAttendance = (student: any, qrData: string) => {
    const attendanceRecord = {
      ...student,
      timestamp: new Date().toISOString(),
      status: 'present'
    };

    // Store in localStorage (in real app, this would be sent to backend)
    const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
    
    // Check if student already checked in today
    const today = new Date().toDateString();
    const alreadyCheckedIn = existingRecords.some((record: any) => 
      record.studentId === student.studentId && 
      new Date(record.timestamp).toDateString() === today
    );

    if (!alreadyCheckedIn) {
      existingRecords.push(attendanceRecord);
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
      
      // Add student to database if not exists
      const studentExists = existingStudents.some((s: any) => s.studentId === student.studentId);
      if (!studentExists) {
        existingStudents.push(student);
        localStorage.setItem('students', JSON.stringify(existingStudents));
      }
      
      onScan(qrData);
    } else {
      toast({
        title: "Already Checked In",
        description: `${student.name} has already been marked present today.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Scan Student Card</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!studentInfo ? (
            <>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-lg"></div>
                </div>
              </div>
              
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 mb-4">
                  Position the QR code within the frame
                </p>
                <Button
                  onClick={simulateQrScan}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Simulate QR Scan (Demo)
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Attendance Recorded!
                </h3>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Student ID:</span>
                  <span>{studentInfo.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{studentInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Program:</span>
                  <span>{studentInfo.program}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Year:</span>
                  <span>{studentInfo.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Faculty:</span>
                  <span>{studentInfo.faculty}</span>
                </div>
              </div>
              
              <Button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
