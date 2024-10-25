export enum ImageType {
    JPEG = "jpeg",
    PNG = "png",
    WEBP = "webp",
}

export type ImageConverterOptions = {
    source: string;
    width?: number;
    height?: number;
    quality?: number;
    imageType?: ImageType;
};

export class ImageConverter {
    protected width: number | undefined;
    protected height: number | undefined;
    protected source: string;

    protected quality: number;

    protected constructor(options: ImageConverterOptions) {
        this.width = options.width;
        this.height = options.height;
        this.source = options.source;
        this.quality = options.quality || 1;
    }

    protected convert(imageType: ImageType): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.source;
            image.onload = (e) => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d") as CanvasRenderingContext2D;

                canvas.width = this.width || image.width;
                canvas.height = this.height || image.height;

                if (!e.target) throw new Error("Image not found");

                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                context.drawImage(e.target as HTMLImageElement, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (data) => {
                        resolve(data as Blob);
                    },
                    `image/${imageType}`,
                    this.quality
                );
            };
            image.onerror = (e) => reject(e);
        });
    }
}
