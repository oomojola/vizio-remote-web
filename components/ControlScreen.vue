<template>
  <div class="control-screen">
    <div class="control-container">
      <div class="header">
        <h1>Vizio TV Remote</h1>
        <button @click="handleUnpair" class="btn-unpair">Unpair</button>
      </div>

      <div class="remote-control">
        <!-- D-Pad Section -->
        <div class="d-pad-section">
          <div class="d-pad">
            <button @click="sendKey('UP')" class="d-pad-btn d-pad-up" :disabled="isSending">
              ↑
            </button>
            <div class="d-pad-middle">
              <button @click="sendKey('LEFT')" class="d-pad-btn d-pad-left" :disabled="isSending">
                ←
              </button>
              <button @click="sendKey('ENTER')" class="d-pad-btn d-pad-center" :disabled="isSending">
                OK
              </button>
              <button @click="sendKey('RIGHT')" class="d-pad-btn d-pad-right" :disabled="isSending">
                →
              </button>
            </div>
            <button @click="sendKey('DOWN')" class="d-pad-btn d-pad-down" :disabled="isSending">
              ↓
            </button>
          </div>
        </div>

        <!-- Volume Controls -->
        <div class="controls-section">
          <div class="control-buttons">
            <button @click="sendKey('VOL_UP')" class="control-btn volume-up" :disabled="isSending">
              <span class="icon">🔊</span>
              <span class="label">Volume Up</span>
            </button>
            <button @click="sendKey('VOL_DOWN')" class="control-btn volume-down" :disabled="isSending">
              <span class="icon">🔉</span>
              <span class="label">Volume Down</span>
            </button>
          </div>
        </div>

        <!-- Channel Controls -->
        <div class="controls-section">
          <div class="control-buttons">
            <button @click="sendKey('CH_UP')" class="control-btn channel-up" :disabled="isSending">
              <span class="icon">📺</span>
              <span class="label">Channel Up</span>
            </button>
            <button @click="sendKey('CH_DOWN')" class="control-btn channel-down" :disabled="isSending">
              <span class="icon">📺</span>
              <span class="label">Channel Down</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="controls-section">
          <div class="control-buttons">
            <button @click="sendKey('BACK')" class="control-btn back-btn" :disabled="isSending">
              <span class="icon">←</span>
              <span class="label">Back</span>
            </button>
            <button @click="sendKey('EXIT')" class="control-btn exit-btn" :disabled="isSending">
              <span class="icon">✕</span>
              <span class="label">Exit</span>
            </button>
            <button @click="sendKey('MENU')" class="control-btn menu-btn" :disabled="isSending">
              <span class="icon">☰</span>
              <span class="label">Menu</span>
            </button>
            <button @click="sendKey('RETURN')" class="control-btn return-btn" :disabled="isSending">
              <span class="icon">↩</span>
              <span class="label">Return</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="lastCommand" class="status-message">
        Last command: {{ lastCommand }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  unpair: []
}>()

const isSending = ref(false)
const lastCommand = ref('')

const sendKey = async (key: string) => {
  if (isSending.value) return

  isSending.value = true
  lastCommand.value = key

  try {
    await $fetch('/api/control/key', {
      method: 'POST',
      body: { key }
    })
    lastCommand.value = key
  } catch (error: any) {
    console.error('Error sending key command:', error)
    lastCommand.value = `Error: ${error.data?.message || error.message || key}`
  } finally {
    setTimeout(() => {
      isSending.value = false
    }, 200)
  }
}

const handleUnpair = async () => {
  try {
    await $fetch('/api/pairing/unpair', {
      method: 'POST'
    })

    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('vizioAuthToken')
      localStorage.removeItem('vizioTvIp')
    }

    emit('unpair')
  } catch (error: any) {
    console.error('Error unpairing:', error)
    // Still emit unpair to allow UI to reset
    emit('unpair')
  }
}
</script>

<style scoped>
.control-screen {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-container {
  background: white;
  border-radius: 20px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

h1 {
  font-size: 1.5rem;
  color: #667eea;
  margin: 0;
}

.btn-unpair {
  padding: 8px 16px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-unpair:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.remote-control {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.d-pad-section,
.controls-section {
  text-align: center;
}

h2 {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.d-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.d-pad-middle {
  display: flex;
  gap: 5px;
  align-items: center;
}

.d-pad-btn {
  width: 65px;
  height: 65px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.d-pad-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.d-pad-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.d-pad-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.d-pad-center {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
}

.d-pad-center:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
}

.control-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.control-btn {
  flex: 1;
  min-width: 110px;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.control-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.volume-up,
.volume-down {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
}

.volume-up:hover:not(:disabled),
.volume-down:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.channel-up,
.channel-down {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.channel-up:hover:not(:disabled),
.channel-down:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.exit-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
}

.exit-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.menu-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.menu-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.return-btn {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3);
}

.return-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(250, 112, 154, 0.4);
}

.icon {
  font-size: 1.5rem;
}

.label {
  font-size: 0.8rem;
  font-weight: 600;
}

.status-message {
  margin-top: 20px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 8px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .control-container {
    padding: 15px;
  }

  .d-pad-btn {
    width: 55px;
    height: 55px;
    font-size: 1.2rem;
  }

  .d-pad-center {
    width: 55px;
    height: 55px;
  }

  .control-btn {
    min-width: 90px;
    padding: 12px;
  }

  .icon {
    font-size: 1.2rem;
  }

  .label {
    font-size: 0.7rem;
  }
}
</style>
