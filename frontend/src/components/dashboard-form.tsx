import { useAuth } from "@/context/auth-context";
import { parseFileName } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

interface FileData {
  totalApks: number;
  pending: number;
  completed: number;
  apks: [{ id: string; name: string }];
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
          toast.success("Files fetched successfully!");
        } catch (error) {
          console.error("Error fetching files:", error);
          toast.error("Failed to fetch files.");
        } finally {
          setLoading(false);
        }
      };

      fetchFiles();
    }
  }, [user]);

  const handleSeeReport = async (apkId: string) => {
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
      toast.success("Report fetched successfully!");
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report.");
    }
  };

  return (
    <div className="h-screen w-screen p-5 bg-white rounded-lg shadow-md">
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
        <p className="text-center">Loading...</p>
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
              {fileData.apks.map((apk, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">
                    <div className="flex justify-center gap-20 items-center">
                      <p>{parseFileName(apk.name)}</p>
                      <Button onClick={() => handleSeeReport(apk.id)}>
                        <Link to="/report" className="underline underline-offset-4">
                        See Report
                        </Link>
                        See Report</Button>
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
