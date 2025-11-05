<template>
  <q-page class="bg-grey-1">
    <!-- Barra de busca -->
    <q-toolbar class="bg-white q-pa-sm shadow-1">
      <q-input
        filled
        v-model="filtro"
        label="Buscar Produto"
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>

    <!-- Lista de produtos -->
    <q-list bordered separator>
      <q-item
        v-for="produto in produtosFiltrados"
        :key="produto.id"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar>
            <img
              :src="produto.imagemBase64 || defaultImg"
              alt="Imagem do produto"
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ produto.nome }}
          </q-item-label>
          <q-item-label caption>
            R$ {{ produto.preco?.toFixed(2) || '0,00' }} — Estoque: {{ produto.estoque || 0 }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn flat dense icon="edit" color="primary" @click.stop="editarProduto(produto)" />
          <q-btn flat dense icon="delete" color="negative" @click.stop="removerProduto(produto)" />
        </q-item-section>
      </q-item>

      <!-- Caso não haja produtos -->
      <div v-if="produtosFiltrados.length === 0" class="text-center q-pa-lg text-grey">
        Nenhum produto encontrado.
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
import { ref as dbRef, onValue, remove } from 'firebase/database'

const router = useRouter()
const produtos = ref([])
const filtro = ref('')
const defaultImg = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png'

// 🔹 Busca todos os produtos do Firebase
onMounted(() => {
  const produtosRef = dbRef(database, 'products')
  onValue(produtosRef, (snapshot) => {
    const data = snapshot.val()
    produtos.value = data
      ? Object.keys(data).map(id => ({ id, ...data[id] }))
      : []
  })
})

// 🔹 Filtro de produtos
const produtosFiltrados = computed(() => {
  const texto = filtro.value.trim().toLowerCase()
  if (!texto) return produtos.value

  return produtos.value.filter(
    (p) =>
      p.nome?.toLowerCase().includes(texto) ||
      p.preco?.toString().includes(texto)
  )
})

// 🔹 Botões de ação
const irParaCadastro = () => router.push('/cadastro-produtos')

const editarProduto = (produto) => {
  router.push({ path: '/editar-produto', query: { id: produto.id } })
}

const removerProduto = async (produto) => {
  if (confirm(`Deseja remover o produto "${produto.nome}"?`)) {
    await remove(dbRef(database, 'products/' + produto.id))
    alert('Produto removido com sucesso!')
  }
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

