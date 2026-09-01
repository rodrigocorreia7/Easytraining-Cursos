import { siteConfig as defaultSiteConfig } from '../data/siteConfig';

export type SiteConfig = typeof defaultSiteConfig;

export const SiteConfigService = {
  /**
   * Obtém as configurações atuais do site
   */
  async getConfig(): Promise<SiteConfig> {
    try {
      const res = await fetch('/api/site-config', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar configurações');
      return await res.json();
    } catch (error) {
      console.error('SiteConfigService.getConfig error:', error);
      return defaultSiteConfig;
    }
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
      return await res.json();
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
      return res.ok;
    } catch (error) {
      console.error('SiteConfigService.resetConfig error:', error);
      return false;
    }
  }
};
