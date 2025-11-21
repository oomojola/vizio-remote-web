<template>
  <div id="app">
    <PairingScreen v-if="!isPaired" @paired="handlePaired" />
    <ControlScreen v-else @unpair="handleUnpair" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isPaired = ref(false)

const checkPairingStatus = async () => {
  try {
    const response = await $fetch<{ isPaired: boolean }>('/api/pairing/status')
    isPaired.value = response.isPaired || false
  } catch (error) {
    console.error('Failed to check pairing status:', error)
    isPaired.value = false
  }
}

onMounted(() => {
  checkPairingStatus()
})

const handlePaired = () => {
  isPaired.value = true
}

const handleUnpair = () => {
  isPaired.value = false
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
