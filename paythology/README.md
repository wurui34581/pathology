# pathology

## 开发构建

### 目录结构 

```bash
├── /dist/           # 项目输出目录
├── /mock/           # 数据mock
├── /public/         # 公共文件，编译时copy至dist目录
├── /src/            # 项目源码目录
│ ├── /components/   # UI组件及UI相关方法
│ ├── /layouts/      # 全局组件
│ │ └── app.js       # 页面入口
│ │ └── index.js     # 入口文件
│ ├── /models/       # 数据模型
│ ├── /pages/        # 页面组件
│ │ └── document.ejs # html模版
│ ├── /services/     # 数据接口
│ ├── /themes/       # 项目样式
│ │ ├── default.less # 全局样式
│ │ └── vars.less    # 全局样式变量
│ ├── /utils/        # 工具函数
│ │ ├── config.js    # 项目常规配置
│ │ ├── menu.js      # 菜单及面包屑配置
│ │ ├── config.js    # 项目常规配置
│ │ ├── request.js   # 异步请求函数(axios)
│ │ └── theme.js     # 项目需要在js中使用到样式变量
├── package.json     # 项目信息
├── .eslintrc        # Eslint配置
└── .umirc.js        # umi配置
└── .umirc.mock.js   # mock配置
└── .theme.config.js # 主题less编译配置
```

文件夹命名说明:

* components：组件（方法）为单位以文件夹保存，文件夹名组件首字母大写（如`DataTable`），方法首字母小写（如`layer`）,文件夹内主文件与文件夹同名，多文件以`index.js`导出对象（如`./src/components/Layout`）。
* routes：页面为单位以文件夹保存，文件夹名首字母小写（特殊除外，如`UIElement`）,文件夹内主文件以`index.js`导出，多文件时可建立`components`文件夹（如`./src/routes/dashboard`），如果有子路由，依次按照路由层次建立文件夹（如`./src/routes/UIElement`）。

### 快速开始

克隆项目文件:

```bash
git clone https://github.com/zuiidea/antd-admin.git
```

进入目录安装依赖:

```bash
#开始前请确保没有安装roadhog、webpack到NPM全局目录, 国内用户推荐yarn或者cnpm
npm i 或者 yarn install
```

开发：

```bash
npm run start
打开 http://localhost:8000 #端口在package.json中cross-env后加上 PORT=8000指定
```


接口说明

1./upload
方法：POST
作用：上传文件夹
提交示例：
[{name:'folderName/fileName'}]

2.patients
方法：GET
作用：获取患者（文件）列表以及相应的算法数据
Response:
{
  id: 'patientId',   //患者（文件）ID
  name: 'fileName',  //文件名
  dzi_path: '/dzi_path/123.dzi',   //dzi文件地址
  
}



