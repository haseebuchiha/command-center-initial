import { NextRequest, NextResponse } from 'next/server';
import { HandleUploadBody, handleUpload } from '@vercel/blob/client';

export async function BlobsStoreController(
  request: NextRequest
): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const allowedContentTypes = (searchParams.get('allowedContentTypes') || '')
    .split(',')
    .filter(Boolean);

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: allowedContentTypes.length
            ? allowedContentTypes
            : undefined,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
