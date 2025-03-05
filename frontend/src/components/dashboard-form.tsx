import { useAuth } from "@/context/auth-context";
import { parseFileName } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface FileData {
  totalApks: number;
  pending: number;
  completed: number;
  apks: [{id: string, name: string}];
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchFiles = async () => {
        try {
          const response = await fetch("http://localhost:3000/user/files", {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          setFileData(data.data);
        } catch (error) {
          console.error("Error fetching files:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFiles();
    }
  }, [user]);

  const handleSeeReport = async (apkId: String) => {
    try {
      console.log(apkId, user?.id);
      const response = await fetch(`http://localhost:3000/user/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apkId, userId: user?.id }),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Files</h2>
          <p className="text-2xl font-bold text-blue-600">{fileData?.totalApks || 0}</p>
        </div>
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Pending Tests</h2>
          <p className="text-2xl font-bold text-yellow-500">{fileData?.pending || 0}</p>
        </div>
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Completed Tests
          </h2>
          <p className="text-2xl font-bold text-green-500">{fileData?.completed || 0}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !fileData ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">APK Files</th>
              </tr>
            </thead>
            <tbody>
              {fileData.apks.map((apk , index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">
                    <div className="flex justify-center gap-20 items-center">
                      <p>{parseFileName(apk.name)}</p>
                      <Button onClick={() => handleSeeReport(apk.id)}>See Report</Button>
                    </div>
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
