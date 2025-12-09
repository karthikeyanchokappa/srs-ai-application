import AWS from "aws-sdk";

const s3 = new AWS.S3();
const BUCKET = process.env.S3_BUCKET; // Set in Lambda environment

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileType, fileData } = body;

    if (!fileName || !fileType || !fileData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid upload request" })
      };
    }

    const buffer = Buffer.from(fileData, "base64");

    const uploadResult = await s3
      .upload({
        Bucket: BUCKET,
        Key: `uploads/${Date.now()}_${fileName}`,
        Body: buffer,
        ContentType: fileType,
        ACL: "public-read"
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        url: uploadResult.Location
      })
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Upload failed" })
    };
  }
};
