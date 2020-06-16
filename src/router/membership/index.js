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
          title: '添加学校'
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
        path: '/vipshcoolinfo/:schoolId',
        component: () => import('@/views/membership/VipSchoolInfo.vue'),
        name: 'VipSchoolInfo',
        meta: {
          title: '学校详情'
        }
      },
      {
        path: '/schoolstudycardlist/:schoolId/:schoolName/:type',
        component: () => import('@/views/membership/SchoolStudyCardList.vue'),
        name: 'SchoolStudyCardList',
        meta: {
          title: '学习卡列表'
        }
      }
    ]
  }
]
