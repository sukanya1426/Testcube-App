import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), '/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disable default body parsing by Next.js
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for file handling
  },
};

const parseForm = async (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024, // 100 MB size limit
    filename: (_name, _ext, part) => `${Date.now()}_${part.originalFilename}`,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseForm(req);
    console.log('Files:', files);

    const uploadedFiles = Object.values(files)
      .flatMap((file) => (Array.isArray(file) ? file : [file])) // Flatten if there are multiple files
      .map((f) => ({
        name: f.originalFilename,
        path: f.filepath,
      }));

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ message: 'No files uploaded.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Files uploaded successfully', uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'File upload failed' }, { status: 500 });
  }
}
