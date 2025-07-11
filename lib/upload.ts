// Generic presigned URL upload utility for all modules

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  purpose: string;
  customPath: string;
}

export interface PresignedUrlResponse {
  statusCode: number;
  message: string;
  data: {
    url: string; // presigned URL
    fileUrl: string; // final file URL after upload
    [key: string]: any;
  };
}

// 1. Get presigned URL from backend
export async function getPresignedUrl(
  payload: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
  const res = await fetch(
    `${process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:5000'}/api/upload/presigned-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'app-type': 'mobile',
        'Accept-Language': 'en',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error('Failed to get presigned URL');
  return res.json();
}

// 2. Upload file to presigned URL
export async function uploadFileToPresignedUrl(
  presignedUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  if (!res.ok) throw new Error('Failed to upload file to storage');
}
