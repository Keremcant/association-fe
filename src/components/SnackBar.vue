
<template>
  <VSnackbar
    v-model="visible"
    :color="color"
    location="top right"
    variant="elevated"
    close-on-content-click
  >
    {{ $t(message) }} !
    <template #actions>
      <VBtn
        variant="text"
        @click="snackbar = false"
      >
        <b style="color: white">
          X
        </b>
      </VBtn>
    </template>
  </VSnackbar>
</template>

<script setup>
const visible = ref(false)
const message = ref('')
const color = ref('info')

function show(msg, clr){
  visible.value = true
  message.value = msg
  color.value = clr
}

defineExpose({
  show,
})
</script>
