export const FILE_TYPES_DOCS_IMAGES = {
  'image/*': ['.jpeg', '.png', '.jpg'],
  'application/octet-stream': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.7z', '.tar'],
};

export const FILE_TYPES_IMAGES = {
  'image/*': ['.jpeg', '.png', '.jpg'],
};

export const FILE_CSV_EXCEL = {
  'application/octet-stream': ['.csv', '.xls', '.xlsx'],
};

export const FILE_VIDEOS = {
  'video/*': ['.mp4', '.webm', '.ogg', '.mkv'],
};

export const FILE_AUDIOS = {
  'audio/*': ['.mp3', '.wav', '.ogg'],
};

export const FILE_ALL_TYPES = {
  ...FILE_AUDIOS,
  ...FILE_CSV_EXCEL,
  ...FILE_TYPES_DOCS_IMAGES,
  ...FILE_VIDEOS,
};
