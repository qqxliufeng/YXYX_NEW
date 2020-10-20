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
        path: '/logmanagementuserlist/:userId',
        component: () => import('@/views/system/LogmanagementUserList.vue'),
        name: 'LogmanagementUserList',
        meta: {
          title: '用户日志记录'
        }
      },
      {
        path: '/textbooklist/:studyCardId/:studyCardCode/:studyCardErcode/:textbookType',
        component: () => import('@/views/system/TextBookList.vue'),
        name: 'TextBookList',
        meta: {
          title: '教材列表'
        }
      },
      {
        path: '/feedback/:feedbackId',
        component: () => import('@/views/system/FeedBackInfo.vue'),
        name: 'FeedBackInfo',
        meta: {
          title: '反馈详情'
        }
      },
      {
        path: '/feedbackreply/:feedbackId',
        component: () => import('@/views/system/FeedBackReply.vue'),
        name: 'FeedBackReply',
        meta: {
          title: '回复反馈'
        }
      }
    ]
  }
]
