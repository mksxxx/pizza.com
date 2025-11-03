<template>
  <q-layout view="lHh Lpr lFf" container style="height: 100vh" class="shadow-2">

    <!-- Cabeçalho -->
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-green'">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Pizza.com</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer / Sliderbar -->
    <q-drawer v-model="drawer" show-if-above :width="250" :breakpoint="400">

      <!-- Avatar / imagem do usuário -->
      <q-img class="absolute-top"
          src="https://cdn.awsli.com.br/2500x2500/549/549871/produto/29153219/55743cf91c.jpg"
          style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center">
          <!-- AVATAR (Puxando avatarData) -->
          <q-avatar size="56px" class="q-mb-sm bg-white">
            <!-- Usa avatarBase64 ou a imagem de placeholder -->
            <img :src="avatarData.avatarBase64 || 'https://i.pinimg.com/1200x/24/15/e8/2415e8ae5eff3d019229acc00c035338.jpg'">
          </q-avatar>
          
          <!-- NOME (Puxando avatarData.nome) -->
          <div class="text-weight-bold">{{ avatarData.nome || 'Carregando...' }}</div>
          
          <!-- EMAIL (Puxando avatarData.email) -->
          <div class="infouser">
            <span>{{ avatarData.email || 'carregando@email.com' }}</span>
          </div>
        </div>
      </q-img>
      
      <!-- Área de scroll do menu -->
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item to="/dashboard" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Início</q-item-section>
          </q-item>

          <q-expansion-item expand-separator icon="add_circle" label="Cadastros">
            <q-item to="/cadastro" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="person_add" />
              </q-item-section>
              <q-item-section>Usuários</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="shopping_cart" />
              </q-item-section>
              <q-item-section>Produtos</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>Clientes</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>

           <q-item to="/pedidos" clickable v-ripple>
            
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <q-item-section>Pedidos</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Sair</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      
    </q-drawer>

    <!-- Container de páginas -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue' // Adicionado onMounted
import { auth, database } from '../firebase/firebase'; 
import { useUserStore } from '../stores/userStore.js'
import { useRouter } from 'vue-router'
import { onValue, ref as dbRef } from 'firebase/database'; // Importação do Realtime DB
import { onAuthStateChanged } from 'firebase/auth'; // Importação do Auth

const userStore = useUserStore()
const router = useRouter()
const drawer = ref(false)

// 2. Variável reativa para armazenar os dados do usuário (Nome, Email, Avatar)
const avatarData = ref({
  nome: null,
  email: null,
  avatarBase64: null,
});

// 🔹 Lógica de inicialização do Auth e busca de dados
onMounted(() => {
  // 3. Verifica o estado da autenticação ao montar o componente
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Atualiza o store se necessário (boa prática)
      userStore.user = { uid: user.uid, email: user.email }; 
      
      // Busca os dados do Realtime DB
      fetchUserData(user.uid);
    } else {
      // Se deslogar, limpa os dados e redireciona (a lógica já está no onBeforeMount, mas reafirmo)
      userStore.user = null;
      router.replace('/'); 
    }
  });
});

// 4. Função para buscar os dados do usuário logado no Realtime DB
const fetchUserData = (userId) => {
  const userRef = dbRef(database, 'users/' + userId);

  // Escuta alterações em tempo real
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      avatarData.value = {
        nome: data.nome,
        email: data.email,
        avatarBase64: data.avatarBase64,
      };
    } else {
      console.warn("Nenhum dado de perfil encontrado no Realtime DB.");
      // Usa dados disponíveis do Auth como fallback
      avatarData.value.email = auth.currentUser?.email;
      avatarData.value.nome = auth.currentUser?.displayName;
    }
  }, (error) => {
    console.error("Erro ao buscar dados do Firebase Realtime DB:", error);
  });
};

onBeforeMount(() => {
    if (!userStore.user) {
        router.replace('/')
    }
})

// 🔹 Função de logout
function handleLogout() {
    userStore.logout()
    router.push('/')
}
</script>

<style scoped>
:deep(.q-header.bg-green) {
    background-color: #00532e !important;
}
/* Estilo para garantir que o texto do nome e email seja legível sobre a imagem (opcional) */
.text-weight-bold, .infouser span {
  text-shadow: 0px 0px 5px #000;
}
/* Para garantir que a imagem do avatar preencha o círculo */
.q-drawer :deep(.q-avatar img) {
  object-fit: cover;
}
</style>
