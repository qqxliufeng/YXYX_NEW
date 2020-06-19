import Layout from '@/layout'
export default [
  {
    path: '/materialinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/granttextbooktoscholl/:textbookId',
        component: () => import('@/views/material/GrantTextBookToSchool.vue'),
        name: 'GrantTextBookToSchool',
        meta: {
          title: '授权学校',
          noCache: true
        }
      },
      {
        path: '/generatematerial/:textbookId',
        component: () => import('@/views/material/GenerateMaterial.vue'),
        name: 'GenerateMaterial',
        meta: {
          title: '生成或者编辑教材',
          noCache: true
        }
      }
    ]
  }
]
