export const whatsappService = {
  formatNumber(number: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = number.replace(/\D/g, '');
    
    // Adiciona o código do país se não existir
    if (!cleaned.startsWith('55')) {
      return `55${cleaned}`;
    }
    
    return cleaned;
  },

  generateLink(number: string, message?: string): string {
    const formattedNumber = this.formatNumber(number);
    const baseUrl = 'https://wa.me/';
    
    if (message) {
      return `${baseUrl}${formattedNumber}?text=${encodeURIComponent(message)}`;
    }
    
    return `${baseUrl}${formattedNumber}`;
  }
};