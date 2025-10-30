<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Cabeçalho -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Cadastro</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Container de páginas -->
    <q-page-container>
      <q-page padding class="bg-grey-2">
        <q-card class="q-pa-md" style="max-width: 420px; margin: auto;">
          <q-card-section class="text-center">
            <div class="text-h6">Cadastro de Usuário</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="form.nome"
                label="Nome completo"
                :rules="[val => !!val || 'Informe o nome']"
              />
              <q-input
                filled
                v-model="form.email"
                type="email"
                label="E-mail"
                :rules="[val => !!val || 'Informe o e-mail']"
              />
              <q-input
                filled
                v-model="form.senha"
                type="password"
                label="Senha"
                :rules="[val => val && val.length >= 6 || 'Mínimo de 6 caracteres']"
              />

              <div class="flex justify-end q-mt-md">
                <q-btn label="Cadastrar" color="primary" type="submit" />
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
import { auth } from '../firebase/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const router = useRouter() // podemos usar para redirecionar depois

const form = ref({
  nome: '',
  email: '',
  senha: ''
})

const onSubmit = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, form.value.email, form.value.senha)
    const user = cred.user

    await updateProfile(user, { displayName: form.value.nome })

    alert('Usuário cadastrado com sucesso!')
    console.log('Usuário criado:', user)

    // Redireciona para dashboard
    router.push('/dashboard')
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err)
    alert('Erro ao cadastrar: ' + err.message)
  }
}
</script>
