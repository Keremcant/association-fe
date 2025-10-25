<template>
  <VCardText>
    <iframe
      v-if="formData.pdfUrl"
      :src="formData.pdfUrl"
      style="width:100%; height:80vh; border:none;"
    />
    <p v-else>
      {{ $t('PDF not available') }}
    </p>
    <VRow>
      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          color="primary"
          @click="$emit('close')"
        >
          {{ $t('Close') }}
        </VBtn>
      </VCol>
    </VRow>
  </VCardText>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
})
</script>
