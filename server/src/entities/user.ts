export class User {
  constructor(private name: string) {}

  hi() {
    console.log(`Hi, ${this.name}`);
  }
}
