import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'Home | LotteryApp', layout: 'default' } },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: 'About | LotteryApp', layout: 'default' } },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { title: 'Login | LotteryApp', layout: 'auth' } },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { title: 'Users | LotteryApp', layout: 'default', requiresAuth: true },
      children: [
        { path: ':id', name: 'user-detail', component: () => import('../views/UserDetailView.vue'), props: true, meta: { title: 'Details | LotteryApp', requiresAuth: true } },
        { path: ':id/edit', name: 'user-edit', component: () => import('../views/UserEditView.vue'), props: true, meta: { title: 'Edit | LotteryApp', requiresAuth: true } },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: '404 | LotteryApp', layout: 'default' } },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'users' };
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'LotteryApp';
});

export default router;
