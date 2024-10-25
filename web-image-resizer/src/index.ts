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

                    let width = image.width;
                    let height = image.height;

                    const widthRatio = options.maxWidth / width;
                    const heightRatio = options.maxHeight / height;
                    const ratio = Math.min(widthRatio, heightRatio);

                    if (ratio < 1) {
                        width *= ratio;
                        height *= ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    context.drawImage(image, 0, 0, width, height);
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
