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
    path: "/usuarios",
    name: "UsuariosPage",
    component: () => import('src/pages/ListUsers.vue'),
    meta:{layout: LayoutDefoult}
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
  },
  {
    path:"/produtos",
    name:"ProdutosPage",
    component: () => import('src/pages/ListProduct.vue'),
    meta:{layout: LayoutDefoult}
  },
  {
    path:"/cadastro-produtos",
    name:"CadastroProdutosPage",
    component: () => import('src/pages/RegisterProduct.vue'),
    meta:{layout: LayoutDefoult}
  }
  

]

export default routes