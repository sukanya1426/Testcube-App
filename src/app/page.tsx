"use client"
import React, { useState } from "react";

export default function Home() {
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [txtFile, setTxtFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "apk" | "txt") => {
    if (event.target.files) {
      if (type === "apk") setApkFile(event.target.files[0]);
      if (type === "txt") setTxtFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!apkFile || !txtFile) {
      alert("Please upload both APK and TXT files.");
      return;
    }
    console.log("APK File:", apkFile);
    console.log("TXT File:", txtFile);
    alert("Files uploaded successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <header className="text-3xl font-bold mb-10 text-gray-800">Provide APK</header>
      
      <main className="flex flex-col gap-8 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg hover:border-gray-600 cursor-pointer bg-white shadow-md">
            <span className="text-lg text-gray-600">Upload APK File</span>
            <input
              type="file"
              accept=".apk"
              className="hidden"
              onChange={(e) => handleFileChange(e, "apk")}
            />
          </label>

          <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg hover:border-gray-600 cursor-pointer bg-white shadow-md">
            <span className="text-lg text-gray-600">Upload TXT File</span>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => handleFileChange(e, "txt")}
            />
          </label>
        </div>

        <button
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </main>
    </div>
  );
}
