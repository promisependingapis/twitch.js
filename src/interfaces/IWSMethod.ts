export interface IWSMethodRunCondition {
    command?: string;
}

export interface IWSMethod {
    method: any;
    runConditions: IWSMethodRunCondition;
    execute(args: any): any;
}
