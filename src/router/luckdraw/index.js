import Layout from '@/layout'
export default [
  {
    path: '/luckdrawinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/luckdrawgoods/:prizeId',
        component: () => import('@/views/luckdraw/PrizeGoodsInfo.vue'),
        name: 'PrizeGoodsInfo',
        meta: {
          title: '奖品信息',
          noCache: true
        }
      }
    ]
  }
]
