import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useRegion } from "@/hooks/useRegion";
import { usePresignedURL } from "@/hooks/usePresignedURL";
import { useImageTransform } from "@/hooks/useImageTransform";
import { useSize } from "@/hooks/useSize";
import { useImage } from "@/hooks/useImage";

export default function Index() {
    const [format, setFormat] = useState("webp");
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [presignedServerUrl, setPresignedServerUrl] = useState("http://localhost:3000/generate-presigned-url");

    const { files, handleFilesChange } = useImage();
    const { sizes, handleSizeChange, addSize, removeSize } = useSize();

    const [bucket, setBucket] = useState("your-bucket-name");
    const [bucketDir, setBucketDir] = useState("images");
    const { region, setRegion, regions } = useRegion("ap-northeast-2");
    const { getPresignedUrl } = usePresignedURL(presignedServerUrl, region, bucket);

    const processAndUploadImage = async (file: File, size: string) => {
        const convertedImage = await useImageTransform(file, size, format);

        const [width, height] = size.split("x");
        const fileName = `${file.name.split(".")[0]}_${width}x${height}.${format}`;
        const objectKey = `${bucketDir ? bucketDir + "/" : ""}${fileName}`;

        const presignedUrl = await getPresignedUrl(objectKey);

        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: convertedImage,
        });

        if (!uploadResponse.ok) throw new Error("Upload failed");
        return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(objectKey)}`;
    };

    const handleUpload = async () => {
        setUploading(true);
        setResults([]);
        setError(null);

        try {
            const uploadPromises = files.flatMap((file) => sizes.map((size) => processAndUploadImage(file, size)));
            const uploadedUrls = await Promise.all(uploadPromises);
            setResults(uploadedUrls);
        } catch (error) {
            console.error("Error:", error);
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Image Transformer & Uploader</h1>

            <Card>
                <CardHeader>
                    <CardTitle>이미지 업로드</CardTitle>
                    <CardDescription>설정을 입력하고 이미지를 선택하여 업로드하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="presignedServerUrl">S3 Presigned URL 발급 서버 엔드포인트</Label>
                        <Input
                            id="presignedServerUrl"
                            value={presignedServerUrl}
                            onChange={(e) => setPresignedServerUrl(e.target.value)}
                            placeholder="예: http://localhost:3000/generate-presigned-url"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>AWS 리전</Label>
                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger>
                                <SelectValue placeholder="리전 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map((region) => (
                                    <SelectItem key={region.value} value={region.value}>
                                        {region.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bucket">S3 버킷 이름</Label>
                        <Input id="bucket" value={bucket} onChange={(e) => setBucket(e.target.value)} placeholder="버킷 이름을 입력하세요" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bucket-dir">S3 버킷 하위 디렉토리 경로 (루트 경로에 저장시 비워두세요)</Label>
                        <Input id="bucket-dir" value={bucketDir} onChange={(e) => setBucketDir(e.target.value)} placeholder="버킷내에 저장할 하위 디렉토리를 입력해주세요" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="files">이미지 선택</Label>
                        <Input id="files" type="file" multiple onChange={handleFilesChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>출력 포맷</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger>
                                <SelectValue placeholder="포맷 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="webp">WebP</SelectItem>
                                <SelectItem value="png">PNG</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>사이즈</Label>
                        {sizes.map((size, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input value={size} onChange={(e) => handleSizeChange(index, e.target.value)} placeholder="예: 800x600" />
                                <Button variant="outline" size="icon" onClick={() => removeSize(index)}>
                                    &times;
                                </Button>
                            </div>
                        ))}
                        <Button onClick={addSize} variant="outline" size="sm">
                            사이즈 추가
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpload} disabled={uploading || !files.length || !sizes.length || !presignedServerUrl || !region || !bucket} className="w-full">
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 업로드 중...
                            </>
                        ) : (
                            "업로드"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>오류</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {results.length > 0 && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>업로드 결과</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {results.map((url, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-neutral-100 rounded dark:bg-neutral-800">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate mr-2">
                                        {url}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
