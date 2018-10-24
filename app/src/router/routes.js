
const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'dashboard', path: '', component: () => import('pages/Dashboard.vue') },
      { name: 'settings', path: 'settings', component: () => import('pages/Settings.vue') },
      { name: 'debug', path: 'debug', component: () => import('pages/Debug.vue') },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
