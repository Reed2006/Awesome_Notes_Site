import { getSupabaseClient, getSupabaseConfig } from '@/lib/supabase';

const BUCKET_NAME = 'course-resources';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * 上传文件到 Supabase Storage
 * @param file - 要上传的文件
 * @param storagePath - 存储路径（如 "econ/political-economy/pe-1.pdf"）
 * @param options - 上传选项（进度回调等）
 * @returns 文件的公开访问 URL
 */
export async function uploadFile(
  file: File,
  storagePath: string,
  options?: UploadOptions
): Promise<string> {
  // 如果需要进度监听，使用 XMLHttpRequest
  if (options?.onProgress) {
    return uploadWithProgress(file, storagePath, options.onProgress);
  }

  // 标准上传（无进度监听）
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true, // 如果文件已存在则覆盖
    });

  if (error) throw error;

  // 获取公开访问 URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * 使用 XMLHttpRequest 实现带进度的上传
 */
function uploadWithProgress(
  file: File,
  storagePath: string,
  onProgress: (progress: UploadProgress) => void
): Promise<string> {
  const supabase = getSupabaseClient();
  const { url: supabaseUrl, anonKey } = getSupabaseConfig();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 监听上传进度
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', async () => {
      if (xhr.status === 200) {
        // 获取公开 URL
        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);
        resolve(data.publicUrl);
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    // 构建 Supabase Storage API 请求
    const url = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${storagePath}`;
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${anonKey}`);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.send(file);
  });
}

/**
 * 下载文件（带进度监听）
 * @param url - 文件的公开访问 URL
 * @param filename - 保存的文件名
 * @param onProgress - 进度回调
 */
export async function downloadFile(
  url: string,
  filename: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    // 监听下载进度
    xhr.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // 创建 Blob URL 并触发下载
        const blob = xhr.response;
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        resolve();
      } else {
        reject(new Error(`Download failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Download failed'));
    });

    xhr.open('GET', url);
    xhr.send();
  });
}

/**
 * 删除文件
 */
export async function deleteFile(storagePath: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) throw error;
}

/**
 * 获取文件元数据
 */
export async function getFileMetadata(storagePath: string) {
  const pathParts = storagePath.split('/');
  const fileName = pathParts.pop();
  const folderPath = pathParts.join('/');

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folderPath, {
      search: fileName,
    });

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('File not found');

  return data[0];
}
