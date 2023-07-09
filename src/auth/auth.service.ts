/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './interface/user.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';

const USERS_FILE_PATH = path.resolve(appRoot.path, 'users.json');

@Injectable()
export class AuthService {
  private users: User[] = [];
  constructor(private jwtService: JwtService) {
    this.loadUsersFromFile()
  }

  login(email: string, password: string): any {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      const token = this.generateToken(user.email);
      return token;
    } else {
      return null;
    }
  }

  generateToken(email: string): string {
    const payload = { email };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Token non valido');
    }
  }

  getUserByEmail(email: string): any {
    return this.users.find(user => user.email === email);
  }

  registerUser(user: User): boolean {
    const existingUser = this.getUserByEmail(user.email);
    if (existingUser) {
      return false;
    };
    this.users.push(user);
    this.saveUsersToFile();
    return true
  }

  private loadUsersFromFile(): void {
    try {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
      this.users = JSON.parse(data);
    } catch (error) {
      this.users = [];
      throw new Error(`JSON User ERROR: ${error}`);
    }
  }

  private saveUsersToFile(): void {
    const data = JSON.stringify(this.users, null, 2);
    fs.writeFileSync(USERS_FILE_PATH, data);
  }
}
