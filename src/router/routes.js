import LayoutAuth from "src/layouts/LayoutAuth.vue";
import LayoutDefoult from "src/layouts/LayoutDefoult.vue";
import MainLayout from "src/layouts/MainLayout.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import('pages/login/Login.vue'),
    meta: {layout: LayoutAuth}
  },

  {
    path: "/sidebar",
    name: "Sidebar",
    component: () => import('components/SidebarMenu.vue'),
    meta: {layout: MainLayout}
  },
  {
    path: "/teste",
    name: "TestePage",
    component: () => import('pages/PageTeste1.vue'),
    meta:{layout: LayoutDefoult}
  }
]

export default routes
