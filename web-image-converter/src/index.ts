import { ImageConverter } from "./ImageConverter";

class WEBPImageConverter extends ImageConverter {
    constructor(options: ImageConverterOptions) {
        super(options);
    }
    public convert(): Promise<Blob> {
        return super.convert(ImageType.WEBP);
    }
}

class PNGImageConverter extends ImageConverter {
    constructor(options: ImageConverterOptions) {
        super(options);
    }
    public convert(): Promise<Blob> {
        return super.convert(ImageType.PNG);
    }
}

export const imageConverter = {
    webp: WEBPImageConverter,
    png: PNGImageConverter,
};
