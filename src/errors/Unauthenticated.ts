export class Unauthenticated extends Error {
  constructor(message = 'Unauthenticated') {
    super(message);
    this.name = 'Unauthenticated';
  }
}
