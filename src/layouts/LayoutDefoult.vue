<template>
  <q-layout view="lHh Lpr lFf" container style="height: 100vh" class="shadow-2">

    <!-- Cabeçalho -->
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-green'">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Pizza.com</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer / Sidebar -->
    <q-drawer v-model="drawer" show-if-above :width="250" :breakpoint="400">

      <!-- Avatar / imagem do usuário -->
      <q-img class="absolute-top"
        src="https://cdn.awsli.com.br/2500x2500/549/549871/produto/29153219/55743cf91c.jpg"
        style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center">
          <q-avatar size="56px" class="q-mb-sm bg-white">
            <img :src="avatarData.avatarBase64">
          </q-avatar>
          
          <div class="text-weight-bold">{{ avatarData.nome || 'Carregando...' }}</div>
          <div class="infouser">
            <span>{{ avatarData.email || 'carregando@email.com' }}</span>
          </div>
        </div>
      </q-img>
      
      <!-- Menu lateral -->
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item to="/dashboard" clickable v-ripple>
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Início</q-item-section>
          </q-item>

          <!-- 🔒 Só aparece se for Administrador -->
          <q-expansion-item
            v-if="avatarData.permissao === 'Administrador'"
            expand-separator
            icon="add_circle"
            label="Cadastros"
          >
            <q-item to="/usuarios" clickable v-ripple>
              <q-item-section avatar><q-icon name="person_add" /></q-item-section>
              <q-item-section>Usuários</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
              <q-item-section>Produtos</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar><q-icon name="people" /></q-item-section>
              <q-item-section>Clientes</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item clickable v-ripple>
            <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>

          <q-item to="/pedidos" clickable v-ripple>
            <q-item-section avatar><q-icon name="drafts" /></q-item-section>
            <q-item-section>Pedidos</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="handleLogout">
            <q-item-section avatar><q-icon name="logout" /></q-item-section>
            <q-item-section>Sair</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { auth, database } from '../firebase/firebase'
import { useRouter } from 'vue-router'
import { onValue, ref as dbRef } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '../stores/userStore.js'

const userStore = useUserStore()
const router = useRouter()
const drawer = ref(false)

// 🔹 Dados do usuário logado
const avatarData = ref({
  nome: null,
  email: null,
  avatarBase64: null,
  permissao: null, // 👈 Adicionado
})

// 🔹 Verifica login e busca os dados do usuário
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userStore.user = { uid: user.uid, email: user.email }
      fetchUserData(user.uid)
    } else {
      userStore.user = null
      router.replace('/')
    }
  })
})

// 🔹 Busca dados no Firebase Realtime Database
const fetchUserData = (userId) => {
  const userRef = dbRef(database, 'users/' + userId)

  onValue(
    userRef,
    (snapshot) => {
      const data = snapshot.val()
      if (data) {
        avatarData.value = {
          nome: data.nome,
          email: data.email,
          avatarBase64: data.avatarBase64,
          permissao: data.permissao || 'Usuário', // 👈 Pega a permissão
        }
      } else {
        console.warn('Nenhum dado de perfil encontrado no Realtime DB.')
        avatarData.value.email = auth.currentUser?.email
        avatarData.value.nome = auth.currentUser?.displayName
        avatarData.value.permissao = 'Usuário'
      }
    },
    (error) => {
      console.error('Erro ao buscar dados do Firebase Realtime DB:', error)
    }
  )
}

onBeforeMount(() => {
  if (!userStore.user) {
    router.replace('/')
  }
})

// 🔹 Logout
function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>

:deep(.q-header.bg-green) {
  background-color: #00532e !important;
}

/* ---------- BLOCO DE PERFIL ---------- */
.perfil-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #004d2a, #008b56);
  padding: 25px 15px;
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  margin: 10px;
  text-align: center;
}

.perfil-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
  margin-bottom: 12px;
}

.perfil-nome {
  font-size: 1.1rem;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 4px;
}

.perfil-email {
  font-size: 0.9rem;
  opacity: 0.9;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 6px;
}

.perfil-permissao {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  padding: 3px 10px;
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
}

/* ---------- AJUSTES GERAIS ---------- */
.text-weight-bold, .infouser span {
  text-shadow: 0px 0px 5px #000;
}

.q-drawer :deep(.q-avatar img) {
  object-fit: cover;
}
</style>

