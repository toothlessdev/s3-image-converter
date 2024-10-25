import { useState } from "react";

export function useImage() {
    const [files, setFiles] = useState<File[]>([]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return { files, handleFilesChange, setFiles };
}
