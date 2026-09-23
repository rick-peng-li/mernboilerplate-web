import { createHmac, randomBytes, timingSafeEqual, scryptSync } from 'node:crypto';
import { env } from '../config/env.js';

function base64UrlEncode(value) {
    return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
    return Buffer.from(value, 'base64url').toString('utf8');
}

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
    const hashedValue = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hashedValue}`;
}

export function verifyPassword(password, storedHash) {
    const [salt, originalHash] = String(storedHash || '').split(':');
    if (!salt || !originalHash) {
        return false;
    }

    const originalHashBuffer = Buffer.from(originalHash, 'hex');
    const currentHashBuffer = Buffer.from(scryptSync(password, salt, 64).toString('hex'), 'hex');

    if (originalHashBuffer.length !== currentHashBuffer.length) {
        return false;
    }

    return timingSafeEqual(originalHashBuffer, currentHashBuffer);
}

export function issueAuthToken(user) {
    const payload = {
        sub: user.id || user._id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = createHmac('sha256', env.authSecret).update(encodedPayload).digest('base64url');

    return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
    const [encodedPayload, signature] = String(token || '').split('.');
    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = createHmac('sha256', env.authSecret).update(encodedPayload).digest('base64url');
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
        return null;
    }

    if (!timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
        return null;
    }

    let payload;

    try {
        payload = JSON.parse(base64UrlDecode(encodedPayload));
    } catch (_error) {
        return null;
    }

    if (payload.exp < Date.now()) {
        return null;
    }

    return payload;
}
