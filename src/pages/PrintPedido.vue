<template>
  <q-page class="bg-white q-pa-md">
    <div id="pedido">
      <div>=== PEDIDO {{ pedido.sequencia }} ===</div>
      <div>Usuário: {{ pedido.usuario }}</div>
      <div>Cliente: {{ pedido.cliente }}</div>
      <div>--------------------</div>
      <div v-for="(item, index) in pedido.produtos" :key="index">
        {{ item.quantidade }}x {{ item.nome }} - R$ {{ item.preco.toFixed(2) }}
      </div>
      <div>--------------------</div>
      <div>Total: R$ {{ total.toFixed(2) }}</div>
    </div>

    <div class="text-center q-mt-md">
      <q-btn label="Imprimir Pedido" color="primary" @click="imprimirPedido" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const pedido = ref({
  usuario: 'Marcos Silva',
  cliente: 'João Pereira',
  sequencia: 'PED-1023',
  produtos: [
    { nome: 'Pizza Calabresa', quantidade: 2, preco: 39.9 },
    { nome: 'Refrigerante 2L', quantidade: 1, preco: 10.0 }
  ]
})

const total = computed(() =>
  pedido.value.produtos.reduce((sum, p) => sum + p.preco * p.quantidade, 0)
)

const imprimirPedido = () => {
  const printContent = document.getElementById('pedido').innerHTML
  const win = window.open('', '', 'height=500,width=300')
  win.document.write('<pre>' + printContent + '</pre>')
  win.document.close()
  win.print()
}
</script>

<style scoped>
#pedido {
  font-family: monospace;
  white-space: pre-line;
  font-size: 14px;
}
</style>
