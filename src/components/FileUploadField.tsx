import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { route } from '@/lib/route';
import mime from 'mime';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UploadedBlob } from '@/types/UploadedBlob';
import { toast } from 'sonner';
import { FileUp, CheckCircle } from 'lucide-react';

export default function FileUploadField({
  value,
  onChange,
  onLoading,
  images,
  allowedContentTypes,
}: {
  value: UploadedBlob | null;
  onChange: (value: UploadedBlob | null) => void;
  onLoading?: (loading: boolean) => void;
  images?: boolean;
  allowedContentTypes?: string[];
}) {
  const [loading, setLoading] = useState(false);

  const getAllowedContentTypes = () => {
    let result: string[] = [];

    if (images) {
      result = [...result, 'image/jpeg', 'image/png', 'image/gif'];
    }

    if (allowedContentTypes) {
      result = [...result, ...allowedContentTypes];
    }

    return result;
  };

  const actualAllowedContentTypes = getAllowedContentTypes();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: route('blobs.store', {
          allowedContentTypes: actualAllowedContentTypes,
        }),
      });

      onChange({ name: file.name, url: blob.url });
    } catch (e) {
      console.error(e);

      toast.error(
        'Error uploading file. Please check the file type and try again.'
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    onLoading?.(loading);
  }, [onLoading, loading]);

  return (
    <>
      {value && (
        <div>
          {value.name.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
            <img src={value.url} width={100} alt={''} />
          ) : (
            <div className="flex items-center gap-1 border border-gray-300 rounded p-1">
              <FileUp className="h-4 w-4" />
              <div>{value.name}</div>
              <CheckCircle className="h-4 w-4" />
            </div>
          )}

          <div>
            <Button
              type="button"
              variant="link"
              onClick={() => onChange(null)}
              size="sm"
              className="text-red-500 p-0"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-1 items-center">
        <div>
          <Input
            type="file"
            onChange={handleChange}
            disabled={loading}
            ref={fileInputRef}
            className="hidden"
          />

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={loading}
            className="relative "
            onClick={() => fileInputRef.current?.click()}
          >
            <>{loading ? 'Uploading...' : 'Select File'}</>
          </Button>
        </div>

        {actualAllowedContentTypes.length > 0 && (
          <div className="text-xs text-gray-500">
            (
            {actualAllowedContentTypes
              .map((type) => mime.getExtension(type))
              .join(', ')}
            )
          </div>
        )}
      </div>
    </>
  );
}
