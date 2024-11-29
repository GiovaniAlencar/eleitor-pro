export const masks = {
  phone: {
    mask: '(00) 00000-0000',
    definitions: {
      '0': /[0-9]/
    }
  },
  cpf: {
    mask: '000.000.000-00',
    definitions: {
      '0': /[0-9]/
    }
  },
  cnpj: {
    mask: '00.000.000/0000-00',
    definitions: {
      '0': /[0-9]/
    }
  },
  cep: {
    mask: '00000-000',
    definitions: {
      '0': /[0-9]/
    }
  },
  date: {
    mask: '00/00/0000',
    definitions: {
      '0': /[0-9]/
    }
  },
  currency: {
    mask: 'R$ num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.',
        radix: ',',
        scale: 2,
        padFractionalZeros: true,
        normalizeZeros: true,
        min: 0
      }
    }
  }
};