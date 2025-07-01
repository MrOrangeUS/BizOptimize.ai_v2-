import fs from 'fs';
const certPath = '/tmp/mongo-cert.pem';

export function ensureMongoCert() {
  if (process.env.MONGODB_CERT_B64 && !fs.existsSync(certPath)) {
    const cert = Buffer.from(process.env.MONGODB_CERT_B64, 'base64').toString('utf-8');
    fs.writeFileSync(certPath, cert);
  }
  return certPath;
} 