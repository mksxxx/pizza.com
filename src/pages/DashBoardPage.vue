<script setup>
import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '../stores/userStore.js'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const drawer = ref(false)


onBeforeMount(() => {
    if (!userStore.user) {
        router.replace('/')
    }
})

// 🔹 Função de logout
function handleLogout() {
    userStore.logout()
    router.push('/')
}
</script>

<template>
    <div>
        <q-layout view="lHh Lpr lff" container style="height: 100vh" class="shadow-2">
            <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-green'">
                <q-toolbar>
                    <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
                    <q-toolbar-title>Pizza.com</q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-drawer v-model="drawer" show-if-above :width="250" :breakpoint="400">
                <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
                    <q-list padding>
                        <q-item to="/dashboard" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="home" />
                            </q-item-section>
                            <q-item-section>Início</q-item-section>
                        </q-item>

                        <q-expansion-item expand-separator icon="add_circle" label="Cadastros"> 
                            <q-item to="/teste" clickablev-ripple>
                                <q-item-section avatar>
                                    <q-icon name="person_add" />
                                </q-item-section>
                                <q-item-section>Usuários</q-item-section>
                            </q-item>

                            <q-item clickable v-ripple>
                                <q-item-section avatar>
                                    <q-icon name="shopping_cart" />
                                </q-item-section>
                                <q-item-section>Produtos</q-item-section>
                            </q-item>

                            <q-item clickable v-ripple>
                                <q-item-section avatar>
                                    <q-icon name="people" />
                                </q-item-section>
                                <q-item-section>Clientes</q-item-section>
                            </q-item>
                        </q-expansion-item>

                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="account_circle" />
                            </q-item-section>
                            <q-item-section>Perfil</q-item-section>
                        </q-item>

                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="drafts" />
                            </q-item-section>
                            <q-item-section>Pedidos</q-item-section>
                        </q-item>

                        <q-item clickable v-ripple @click="handleLogout">
                            <q-item-section avatar>
                                <q-icon name="logout" />
                            </q-item-section>
                            <q-item-section>Sair</q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>

                <q-img class="absolute-top"
                    src="https://cdn.awsli.com.br/2500x2500/549/549871/produto/29153219/55743cf91c.jpg"
                    style="height: 150px">
                    <div class="absolute-bottom bg-transparent text-center">
                        <q-avatar size="56px" class="q-mb-sm">
                            <img src="https://i.pinimg.com/1200x/24/15/e8/2415e8ae5eff3d019229acc00c035338.jpg">
                        </q-avatar>
                        <div class="text-weight-bold">Marquinhos do mal</div>
                        <div class="infouser">
                            <span>{{ userStore.user?.email }}</span>
                        </div>
                    </div>
                </q-img>
            </q-drawer>

            <q-page-container>
                <q-page padding>
                    <p v-for="n in 5" :key="n">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Fugit nihil praesentium molestias a adipisci, dolore vitae odit,
                        quidem consequatur optio voluptates asperiores pariatur eos numquam
                        rerum delectus commodi perferendis voluptate?
                    </p>
                </q-page>
            </q-page-container>
        </q-layout>
    </div>
</template>

<style scoped>
:deep(.q-header.bg-green) {
    background-color: #00532e !important;
}

.infouser {
    font-size: 12px;
    text-align: center;
}
</style>
