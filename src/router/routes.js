import LayoutAuth from "src/layouts/LayoutAuth.vue";
import MainLayout from "src/layouts/MainLayout.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import('pages/Login.vue'),
    meta: {layout: LayoutAuth}
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import('pages/DashBoardPage.vue'),
    meta: {layout: MainLayout}
  },
  {
    path: "/teste",
    name: "TestePage",
    component: () => import('pages/TestePage.vue'),
    meta:{layout: MainLayout}
  }
]

export default routes
