import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface TestCase {
  userId: string;
  apkId: string;
  verdict: string;
  response: string;
  inputs: { userId: string; apkId: string; field: string; text: string }[];
}

const ReportForm = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    // Setting the test case data
    const testData = [
      {
        userId: "user123",
        apkId: "apk567",
        verdict: "Passed",
        response: "All inputs processed successfully.",
        inputs: [
          {
            userId: "user123",
            apkId: "apk567",
            field: "username",
            text: "testUser",
          },
          {
            userId: "user123",
            apkId: "apk567",
            field: "password",
            text: "securePass123",
          },
          {
            userId: "user123",
            apkId: "apk567",
            field: "email",
            text: "test@example.com",
          },
        ],
      },
      {
        userId: "user123",
        apkId: "apk567",
        verdict: "Failed",
        response: "Invalid input detected in password field.",
        inputs: [
          {
            userId: "user123",
            apkId: "apk567",
            field: "username",
            text: "newUser",
          },
          {
            userId: "user123",
            apkId: "apk567",
            field: "password",
            text: "123",
          },
          {
            userId: "user123",
            apkId: "apk567",
            field: "email",
            text: "user@domain.com",
          },
        ],
      },
    ];

    setTestCases(testData);
  }, []);

  if (testCases.length === 0) {
    return <p className="text-center text-gray-500">No test case data available.</p>;
  }

  const { userId, apkId } = testCases[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center ">Test Case Report</h1>
      <p className="text-sm font-bold mb-6 text-center text-gray-700">
        User ID: <span className="text-gray-700">{userId}</span> and APK ID: <span className="text-gray-700">{apkId}</span>
      </p>


      {testCases.map((testCase, index) => (
        <Card key={index} className="shadow-lg rounded-xl mb-4">
          <CardHeader>
            <h3 className="text-xl font-bold">Test Case Report</h3>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-lg font-medium">Verdict:
                <Badge className={`ml-2 ${testCase.verdict === "Passed" ? "bg-green-500" : "bg-red-500"}`}>
                  {testCase.verdict}
                </Badge>
              </p>
              <p className="text-lg font-medium">Response: <span className="text-gray-700">{testCase.response}</span></p>
            </div>

            <h4 className="text-xl font-semibold mt-4 mb-2">Inputs Tested</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Input Text</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCase.inputs.map((input, index) => (
                  <TableRow key={index}>
                    <TableCell>{input.field}</TableCell>
                    <TableCell>{input.text}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportForm;
