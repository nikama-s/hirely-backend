import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { User } from "@prisma/client";
import { JwtPayload } from "../types/auth";

export class AuthService {
  private static getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    return secret;
  }

  private static getJwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  static async register(data: {
    email: string;
    password: string;
    isAdmin?: boolean;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        isAdmin: data.isAdmin || false
      }
    });

    return this.generateToken(user);
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static generateToken(user: User): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    };

    const secret = this.getJwtSecret();
    const expiresIn = this.getJwtExpiresIn();

    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.getJwtSecret()) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
