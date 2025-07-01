import { useState } from 'react';

import { getUploadSignedURL, uploadFile } from 'api/core';

import { getFileNameExt, getUniqueName } from 'utils/functions';

import { IFileInfo, IUploadProgress, ModuleType } from 'interfaces/IAttachments';

export const useUploader = (moduleName?: ModuleType, folder?: string) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  const [progress, setProgress] = useState<Array<IUploadProgress>>([]);
  const [totalUploadProgress, setTotalUploadProgress] = useState<number>(0);

  const [totalFilesUpload, setTotalFileUploaded] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);

  const [filesData, setFilesData] = useState<Array<IFileInfo>>([]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File, total = 1) => {
    setIsUploading(true);
    setTotalFileUploaded(prev => (prev > 0 ? prev : 0));

    const info = getFileNameExt(file);
    const file_name = `${info.ext.toUpperCase()}_${getUniqueName()}.${info.ext}`;
    const updatedFile = new File([file], file_name, { type: file.type });
    let path = '';

    if (moduleName) {
      path = `${moduleName}/`;
    }
    if (folder && folder !== '') {
      folder = folder.replace(/\/+$/, '');
      path += `${folder}/`;
    }

    path += `${file_name}`;

    try {
      const response = await getUploadSignedURL(path);
      if (response.data) {
        const url = response.data.url;
        const data: IFileInfo = {
          file: updatedFile,
          unique_name: path,
          name: info.fileName,
          ext: info.ext,
        };

        total = totalFiles > 0 ? totalFiles : total > 0 ? total : 1;

        setFilesData(prev => {
          const exist = prev.find(pre => pre.unique_name === path);
          if (exist) return prev;
          return [...prev, data];
        });

        await uploadFile(
          updatedFile,
          url,
          progress => {
            setProgress(prev => {
              const isExist = prev.findIndex(pre => pre.file_id === path);
              if (isExist !== -1) {
                prev[isExist].progress = Number(progress);
              } else {
                prev.push({ file_id: path, progress: Number(progress) });
              }
              setTotalUploadProgress(() => {
                const totalProgress = prev.reduce((sum, num) => sum + (num.progress ?? 0), 0);
                return Number(Math.round(totalProgress / total));
              });

              return prev;
            });
          },
          () => {
            setTotalFileUploaded(prev => (prev < totalFiles ? prev + 1 : totalFiles));
            setFilesData(prev => prev.filter(pre => pre.unique_name !== path));
          }
        );

        if (url) return data;
        throw Error('The server could not understand the request due to invalid request. Please verify your input');
      } else {
        throw response.error;
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetProgress = () => {
    setSelectedFiles([]);

    setProgress([]);
    setFilesData([]);

    setTotalFileUploaded(0);
    setTotalUploadProgress(0);
    setTotalFiles(0);
  };

  return {
    totalFiles,
    totalFilesUpload,

    progress,
    totalUploadProgress,

    resetProgress,
    setTotalFiles,

    selectedFiles,
    setSelectedFiles,

    handleUpload,
    isUploading,
    filesData,
  };
};
