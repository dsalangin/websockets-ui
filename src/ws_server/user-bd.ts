import { createHash, randomUUID } from 'crypto';

type User = {
  name: string;
  password: string;
  index: string;
};

export type UserData = {
  name: string;
  password: string;
};

type RegUserData = {
  name: string;
  index: string;
};

class UserDB {
  private users = new Map();

  private generateKey(name: string, password: string): string {
    const hash = createHash('sha256');
    hash.update(`${name}${password}`);
    return hash.digest('hex');
  }

  private checkUser(key: string): boolean {
    return this.users.has(key);
  }

  private getUser(key: string): RegUserData {
    const { name, index } = this.users.get(key);
    return { name, index };
  }

  private addUser(key: string, name: string, password: string) {
    const user: User = {
      name,
      password,
      index: randomUUID().toString(),
    };

    this.users.set(key, user);
  }

  registerUser({ name, password }: UserData): RegUserData {
    const key = this.generateKey(name, password);

    if (!this.checkUser(key)) {
      this.addUser(key, name, password);
    }

    return this.getUser(key);
  }
}

export const userDB = new UserDB();
