export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

const mimeExtensionMap: Record<string, string> = {
  pdf: 'pdf',
  zip: 'zip',
  'wordprocessingml': 'docx',
  msword: 'doc',
  spreadsheetml: 'xlsx',
  powerpoint: 'pptx',
  mp4: 'mp4',
  video: 'mp4',
  image: 'img',
};

export function getExtensionFromMimeType(mimeType?: string): string | null {
  if (!mimeType) return null;

  const normalized = mimeType.toLowerCase();
  for (const key of Object.keys(mimeExtensionMap)) {
    if (normalized.includes(key)) {
      return mimeExtensionMap[key];
    }
  }

  return null;
}

export function getExtensionFromFilename(filename?: string | null): string | null {
  if (!filename) return null;

  const cleanFilename = filename.split('?')[0];
  const parts = cleanFilename.split('.');
  if (parts.length < 2) {
    return null;
  }

  const ext = parts.pop();
  return ext ? ext.toLowerCase() : null;
}
