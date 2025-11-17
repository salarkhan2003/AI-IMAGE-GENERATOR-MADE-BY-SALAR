
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL like "data:image/png;base64,iVBORw0KGgo...".
        // We resolve with the full data URL.
        resolve(reader.result);
      } else {
        reject(new Error("File could not be read as a data URL."));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
