#!/usr/bin/env node

const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);

const regions = [
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

async function generatePutPresignedUrl(region, bucketName, objectKey) {
    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    const command = new PutObjectCommand({ Bucket: bucketName, Key: objectKey });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL 유효기간은 1시간
    return url;
}

app.post("/generate-presigned-url", async (req, res) => {
    const { region, bucket, key } = req.body;

    if (!region || !bucket || !key) return res.status(400).json({ error: "region, bucket, and key are required" });

    const regionValue = regions.find((r) => r.value === region);
    if (!regionValue) return res.status(400).json({ error: "Invalid region" });

    try {
        const url = await generatePutPresignedUrl(region, bucket, decodeURIComponent(key));
        res.json({ url });
    } catch (err) {
        console.error("Error generating presigned URL:", err);
        res.status(500).json({ error: "An error occurred while generating the presigned URL." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[PRE-SIGNED URL] Server is Running on http://localhost:${PORT}`);
});
