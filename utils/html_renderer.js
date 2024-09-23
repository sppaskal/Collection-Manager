export function renderYugiohCardToHtml (card) {
  return `
        <html>
        <body>
            <h1>${card.name}</h1>
            <h2>${card.type}</h2>
            <h2>${card.race}</h2>
            <h2>${card.ygoprodeck_url}</h2>
            <h2>${card.desc}</h2>
            <img src="${card.image}" alt="${card.name}" />
        </body>
        </html>
    `
}
