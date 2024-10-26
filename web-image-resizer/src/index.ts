export type ImageResizerOptions = {
    file: File;
    maxWidth: number;
    maxHeight: number;
    quality?: number;
};

export class ImageResizer {
    public static resize(options: ImageResizerOptions): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const image = new Image();
                image.src = event.target?.result as string;
                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

                    const originalWidth = image.width;
                    const originalHeight = image.height;

                    const widthRatio = options.maxWidth / originalWidth;
                    const heightRatio = options.maxHeight / originalHeight;
                    const ratio = Math.max(widthRatio, heightRatio);

                    const newWidth = originalWidth * ratio;
                    const newHeight = originalHeight * ratio;

                    canvas.width = options.maxWidth;
                    canvas.height = options.maxHeight;

                    const x = (options.maxWidth - newWidth) / 2;
                    const y = (options.maxHeight - newHeight) / 2;

                    context.drawImage(image, x, y, newWidth, newHeight);
                    canvas.toBlob(
                        (data) => {
                            resolve(data as Blob);
                        },
                        options.file.type,
                        options.quality
                    );
                };
                image.onerror = () => reject(new Error("이미지를 불러오는데 실패했습니다."));
            };
            reader.onerror = () => reject(new Error("파일을 읽는데 실패했습니다."));
            reader.readAsDataURL(options.file);
        });
    }
}
