<template>
  <q-page class="bg-grey-1">
    <!-- Barra de busca -->
    <q-toolbar class="bg-white q-pa-sm shadow-1">
      <q-input
        filled
        v-model="filtro"
        label="Buscar Cliente"
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>

    <!-- Lista de clientes -->
    <q-list bordered separator>
      <q-item
        v-for="cliente in clientesFiltrados"
        :key="cliente.id"
        clickable
        v-ripple
         @click="editarCliente(cliente)"
      >
        <!-- Avatar do cliente -->
        <q-item-section avatar>
          <q-avatar size="48px">
            <img
              v-if="cliente.imagemBase64"
              :src="cliente.imagemBase64"
              alt="Foto do cliente"
            />
            <q-icon
              v-else
              name="person"
              color="green-10"
              size="32px"
            />
          </q-avatar>
        </q-item-section>

        <!-- Dados do cliente -->
        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ cliente.nome }}
          </q-item-label>
          <q-item-label caption>
            📞 {{ cliente.telefone || 'Sem telefone' }} — ✉️ {{ cliente.email || 'Sem e-mail' }}
          </q-item-label>
        </q-item-section>

        <!-- Botões -->
      <q-item-section side>
    <q-icon name="chevron_right" color="grey-7" />
  </q-item-section>
</q-item>

      <!-- Caso não haja clientes -->
      <div v-if="clientesFiltrados.length === 0" class="text-center q-pa-lg text-grey">
        Nenhum cliente encontrado.
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
import { ref as dbRef, onValue, /*remove*/ } from 'firebase/database'

const router = useRouter()
const clientes = ref([])
const filtro = ref('')

// 🔹 Carrega os clientes do Firebase
onMounted(() => {
  const clientesRef = dbRef(database, 'clients')
  onValue(clientesRef, (snapshot) => {
    const data = snapshot.val()
    clientes.value = data
      ? Object.keys(data).map(id => ({ id, ...data[id] }))
      : []
  })
})

// 🔹 Filtro de busca
const clientesFiltrados = computed(() => {
  const texto = filtro.value.trim().toLowerCase()
  if (!texto) return clientes.value

  return clientes.value.filter(
    (c) =>
      c.nome?.toLowerCase().includes(texto) ||
      c.email?.toLowerCase().includes(texto) ||
      c.telefone?.toLowerCase().includes(texto)
  )
})

// 🔹 Ações
const irParaCadastro = () => router.push('/cadastro-clientes')

const editarCliente = (cliente) => {
  router.push({ path: '/editar-clientes', query: { id: cliente.id } })
}
/*
const removerCliente = async (cliente) => {
  if (confirm(`Deseja remover o cliente "${cliente.nome}"?`)) {
    await remove(dbRef(database, 'clients/' + cliente.id))
    alert('Cliente removido com sucesso!')
  }
}
  */
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

/* Garante que a imagem do avatar preencha o círculo */
:deep(.q-avatar img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
