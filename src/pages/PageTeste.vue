

<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
      <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="100"
        :breakpoint="500"
      >
        <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section>
                Inbox
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section>
                Star
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                Send
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                Drafts
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
          </p>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>

<style lang="sass" scoped>
.menu-list .q-item
  border-radius: 0 32px 32px 0

  nav a {
  color: var(--icon-color);
  font-size: 22px;
  transition: color 0.3s ease, transform 0.3s ease;
}

nav a:hover {
  color: var(--icon-hover);
  transform: scale(1.15);
}

/* BOTÃO SAIR */
.logout {
  margin-bottom: 25px;
}

#logoutBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}


#logoutBtn i.fa {
  font-size: 20px;
  color: #495057;
}


#logoutBtn:hover {
  color: var(--icon-hover);
}


#logoutBtn:hover i.fa {
  color: var(--icon-hover);
}


#logoutBtn:active {
  opacity: 0.8;
}
</style>
