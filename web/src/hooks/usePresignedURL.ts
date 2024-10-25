import { useState } from "react";

export function usePresignedURL(presignedServerUrl: string, region: string, bucket: string) {
    const [error, setError] = useState<string | null>(null);

    const getPresignedUrl = async (key: string) => {
        try {
            const response = await fetch(presignedServerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ region, bucket, key }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to get presigned URL.");
            return data.url;
        } catch (err) {
            console.error("Presigned URL request error:", err);
            setError("Failed to get presigned URL.");
            throw err;
        }
    };

    return { getPresignedUrl, error };
}
