import { randomUUID } from 'crypto';
import type { RegUserData, User, UserData } from './types';

class UserDB {
  private users: User[] = [];

  getUser(id: string): RegUserData {
    const user = this.users.find((user) => user.index === id);

    if (!user) {
      throw new Error(`User with ${id} id is missing`);
    }

    return { name: user.name, index: user.index };
  }

  private addUser(name: string, password: string) {
    const user: User = {
      name,
      password,
      index: randomUUID().toString(),
    };

    this.users.push(user);

    return {
      name: user.name,
      index: user.index,
    };
  }

  registerUser({ name, password }: UserData): RegUserData {
    const user = this.users.find(
      (user) => user.name === name && user.password === password,
    );

    if (!user) {
      return this.addUser(name, password);
    }

    return user;
  }
}

export const userDB = new UserDB();
