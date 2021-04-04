export class Utterance {
  constructor(
    public id: string,
    public utterance: string,
    public tag: string,
    public user: string,
    public complete?: boolean
  ) {}
}
