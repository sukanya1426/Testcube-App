import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export function FileUplaoad() {
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; success: boolean } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "apk" | "txt") => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileName = file.name.toLowerCase();

      if (type === "apk" && fileName.endsWith(".apk")) {
        setApkFile(file);
      } else if (type === "txt" && fileName.endsWith(".txt")) {
        setTxtFile(file);
      } else {
        alert(`Please select a valid ${type.toUpperCase()} file.`);
        toast.error(`Please select a valid ${type.toUpperCase()} file.`);
      }
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!apkFile || !txtFile) {
      toast.error("Please upload both APK and TXT files.");
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("apkFile", apkFile);
      formData.append("txtFile", txtFile);

      const response = await axios.post("http://localhost:3000/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "email": user?.email || "base",
        },
      });
      if (response.status !== 200) throw new Error(await response.data.message || "File upload failed.");

      setUploadStatus({ message: response.data.message, success: true });
      setApkFile(null);
      setTxtFile(null);
      toast.success(response.data.message);
    } catch (error) {
      setUploadStatus({ message: error instanceof Error ? error.message : "Upload failed.", success: false });
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <header className="text-3xl font-bold mb-10 text-gray-800">Provide APK and TXT Files</header>
      <main className="flex flex-col gap-8 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* APK File Input */}
          <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg bg-white cursor-pointer hover:border-gray-600">
            <span className="text-gray-700">{apkFile ? apkFile.name : "Upload APK File"}</span>
            <input type="file" accept=".apk" className="hidden" onChange={(e) => handleFileChange(e, "apk")} />
          </label>

          {/* TXT File Input */}
          <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg bg-white cursor-pointer hover:border-gray-600">
            <span className="text-gray-700">{txtFile ? txtFile.name : "Upload TXT File"}</span>
            <input type="file" accept=".txt" className="hidden" onChange={(e) => handleFileChange(e, "txt")} />
          </label>
        </div>

        {/* Submit Button */}
        <button
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isUploading || !apkFile || !txtFile}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </button>

        {/* Upload Status */}
        {uploadStatus && (
          <div className={`mt-4 p-4 rounded-md ${uploadStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {uploadStatus.message}
          </div>
        )}
      </main>
    </div>
  );
}
