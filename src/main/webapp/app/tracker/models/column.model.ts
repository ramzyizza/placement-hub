export class Column {
  constructor(public name: string, public tasks: Row[]) {}
}
export class Row {
  constructor(
    public id: number,
    public companyName: string,
    public jobTitle: string,
    public jobLocation: string | null,
    public jobDuration: string | null,
    public applicationStatus: string
  ) {}
}

export class data {}
