
import * as fs from 'fs/promises';
import * as path from 'path';

export const avatarsPath = path.join(process.cwd(), 'avatars');

export const parseSchema = async (schema, data) => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    const errors = error.issues || error.errors || [];
    const errorMessage = errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join('; ');
    throw new Error(errorMessage);
  }
};

export const clean = (obj: any): any => {
  const cleaned = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

export const getAvatarFile = async (fileName) => {
  try {
    const filePath = path.join(avatarsPath, fileName);
    const buffer: any = await fs.readFile(filePath);
    const file = new File([buffer], fileName, {
      type: 'image/png'
    });
    return file;
  }
  catch (error) {
    return null;
  }
}

export const formatDate = (dateValue) => {
  if (!dateValue) return null;

  let date: Date;

  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) return null;

  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}