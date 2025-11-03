import LayoutAuth from "src/layouts/LayoutAuth.vue";
import LayoutDefoult from "src/layouts/LayoutDefoult.vue";

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
    meta: {layout: LayoutDefoult}
  },
  {
    path: "/cadastro",
    name: "CadastroPage",
    component: () => import('src/pages/RegisterUser.vue'),
    meta:{layout: LayoutDefoult}
  },
  {
    path: "/pedidos",
    name: "PedidosPage",
    component: () => import('src/pages/PrintPedido.vue'),
    meta:{layout: LayoutDefoult}
  }
]

export default routes