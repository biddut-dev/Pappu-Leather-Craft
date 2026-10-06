import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { User } from "@/types";
import { initialAdminUser } from "./seed-data";

const JWT_SECRET = process.env.AUTH_SECRET || "pappu-leather-craft-super-secret-key-2026-production";
const AUTH_COOKIE = "plc_session";

// In-memory registered user cache (plus admin)
const usersStore: (User & { passwordHash: string })[] = [
  {
    ...initialAdminUser,
    passwordHash: bcrypt.hashSync("admin123456", 10),
  },
  {
    _id: "user-demo-01",
    name: "Tanvir Ahmed",
    email: "customer@gmail.com",
    phone: "+8801712000000",
    role: "customer",
    isActive: true,
    passwordHash: bcrypt.hashSync("customer123", 10),
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        fullName: "Tanvir Ahmed",
        phone: "+8801712000000",
        division: "Dhaka",
        district: "Dhaka",
        area: "Dhanmondi 27",
        address: "House 14, Road 27, Dhanmondi, Dhaka",
        isDefault: true,
      },
    ],
    createdAt: "2026-02-01T00:00:00Z",
  },
];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: User): string {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string) {
  return usersStore.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export async function registerUser(name: string, email: string, phone: string, password: string):Promise<User> {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const newUser: User & { passwordHash: string } = {
    _id: "usr-" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: "customer",
    isActive: true,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  usersStore.push(newUser);

  // Return user without password
  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export async function getAllUsers(): Promise<User[]> {
  return usersStore.map(({ passwordHash: _, ...user }) => user);
}

export { AUTH_COOKIE };
