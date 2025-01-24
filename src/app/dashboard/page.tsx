'use client';

import { useEffect, useState } from 'react';

interface FileData {
  apkFileName: string;
  testCaseFileName: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/user-files');
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {files.map(({ apkFileName, testCaseFileName }, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">APK: {apkFileName}</h3>
              <p className="text-sm">Test Case: {testCaseFileName}</p>
              <div className="mt-2 space-x-4">
                <a
                  href={`/api/download?file=${apkFileName}`}
                  download
                  className="text-blue-500 hover:underline"
                >
                  Download APK
                </a>
                <a
                  href={`/api/download?file=${testCaseFileName}`}
                  download
                  className="text-blue-500 hover:underline"
                >
                  Download Test Case
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

