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
                image.onload = (e) => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

                    let width = image.width;
                    let height = image.height;

                    if (width > height) {
                        if (width > options.maxWidth) {
                            height *= options.maxWidth / width;
                            width = options.maxWidth;
                        }
                    } else {
                        if (height > options.maxHeight) {
                            width *= options.maxHeight / height;
                            height = options.maxHeight;
                        }
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
                image.onerror = () => reject(new Error("Failed to load image."));
            };
            reader.onerror = () => reject(new Error("Failed to read file."));
            reader.readAsDataURL(options.file);
        });
    }
}
