import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
});

const keysPath = path.join(process.cwd(), 'keys');
if (!fs.existsSync(keysPath)) {
    fs.mkdirSync(keysPath);
}

fs.writeFileSync(path.join(keysPath, 'private_key.pem'), privateKey);
fs.writeFileSync(path.join(keysPath, 'public_key.pem'), publicKey);

console.log('Private and Public Key were successfully created and saved in the keys/ directory.');
