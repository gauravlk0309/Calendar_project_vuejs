
const routes = [
  {
    path: '/',
    component: () => import('layouts/BasicLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('components/Login.vue'),
        meta: {
          checkRedirect: true
        }
      },
      {
        path: '/login',
        name:'login',
        component: () => import('components/Login.vue')
      }
    ]
  },
  {
    path: '/theHub',
    component: () => import('layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'landingPage',
        component: () => import('components/LandingPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/nucleus',
        name: 'viewCommunicationDashboard',
        meta: {
          requiresAuth: true
        },
        component: () => import('src/nucleus/ViewCommunicationDashboard.vue')
      },
      {
        path: '/monthview',
        name: 'eventMonthView',
        meta: {
          requiresAuth: true
        },
        component: () => import('src/nucleus/EventMonthView.vue')
      },
      {
        path: '/dayview',
        name: 'eventDayView',
        meta: {
          requiresAuth: true
        },
        component: () => import('src/nucleus/EventDayView.vue')
      },
      {
        path: '/fileconverter',
        name: 'fileConverter',
        meta: {
          requiresAuth: true
        },
        component: () => import('src/nucleus/FileConverter.vue')
      },
      {
        path: '/weekview',
        name: 'eventWeekView',
        meta: {
          requiresAuth: true
        },
        component: () => import('src/nucleus/EventWeekView.vue')
      },
      {
        path: '/navigationbar',
        name: 'navigationBar',
        meta: {
          requiresAuth: true
        },
        component: () => import('src/pages/NavigationBar.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  })
}

export default routes
