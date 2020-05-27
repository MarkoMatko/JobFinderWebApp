export class User {
  constructor(
    public username: string,
    public password: string,
    public email: string,
    public roles: string[],
    public id?: number,
  ) {}
}
