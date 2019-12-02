export type EqualityFn = (a: any, b: any) => boolean;
const simpleIsEqual: EqualityFn = (a: any, b: any): boolean => a === b;

export function memoize<T extends (...args: any[]) => any>(resultFn: T, isEqual: EqualityFn = simpleIsEqual): T {
    let lastThis: any;
    let lastArgs: any[] = [];
    let lastResult: any;
    let calledOnce: boolean = false;

    const isNewArgEqualToLast = (newArg: any, index: number): boolean => isEqual(newArg, lastArgs[index]);

    // breaking cache when context (this) or arguments change
    const result = function(this: any, ...newArgs: any[]) {
        if (calledOnce && lastThis === this && newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
            return lastResult;
        }

        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        lastResult = resultFn.apply(this, newArgs);
        return lastResult;
    };

    return result as T;
}
