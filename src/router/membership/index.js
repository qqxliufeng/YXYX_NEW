import Layout from '@/layout'
export default [
  {
    path: '/vipshcoolinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/addschool',
        component: () => import('@/views/membership/AddSchool.vue'),
        name: 'AddSchool',
        meta: {
          title: '添加学校',
          noCache: true
        }
      },
      {
        path: '/editschool/:schoolId',
        component: () => import('@/views/membership/EditSchool.vue'),
        name: 'EditSchool',
        meta: {
          title: '编辑学校'
        }
      },
      {
        path: '/schoolrecordlist/:schoolId',
        component: () => import('@/views/membership/SchoolRecordList.vue'),
        name: 'SchoolRecordList',
        meta: {
          title: '学校服务记录'
        }
      },
      {
        path: '/schoolstudycardlist/:schoolId/:schoolName/:type',
        component: () => import('@/views/membership/SchoolStudyCardList.vue'),
        name: 'SchoolStudyCardList',
        meta: {
          title: '学习卡列表'
        }
      },
      {
        path: '/grant-tb-off-school/:schoolId',
        component: () => import('@/views/membership/GrantTextBookToOffLineSchool.vue'),
        name: 'GrantTextBookToOffLineSchool',
        meta: {
          title: '给学校分配教材',
          noCache: true
        }
      },
      {
        path: '/granttextbook/:studentId',
        component: () => import('@/views/membership/GrantTextBookToStudent.vue'),
        name: 'GrantTextBookToStudent',
        meta: {
          title: '给学生分配教材',
          noCache: true
        }
      }
    ]
  }
]
