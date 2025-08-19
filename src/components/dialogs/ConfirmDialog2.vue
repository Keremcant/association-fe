<template>
  <VCard>
    <VDialog
      persistent
      max-width="500"
      :model-value="visible"
      @update:model-value="(val) => visible = val"
    >
      <DialogCloseBtn @click="hide" />
      <VCard class="text-center px-10 py-6">
        <VCardTitle>{{ $t(title) }}</VCardTitle>
        <VCardText>
          <VBtn
            icon
            variant="outlined"
            color="warning"
            class="my-4"
            style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
          >
            <span class="text-5xl">!</span>
          </VBtn>

          <h6 class="text-lg font-weight-medium">
            {{ msg }} {{ $t(del) }} ?
          </h6>
        </VCardText>

        <VCardText class="d-flex align-center justify-center gap-2">
          <VBtn
            variant="elevated"
            :loading="loading"
            @click="onConfirmation"
          >
            {{ $t(Accept) }}
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="hide"
          >
            {{ $t(Cancel) }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup>
defineProps({
  loading: Boolean,
})

const emit = defineEmits([
  'confirm',
])

const visible = ref(false)
const title = ref('')
const msg = ref('')
const del = "is Delete"
const Cancel = "Cancel"
const Accept = "Accept"


function show(t, m){
  visible.value = true
  title.value = t
  msg.value = m
}
function hide(){
  visible.value = false
}

defineExpose({
  show,
  hide,
})

const onConfirmation = () => {
  emit('confirm', true)
}
</script>
