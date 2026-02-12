import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDynamicFilesStore = defineStore('dynamicFiles', () => {
  const menuUrl = ref('')
  const carteleraUrl = ref('')
  const loadingMenu = ref(false)
  const loadingCartelera = ref(false)

  const SCRIPT_URLS = {
    MENU: 'https://script.google.com/macros/s/AKfycbwFKOBzy3N9p31cdBZyiXEM7DJL-75UJB0N72rgZ2Id4FlkMI8_ThJFRNw_UvWB41Bq9w/exec',
    CARTELERA: 'https://script.google.com/macros/s/AKfycbyhgd1WUBvN4_L422E-tFP4hNWluKKDgiJdkZ0EYJ_hQzfp44N4AQOdsK6QGHoB-sy7/exec'
  }

  const fetchMenuUrl = async () => {
    if (menuUrl.value) return menuUrl.value
    loadingMenu.value = true
    try {
      const response = await fetch(SCRIPT_URLS.MENU)
      const data = await response.json()
      if (data && data.url) {
        menuUrl.value = data.url
        return data.url
      }
      throw new Error('No menu URL found')
    } catch (error) {
      console.error('Error fetching menu URL:', error)
      return '/menu.pdf' // Fallback
    } finally {
      loadingMenu.value = false
    }
  }

  const fetchCarteleraUrl = async () => {
    loadingCartelera.value = true
    try {
      const response = await fetch(SCRIPT_URLS.CARTELERA)
      const data = await response.json()
      if (data && data.url) {
        carteleraUrl.value = data.url
        return data.url
      }
      throw new Error('No cartelera URL found')
    } catch (error) {
      console.error('Error fetching cartelera URL:', error)
      return null
    } finally {
      loadingCartelera.value = false
    }
  }

  return {
    menuUrl,
    carteleraUrl,
    loadingMenu,
    loadingCartelera,
    fetchMenuUrl,
    fetchCarteleraUrl
  }
})
