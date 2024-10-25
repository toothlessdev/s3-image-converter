import { ImageResizer } from "web-image-resizer";
import { imageConverter } from "web-image-converter";

export async function useImageTransform(file: File, size: string, format: string) {
    const [width, height] = size.split("x").map(Number);

    const resizedImage = await ImageResizer.resize({
        file,
        maxWidth: width,
        maxHeight: height,
        quality: 0.8,
    });

    const converter = new imageConverter[format as keyof typeof imageConverter]({
        source: URL.createObjectURL(resizedImage),
        width,
        height,
        quality: 1,
    });

    return await converter.convert();
}
