import fs from 'fs';
const certPath = '/var/task/mongo-cert.pem';

export function ensureMongoCert() {
  if (process.env.MONGO_CERT_B64 && !fs.existsSync(certPath)) {
    const cert = Buffer.from(process.env.MONGO_CERT_B64, 'base64').toString('utf-8');
    fs.writeFileSync(certPath, cert);
  }
  return certPath;
} 