import { useState } from "react";

export function useSize(initialSizes: string[] = ["800x600"]) {
    const [sizes, setSizes] = useState(initialSizes);

    const handleSizeChange = (index: number, value: string) => {
        const newSizes = [...sizes];
        newSizes[index] = value;
        setSizes(newSizes);
    };

    const addSize = () => setSizes([...sizes, ""]);

    const removeSize = (index: number) => {
        const newSizes = sizes.filter((_, i) => i !== index);
        setSizes(newSizes);
    };

    return { sizes, handleSizeChange, addSize, removeSize };
}
