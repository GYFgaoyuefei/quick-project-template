"use strict";
exports.__esModule = true;
/**
 *
 * @param note 参数说明
 * @param generator 参数生产成方式，同桩配置，也可用于参数校验
 * @param require true｜false
 */
function TInt(note, generator, require) {
    return {
        note: note ? note : 'int',
        require: require ? require : false,
        generator: generator ? generator : '<NU, 1, 8>',
        _type: 'int'
    };
}
exports.TInt = TInt;
/**
 *
 * @param note 参数说明
 * @param generator 参数生产成方式，同桩配置，也可用于参数校验
 * @param require true｜false
 */
function TString(note, generator, require) {
    return {
        note: note ? note : 'string',
        require: require ? require : false,
        generator: generator ? generator : '<EN, 1, 8>',
        _type: 'string'
    };
}
exports.TString = TString;
/**
 *
 * @param note 参数说明
 * @param generator 参数生产成方式，同桩配置，也可用于参数校验
 * @param require true｜false
 */
function TFloat(note, generator, require) {
    return {
        note: note ? note : 'string',
        require: require ? require : false,
        generator: generator ? generator : '<[1|2|3|4|5|6|7|8|9], 1, 3>.<NU, 1, 3>',
        _type: 'float'
    };
}
exports.TFloat = TFloat;
/**
 * 结构体类型
 * @param struct  {a: TIntDefined, b: TObject} 结构体结构描述
 * @param note
 * @param require
 */
function TObject(struct, note, require) {
    return {
        inner: struct,
        note: note ? note : 'string',
        require: require ? require : false,
        _type: 'object'
    };
}
exports.TObject = TObject;
/**
 *
 * @param inner list中元素的结构
 * @param note
 * @param require
 */
function TList(inner, note, require) {
    return {
        inner: inner,
        note: note ? note : 'string',
        require: require ? require : false,
        _type: 'list'
    };
}
exports.TList = TList;
/**
 *
 * @param files TSimpleFileDefined数组
 * @param note
 * @param require
 */
function TFile(files, note, require) {
    return {
        files: files,
        note: note ? note : 'string',
        require: require ? require : false,
        _type: 'file'
    };
}
exports.TFile = TFile;
