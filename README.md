Thor Project Template
========================================

## Table of contents

* [Quick start](#quick-start)
  * [1. Introducing the project](#1-introduction-the-project)
  * [2. The configuration](#2-the-configuration)
      * [appName](#appname)
      * [routes](#routes)
      * [siderMenus](#sidermenus)
  * [3. Create the class and interfaces](#3-create-the-class-and-interfaces)
  * [4. Start dev server and release build](#4-start-dev-server-and-release-build)
* [Methods](#methods)
  * [Data request](#data-request)
      * [getJson\<T\>(url: string, options: RequestInit = {}): Promise\<T\>](#getjsonturl-string-options-requestinit-promiset) 
      * [request\<T\>(url: string, options: RequestInit = {}): Promise\<T\>](#requestturl-string-options-requestinit-promiset)
      * [get\<T\>(url: string, params: IRequestParams = {}): Promise\<T\>](#getturl-string-params-irequestparams-promiset)
      * [post\<T\>(url: string, params: IRequestParams | FormData = {}): Promise\<T\>](#postturl-string-params-irequestparams-formdata-promiset)
      * [put\<T\>(url: string, params: IRequestParams | FormData = {}): Promise\<T\>](#putturl-string-params-irequestparams-formdata-promiset)
      * [getList\<T\>(url: string, params?: IRequestParams, pageParam?: IPaginationRequestParams): Promise\<IPaginationData\<T\>\>](#getlistturl-string-params-irequestparams-pageparam-ipaginationrequestparams-promiseipaginationdatat)
* [Construction Diagram](#construction-diagram)
* [Documentation and FAQ](#documentation-and-faq)

## Quick start
#### 1. Introducing the project
This project inherits the react project. Learn more [create-react-app](https://github.com/facebook/create-react-app).  
After install the project, you will find the structure of the project as below.  
```
.
├── loaders
|   ├── antdStyleLoader.js
|   ├── pathComponentMappingLoader.js
|   ├── revisionLoader.js
|   └── routeConfigLoader.js
├── mock
├── node_modules
├── public
├── resources
|   └── application-context.json
├── src
|   ├── com.didichuxing
|   |   ├── area
|   |   |   ├── AbstractArea.tsx
|   |   |   ├── AbstractAsync.tsx
|   |   |   ├── AsyncPath.tsx
|   |   |   ├── AsyncRoute.tsx
|   |   |   ├── PathArea.tsx
|   |   |   └── RouteArea.tsx
|   |   ├── components
|   |   |   ├── DataTransferComponent.tsx
|   |   |   ├── PlusOperator.less
|   |   |   └── PlusOperator.tsx
|   |   ├── ria
|   |   |   ├── context
|   |   |   |   └── IApplicationContext.ts
|   |   |   ├── Workspace.less
|   |   |   └── Workspace.tsx
|   |   ├── utils
|   |   |   ├── Progress.ts
|   |   |   ├── request.ts
|   |   |   └── requestList.ts
|   ├── Application.less
|   └── Application.tsx
├── tests
├── .babelrc
├── .gitignore
├── .roadhogrc.mock.js
├── .stylelintrc
├── .webpackrc.js
├── declaration.d.ts
├── package.json
├── README.md
├── tsconfig.json
├── tslint.json
└── webpack.config.js
```
* ```loaders/``` The collection of loaders for handling building capability. There are 4 loaders.
  * **antdStyleLoader** used to handle the antd style.
  * **pathComponentMappingLoader** used to map the path to the component.
  * **revisionLoader** used to replace the app name to the [ant-desing-pro](http://ant-design-pro.gitee.io/)'s.
  * **routeConfigLoader** used to dynamic the component from the rout path.
* ```mock/``` The mock data for dev. Learn more [https://pro.ant.design/docs/mock-api](https://pro.ant.design/docs/mock-api) and [https://github.com/nuysoft/Mock/wiki/Syntax-Specification](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)
* ```node_modules/``` The 3rd-party node lib. Learn more [https://docs.npmjs.com/](https://docs.npmjs.com/)
* ```public/``` The public static resources should be there. It would be copied to the output directory (by default ./dist) on the dev and build.
* ```resources/``` This folder is used to config at runtime. The config file [application-context.json](#2-the-configuration) is in there.
* ```src/``` The class home path. The code place.
* ```tests/``` The unit test place. Learn more [https://facebook.github.io/jest/](https://facebook.github.io/jest/).
* ```.babelrc``` The babel config. Learn more [http://babeljs.io/docs/usage/babelrc](http://babeljs.io/docs/usage/babelrc).
* ```.gitignore``` The git ignore file. Learn more [https://git-scm.com/docs/gitignore](https://git-scm.com/docs/gitignore).
* ```.roadhogrc.mock.js``` The dev server config file. Learn more [https://github.com/sorrycc/roadhog#mock](https://github.com/sorrycc/roadhog#mock).
* ```.stylelintrc``` The style lint config. Learn more [https://stylelint.io/user-guide/configuration/](https://stylelint.io/user-guide/configuration/).
* ```.webpackrc.js``` The roadhog's webpack. Learn more [https://github.com/sorrycc/roadhog#configuration](https://github.com/sorrycc/roadhog#configuration).
* ```declaration.d.ts``` The declaration ts file, include json declaration and less declaration. Learn more [http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
* ```package.json``` All dependencies module will be configed there, and include other things. Learn more [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)
* ```README.md``` The read me file, used to introduce and show the project information. The markdown as the syntax. Learn more [https://docs.gitlab.com/ee/user/markdown.html](https://docs.gitlab.com/ee/user/markdown.html).
* ```tsconfig.json``` The typescript config file. Learn more [http://www.typescriptlang.org/docs/handbook/tsconfig-json.html](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
* ```tslint.json``` The typescript lint config file. Learn more [https://palantir.github.io/tslint/](https://palantir.github.io/tslint/).
* ```webpack.config.js``` The webpack config js file. The extra webpack config will be append used if this file exists. Learn more [https://webpack.js.org/configuration/](https://webpack.js.org/configuration/).

#### 2. The configuration
###### appName
The value of the appName will be shown in the banner as the name of the project. It can be the Chinese language as well.
```json
{
    "appName": "thor-demo"
}
```
###### routes
The route configuration.  
It has 2 methods to explan the path mapping.  
1st is the router path mapping to the class full name.  
2nd is the router path mapping to the config object has _component_ and _routes_.  
  * **component** is the class full name.
  * **routes** is the recursive route configuration.

```json
{
    "appName": "thor-demo",
    "routes": {
        "/": "com/didichuxing/Index",
        "/workspace": {
            "component": "com/didichuxing/ria/Workspace",
            "routes": {
                "/dashboard": "com/didichuxing/ria/dashboard/Dashboard"
            }
        }
    }
}
```
_Note: The route path allows the path regexp. Learn more [https://github.com/pillarjs/path-to-regexp#parameters](https://github.com/pillarjs/path-to-regexp#parameters) and [https://reacttraining.com/react-router/web/guides/philosophy](https://reacttraining.com/react-router/web/guides/philosophy)._

###### siderMenus
The left side menu config under the project.  
  * **name** is the name of the menu item, it will be shown.
  * **icon** is the icon type, it will be shown on the left of the name. The icon type please see [http://ant-design.gitee.io/components/icon-cn/#图标列表](http://ant-design.gitee.io/components/icon-cn/#%E5%9B%BE%E6%A0%87%E5%88%97%E8%A1%A8).
  * **path** is the access router path configed in the routes.

```json
{
    "appName": "thor-demo",
    "routes": {
        "/": "com/didichuxing/Index",
        "/workspace": {
            "component": "com/didichuxing/ria/Workspace",
            "routes": {
                "/dashboard": "com/didichuxing/ria/dashboard/Dashboard"
            }
        }
    },
    "siderMenus": [
        {
            "name": "大盘",
            "icon": "dashboard",
            "path": "/workspace/dashboard"
        }
    ]
}
```

#### 3. Create the class and interfaces
Create the Dashboard class as tsx. Learn more [typescript jsx](http://www.typescriptlang.org/docs/handbook/jsx.html)
```sh
$ vim ./src/com/didichuxing/ria/dashboard/Dashboard.tsx
```
Let's code the Dashboard class
```tsx
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/**
 * @interface
 * The props of the Dashboard component
 */
interface IDashboardProps {}

/**
 * @interface
 * The route props of the Dashboard component
 */
interface IDashboardRouteProps extends RouteComponentProps<IDashboardProps> {}

/**
 * @interface
 * The state of the Dashboard component
 */
interface IDashboardState {}

export default class Dashboard extends React.Component<IDashboardRouteProps, IDashboardState> {

    /**
     * @constructor
     * @param {IDashboardRouteProps} props
     * @param context
     */
    constructor(props: IDashboardRouteProps, context?: any) {
        super(props, context);
        this.state = {
            // the initial state code is here
        }
    }
    
    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        return <div>Dashboard</div>;
    }
}

```
#### 4. Start dev server and release build
  * Dev for local mock, you should execute command as below

  ```sh
  $ npm start
  ```
  * Dev for proxy service, you should add proxy service ip and port in the ```.roadhogrc.mock.js``` at first

  ```javascript
  const NO_PROXY_TARGET = 'http://100.90.209.13:8084';
  ```
  Then, execute command as below
  ```sh
  $ npm run start:no-proxy
  ```
  * Build for release, execute command as below

  ```sh
  $ npm build
  ```
  The release code in the output directory (by default ./dist).

## Methods
#### Data request
###### getJson\<T\>(url: string, options: [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) = {}): Promise\<T\>
Get json from the request url.
  * _url: string [Required]_ The request url
  * _options: RequestInit [Optional]_ The request option. Learn more Request Parameters init from [https://developer.mozilla.org/en-US/docs/Web/API/Request/Request](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)
  * _Promise\<T\> as returnd type_ The returnd value is async as [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The \<T\> is a [generic](http://www.typescriptlang.org/docs/handbook/generics.html), The type of request json data is the T.  
About generics please learn more [http://www.typescriptlang.org/docs/handbook/generics.html](http://www.typescriptlang.org/docs/handbook/generics.html)

Useage as below

```typescript
import { getJson } from 'com/didichuxing/utils/request';

interface IStudentData {
    readonly name: string;
    readonly school: string;
    readonly address: string;
}

// your code here...
getJson<IStudentData>('/public/student.json').then((data: IStudentData): void => {
    console.log(data); // the data is the student.json data.
}).catch((reason?: any): void => {
    // catch error code here...
});
// your code here...
```

###### request\<T\>(url: string, options: [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) = {}): Promise\<T\>
Get the response data by request. The response has to implement [IResponseJsonObject\<T\>](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts).
  * _url: string [Required]_ The request url
  * _options: RequestInit [Optional]_ The request option. Learn more Request Parameters init from [https://developer.mozilla.org/en-US/docs/Web/API/Request/Request](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)
  * _Promise\<T\> as returnd type_ The returnd value is async as [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The \<T\> is a [generic](http://www.typescriptlang.org/docs/handbook/generics.html), The type of request json data is the T.  
About generics please learn more [http://www.typescriptlang.org/docs/handbook/generics.html](http://www.typescriptlang.org/docs/handbook/generics.html)

Base the request method, it derives get, post and put methods.

Useage as below  
Api path '/api/student/2' response json as below

```json
{
    "data": {
        "id": 2,
        "name": "Cory",
        "school": "middle school",
        "address": "Haidian Dist. Beijing China"
    },
    "errmsg": "success",
    "errno": 0
}
```
The request code as below

```typescript
import request from 'com/didichuxing/utils/request';

interface IStudentData {
    readonlu id: number;
    readonly name: string;
    readonly school: string;
    readonly address: string;
}

// your code here...
// get student data from '/api/student/2'
request<IStudentData>('/api/student/2').then((data: IStudentData): void => {
    console.log(data); // the data is the student.json data.
}).catch((reason?: any): void => {
    // catch error code here...
});
// your code here...
```

###### get\<T\>(url: string, params: [IRequestParams]([https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts]) = {}): Promise\<T\>
Based from request method, the given request method is 'GET'.  
The response has to implement [IResponseJsonObject\<T\>](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts).
  * _url: string [Required]_ The request url
  * _options: [IRequestParams]([https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts]) [Optional]_ The get params.
  * _Promise\<T\> as returnd type_ The returnd value is async as [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The \<T\> is a [generic](http://www.typescriptlang.org/docs/handbook/generics.html), The type of request json data is the T.  
About generics please learn more [http://www.typescriptlang.org/docs/handbook/generics.html](http://www.typescriptlang.org/docs/handbook/generics.html)

###### post\<T\>(url: string, params: [IRequestParams]([https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts]) | [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) = {}): Promise\<T\>
Based from request method, the given request method is 'POST'.  
It is used to add new data.
The response has to implement [IResponseJsonObject\<T\>](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts).
  * _url: string [Required]_ The request url
  * _options: [IRequestParams]([https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts]) | [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) [Optional]_ The post params, it can be IRequestParams or FormData.
  * _Promise\<T\> as returnd type_ The returnd value is async as [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The \<T\> is a [generic](http://www.typescriptlang.org/docs/handbook/generics.html), The type of request json data is the T.  
About generics please learn more [http://www.typescriptlang.org/docs/handbook/generics.html](http://www.typescriptlang.org/docs/handbook/generics.html)

###### put\<T\>(url: string, params: [IRequestParams](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts) | [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) = {}): Promise\<T\>
Based from request method, the given request method is 'Put'.  
It is used to modify the given data.
The response has to implement [IResponseJsonObject\<T\>](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts).
  * _url: string [Required]_ The request url
  * _options: [IRequestParams]([https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts]) | [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) [Optional]_ The post params, it can be IRequestParams or FormData.
  * _Promise\<T\> as returnd type_ The returnd value is async as [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The \<T\> is a [generic](http://www.typescriptlang.org/docs/handbook/generics.html), The type of request json data is the T.  
About generics please learn more [http://www.typescriptlang.org/docs/handbook/generics.html](http://www.typescriptlang.org/docs/handbook/generics.html)

Useage as below

```typescript
import { get, post, put } from 'com/didichuxing/utils/request';

interface IStudentData {
    readonly id: number;
    readonly name: string;
    readonly school: string;
    readonly address: string;
}

// your code here...
// get student data from '/api/student/2'
get<IStudentData>('/api/student/2').then((data: IStudentData): void => {
    console.log(data); // the data is the student.json data.
}).catch((reason?: any): void => {
    // catch error code here...
});

// add(post) a new student data from '/api/student/2'
post<IStudentData>('/api/student', {
    name: 'Cory',
    school: 'primary school',
    address: 'Haidian Dist. Beijing China'
}).then((data: IStudentData): void => {
    console.log('success'); // add a new student data successful
}).catch((reason?: any): void => {
    // catch error code here...
});

// modify(put) student data from '/api/student/2'
put<IStudentData>('/api/student/2', {
    id: 2,
    name: 'Cory',
    school: 'primary school',
    address: 'Haidian Dist. Beijing China'
}).then((data: IStudentData): void => {
    console.log('success'); // modify the student data successful
}).catch((reason?: any): void => {
    // catch error code here...
});
// your code here...
```
###### getList\<T\>(url: string, params?: [IRequestParams](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts), pageParam?: [IPaginationRequestParams](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/requestList.ts)): Promise\<[IPaginationData](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/requestList.ts)\<T\>\>
Get list data via request. It is used to get the table list data(include pagination).  
The default page number is 1, the default page size is 10.  
  * _url: string_ [Require] The request url.
  * _params: [IRequestParams](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/request.ts)_ [Optional] The get request params.
  * _pageParam: [IPaginationRequestParams](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/requestList.ts)_ [Optional] The pagination params. default { pageNum: 1, pageSize: 10 }.
  * _Promise\<[IPaginationData](https://git.xiaojukeji.com/qt-fe/infrastructure/thor-template/blob/master/src/com/didichuxing/utils/requestList.ts)\<T\>\> as returnd type_
  
Useage as below  
Api path '/api/students' response json as below

```json
{
    "data": {
        "content": [{
            "id": 1,
            "name": "Leo",
            "school": "middle school",
            "address": "Haidian Dist. Beijing China"
        }, {
            "id": 2,
            "name": "Cory",
            "school": "middle school",
            "address": "Haidian Dist. Beijing China"
        }, {
            "id": 3,
            "name": "Jim",
            "school": "middle school",
            "address": "Haidian Dist. Beijing China"
        }],
        "total": 175
    },
    "errmsg": "success",
    "errno": 0
}
```
The request list code as below

```typescript
import { getList } from 'com/didichuxing/utils/requestList';

interface IStudentMetadata {
    readonly id: number;
    readonly name: string;
    readonly school: string;
    readonly address: string;
}

// your code here...
getList<IStudentMetadata>('/api/students').then((data: IPaginationData<IStudentMetadata>): void => {
    console.log(data.total);
    data.content.forEach((student: IStudentMetadata): void => {
       console.log(student); 
    });
}).catch((reason?: any): void => {
    // catch error code here...
});
// your code here...
```

## Construction Diagram



## Documentation and FAQ
[@didi/thor-cli库地址](https://artifactory.intra.xiaojukeji.com/artifactory/webapp/#/artifacts/browse/simple/General/npm/@didi/thor-cli/-/@didi)  
[Typescript](https://www.typescriptlang.org/)  
[Type Search](http://microsoft.github.io/TypeSearch/)  
[React](https://reactjs.org/)  
[Redux](https://redux.js.org/)  
[Webpack](https://webpack.js.org/)  
[Ant design](https://ant.design/)  
[Ant design pro](https://pro.ant.design/)  
[Ant design library](http://library.ant.design/)
