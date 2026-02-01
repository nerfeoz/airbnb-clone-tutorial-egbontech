import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadProps {
  preview: string | null;
  onChange: (file: File) => void;
}

export default function ImageUpload({ preview, onChange }: ImageUploadProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  };
  return (
    <div className="relative w-full">
      <label
        htmlFor="image-upload"
        className="relative flex flex-col justify-center items-center gap-2 cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-10 text-gray-600 hover:text-gray-400 min-h-80 transition"
      >
        {!preview && (
          <>
            <TbPhotoPlus size={36} />
            <p className="font-medium">Click to upload</p>
            <p className="text-sm text-gray-400">Upload one image</p>
          </>
        )}

        {preview && (
          <Image
            src={preview}
            alt="preview"
            fill
            className="object-cover rounded-2xl"
          />
        )}
      </label>

      <input
        id="image-upload"
        type="file"
        accept="images/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
