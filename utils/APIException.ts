import { API_ERROR_TYPE } from "@/typings/app";

// 自定义 Error 类
export class APIException extends Error {
    public type: API_ERROR_TYPE;

    constructor(message: string, type: API_ERROR_TYPE) {
        super(message); // 调用父类的构造函数 (Error)
        this.name = "APIException"; // 错误名称
        this.type = type; // 自定义类型
        Object.setPrototypeOf(this, new.target.prototype); // 修复继承链
    }
}