export const downloadFile = async (blobURL: string, fileName: string) => {
    try {
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error('Error downloading the file:', error);
    }
};