import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("./keraflour-firebase-adminsdk-fbsvc-bc7f67b627.json");

const jsonString = fs.readFileSync(serviceAccountPath, "utf-8");

const serviceAccount = JSON.parse(jsonString);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
