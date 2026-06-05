export const DRIVE_FILES = {
  favorites: 'omed_bible_favorites.json',
  highlights: 'omed_bible_highlights.json',
  notes: 'omed_bible_notes.json',
  plans: 'omed_bible_plans.json',
  settings: 'omed_bible_settings.json',
  position: 'omed_bible_position.json',
} as const;

type DriveFileListResponse = { files?: { id: string }[] };

const assertDriveResponse = (res: Response, action: string) => {
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Google session invalid (${res.status}) during ${action}`);
  }
  if (!res.ok) {
    throw new Error(`Google Drive request failed (${res.status}) during ${action}`);
  }
};

const getFileId = async (fileName: string, token: string): Promise<string | null> => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${fileName}'`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  assertDriveResponse(res, `find ${fileName}`);

  const data = (await res.json()) as DriveFileListResponse;
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
};

export const syncFileToDrive = async <T>(fileName: string, data: T, token: string): Promise<boolean> => {
  const fileId = await getFileId(fileName, token);
  const metadata = {
    name: fileName,
    parents: ['appDataFolder'],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  const url = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const method = fileId ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  assertDriveResponse(res, `upload ${fileName}`);
  return true;
};

export const syncFileFromDrive = async <T = unknown>(fileName: string, token: string): Promise<T | null> => {
  const fileId = await getFileId(fileName, token);
  if (!fileId) return null;

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assertDriveResponse(res, `download ${fileName}`);
  return (await res.json()) as T;
};
