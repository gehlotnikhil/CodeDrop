import { supabase } from './superbase';
import * as fs from 'fs';
import * as path from 'path';

export const  uploadFromFilePath = async (localFilePath: string, uploadPath: string) => {
  try {
    const fileBuffer = fs.readFileSync(localFilePath);
    const fileName = path.basename(localFilePath);
    const file = new Blob([fileBuffer], { type: 'application/octet-stream' });

    const { data, error } = await supabase.storage
      .from('selfhosting1')  // your bucket name 
      .upload(uploadPath , file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('❌ Upload failed:', error.message);
    } else {
      console.log('✅ File uploaded:', data?.path);
    }
  } catch (err) {
    console.error('❌ Error reading file:', err);
  }
};


