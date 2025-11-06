<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding class="bg-grey-2">
        <q-card class="q-pa-md" style="max-width: 420px; margin: auto;">
          <!-- Cabeçalho com seta -->
                <q-card-section>
            <div class="text-h6 text-center">Editar Produto</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
              
              <!-- Avatar e imagem -->
              <div class="text-center q-pb-md">
                <q-avatar size="100px" color="grey-3" text-color="grey-8">
                  <q-icon v-if="!imagemUrl" name="shopping_bag" size="52px" />
                  <img v-else :src="imagemUrl">
                </q-avatar>

                <q-file
                  v-model="form.imagemFile"
                  label="Alterar Imagem"
                  accept="image/*"
                  filled
                  clearable
                  @update:model-value="previewImagem"
                  class="q-mt-sm"
                />
              </div>

              <!-- Campos -->
              <q-input
                filled
                v-model="form.nome"
                label="Nome do produto"
                :rules="[val => !!val || 'Informe o nome do produto']"
              />

              <q-input
                filled
                v-model.number="form.preco"
                type="number"
                label="Preço (R$)"
                :rules="[val => val > 0 || 'Informe um preço válido']"
              />

              <q-input
                filled
                v-model.number="form.estoque"
                type="number"
                label="Quantidade em estoque"
                :rules="[val => val >= 0 || 'Informe o estoque']"
              />

              <q-select
                filled
                v-model="form.categoria"
                label="Categoria"
                :options="categoriaOptions"
                :rules="[val => !!val || 'Selecione a categoria']"
              />

              <q-input
                filled
                v-model="form.descricao"
                type="textarea"
                label="Descrição"
                autogrow
              />

              <!-- Botões -->
              <div class="flex justify-end q-mt-md">
                <q-btn label="Cancelar" type="button" class="btn-cancelar q-mr-md" @click="onBack" />
                <q-btn label="Salvar Alterações" type="submit" class="btn" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { database } from '../firebase/firebase'
import { ref as dbRef, get, update } from 'firebase/database'

const router = useRouter()
const route = useRoute()
const refId = route.query.id // recebido pela rota: /editar-produto?id=xxxx

const categoriaOptions = ['Bebidas', 'Lanches', 'Sobremesas', 'Outros']

const form = ref({
  nome: '',
  preco: null,
  estoque: 0,
  categoria: null,
  descricao: '',
  imagemFile: null
})

const imagemUrl = ref(null)
const produtoKey = ref(null)

// Converter arquivo em Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

// Mostra a imagem ao selecionar
const previewImagem = async (file) => {
  imagemUrl.value = file ? await fileToBase64(file) : null
}

// Carrega o produto pelo refId
const carregarProduto = async () => {
  try {
    const snapshot = await get(dbRef(database, 'products'))
    if (snapshot.exists()) {
      const produtos = snapshot.val()
      const encontrado = Object.entries(produtos).find(
        ([, p]) => p.refId === refId
      )

      if (encontrado) {
        const [key, data] = encontrado
        produtoKey.value = key
        form.value = {
          nome: data.nome,
          preco: data.preco,
          estoque: data.estoque,
          categoria: data.categoria,
          descricao: data.descricao,
          imagemFile: null
        }
        imagemUrl.value = data.imagemBase64 || null
      } else {
        alert('Produto não encontrado.')
        router.push('/dashboard')
      }
    } else {
      alert('Nenhum produto encontrado.')
    }
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
    alert('Erro ao carregar produto.')
  }
}

onMounted(carregarProduto)

// Atualiza os dados no Firebase
const onSubmit = async () => {
  try {
    if (!produtoKey.value) {
      alert('Produto não encontrado.')
      return
    }

    const { nome, preco, estoque, categoria, descricao, imagemFile } = form.value
    const base64Imagem = imagemFile ? await fileToBase64(imagemFile) : imagemUrl.value

    const produtoData = {
      refId,
      nome,
      preco,
      estoque,
      categoria,
      descricao,
      imagemBase64: base64Imagem,
      updatedAt: new Date().toISOString()
    }

    await update(dbRef(database, `products/${produtoKey.value}`), produtoData)

    alert(`Produto "${nome}" atualizado com sucesso!`)
    router.push('/dashboard')
  } catch (err) {
    console.error('Erro ao atualizar produto:', err)
    alert('Erro ao atualizar: ' + err.message)
  }
}

const onBack = () => {
  router.go(-1)
}
</script>

<style scoped>
:deep(.q-field--filled .q-field__control) {
  background-color: #FFFFFF !important;
}
:deep(.q-field--filled .q-field__control::after) {
  background: #00532e !important;
}
:deep(.q-field--float .q-field__label) {
  color: #00532e !important;
}
.q-field--filled.q-field--error .q-field__control {
  background-color: #FFFFFF !important;
}
:deep(.q-field__native) {
  caret-color: #00532e !important;
}
.btn {
  background-color: #00532e;
  color: white;
}
.btn-cancelar {
  background-color: white;
  color: #00532e;
  border: 1px solid #00532e;
}
:deep(.q-avatar img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
