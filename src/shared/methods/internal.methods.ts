export const convertBlobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      resolve(fileReader.result as string);
    });
    fileReader.addEventListener('error', () => {
      resolve('');
    });
    fileReader.readAsDataURL(blob);
  });
};
