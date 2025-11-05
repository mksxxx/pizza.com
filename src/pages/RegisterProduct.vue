<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
    </q-header>

    <q-page-container>
      <q-page padding class="bg-grey-2">
        <q-card class="q-pa-md" style="max-width: 420px; margin: auto;">
          <q-card-section class="text-center">
            <div class="text-h6">Cadastro de Produto</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit" class="q-gutter-md">

              <div class="text-center q-pb-md">
                <q-avatar size="100px" color="grey-3" text-color="grey-8">
                  <q-icon v-if="!imagemUrl" name="shopping_bag" size="52px" />
                  <img v-else :src="imagemUrl">
                </q-avatar>
                <q-file
                  v-model="form.imagemFile"
                  label="Selecionar Imagem do Produto"
                  accept="image/*"
                  filled
                  clearable
                  @update:model-value="previewImagem"
                  class="q-mt-sm"
                />
              </div>

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

              <div class="flex justify-end q-mt-md">
                <q-btn label="Cancelar" type="button" class="btn-cancelar q-mr-md" @click="onCancel" />
                <q-btn label="Cadastrar" type="submit" class="btn" />
              </div>

            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { database } from '../firebase/firebase'
import { ref as dbRef, push } from 'firebase/database'

const router = useRouter()

const categoriaOptions = [
  'Bebidas',
  'Lanches',
  'Sobremesas',
  'Outros'
]

const form = ref({
  nome: '',
  preco: null,
  estoque: 0,
  categoria: null,
  descricao: '',
  imagemFile: null
})

const imagemUrl = ref(null)

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null)
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const previewImagem = async (file) => {
  imagemUrl.value = file ? await fileToBase64(file) : null
}

const onSubmit = async () => {
  try {
    const { nome, preco, estoque, categoria, descricao, imagemFile } = form.value
    const base64Imagem = imagemFile ? await fileToBase64(imagemFile) : null

    const produtoData = {
      nome,
      preco,
      estoque,
      categoria,
      descricao,
      imagemBase64: base64Imagem,
      createdAt: new Date().toISOString()
    }

    // salva no Firebase
    await push(dbRef(database, 'products'), produtoData)

    alert(`Produto ${nome} cadastrado com sucesso!`)
    router.push('/dashboard')
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err)
    alert('Erro ao cadastrar: ' + err.message)
  }
}

const onCancel = () => {
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
