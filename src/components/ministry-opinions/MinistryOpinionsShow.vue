<template>
  <VCardText>
    <div v-if="loading">
      {{ $t('Dosya yükleniyor') }}...
    </div>

    <div
      v-else-if="pdfSrc"
      ref="pdfWrapper"
      style="width:100%; height:80vh; user-select: none;"
      @contextmenu.prevent
      @keydown.ctrl.prevent
      @keydown.meta.prevent
    >
      <PDF :src="pdfSrc" />
    </div>

    <p v-else>
      {{ $t('PDF yüklenemedi') }}
    </p>
  </VCardText>
</template>


<script setup>
import { ref, onMounted } from "vue"
import PDF from "pdf-vue3"
import axios from '@/plugins/axios.js'

const props = defineProps({
  uuid: { type: String, required: true },
})

const pdfSrc = ref(null)
const pdfWrapper = ref(null)
const loading = ref(true)

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => resolve(reader.result.split(",")[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

onMounted(async () => {
  if (!props.uuid) return

  try {
    const response = await axios.get(
      `https://panel-api.ozbakder.com/ministryopinions/file/${props.uuid}`,
      {
        responseType: "blob",
        validateStatus: status => status >= 200 && status < 300,
        headers: { Accept: "application/pdf" },
      },
    )

    const base64 = await blobToBase64(response.data)

    pdfSrc.value = base64

    pdfWrapper.value?.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "c", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    })
  } catch (err) {
    console.error("PDF yüklenemedi", err)
    pdfSrc.value = null
  } finally {
    loading.value = false
  }
})
</script>

