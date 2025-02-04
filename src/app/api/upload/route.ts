import formidable, { File, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const parseForm = (req: IncomingMessage): Promise<{ files: Files }> => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024,
    filename: (_name, _ext, part) => `${Date.now()}_${part.originalFilename}`,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) reject(err);
      resolve({ files });
    });
  });
};

async function webStreamToNodeStream(webStream: ReadableStream): Promise<Readable> {
  const reader = webStream.getReader();
  const nodeStream = new Readable({
    read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          this.push(null);
        } else {
          this.push(value);
        }
      });
    },
  });
  return nodeStream;
}

export async function POST(req: Request) {
  try {
    const nodeStream = await webStreamToNodeStream(req.body as ReadableStream);

    const incomingReq = Object.assign(nodeStream, {
      headers: Object.fromEntries(req.headers),
      method: req.method,
      url: req.url,
    }) as IncomingMessage;

    const { files } = await parseForm(incomingReq);

    const uploadedFiles = Object.values(files)
      .flatMap((file) => (Array.isArray(file) ? file : [file]))
      .map((f) => ({
        name: f.originalFilename || 'unknown',
        path: f.filepath,
        type: f.mimetype,
      }));

    return new Response(
      JSON.stringify({
        message: 'Files uploaded successfully',
        uploadedFiles,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'File upload failed' }),
      { status: 500 }
    );
  }
}
