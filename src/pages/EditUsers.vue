<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated></q-header>

    <q-page-container>
      <q-page padding class="bg-grey-2">
        <q-card class="q-pa-md" style="max-width: 420px; margin: auto;">
          <q-card-section class="text-center">
            <div class="text-h6">Editar Usuário</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="salvarAlteracoes" class="q-gutter-md">
              <!-- Foto do usuário -->
              <div class="text-center q-pb-md">
                <q-avatar size="100px" color="grey-3" text-color="grey-8">
                  <q-icon v-if="!imagemUrl" name="person" size="52px" />
                  <img v-else :src="imagemUrl">
                </q-avatar>
                <q-file
                  v-model="imagemFile"
                  label="Alterar Foto do Usuário"
                  accept="image/*"
                  filled
                  clearable
                  @update:model-value="previewImagem"
                  class="q-mt-sm"
                />
              </div>

              <!-- Campos principais -->
              <q-input
                filled
                v-model="usuario.nome"
                label="Nome completo"
                :rules="[val => !!val || 'Informe o nome do usuário']"
              />

              <q-input
                filled
                v-model="usuario.email"
                label="E-mail"
                type="email"
                :rules="[val => /.+@.+\..+/.test(val) || 'Informe um e-mail válido']"
              />

              <q-select
                v-model="usuario.permissao"
                :options="['Usuário', 'Administrador']"
                label="Permissão"
                filled
                class="q-mt-md"
              />

              <q-input
                filled
                v-model="novaSenha"
                label="Nova Senha (opcional)"
                type="password"
              />

              <!-- Botões -->
              <div class="flex justify-end q-mt-md">
                <q-btn label="Cancelar" type="button" class="btn-cancelar q-mr-md" @click="onCancel" />
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
import { useRoute, useRouter } from 'vue-router'
import { database } from '../firebase/firebase'
import { ref as dbRef, get, update } from 'firebase/database'
import { getAuth, updatePassword, updateEmail } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const usuario = ref({ nome: '', email: '', permissao: '', avatarBase64: '' })
const novaSenha = ref('')
const imagemFile = ref(null)
const imagemUrl = ref(null)
const auth = getAuth()

// 🔹 Converte o arquivo em Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// 🔹 Mostra a imagem antes de salvar
const previewImagem = async (file) => {
  imagemUrl.value = file ? await fileToBase64(file) : usuario.value.avatarBase64
}

// 🔹 Carrega os dados do usuário selecionado
onMounted(async () => {
  const id = route.query.id
  if (!id) return

  const userRef = dbRef(database, 'users/' + id)
  const snapshot = await get(userRef)

  if (snapshot.exists()) {
    usuario.value = snapshot.val()
    imagemUrl.value = usuario.value.avatarBase64 || null
  } else {
    alert('Usuário não encontrado!')
    router.push('/usuarios')
  }
})

// 🔹 Salva as alterações no Firebase
const salvarAlteracoes = async () => {
  const id = route.query.id
  if (!id) return

  try {
    const base64Imagem = imagemFile.value
      ? await fileToBase64(imagemFile.value)
      : usuario.value.avatarBase64 || null

    // Atualiza dados
    await update(dbRef(database, 'users/' + id), {
      nome: usuario.value.nome,
      email: usuario.value.email,
      permissao: usuario.value.permissao,
      avatarBase64: base64Imagem,
      updatedAt: new Date().toISOString()
    })

    // Atualiza Auth se for o usuário atual
    const currentUser = auth.currentUser
    if (currentUser && currentUser.uid === id) {
      if (usuario.value.email !== currentUser.email) {
        await updateEmail(currentUser, usuario.value.email)
      }
      if (novaSenha.value) {
        await updatePassword(currentUser, novaSenha.value)
      }
    }

    alert('Usuário atualizado com sucesso!')
    router.push('/usuarios')
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err)
    alert('Erro ao atualizar: ' + err.message)
  }
}

const onCancel = () => router.push('/usuarios')
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
