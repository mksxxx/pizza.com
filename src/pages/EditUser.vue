<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md" style="max-width: 420px; margin: auto;">
      <q-card-section>
        <div class="text-h6 text-center">Editar Meu Perfil</div>
      </q-card-section>

      <q-card-section>
        <!-- Avatar -->
        <div class="text-center q-mb-md">
          <q-avatar size="100px" color="grey-3" text-color="grey-8">
            <q-icon v-if="!imagemUrl" name="person" size="52px" />
            <img v-else :src="imagemUrl" alt="Avatar do usuário" />
          </q-avatar>

          <q-file
            v-model="imagemFile"
            label="Alterar Foto"
            accept="image/*"
            filled
            clearable
            class="q-mt-sm"
            @update:model-value="previewImagem"
          />
        </div>

        <!-- Campos -->
        <q-input
          v-model="usuario.nome"
          label="Nome"
          filled
          :rules="[val => !!val || 'Informe o nome do usuário']"
        />

        <q-input
          v-model="usuario.email"
          label="E-mail"
          type="email"
          filled
          class="q-mt-md"
          :rules="[val => /.+@.+\..+/.test(val) || 'Informe um e-mail válido']"
        />

        <q-input
          v-model="novaSenha"
          label="Nova Senha (opcional)"
          type="password"
          filled
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancelar" color="white" text-color="#00532e" @click="onCancel" />
        <q-btn label="Salvar" class="btn" @click="salvarAlteracoes" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { database } from '../firebase/firebase'
import { ref as dbRef, get, update } from 'firebase/database'
import { getAuth, updatePassword, updateEmail } from 'firebase/auth'

const router = useRouter()
const usuario = ref({ nome: '', email: '', avatarBase64: '' })
const novaSenha = ref('')
const imagemFile = ref(null)
const imagemUrl = ref(null)
const auth = getAuth()

// 🔹 Converte arquivo em Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// 🔹 Mostra imagem antes de salvar
const previewImagem = async (file) => {
  imagemUrl.value = file ? await fileToBase64(file) : usuario.value.avatarBase64
}

// 🔹 Carrega os dados do usuário logado
onMounted(async () => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    alert('Nenhum usuário logado!')
    router.push('/login')
    return
  }

  const userRef = dbRef(database, 'users/' + currentUser.uid)
  const snapshot = await get(userRef)

  if (snapshot.exists()) {
    usuario.value = snapshot.val()
    imagemUrl.value = usuario.value.avatarBase64 || null
  } else {
    alert('Usuário não encontrado no banco!')
  }
})

// 🔹 Salva as alterações no Firebase
const salvarAlteracoes = async () => {
  const currentUser = auth.currentUser
  if (!currentUser) return

  try {
    const base64Imagem = imagemFile.value
      ? await fileToBase64(imagemFile.value)
      : usuario.value.avatarBase64 || null

    // Atualiza no banco de dados
    await update(dbRef(database, 'users/' + currentUser.uid), {
      nome: usuario.value.nome,
      email: usuario.value.email,
      avatarBase64: base64Imagem
    })

    // Atualiza no Auth
    if (usuario.value.email !== currentUser.email) {
      await updateEmail(currentUser, usuario.value.email)
    }
    if (novaSenha.value) {
      await updatePassword(currentUser, novaSenha.value)
    }

    alert('Perfil atualizado com sucesso!')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Erro ao atualizar usuário: ' + err.message)
  }
}

const onCancel = () => router.push('/dashboard')
</script>

<style scoped>
.q-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.btn {
  background-color: #00532e;
  color: white;
}
</style>
