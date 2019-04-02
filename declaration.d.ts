/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The declaration ts file
 */

declare module '*.json' {
    const content: {[key: string]: any};
    export = content;
}

declare module '*.less' {
    const content: {[className: string]: string};
    export = content;
}
