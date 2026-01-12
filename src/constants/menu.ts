export interface MenuItem {
  name: string
  description?: string
  price?: number
  priceVaso?: number
  priceBotella?: number
  priceCopa?: number
}

export interface MenuCategory {
  title: string
  subtitle?: string
  type: 'standard' | 'tiered-drink' | 'specials'
  items: MenuItem[]
}

export const menuData: MenuCategory[] = [
  {
    title: 'NUESTROS PLATOS',
    type: 'standard',
    items: [
      {
        name: 'Ópera de Cangrejo Porteño',
        description: 'Cocolón de arroz, pulpa de cangrejo fresco y salsa de la casa.',
        price: 16.00
      },
      {
        name: 'Armonía de Camarón y Maní',
        description: 'Masa crocante de plátano verde, maní y camarón de manglar, y salsa tatemada tradicional.',
        price: 17.00
      },
      {
        name: 'Crustáceo en Fritura Dorada',
        description: 'Bocado de pangora servida al estilo "lollipop", con una mayonesa de Mostaza Dijon antigua.',
        price: 20.00
      },
      {
        name: 'Acordes de Sabores',
        description: 'Tabla de curados de lomo embuchado, queso de maduración, bresaola grisines y masa hojaldrada.',
        price: 23.00
      },
      {
        name: 'Crispy Jazz',
        description: 'Pollo crujiente, salsa de anguila, mayonesa de maní y papitas salteadas al limón.',
        price: 18.00
      },
      {
        name: 'Rapsodia Picante de Camarón',
        description: 'Camarones tempura, bañados en salsa mayo de siracha, sobre col morada.',
        price: 14.00
      },
      {
        name: 'Sushi Express',
        description: 'Rollo de camarón, queso crema, vegetales y aguacate. Con salsa de anguila, salsa de maracuyá o salsa ponzu cítrica.',
        price: 40.00
      },
      {
        name: 'Notas Dulces',
        description: 'Churros crujientes, acompañados de salsa achocolatada.',
        price: 15.00
      },
      {
        name: 'Cremoso Ramazotti',
        description: 'Un arroz en su punto, con tomates orgánicos deshidratados y queso parmesano.',
        price: 19.00
      },
      {
        name: 'Lomo en Clave de Sol',
        description: 'Corte de 250g de lomo fino al grill, bañado en salsa de vino tinto, acompañado de zanahorias baby caramelizadas y un cremoso risotto blanco con notas de queso parmesano',
        price: 34.00
      },
      {
        name: 'Burgers en Beat',
        description: '3 Mini hamburguesas de carne magra de lomo fino al estilo smash con pan brioche, mermelada de tocino, cebollas caramelizadas y queso provolone.',
        price: 18.00
      },
      {
        name: 'Fusión en Ritmo',
        description: 'Costilla de res braseada lentamente, servida con salsa demi-glace y champiñones salteados, sobre un risotto de paprika.',
        price: 30.00
      }
    ]
  },
  {
    title: 'SPECIALS',
    type: 'standard',
    items: [
      {
        name: 'Sinatra',
        description: 'Mix de nuestros platos: Crispy Jazz, Ópera de Cangrejo, Rapsodia de Camarón, Armonía de Camarón y Maní y Crustáceo en fritura.',
        price: 19.00
      }
    ]
  },
  {
    title: 'CÓCTELES DE AUTOR',
    type: 'standard',
    items: [
      {
        name: 'CARA LUNA',
        description: 'Gin Dry, Gin Rose, Syrup de Rosas, Zumo de Limón.',
        price: 15.00
      },
      {
        name: 'CORAZÓN PARTÍO',
        description: 'Ron, Sirope de Passion Fruit, Limón, Sirope de Jamaica.',
        price: 15.00
      },
      {
        name: 'LA GOTA FRÍA',
        description: 'Vodka, Starlino Rose, Syrup de Mandarina, Zumo de Limón.',
        price: 15.00
      },
      {
        name: 'LA CHICA DE HUMO',
        description: 'Tequila, Flor de Sauco Monin, Aperol, Zumo de Limón.',
        price: 15.00
      },
      {
        name: 'LA NEGRA TOMASA',
        description: 'Ron, Vino tinto, Sirope de Maracuyá, Zumo de Limón.',
        price: 15.00
      },
      {
        name: 'FUEGO DE NOCHE',
        description: 'Gin Dry, Sirope de Canela, Ginger Ale, Zumo de Limón.',
        price: 15.00
      },
      {
        name: '4R SOLERA',
        description: 'Ron, Jugo de Naranja, Sirope de Piña y Angostura.',
        price: 15.00
      },
      {
        name: 'PIANO PIANO',
        description: 'Fatwash de Chocolate con notas de Ron Añejo y Licor de Banano.',
        price: 15.00
      },
      {
        name: 'NOTA #4',
        description: 'Licor de Durazno, Cordial de mandarina & Espumante.',
        price: 15.00
      }
    ]
  },
  {
    title: 'CÓCTELES CLÁSICOS',
    type: 'standard',
    items: [
      { name: 'Aperol Spritz', price: 15.00 },
      { name: 'Old Fashioned', price: 15.00 },
      { name: 'JagerBomb', price: 15.00 },
      { name: 'Carajillo', price: 15.00 },
      { name: 'Negroni', price: 15.00 },
      { name: 'Apple Martini', price: 15.00 },
      { name: 'Fernet', price: 15.00 },
      { name: 'Padrino', price: 15.00 },
      { name: 'Mojito Clásico', price: 15.00 },
      { name: 'Moscow Mule', price: 15.00 },
      { name: 'Paloma', price: 15.00 },
      { name: 'Expreso Martini', price: 15.00 },
      { name: 'Margarita', price: 15.00 },
      { name: 'Caipiriña', price: 15.00 }
    ]
  },
  {
    title: 'VINOS TINTOS',
    type: 'tiered-drink',
    items: [
      { name: 'Ventisquero Clasico Cabernet Sauvignon', priceCopa: 10.00, priceBotella: 40.01 },
      { name: 'Ventisquero Reserva Cabernet Sauvignon', priceBotella: 59.06 },
      { name: 'Ventisquero Clasico Merlot', priceBotella: 40.01 },
      { name: 'Jp Chenet Reserva Merlot', priceBotella: 56.25 },
      { name: 'Postales Roble Malbec, Bodega Fin del Mundo', priceBotella: 58.75 },
      { name: 'Postales Malbec, Bodega Fin del Mundo', priceBotella: 41.25 }
    ]
  },
  {
    title: 'VINOS BLANCOS / ROSÉ',
    type: 'tiered-drink',
    items: [
      { name: 'JP Chenet Reserva Sauvignon Blanc', priceCopa: 10.00, priceBotella: 40.01 },
      { name: 'Visionario Morande Sauvignon Blanc', priceBotella: 56.25 },
      { name: 'JP Chenet Reserva Chardonnay', priceBotella: 41.25 },
      { name: 'Nebla Garnacha Rosé', priceBotella: 48.80 },
      { name: 'Ventisquero Clasico Rose', priceBotella: 41.47 }
    ]
  },
  {
    title: 'ESPUMANTES & CHAMPAGNE',
    type: 'tiered-drink',
    items: [
      { name: 'Chandon Garden Spritz', priceBotella: 81.00 },
      { name: 'Jp Pinot Noir Demi Sec Rosé', priceBotella: 88.75 },
      { name: 'Jp Divine Muscat Blanc de Blancs', priceBotella: 88.75 },
      { name: 'Jp Chenet Ice Edition', priceBotella: 77.01 },
      { name: 'Jp Chenet Ice Edition Rose', priceBotella: 77.01 },
      { name: 'Jp Chenet Sparkling Brut', priceBotella: 66.30 },
      { name: 'Henkell Blanc De Blancs', priceBotella: 63.75 },
      { name: 'Alto Palermo Demi Sec', priceCopa: 10.22, priceBotella: 50.00 },
      { name: 'Dom Perignon Blanc Vintage', priceBotella: 1125.00 },
      { name: 'Moet & Chandon Imperial Brut', priceBotella: 350.00 }
    ]
  },
  {
    title: 'WHISKY',
    type: 'tiered-drink',
    items: [
      { name: 'Royal Salute 21 Años', priceBotella: 875.00 },
      { name: 'Johnnie Walker Blue Label', priceBotella: 937.50 },
      { name: 'Johnnie Walker 18 Años', priceBotella: 500.00 },
      { name: 'Johnnie Walker Gold Label', priceVaso: 25.00, priceBotella: 287.50 },
      { name: 'Johnnie Walker Swing', priceBotella: 246.25 },
      { name: 'Johnnie Walker Double Black', priceVaso: 20.63, priceBotella: 213.75 },
      { name: 'Johnnie Walker Black Label', priceVaso: 18.75, priceBotella: 181.25 },
      { name: 'Buchanan\'s 18 Años', priceBotella: 412.50 },
      { name: 'Buchanan\'s Master', priceVaso: 20.13, priceBotella: 213.75 },
      { name: 'Buchanan\'s 12 Años', priceVaso: 41.25, priceBotella: 188.98 },
      { name: 'Macallan 12 Años', priceBotella: 525.00 },
      { name: 'The Glenlivet 12 YO', priceVaso: 22.00, priceBotella: 250.00 },
      { name: 'The Glenlivet Founders Reserve', priceVaso: 18.75, priceBotella: 201.00 },
      { name: 'Chivas Regal 13 Años', priceVaso: 18.75, priceBotella: 206.25 },
      { name: 'Chivas Regal 12 Años', priceBotella: 181.25 },
      { name: 'Jack Daniel\'s Honey', priceVaso: 18.75, priceBotella: 202.50 },
      { name: 'Jack Daniel\'s No. 7', priceVaso: 17.50, priceBotella: 196.25 },
      { name: 'Old Parr 12 Años', priceVaso: 15.00, priceBotella: 170.00 },
      { name: 'Dewar\'s 12 Años', priceBotella: 125.00 }
    ]
  },
  {
    title: 'TEQUILA',
    type: 'tiered-drink',
    items: [
      { name: 'Maestro Dobel Diamante', priceBotella: 412.50 },
      { name: 'Don Julio Reposado', priceBotella: 488.03 },
      { name: 'Don Julio Blanco', priceVaso: 33.75, priceBotella: 427.08 },
      { name: 'Patrón Reposado', priceVaso: 37.98, priceBotella: 481.56 },
      { name: 'Patrón Silver', priceVaso: 29.80, priceBotella: 377.91 },
      { name: '1800 Añejo', priceBotella: 310.53 },
      { name: '1800 Cristalino', priceVaso: 22.82, priceBotella: 270.03 },
      { name: 'Jimador Reposado', priceBotella: 188.80 },
      { name: 'Jimador Silver', priceVaso: 16.25, priceBotella: 183.55 },
      { name: 'José Cuervo Silver', priceBotella: 167.12 },
      { name: 'Herradura Plata', priceVaso: 20.00, priceBotella: 287.50 },
      { name: 'Karnal Añejo', priceVaso: 12.00, priceBotella: 120.00 }
    ]
  },
  {
    title: 'RON',
    type: 'tiered-drink',
    items: [
      { name: 'Zacapa 23 Solera', priceBotella: 326.23 },
      { name: 'Botran 18 Años', priceBotella: 263.58 },
      { name: 'Botran 15 Años', priceVaso: 18.75, priceBotella: 205.36 },
      { name: 'Botran 12 Años', priceVaso: 17.00, priceBotella: 145.00 },
      { name: 'Botran 8 Años', priceVaso: 16.25, priceBotella: 100.00 },
      { name: 'Flor de Caña 18 Años', priceBotella: 275.00 },
      { name: 'Flor de Caña 12 Años', priceVaso: 17.50, priceBotella: 134.35 },
      { name: 'Carúpano 12 Años', priceBotella: 130.95 }
    ]
  },
  {
    title: 'GIN',
    type: 'tiered-drink',
    items: [
      { name: 'N3 London Dry', priceBotella: 238.75 },
      { name: 'Tanqueray No. Ten', priceBotella: 230.00 },
      { name: 'Tanqueray Dry', priceVaso: 17.50, priceBotella: 140.00 },
      { name: 'Bombay Sapphire', priceVaso: 17.00, priceBotella: 137.44 },
      { name: 'Beefeater', priceVaso: 16.25, priceBotella: 136.35 },
      { name: 'Crespo Dry', priceVaso: 16.25, priceBotella: 108.75 }
    ]
  },
  {
    title: 'VODKA',
    type: 'tiered-drink',
    items: [
      { name: 'Belvedere Pure', priceVaso: 20.00, priceBotella: 200.00 },
      { name: 'Grey Goose Original', priceVaso: 20.49, priceBotella: 181.25 },
      { name: 'Absolut', priceVaso: 16.69, priceBotella: 118.75 },
      { name: 'Finlandia', priceVaso: 15.00, priceBotella: 110.00 },
      { name: 'Stolichnaya Red', priceBotella: 90.76 }
    ]
  },
  {
    title: 'APERITIVOS / BAJATIVOS',
    type: 'standard',
    items: [
      { name: 'Baileys', price: 10.05 },
      { name: 'Disaronno', price: 13.75 },
      { name: 'Amarula', price: 10.62 },
      { name: 'Cointreau', price: 15.76 },
      { name: 'Brandy Torres 5', price: 10.53 },
      { name: 'Licor 43', price: 18.89 },
      { name: 'Amaro Montenegro', price: 12.29 }
    ]
  },
  {
    title: 'CERVEZAS',
    type: 'standard',
    items: [
      { name: 'Modelo', price: 7.88 },
      { name: 'Corona', price: 7.88 },
      { name: 'Stella Artois', price: 7.88 },
      { name: 'Club Premium', price: 6.25 }
    ]
  },
  {
    title: 'BEBIDAS SOFT',
    type: 'standard',
    items: [
      { name: 'Limonada', price: 3.91 },
      { name: 'Limonada Imperial', price: 4.51 },
      { name: 'Agua Natural', price: 4.50 },
      { name: 'Agua Mineral', price: 4.50 },
      { name: 'Red Bull', price: 9.65 },
      { name: 'Coca Cola Regular', price: 3.91 },
      { name: 'Coca Cola Zero', price: 3.91 },
      { name: 'Sprite', price: 3.91 }
    ]
  }
]
