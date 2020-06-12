import Layout from '@/layout'
export default [
  {
    path: '/systeminfo',
    component: Layout,
    redirect: '/system/group',
    hidden: true,
    children: [
      {
        path: '/addgroupinfo',
        component: () => import('@/views/system/AddGroupInfo.vue'),
        name: 'AddGroupInfo',
        meta: {
          title: '添加新用户'
        }
      },
      {
        path: '/grantmenubutton/:userId/:roleId',
        component: () => import('@/views/system/GrantMenuButton.vue'),
        name: 'GrantMenuButton',
        meta: {
          title: '分配按钮'
        }
      },
      {
        path: '/menubutton/:menuId/:menuName',
        component: () => import('@/views/system/menuButton.vue'),
        name: 'MenuButton',
        meta: {
          title: '按钮管理'
        }
      },
      {
        path: '/textbooklist/:studyCardId/:studyCardCode/:studyCardErcode',
        component: () => import('@/views/system/TextBookList.vue'),
        name: 'TextBookList',
        meta: {
          title: '教材列表'
        }
      }
    ]
  }
]
