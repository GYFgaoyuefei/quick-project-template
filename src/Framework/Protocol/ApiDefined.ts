import { TIntDefined, TFloatDefined, TStringDefined, TObjectDefined, TListDefined, TSimpleMap } from "./TypeDefined";

type normal = TIntDefined | TFloatDefined | TStringDefined | TObjectDefined | TListDefined | TSimpleMap | null
export interface TApiDefined {
    request: normal,
    response: normal,
    note: string,
    changeLog:string
}

export const api = (arg: TApiDefined) => {
    return {
        toJSON: () => {return arg}
    }
}