import { siteConfig as defaultSiteConfig } from '../data/siteConfig';

export type SiteConfig = typeof defaultSiteConfig;

let inFlightPromise: Promise<SiteConfig> | null = null;
let cachedConfig: SiteConfig | null = null;

export const SiteConfigService = {
  /**
   * Obtém as configurações atuais do site com deduplicação de requisições e cache em memória
   */
  async getConfig(): Promise<SiteConfig> {
    if (cachedConfig) {
      return cachedConfig;
    }

    if (inFlightPromise) {
      return inFlightPromise;
    }

    inFlightPromise = (async () => {
      try {
        const res = await fetch('/api/site-config');
        if (!res.ok) throw new Error('Falha ao buscar configurações');
        const data = await res.json();
        cachedConfig = data;
        return data;
      } catch (error) {
        console.error('SiteConfigService.getConfig error:', error);
        return defaultSiteConfig;
      } finally {
        inFlightPromise = null;
      }
    })();

    return inFlightPromise;
  },

  /**
   * Atualiza as configurações do site
   */
  async updateConfig(newConfig: Partial<SiteConfig>): Promise<SiteConfig | null> {
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      if (!res.ok) throw new Error('Falha ao atualizar configurações');
      const data = await res.json();
      cachedConfig = data;
      return data;
    } catch (error) {
      console.error('SiteConfigService.updateConfig error:', error);
      return null;
    }
  },

  /**
   * Restaura as configurações originais do site
   */
  async resetConfig(): Promise<boolean> {
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'config' })
      });
      if (res.ok) {
        cachedConfig = null;
      }
      return res.ok;
    } catch (error) {
      console.error('SiteConfigService.resetConfig error:', error);
      return false;
    }
  }
};
