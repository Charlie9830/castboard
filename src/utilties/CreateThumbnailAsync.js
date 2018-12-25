let CreateThumbnailAsync = (base64Data) => {
    return new Promise((resolve, reject) => {
        let targetImageWidth = 48;


        let image = new Image();
        image.src = 'data:image/jpg;base64,' + base64Data;

        image.addEventListener('load', (e) => {
            let canvas = document.createElement('canvas');

            let aspectRatio = targetImageWidth / image.width;

            canvas.width = targetImageWidth;
            canvas.height = aspectRatio * image.height;

            // Compress Image.
            canvas.getContext('2d').drawImage(image, 0, 0, targetImageWidth, aspectRatio * image.height);

            let result = canvas.toDataURL("image/jpeg");
            resolve(result);
        })
    })
}

export default CreateThumbnailAsync;