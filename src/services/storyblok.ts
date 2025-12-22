import StoryblokClient from 'storyblok-js-client';

class StoryblokService {
  private client: StoryblokClient;

  constructor() {
    this.client = new StoryblokClient({
      accessToken: 'SPi5wCbnPqpQBZjWrIBElQtt',
      cache: {
        clear: 'auto',
        type: 'memory'
      },
      endpoint: 'https://api.storyblok.com/v2'
    });
  }

  /**
   * Obtiene la lista de eventos desde Storyblok
   * Filtra por la carpeta 'night-events/' y ordena por fecha ascendente
   */
  async getEvents() {
    try {
      const response = await this.client.get('cdn/stories', {
        version: 'published',
        starts_with: 'night-events/',
        sort_by: 'content.fecha:asc',
      });
      return response.data.stories;
    } catch (error) {
      console.error('StoryblokService: Error fetching events', error);
      throw error;
    }
  }

  /**
   * Obtiene un evento específico por su UUID
   * @param uuid Identificador único del evento
   */
  async getEventById(uuid: string) {
    try {
      const response = await this.client.get('cdn/stories', {
        version: 'published',
        by_uuids: uuid,
      });

      if (response.data.stories && response.data.stories.length > 0) {
        return response.data.stories[0];
      }
      return null;
    } catch (error) {
      console.error(`StoryblokService: Error fetching event by ID ${uuid}`, error);
      throw error;
    }
  }

  /**
   * Obtiene un evento específico por su Slug (URL friendly name)
   * @param slug El slug del evento (ej: 'mi-super-evento')
   */
  async getEventBySlug(slug: string) {
    try {
      const response = await this.client.get(`cdn/stories/night-events/${slug}`, {
        version: 'published'
      });
      return response.data.story;
    } catch (error) {
      console.error(`StoryblokService: Error fetching event by slug ${slug}`, error);
      throw error;
    }
  }
}

export default new StoryblokService();
