<template>
  <div class="pairing-screen">
    <div class="pairing-container">
      <h1>Vizio TV Remote</h1>
      <p class="subtitle">Connect to your Vizio TV</p>

      <div class="form-group">
        <label for="tv-ip">TV IP Address</label>
        <input id="tv-ip" v-model="tvIp" type="text" placeholder="192.168.1.100" class="input-field" />
      </div>

      <button @click="initiatePairing" :disabled="!tvIp || isPairing" class="btn btn-primary">
        {{ isPairing ? 'Connecting...' : 'Start Pairing' }}
      </button>

      <div v-if="showPinInput" class="pin-section">
        <p class="pin-instruction">Enter the PIN displayed on your TV</p>
        <input v-model="pin" type="text" placeholder="PIN" maxlength="8" class="input-field pin-input"
          @keyup.enter="submitPin" />
        <button @click="submitPin" :disabled="!pin || isSubmitting" class="btn btn-success">
          {{ isSubmitting ? 'Pairing...' : 'Submit PIN' }}
        </button>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  paired: []
}>()

const tvIp = ref('')
const pin = ref('')
const showPinInput = ref(false)
const isPairing = ref(false)
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('error')

// Load saved TV IP from localStorage on client-side only
onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedIp = localStorage.getItem('vizioTvIp')
    if (savedIp) {
      tvIp.value = savedIp
    }
  }
})

const initiatePairing = async () => {
  if (!tvIp.value) {
    message.value = 'Please enter a TV IP address'
    messageType.value = 'error'
    return
  }

  isPairing.value = true
  message.value = ''

  try {
    const response = await $fetch('/api/pairing/initiate', {
      method: 'POST',
      body: { tvIp: tvIp.value }
    })

    showPinInput.value = true
    message.value = response.message || 'Please enter the PIN displayed on your TV'
    messageType.value = 'success'

    // Save TV IP to localStorage (client-side only)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vizioTvIp', tvIp.value)
    }
  } catch (error: any) {
    message.value = `Error: ${error.data?.message || error.message || 'Failed to connect to TV'}. Make sure your TV is on and connected to the same network.`
    messageType.value = 'error'
    showPinInput.value = false
  } finally {
    isPairing.value = false
  }
}

const submitPin = async () => {
  if (!pin.value) {
    return
  }

  isSubmitting.value = true
  message.value = ''

  try {
    const response = await $fetch('/api/pairing/pair', {
      method: 'POST',
      body: { pin: pin.value }
    })

    message.value = response.message || 'Pairing successful!'
    messageType.value = 'success'

    // Save token to localStorage if provided (for potential future use)
    if (response.token && typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vizioAuthToken', response.token)
    }

    setTimeout(() => {
      emit('paired')
    }, 1000)
  } catch (error: any) {
    message.value = `Pairing failed: ${error.data?.message || error.message || 'Invalid PIN'}. Please try again.`
    messageType.value = 'error'
    pin.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.pairing-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.pairing-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(17, 153, 142, 0.4);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pin-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.pin-instruction {
  text-align: center;
  color: #666;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.pin-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  font-weight: bold;
}

.message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.95rem;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
