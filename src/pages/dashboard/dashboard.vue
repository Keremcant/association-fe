<template>
  <div>
    <h2>Wind Speed Meters & Active KMZ</h2>

    <div class="speedometer-container">
      <div
        v-for="(value, boxId) in windSpeedData"
        :key="boxId"
        class="speedometer-box"
      >
        <h4>Box {{ boxId }}</h4>
        <VueSpeedometer
          :height="100"
          :width="143"
          label-font-size="12"
          :max-segment-labels="1"
          :segments="1"
          :ring-width="8"
          :value="Math.abs(value)"
          :min-value="0"
          :max-value="50"
          :segment-colors="['rgba(var(--v-theme-flow-orange))']"
          needle-color="#197031"
        />
      </div>
    </div>

    <div
      id="map"
      style="width: 100%; height: 500px; margin-top: 30px;"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, onBeforeUnmount } from "vue"
import { Client } from "@stomp/stompjs"
import VueSpeedometer from "vue-speedometer"
import axios from "@/plugins/axios"

let stompClient

// Wind speed reactive object
const windSpeedData = reactive({})

// WebSocket kanallar
const channels = ["resLocation"]

// Google Maps referansları
let map
let kmlLayer

// WebSocket bağlanma
onMounted(() => {
  stompClient = new Client({
    brokerURL: "ws://localhost:8083/ws/websocket",
    reconnectDelay: 5000,
  })

  stompClient.onConnect = () => {
    console.log("✅ STOMP connected")

    channels.forEach(ch => {
      const topic = `/topic/${ch}`

      stompClient.subscribe(topic, msg => {
        const payload = JSON.parse(msg.body)
        if (payload.boxId != null && payload.data?.Speed != null) {
          windSpeedData[payload.boxId] = payload.data?.Speed
        }
      })
    })
  }

  stompClient.activate()

  // Aktif KMZ dosyasını al ve Google Maps üzerinde göster
  loadActiveKMZ()
})

onBeforeUnmount(() => {
  if (stompClient && stompClient.active) {
    console.log("🛑 STOMP disconnecting...")
    stompClient.deactivate()
  }
})

async function loadActiveKMZ() {
  try {
    const response = await axios.get("/maps/get-active")
    const kmzDataBase64 = response.data.data // Base64 string

    if (!kmzDataBase64) {
      console.error("KMZ datası boş")
      
      return
    }

    // Base64'i binary'e çevir
    const binaryString = atob(kmzDataBase64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Blob oluştur
    const kmzBlob = new Blob([bytes], { type: "application/vnd.google-earth.kmz" })

    // Leaflet veya Google Maps KmlLayer için URL oluştur
    const kmzUrl = URL.createObjectURL(kmzBlob)

    // Leaflet haritasına ekle (örnek)
    const omnivore = (await import("@mapbox/leaflet-omnivore")).default
    if (map) {
      if (kmzLayer) {
        map.removeLayer(kmzLayer)
      }
      kmzLayer = omnivore.kmz(kmzUrl).addTo(map)
    }
  } catch (err) {
    console.error("KMZ yükleme hatası:", err)
  }
}
</script>

<style scoped>
.speedometer-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.speedometer-box {
  text-align: center;
}
</style>
