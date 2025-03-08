import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ReportForm, { TestCase } from "./report-form";
import numberToWords from "number-to-words";
import { parseEmail } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom";
interface FileData {
  totalApks: number;
  pending: number;
  completed: number;
  apks: [{ id: string; name: string; link: string; version: number }];
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const { user } = useAuth();
  const [showReport, setShowReport] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

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
      const response = await fetch(`http://localhost:3000/user/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apkId, userId: user?.id }),
        credentials: "include",
      });
      const data = await response.json();
      const dummy = await data.testCases.map((testCase: any) => ({
        userId: testCase.userId,
        apkId: testCase.apkId,
        verdict: testCase.verdict,
        response: testCase.response,
        inputs: testCase.inputs.map((input: any) => ({
          field: input.field,
          text: input.text,
        })),
      }));
      setTestCases(dummy);
      toast.success("Report fetched successfully!");
      setShowReport(true);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report.");
    }
  };

  const handleSeeGraph = (version: number) => {
    window.open(
      `http://localhost:3000/graph/${parseEmail(
        user?.email || ""
      )}/apk/${numberToWords.toWords(version)}/output/index.html`,
      "_blank"
    );
  };
  const handleSeeLog = (version: number) => {
    window.open(
      `http://localhost:3000/log/${parseEmail(
        user?.email || ""
      )}/apk/${numberToWords.toWords(version)}/output/logcat.txt`,
      "_blank"
    );
  };
  



  return (
    <div className="h-full w-screen p-5 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Files</h2>
          <p className="text-2xl font-bold text-blue-600">
            {fileData?.totalApks || 0}
          </p>
        </div>
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Pending Tests</h2>
          <p className="text-2xl font-bold text-yellow-500">
            {fileData?.pending || 0}
          </p>
        </div>
        <div className="p-5 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Completed Tests
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {fileData?.completed || 0}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : !fileData ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          {showReport ? (
            <ReportForm
              testCases={testCases}
              onClose={() => {
                setShowReport(false);
              }}
            />
          ) : (
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
                      <div className="flex justify-center flex-col gap-2 items-center">
                        <div className="flex gap-4 items-center">
                          <p>{apk.name.substring(1)}</p>
                          <Progress value={60} aria-label="Progress" className="w-[200px] h-3"/>
                        </div>
                        <div className="flex gap-4">
                          <Button onClick={() => handleSeeReport(apk.id)}>
                            See Report
                          </Button>
                          <Button onClick={() => handleSeeGraph(apk.version)}>
                            See Graph
                          </Button>
                          <Button onClick={() => handleSeeLog(apk.version)}>
                            See Log
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
