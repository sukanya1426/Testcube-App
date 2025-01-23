// app/api/user-files/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data: Replace with your database logic
  const files = [
    { apkFileName: 'example1.apk', testCaseFileName: 'test1.txt' },
    { apkFileName: 'example2.apk', testCaseFileName: 'test2.txt' },
  ];

  return NextResponse.json(files);
}
