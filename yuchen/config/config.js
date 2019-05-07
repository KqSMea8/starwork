export default {
  singular: true,
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      locale: {
        enable: true,
      },
    }],
  ],
  routes: [
    {
      path: '/',
      component: '../layout',
      routes: [
        {
          path: '/',
          component: './search'
        },
        {
          path: 'dashboard',
          routes: [
            { path: 'analysis', component: './dashboard/analysis' }
          ]
        },
        {
          path: 'helloworld',
          component: './HelloWorld'
        },
        { path: 'index.html', component: './search' },
        { path: 'material.html', component: './search' },
        { path: 'task.html', component: './taskList' },
        { path: 'collection.html', component: './collection' },
        { path: '/ad/m3u8Player.html', component: './playerM3u8' },
        { path: 'gif.html', component: './gif' },
        { path: 'playerByUrl.html', component: './player'},
        { path: 'player.html', component: './playerM3u8'},
        { path: 'shortVideoProduct.html', component: './shortVideoProduct'},
        { path: 'playerTest.html', component: './playerM3u8_2'},
        { path: 'searchBar', component: './searchBar' },
        { path: 'searchResult', component: './searchResult' },
        { path: 'puzzlecards', component: './puzzlecards' },
        { path: 'list', component: './list' },
        { path: 'typescript', component: './tsdemo' },
        { path: 'locale', component: './locale' },
        { path: 'statistics.html',component:'./statistics'},
        { path: 'nameId.html',component:'./nameId'},
        { path: 'taskSearch.html',component:'./taskSearch'},
        { path: 'mixedProduce.html',component:'./mixedProduce'},
      ]
    }
 ],
  proxy: {
    '/apis/': {
      // target: 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com',
      //target: 'http://10.3.81.210:8080/starwoks_api_war/',
      // target: 'http://localhost:8080/starwoks_api_war/',
      target: 'http://starworks.qiyi.domain/',

      changeOrigin: true,
      pathRewrite: { //这个是个正则匹配
        "^/apis/": "apis/"
      }
    },
  },
};
