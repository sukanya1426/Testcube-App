"use client";

import { useEffect, useState } from "react";

interface FileData {
  apkFileName: string;
  testCaseFileName: string;
  status: "Pending" | "Completed";
}

export function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/user-files");
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Files</h2>
          <p className="text-2xl font-bold text-blue-600">{files.length}</p>
        </div>
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Pending Tests</h2>
          <p className="text-2xl font-bold text-yellow-500">3</p>
        </div>
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Completed Tests
          </h2>
          <p className="text-2xl font-bold text-green-500">5</p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">APK File</th>
                <th className="p-2 border">Test Case File</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {files.map(({ apkFileName, testCaseFileName, status }, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">{apkFileName}</td>
                  <td className="p-2 border">{testCaseFileName}</td>
                  <td className="p-2 border">
                    {status === "Completed" ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
