#!/usr/bin/env node

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Command } = require("commander");
const dotenv = require("dotenv");
const inquirer = require("inquirer").default;

dotenv.config();

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
    const command = new PutObjectCommand({ Bucket: bucketName, Key: objectKey, ACL: "public-read" });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
}

async function promptUser() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "region",
            message: "Select AWS region:",
            choices: regions.map((region) => ({ name: region.name, value: region.value })),
        },
        {
            type: "input",
            name: "bucket",
            message: "Enter S3 bucket name:",
        },
        {
            type: "input",
            name: "key",
            message: "Enter S3 object key:",
        },
    ]);

    return answers;
}

const program = new Command();

program
    .name("s3-upload-url")
    .description("CLI to generate S3 presigned URLs for uploading objects")
    .version("1.0.0")
    .action(async () => {
        try {
            const { region, bucket, key } = await promptUser();
            const url = await generatePutPresignedUrl(region, bucket, key);
            console.log("PUT Presigned URL:", url);

            console.log(process.env.AWS_ACCESS_KEY_ID);
        } catch (err) {
            console.error("Error generating PUT presigned URL:", err);
        }
    });

program.parse(process.argv);
