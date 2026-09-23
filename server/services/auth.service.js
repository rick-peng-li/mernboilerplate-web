import { getDataMode, isDatabaseReady } from '../config/database.js';
import { workspaceSeed } from '../data/workspace-seed.js';
import { User } from '../models/user.model.js';
import { hashPassword, issueAuthToken, verifyAuthToken, verifyPassword } from '../utils/auth-crypto.js';

let memoryUsers = structuredClone(workspaceSeed.users);

function sanitizeUser(user) {
    if (!user) {
        return null;
    }

    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user;

    return {
        id: String(plainUser._id),
        name: plainUser.name,
        email: plainUser.email,
        role: plainUser.role,
        status: plainUser.status,
        lastLoginAt: plainUser.lastLoginAt,
        createdAt: plainUser.createdAt,
        updatedAt: plainUser.updatedAt,
        mode: getDataMode(),
    };
}

async function ensureSeedUsers() {
    if (!isDatabaseReady()) {
        return;
    }

    const count = await User.countDocuments();
    if (count === 0) {
        await User.insertMany(workspaceSeed.users);
    }
}

async function findUserByEmail(email) {
    if (isDatabaseReady()) {
        await ensureSeedUsers();
        return User.findOne({ email }).lean();
    }

    return memoryUsers.find((user) => user.email === email) || null;
}

async function findUserById(userId) {
    if (isDatabaseReady()) {
        await ensureSeedUsers();
        return User.findById(userId).lean();
    }

    return memoryUsers.find((user) => String(user._id) === userId) || null;
}

async function updateUserLoginTime(userId) {
    const lastLoginAt = new Date().toISOString();

    if (isDatabaseReady()) {
        await User.findByIdAndUpdate(userId, { lastLoginAt }, { new: true });
        return;
    }

    memoryUsers = memoryUsers.map((user) =>
        String(user._id) === userId ? { ...user, lastLoginAt, updatedAt: lastLoginAt } : user
    );
}

export async function registerUser(payload) {
    const existingUser = await findUserByEmail(payload.email);
    if (existingUser) {
        const error = new Error('This email is already registered.');
        error.statusCode = 409;
        throw error;
    }

    const now = new Date().toISOString();
    const userPayload = {
        ...payload,
        passwordHash: hashPassword(payload.password),
        createdAt: now,
        updatedAt: now,
    };

    let createdUser;

    if (isDatabaseReady()) {
        await ensureSeedUsers();
        createdUser = await User.create(userPayload);
    } else {
        createdUser = {
            ...userPayload,
            _id: `user-${Date.now()}`,
        };
        memoryUsers = [createdUser, ...memoryUsers];
    }

    const safeUser = sanitizeUser(createdUser);

    return {
        token: issueAuthToken(safeUser),
        user: safeUser,
    };
}

export async function loginUser({ email, password }) {
    const user = await findUserByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    await updateUserLoginTime(String(user._id));
    const latestUser = await findUserById(String(user._id));
    const safeUser = sanitizeUser(latestUser);

    return {
        token: issueAuthToken(safeUser),
        user: safeUser,
    };
}

export async function getUserFromToken(token) {
    const payload = verifyAuthToken(token);
    if (!payload) {
        return null;
    }

    const user = await findUserById(payload.sub);
    return sanitizeUser(user);
}
