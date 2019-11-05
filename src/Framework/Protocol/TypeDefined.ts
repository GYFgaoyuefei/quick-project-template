/**
 * 数字类型
 */
export interface TIntDefined {
    note?: string,
    generator?: string,
    require: boolean,
    _type: 'int'
}

/**
 * 字符串类型
 */
export interface TStringDefined {
    note?: string,
    generator?: string,
    require: boolean,
    _type: 'string'
}

/**
 * 浮点类型
 */
export interface TFloatDefined {
    note?: string,
    generator?: string,
    require: boolean,
    _type: 'float'
}

/**
 * 辅助object
 */
export interface TSimpleMap {
    [key:string]:TIntDefined | TStringDefined | TFloatDefined | TListDefined | TObjectDefined
}

/**
 * 结构体类型
 */
export interface TObjectDefined {
    inner: TSimpleMap,
    note?: string,
    require: boolean,
    _type: 'object'
}

/**
 * list类型
 */
export interface TListDefined {
    inner: TIntDefined | TStringDefined | TFloatDefined | TObjectDefined | TListDefined,
    note?: string,
    require: boolean,
    _type: 'list'
}

export interface TSimpleFileDefined {
    uri: string,
    name: string,
    filename: string
}

/**
 * 文件类型
 */
export interface TFileDefined {
    files: TSimpleFileDefined[],
    note?: string,
    require: boolean,
    _type: 'file'
}

/**
 * 
 * @param note 参数说明
 * @param generator 参数生产成方式，同桩配置，也可用于参数校验
 * @param require true｜false
 */
export function TInt(note?:string, generator?:string, require?:boolean) : TIntDefined {
    return {
        note: note ? note : 'int',
        require: require ? require : false,
        generator: generator ? generator : '<NU, 1, 8>',
        _type: 'int'
    }
}

/**
 * 
 * @param note 参数说明
 * @param generator 参数生产成方式，同桩配置，也可用于参数校验
 * @param require true｜false
 */
export function TString(note?:string, generator?:string, require?:boolean) : TStringDefined {
    return {
        note: note ? note : 'string',
        require: require ? require : false,
        generator: generator ? generator : '<EN, 1, 8>',
        _type: 'string'
    }
}

/**
 * 
 * @param note 参数说明
 * @param generator 参数生产成方式，同桩配置，也可用于参数校验
 * @param require true｜false
 */
export function TFloat(note?:string, generator?:string, require?:boolean) : TFloatDefined {
    return {
        note: note ? note : 'string',
        require: require ? require : false,
        generator: generator ? generator : '<[1|2|3|4|5|6|7|8|9], 1, 3>.<NU, 1, 3>',
        _type: 'float'
    }
}

/**
 * 结构体类型
 * @param struct  {a: TIntDefined, b: TObject} 结构体结构描述
 * @param note 
 * @param require 
 */
export function TObject(struct:TSimpleMap, note?:string, require?:boolean) : TObjectDefined {
    return {
        inner: struct,
        note: note ? note : 'string',
        require: require ? require : false,
        _type: 'object'
    }
}

type ListInner = TIntDefined | TStringDefined | TFloatDefined | TObjectDefined | TListDefined
/**
 * 
 * @param inner list中元素的结构
 * @param note 
 * @param require 
 */
export function TList(inner:ListInner, note?:string, require?:boolean) : TListDefined {
    return {
        inner,
        note: note ? note : 'string',
        require: require ? require : false,
        _type: 'list'
    }
}

/**
 * 
 * @param files TSimpleFileDefined数组
 * @param note 
 * @param require 
 */
export function TFile(files:TSimpleFileDefined[], note?:string, require?:boolean) : TFileDefined {
    return {
        files,
        note: note ? note : 'string',
        require: require ? require : false,
        _type: 'file'
    }
}