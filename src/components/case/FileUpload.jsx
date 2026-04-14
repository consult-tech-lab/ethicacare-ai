import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

export default function FileUpload({ files = [], onFilesChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (fileList) => {
    setUploading(true);
    const newFiles = [...files];
    for (const file of fileList) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      newFiles.push({ name: file.name, url: file_url });
    }
    onFilesChange(newFiles);
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => e.target.files.length && handleFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
        ) : (
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
        )}
        <p className="text-sm font-medium text-muted-foreground">
          {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOC, images supported</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="flex-1 truncate font-medium">{file.name}</span>
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => removeFile(i)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}