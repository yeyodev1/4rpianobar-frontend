import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDynamicFilesStore = defineStore('dynamicFiles', () => {
  const menuUrl = ref('')
  const carteleraUrl = ref('')
  const loading = ref(false)
  const showModal = ref(false)
  const modalType = ref<'menu' | 'cartelera'>('menu')
  const currentUrl = ref('')

  const SCRIPT_URLS = {
    MENU: 'https://script.google.com/macros/s/AKfycbwFKOBzy3N9p31cdBZyiXEM7DJL-75UJB0N72rgZ2Id4FlkMI8_ThJFRNw_UvWB41Bq9w/exec',
    CARTELERA: 'https://script.google.com/macros/s/AKfycbyhgd1WUBvN4_L422E-tFP4hNWluKKDgiJdkZ0EYJ_hQzfp44N4AQOdsK6QGHoB-sy7/exec'
  }

  const FALLBACK_URLS = {
    MENU: '/menu.pdf',
    CARTELERA: 'https://drive.google.com/drive/folders/1pyQuPLgBbwE-IoFxDj9aFfsIAObM7Lur?usp=sharing'
  }

  const fetchUrl = async (type: 'menu' | 'cartelera') => {
    loading.value = true
    try {
      const response = await fetch(SCRIPT_URLS[type.toUpperCase() as 'MENU' | 'CARTELERA'])
      const data = await response.json()
      if (data && data.url) {
        if (type === 'menu') menuUrl.value = data.url
        else carteleraUrl.value = data.url
        return data.url
      }
      throw new Error(`No ${type} URL found`)
    } catch (error) {
      console.error(`Error fetching ${type} URL:`, error)
      return FALLBACK_URLS[type.toUpperCase() as 'MENU' | 'CARTELERA']
    } finally {
      loading.value = false
    }
  }

  const openFile = async (type: 'menu' | 'cartelera') => {
    modalType.value = type
    showModal.value = true
    currentUrl.value = ''

    // Si ya tenemos la URL, no la volvemos a pedir (opcional, para el menú es mejor así)
    let url = type === 'menu' ? menuUrl.value : carteleraUrl.value

    if (!url) {
      url = await fetchUrl(type)
    }

    currentUrl.value = url

    // Intentamos abrirlo automáticamente
    const popup = window.open(url, '_blank')
    if (!popup || popup.closed || typeof popup.closed == 'undefined') {
      console.warn('Posible bloqueo de popup')
    }
  }

  const closeModal = () => {
    showModal.value = false
  }

  return {
    menuUrl,
    carteleraUrl,
    loading,
    showModal,
    modalType,
    currentUrl,
    openFile,
    closeModal,
    fetchUrl // Exported for pre-fetching if needed
  }
})
