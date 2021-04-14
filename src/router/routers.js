import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/manager',
    name: '用户管理',
    component: Main,
    meta: {
      hide: true
    },
    children: [
      {
        path: 'manager',
        name: '用户管理',
        meta: {
          icon: 'md-person',
          title: '用户管理'
        },
        component: () => import('@/myView/manager/manager.vue')
      }
    ]
  },
  {
    path: '/article',
    name: '文章管理',
    component: Main,
    meta: {
      hide: true
      //access: ['teacher']
    },
    children: [
      {
        path: 'article',
        name: '文章管理',
        meta: {
          icon: 'md-easel',
          title: '文章管理'
        },
        component: () => import('@/myView/article/article.vue')
      }
    ]
  },

  {
      path: '/comment',
      name: '评论管理',
      component: Main,
      meta: {
        hide: true
        //access: ['teacher']
      },
      children: [
        {
          path: 'comment',
          name: '评论管理',
          meta: {
            icon: 'ios-notifications-outline',
            title: '评论管理'
          },
          component: () => import('@/myView/comment/comment.vue')
        }
      ]
    },
  {
    path: '/category',
    name: '分类管理',
    component: Main,
    meta: {
      hide: true
      //access: ['teacher']
    },
    children: [
      {
        path: 'category',
        name: '分类管理',
        meta: {
          icon: 'md-cloud-upload',
          title: '分类管理'
        },
        component: () => import('@/myView/article/category.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `动态路由-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `带参路由-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
