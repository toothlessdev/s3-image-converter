# Web Image Resizer & Converter

This project aims to simplify the process of uploading optimized images to a static site. It resizes images for different devices (tablet, mobile, PC) and converts them to WebP format before uploading them to S3. The usual manual process is time-consuming, so this tool was created to handle it all at once.

## 🐈‍⬛ Project Structure

Make sure to install Yarn before starting.

## 🛫 Getting Started (Local Setup)

### 1. Install Yarn

The project is organized using `Yarn workspaces` <br/>
Make sure you have Yarn installed on your machine.

```bash
npm install -g yarn
```

### 2. Set Up AWS IAM Credentials

Generate an Access Key and Secret Key from AWS IAM.<br/>
Create a `.env` file inside the presigned-url workspace

```js
# presigned-url/.env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### 3. Run the Presigned URL Server

Start the server to generate presigned URLs for S3

```bash
yarn presigned-url start:server
```

This will run a server on `localhost:3000` using the provided keys.

### 4. Run the Image Converter Website

Start the image converter site

```bash
yarn web dev
```

Fill out the fields as required and click the upload button

### 5. Set Up S3 Bucket Permissions

Ensure your S3 bucket has the following permissions <br/>
Allow `s3:GetObject` `s3:PutObject` actions.

```json
// example
{
    "Version": "VERSION",
    "Id": "POLICYEXAMPLE",
    "Statement": [
        {
            "Sid": "SIDEXAMPLE",
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject", "s3:PutObject"],
            "Resource": "arn:aws:s3:::YOUR_ARN/*"
        }
    ]
}
```

### 6. Set Up CORS Configuration

Configure CORS to allow requests from your local setup

```json
// example
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST"],
        "AllowedOrigins": ["http://localhost:5173"],
        "ExposeHeaders": []
    }
]
```
