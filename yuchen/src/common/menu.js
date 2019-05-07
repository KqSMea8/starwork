/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

const menuData = [
  // {
  //   name: 'Pages',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [
  //     {
  //       name: '分析页',
  //       path: 'analysis',
  //     },
  //     {
  //       name: '监控页',
  //       path: 'monitor',
  //     },
  //     {
  //       name: '工作台',
  //       path: 'workplace',
  //       // hideInBreadcrumb: true,
  //       // hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: 'typescript',
  //   icon: 'dashboard',
  //   path: 'typescript',
  // },
  {
    name: '素材',
    icon: 'video-camera',
    path: 'material.html'
  },
  {
    name: '任务',
    icon: 'double-right',
    path: 'task.html'
  },
  {
    name: '集锦',
    icon: 'play-circle',
    path: 'collection.html'
  },
  {
    name: 'gif',
    icon: 'picture',
    path: 'gif.html'
  },
  {
    name: '短视频生产',
    icon: 'youtube',
    path: 'shortVideoProduct.html'
  },
  {
    name:'数据',
    icon:'pie-chart',
    path:'statistics.html'
  },
  {
    name:'名字转换',
    icon:'user',
    path:'nameId.html'
  },
  {
    name:'任务查看',
    icon:'file-search',
    path:'taskSearch.html'
  },
  {
    name:'starwork混剪',
    icon:'pic-left',
    path:'mixedProduce.html'
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
