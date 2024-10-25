import { useMemo, useState } from "react";

export function useRegion(defaultRegion: string) {
    const [region, setRegion] = useState(defaultRegion);

    const regions = useMemo(() => {
        return [
            { name: "미국 동부 (버지니아 북부)", value: "us-east-1" },
            { name: "미국 동부 (오하이오)", value: "us-east-2" },
            { name: "미국 서부 (캘리포니아)", value: "us-west-1" },
            { name: "미국 서부 (오레곤)", value: "us-west-2" },
            { name: "아시아 태평양 (뭄바이)", value: "ap-south-1" },
            { name: "아시아 태평양 (오사카)", value: "ap-northeast-3" },
            { name: "아시아 태평양 (서울)", value: "ap-northeast-2" },
            { name: "아시아 태평양 (싱가포르)", value: "ap-southeast-1" },
            { name: "아시아 태평양 (시드니)", value: "ap-southeast-2" },
            { name: "아시아 태평양 (도쿄)", value: "ap-northeast-1" },
            { name: "캐나다 (중부)", value: "ca-central-1" },
            { name: "유럽 (프랑크푸르트)", value: "eu-central-1" },
            { name: "유럽 (아일랜드)", value: "eu-west-1" },
            { name: "유럽 (런던)", value: "eu-west-2" },
            { name: "유럽 (파리)", value: "eu-west-3" },
            { name: "유럽 (스톡홀름)", value: "eu-north-1" },
            { name: "남아메리카 (상파울루)", value: "sa-east-1" },
        ];
    }, []);

    return { region, setRegion, regions };
}
