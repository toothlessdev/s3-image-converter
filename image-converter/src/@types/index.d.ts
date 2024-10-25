declare enum ImageType {
    JPEG = "jpeg",
    PNG = "png",
    WEBP = "webp",
}

declare type ImageConverterOptions = {
    source: string;
    width?: number;
    height?: number;
    quality?: number;
    imageType?: ImageType;
};
