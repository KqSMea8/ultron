/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of webpack.module.rules
 */

import path from 'path';

const ROOT_PATH = path.resolve(__dirname, '../');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

export default {
    module: {
        rules: [
            {
                test: /ApplicationContext\.ts$/,
                include: [ path.resolve(ROOT_PATH, 'src/com/didichuxing/context') ],
                use: path.resolve(ROOT_PATH, 'loaders/applicationContextLoader.js')
            },
            {
                test: /Application\.tsx$/,
                include: [ path.resolve(ROOT_PATH, 'src') ],
                exclude: [ path.resolve(ROOT_PATH, 'src/com') ],
                use: [
                    path.resolve(ROOT_PATH, 'loaders/applicationContextLauncherLoader.js'),
                    path.resolve(ROOT_PATH, 'loaders/routeConfigLoader.js')
                ]
            },
            {
                test: /(RouteArea)\.tsx$/,
                include: [ path.resolve(ROOT_PATH, 'src') ],
                use: [
                    path.resolve(ROOT_PATH, 'loaders/routeConfigLoader.js')
                ]
            },
            {
                test: /Workspace\.tsx$/,
                include: [ path.resolve(ROOT_PATH, 'src/com/didichuxing/ria') ],
                use: [
                    path.resolve(ROOT_PATH, 'loaders/revisionLoader.js'),
                    path.resolve(ROOT_PATH, 'loaders/headerClassLoader.js')
                ]
            },
            {
                test: /AbstractArea\.tsx$/,
                include: [ path.resolve(ROOT_PATH, 'src/com/didichuxing/area') ],
                use: path.resolve(ROOT_PATH, 'loaders/pathComponentMappingLoader.js')
            },
            {
                test: /request\.ts$/,
                include: [ path.resolve(ROOT_PATH, 'src/com/didichuxing/utils') ],
                use: path.resolve(ROOT_PATH, 'loaders/requestLoader.js')
            },
            {
                test: /Route\.js$/,
                include: [
                    path.resolve(NODE_MODULES_PATH, 'react-router')
                ],
                use: path.resolve(ROOT_PATH, 'loaders/routeQueryLoader.js')
            },
            {
                test: /(PathUtils|LocationUtils)\.js$/,
                include: [
                    path.resolve(NODE_MODULES_PATH, 'history')
                ],
                exclude: [
                    path.resolve(NODE_MODULES_PATH, 'history/es'),
                    path.resolve(NODE_MODULES_PATH, 'history/umd')
                ],
                use: path.resolve(ROOT_PATH, 'loaders/historyLoader.js')
            }
        ]
    }
};
