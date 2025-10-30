<template>
    <div>
        <q-layout view="lHh Lpr lff" container style="height: 100vh" class="shadow-2">
            <!-- <q-header elevated class="bg-cyan-8">
        <q-toolbar>
          <q-toolbar-title>Pizza.com</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />-->
            <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-green'">
                <q-toolbar>
                    <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
                    <q-toolbar-title>Pizza.com</q-toolbar-title>
                </q-toolbar>
            </q-header>


            <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400">
                <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
                    <q-list padding>
                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="home" />
                            </q-item-section>

                            <q-item-section>
                                Inicio
                            </q-item-section>
                        </q-item>

                        <q-item active clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="add_circle" />
                            </q-item-section>

                            <q-item-section>
                                Cadastros
                            </q-item-section>
                        </q-item>

                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="account_circle" />
                            </q-item-section>

                            <q-item-section>
                                Perfil
                            </q-item-section>
                        </q-item>

                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="drafts" />
                            </q-item-section>

                            <q-item-section>
                                Pedidos
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>

                <q-img class="absolute-top" src="https://cdn.awsli.com.br/2500x2500/549/549871/produto/29153219/55743cf91c.jpg" style="height: 150px">
                    <div class="absolute-bottom bg-transparent">
                        <q-avatar size="56px" class="q-mb-sm">
                            <img src="https://i.pinimg.com/1200x/24/15/e8/2415e8ae5eff3d019229acc00c035338.jpg">
                        </q-avatar>
                        <div class="text-weight-bold">Marquinhos do mal</div>
                        <div>@comiseucu</div>
                    </div>
                </q-img>
            </q-drawer>

            <q-page-container>
                <q-page padding>
                    <p v-for="n in 5" :key="n">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a
                        adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam
                        rerum delectus commodi perferendis voluptate?
                    </p>
                </q-page>
            </q-page-container>
        </q-layout>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup() {
        return {
            drawer: ref(false)
        }
    }
}
</script>

<style scoped>
:deep(.q-header.bg-green) {
    background-color: #00532e !important;
}
</style>
