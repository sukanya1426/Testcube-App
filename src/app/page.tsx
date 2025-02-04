"use client";
import React, { useState } from "react";

export default function Home() {
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "apk" | "txt"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (type === "apk" && file.name.endsWith(".apk")) {
        setApkFile(file);
      } else if (type === "txt" && file.name.endsWith(".txt")) {
        setTxtFile(file);
      } else {
        alert(`Please select a valid ${type.toUpperCase()} file.`);
      }
    }
  };
  

  const handleSubmit = async () => {
    if (!apkFile || !txtFile) {
      setUploadStatus({
        message: "Please upload both APK and TXT files.",
        success: false,
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("apkFile", apkFile);
      formData.append("txtFile", txtFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus({
          message: data.message,
          success: true,
        });
        console.log("Uploaded files:", data.uploadedFiles);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "File upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        message: error instanceof Error ? error.message : "Upload failed.",
        success: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <header className="text-3xl font-bold mb-10 text-gray-800">
        Provide APK and TXT Files
      </header>

      <main className="flex flex-col gap-8 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg hover:border-gray-600 cursor-pointer bg-white shadow-md">
            <span className="text-lg text-gray-600">
              {apkFile ? apkFile.name : "Upload APK File"}
            </span>
            <input
              type="file"
              accept=".apk"
              className="hidden"
              onChange={(e) => handleFileChange(e, "apk")}
            />
          </label>

          <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg hover:border-gray-600 cursor-pointer bg-white shadow-md">
            <span className="text-lg text-gray-600">
              {txtFile ? txtFile.name : "Upload TXT File"}
            </span>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => handleFileChange(e, "txt")}
            />
          </label>
        </div>

        <button
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isUploading || !apkFile || !txtFile}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </button>

        {uploadStatus && (
          <div
            className={`mt-4 p-4 rounded-md ${
              uploadStatus.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {uploadStatus.message}
          </div>
        )}
      </main>
    </div>
  );
}
