import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & {
  name: string;
  children?: AppRouteRecord[];
};

type GetRouteName<T extends AppRouteRecord> = T extends {
  children: readonly AppRouteRecord[];
}
  ? T['name'] | GetRoutesNames<T['children']>
  : T['name'];
type GetRoutesNames<T extends readonly AppRouteRecord[]> = GetRouteName<T[number]>;

const routes = [
  {
    name: 'Home',
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'BooksList',
        component: () => import('@/views/BookListPage.vue'),
      },
      {
        path: 'edit/:id',
        name: 'EditBook',
        component: () => import('@/views/AddOrEditBookPage.vue'),
        props: true,
      },
      {
        path: 'add',
        name: 'AddBook',
        component: () => import('@/views/AddOrEditBookPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
  },
] as const satisfies readonly AppRouteRecord[];

type TRoutes = typeof routes;
export type TRouteNames = GetRoutesNames<TRoutes>;

/**
 * Returns typed route name.
 *
 * @param {TRouteNames} route - The route name to be returned.
 * @return {TRouteNames} The route name.
 */
export function routeTo(route: TRouteNames) {
  return route;
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
