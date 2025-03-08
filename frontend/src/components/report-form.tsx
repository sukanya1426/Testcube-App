import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SidebarClose } from "lucide-react";

export interface TestCase {
  userId: string;
  apkId: string;
  verdict: string;
  response: string;
  inputs: { field: string; text: string }[];
}

interface ReportFormProps {
  testCases: TestCase[];
  onClose: () => void;
}



const ReportForm = ({ testCases, onClose }: ReportFormProps) => {

  if (testCases.length === 0) {
    return <p className="text-center text-gray-500">No test case data available.</p>;
  }

  const { userId, apkId } = testCases[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-4 items-center justify-center">
        <h1 className="text-4xl font-bold text-center ">Test Case Report</h1>
        < SidebarClose className="w-8 h-8 text-red-500 cursor-pointer" onClick={onClose} />
      </div>
      <p className="text-sm font-bold text-center text-gray-700">
        User ID: <span className="text-gray-700">{userId}</span>
      </p>
      <p className="text-sm font-bold mb-6 text-center text-gray-700">
        APK ID: <span className="text-gray-700">{apkId}</span>
      </p>


      {testCases.map((testCase, index) => (
        <Card key={index} className="shadow-lg rounded-xl mb-4">
          <CardHeader>
            <h3 className="text-xl font-bold">Test Case {index+1}</h3>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-lg font-medium">Verdict:
                <Badge className={`ml-2 ${testCase.verdict === "pass" ? "bg-green-500" : "bg-red-500"}`}>
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
