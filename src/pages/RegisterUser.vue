<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>

    </q-header>

    <q-page-container>
      <q-page padding class="bg-grey-2">
        <q-card class="q-pa-md" style="max-width: 420px; margin: auto;">
          <q-card-section class="text-center">
            <div class="text-h6">Cadastro de Usuário</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit" class="q-gutter-md">


              <div class="text-center q-pb-md">

                <q-avatar size="100px" color="grey-3" text-color="grey-8">


                  <q-icon v-if="!avatarUrl" name="person" size="52px" />


                  <img v-else :src="avatarUrl">

                </q-avatar>
                <q-file v-model="form.avatarFile" label="Selecionar Foto de Perfil" accept="image/*" filled clearable
                  @update:model-value="previewAvatar" class="q-mt-sm" />
              </div>


              <q-input filled v-model="form.nome" label="Nome completo" :rules="[val => !!val || 'Informe o nome']" />
              <q-input filled v-model="form.email" type="email" label="E-mail"
                :rules="[val => !!val || 'Informe o e-mail']" />
              <q-input filled v-model="form.senha" type="password" label="Senha"
                :rules="[val => val && val.length >= 6 || 'Mínimo de 6 caracteres']" />


              <q-select filled v-model="form.permissao" label="Nível de Permissão" :options="permissionOptions"
                :rules="[val => !!val || 'Selecione o nível de permissão']" />

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

import { auth, database } from '../firebase/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'

const router = useRouter()

const permissionOptions = [
  'Administrador',
  'Usuário Básico'
]

const form = ref({
  nome: '',
  email: '',
  senha: '',
  permissao: null,
  avatarFile: null
})

const avatarUrl = ref(null)


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};


const previewAvatar = async (file) => {
  if (file) {
    avatarUrl.value = await fileToBase64(file);
  } else {
    avatarUrl.value = null;
  }
}


const onSubmit = async () => {
  let base64String = null;
  const { nome, email, senha, permissao, avatarFile } = form.value;

  try {

    if (avatarFile) {
      base64String = await fileToBase64(avatarFile);
    }


    const cred = await createUserWithEmailAndPassword(auth, email, senha)
    const user = cred.user


    await updateProfile(user, {
      displayName: nome
    })


    const userData = {
      uid: user.uid,
      nome: nome,
      email: email,
      permissao: permissao,
      avatarBase64: base64String || null,
      createdAt: new Date().toISOString()
    };


    await set(dbRef(database, 'users/' + user.uid), userData);

    alert(`Usuário ${nome} (${permissao}) cadastrado com sucesso!`);
    router.push('/dashboard')

  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err)
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