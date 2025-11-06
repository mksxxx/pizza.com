<template>
  <q-page class="bg-grey-1">
    <!-- Barra de busca -->
    <q-toolbar class="bg-white q-pa-sm shadow-1">
      <q-input filled v-model="filtro" label="Buscar Usuário" dense clearable>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>

    <!-- Lista de usuários -->
      <q-list bordered separator>
    <q-item v-for="user in usuariosFiltrados" :key="user.uid" clickable v-ripple @click="editarUsuario(user)">
      <q-item-section avatar>
        <q-avatar>
          <img :src="user.avatarBase64 || 'https://cdn.quasar.dev/img/avatar.png'" alt="Avatar" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-medium">{{ user.nome }}</q-item-label>
        <q-item-label caption>{{ user.email }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>

    <!-- Caso não haja usuários -->
    <div v-if="usuariosFiltrados.length === 0" class="text-center q-pa-lg text-grey">
      Nenhum usuário encontrado.
    </div>
    </q-list>

    <!-- Botão flutuante -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round class="btncustom" icon="add" @click="irParaCadastro" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { database } from '../firebase/firebase'
import { ref as dbRef, onValue } from 'firebase/database'

const router = useRouter()
const usuarios = ref([])
const filtro = ref('')

// 🔹 Busca todos os usuários do Firebase
onMounted(() => {
  const usersRef = dbRef(database, 'users')

  onValue(
    usersRef,
    (snapshot) => {
      const data = snapshot.val()
      if (data) {

        usuarios.value = Object.entries(data).map(([uid, user]) => ({
          uid,
          nome: user.nome || 'Sem nome',
          email: user.email || 'Sem email',
          avatarBase64: user.avatarBase64 || '',
          permissao: user.permissao || 'Usuário'
        }))
      } else {
        usuarios.value = []
      }
    },
    (error) => {
      console.error('Erro ao buscar usuários:', error)
    }
  )
})

// 🔹 Filtro por nome ou email
const usuariosFiltrados = computed(() => {
  const texto = filtro.value.trim().toLowerCase()

  // Se o campo de busca estiver vazio, retorna todos
  if (!texto) {
    return usuarios.value
  }

  // Caso contrário, filtra normalmente
  return usuarios.value.filter(
    (u) =>
      u.nome?.toLowerCase().includes(texto) ||
      u.email?.toLowerCase().includes(texto)
  )
})

// 🔹 Botão que redireciona para a tela de cadastro
const irParaCadastro = () => {
  router.push('/cadastro')
}

const editarUsuario = (user) => {
  router.push({ path: '/editar-usuarios', query: { id: user.uid } })
}
</script>

<style scoped>
.q-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

.q-item {
  transition: background-color 0.2s ease;
}

.q-item:hover {
  background-color: #f5f5f5;
}

.btncustom {
  background-color: #00532e;
  border-radius: 30px;
}
</style>
