
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const privateKey = fs.readFileSync(path.join(process.cwd(), 'keys', 'private_key.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(process.cwd(), 'keys', 'public_key.pem'), 'utf8');

const createJWTToken = ({id , email}) =>{
    const payload = {
        userId: id,
        email: email,
        
    };
    const token = jwt.sign(payload, privateKey, {expiresIn : '2h' ,algorithm: 'RS256' });
    return token;
}


const verifyJWTToken = (token) =>{
    const payload = jwt.verify(token , publicKey , {algorithms: ['RS256'] });
    return payload;
}

export { createJWTToken, verifyJWTToken }