import { useState, useEffect, useRef } from 'react'

const LANGS = {
  de: {
    placeholder: 'Stellen Sie eine Frage zur Reise...',
    welcome: 'Herzlich willkommen! Ich bin Ihr persönlicher Reiseassistent für **Die Vielfalt Brasiliens - Gebeco**.\n\nIch begleite Sie auf Ihrer **15-tägigen Brasilien-Reise** — von den Iguaçu-Wasserfällen durch den Amazonas bis nach Rio de Janeiro und Salvador.\n\n**Wie kann ich dir heute helfen?**',
    suggestions: ['Tagesablauf anzeigen', 'Hotels und Unterkünfte', 'Was ist inbegriffen?', 'Flugdetails', 'Amazonas-Programm', 'Reiseleiter-Kontakte'],
    sysLang: 'Antworte IMMER auf Deutsch. Sei freundlich, präzise und enthusiastisch. Nutze Emojis sparsam.',
    tabChat: 'Assistent',
    tabEx: 'Ausflüge buchen',
    day: 'Tag',
    book: 'Jetzt buchen',
    booking: 'Wird gebucht…',
    payOk: '✓ Buchung erfolgreich! Bestätigung kommt per E-Mail.',
    payCancel: 'Buchung wurde abgebrochen.',
    noStripe: 'Online-Buchung noch nicht verfügbar — bitte kontaktieren Sie OPCO Tours: carlos@opcotours.com',
  },
  pt: {
    placeholder: 'Faça uma pergunta sobre a viagem...',
    welcome: 'Olá! Bem-vindo ao assistente de viagem da **Die Vielfalt Brasiliens - Gebeco**!\n\nEstou aqui para ajudá-lo durante os **15 dias pelo Brasil** — das Cataratas do Iguaçu à Amazônia, de Rio de Janeiro a Salvador.\n\n**Como posso te ajudar hoje?**',
    suggestions: ['Ver roteiro dia a dia', 'Hotéis e hospedagens', 'O que está incluído?', 'Detalhes dos voos', 'Programa na Amazônia', 'Contatos dos guias'],
    sysLang: 'Responda SEMPRE em português brasileiro. Seja amigável, preciso e entusiasmado. Use emojis com moderação.',
    tabChat: 'Assistente',
    tabEx: 'Reservar Excursões',
    day: 'Dia',
    book: 'Reservar',
    booking: 'Aguarde…',
    payOk: '✓ Reserva confirmada! Verifique seu e-mail.',
    payCancel: 'Reserva cancelada.',
    noStripe: 'Reservas online em breve — contate a OPCO Tours: carlos@opcotours.com',
  },
  en: {
    placeholder: 'Ask a question about the trip...',
    welcome: "Welcome! I'm your personal travel assistant for **Die Vielfalt Brasiliens - Gebeco**.\n\nI'm here to help throughout your **15-day Brazil journey** — from Iguaçu Falls through the Amazon to Rio de Janeiro and Salvador.\n\n**How can I help you today?**",
    suggestions: ['Show daily itinerary', 'Hotels & accommodation', "What's included?", 'Flight details', 'Amazon programme', 'Guide contacts'],
    sysLang: 'ALWAYS respond in English. Be friendly, precise and enthusiastic. Use emojis sparingly.',
    tabChat: 'Assistant',
    tabEx: 'Book Excursions',
    day: 'Day',
    book: 'Book Now',
    booking: 'Booking…',
    payOk: '✓ Booking confirmed! Check your email.',
    payCancel: 'Booking cancelled.',
    noStripe: 'Online booking coming soon — contact OPCO Tours: carlos@opcotours.com',
  },
}

const EXCURSIONS = [
  {
    id: 'macuco', day: 2, location: 'Foz do Iguaçu', locEmoji: '💧', price: 135,
    de: { name: 'Macuco Bootsafari', desc: 'Nähern Sie sich den Wasserfällen per Schnellboot — pure Naturgewalt hautnah erleben.' },
    pt: { name: 'Macuco Boat Safari', desc: 'De lancha até o pé das cataratas — adrenalina e natureza em estado bruto.' },
    en: { name: 'Macuco Boat Safari', desc: 'Speed-boat ride to the base of the falls — raw nature at full force.' },
  },
  {
    id: 'rafahin', day: 3, location: 'Foz do Iguaçu', locEmoji: '💧', price: 95,
    de: { name: 'Rafahin Show mit Dinner', desc: 'Fesselnde Guaraní-Kulturshow mit festlichem Abendessen inbegriffen.' },
    pt: { name: 'Rafahin Show com Jantar', desc: 'Espetáculo da cultura Guaraní com jantar festivo incluído.' },
    en: { name: 'Rafahin Show with Dinner', desc: 'Guaraní cultural show with festive dinner included.' },
  },
  {
    id: 'caboclos', day: 6, location: 'Amazônia', locEmoji: '🌿', price: 40,
    de: { name: 'Ausflug zu den Caboclos', desc: 'Maniok-Farm der Caboclos — authentisches Amazonas-Dorfleben entdecken.' },
    pt: { name: 'Visita aos Caboclos', desc: 'Roça de mandioca dos caboclos — vida ribeirinha amazônica genuína.' },
    en: { name: 'Caboclos Village Visit', desc: 'Manioc farm of the Caboclos — authentic Amazon riverside life.' },
  },
  {
    id: 'stadtspaziergang', day: 9, location: 'Rio de Janeiro', locEmoji: '🏖', price: 50,
    de: { name: 'Stadtspaziergang Rio', desc: 'Historisches Zentrum + Caipirinha in Santa Teresa — Rios verborgene Seiten.' },
    pt: { name: 'Caminhada pelo Rio', desc: 'Centro histórico + caipirinha em Santa Teresa — o Rio além do cartão-postal.' },
    en: { name: 'Rio City Walk', desc: 'Historic downtown + caipirinha in Santa Teresa — Rio\'s hidden side.' },
  },
  {
    id: 'corcovado', day: 10, location: 'Rio de Janeiro', locEmoji: '🏖', price: 125,
    de: { name: 'Corcovado / Christusstatue', desc: 'Auffahrt zum Wahrzeichen Rios — 360°-Panoramablick über die Guanabara-Bucht.' },
    pt: { name: 'Corcovado / Cristo Redentor', desc: 'Subida ao ícone do Rio — vista panorâmica de 360° da Baía de Guanabara.' },
    en: { name: 'Corcovado / Christ the Redeemer', desc: 'Rio\'s most iconic landmark — 360° panoramic view over Guanabara Bay.' },
  },
  {
    id: 'samba', day: 10, location: 'Rio de Janeiro', locEmoji: '🏖', price: 120,
    de: { name: 'Samba-Show', desc: 'Glanzvolle Tanzshow mit Sambistas in Kostümen — pulsierendes Carioca-Erlebnis.' },
    pt: { name: 'Show de Samba', desc: 'Espetáculo deslumbrante com sambistas fantasiados — energia carioca pura.' },
    en: { name: 'Samba Show', desc: 'Spectacular costumed sambistas — pure Carioca rhythm and energy.' },
  },
  {
    id: 'bahia-by-night', day: 12, location: 'Salvador', locEmoji: '🎭', price: 155,
    de: { name: 'Bahia by Night', desc: 'Dinner + Capoeira + Maculelê + Afoxé — die Seele Bahias bei Nacht erleben.' },
    pt: { name: 'Bahia by Night', desc: 'Jantar + Capoeira + Maculelê + Afoxé — a alma da Bahia ao anoitecer.' },
    en: { name: 'Bahia by Night', desc: 'Dinner + Capoeira + Maculelê + Afoxé — the soul of Bahia after dark.' },
  },
  {
    id: 'cachoeira', day: 13, location: 'Salvador', locEmoji: '🎭', price: 165,
    de: { name: 'Cachoeira + Mittagessen', desc: 'Koloniale Flussstadt am São Francisco + lebendige Candomblé-Kultur Bahias.' },
    pt: { name: 'Cachoeira + Almoço', desc: 'Cidade colonial às margens do São Francisco + Candomblé — Bahia profunda.' },
    en: { name: 'Cachoeira + Lunch', desc: 'Colonial river town on the São Francisco + living Candomblé culture.' },
  },
]

const TRIP = `OPERATOR: OPCO Tours | opcotours.com | +5521-97565-5173 | carlos@opcotours.com
DURATION: 15 days/14 nights | GROUP: 2-14 pax | AIRLINE: LATAM Airlines (LA)
TRAVEL DATES: 2 Aug 2026 (Day 1) — 16 Aug 2026 (Day 15)

ITINERARY:
Day 1 (Sun 2 Aug) - OVERNIGHT FLIGHT Frankfurt->Sao Paulo: LA8071 FRA 21:30->GRU 04:35
Day 2 (Mon 3 Aug) - FOZ DO IGUACU: LA3200 GRU 07:30->IGU 09:20. Transfer->Recanto Cataratas Thermas Resort. Caipirinha welcome drink. Brazilian side waterfalls (2.5km walkways). Optional: Macuco Boat Safari EUR 135.
Day 3 (Tue 4 Aug) - FOZ DO IGUACU: Argentine side waterfalls (Garganta del Diablo). Free time/pool. Optional: Rafahin Show mit Dinner EUR 95.
Day 4 (Wed 5 Aug) - MANAUS: Checkout. LA3879 IGU 14:50->GRU 16:35. LA3562 GRU 18:50->MAO 21:45. Check-in Blue Tree Premium Manaus. Guide Manaus: Rosalina Fernandes +5592993363882
Day 5 (Thu 6 Aug) - AMAZON JUNGLE LODGE: Checkout Blue Tree. Transfer->Porto de Manaus. Speedboat->Amazon Village Jungle Lodge ~70min (past Meeting of Waters). Welcome drink. Canoe igapo. Piranha fishing. Sunset on river. Alligator spotting night tour.
Day 6 (Fri 7 Aug) - AMAZON: Breakfast. Jungle trek flora/fauna. Optional: Ausflug zu den Caboclos EUR 40 (manioc farm visit). Canoe Acajatuba Village community. Night boat tour (caimans, frogs, birds).
Day 7 (Sat 8 Aug) - MANAUS: Breakfast lodge. Speedboat back. Check-in Blue Tree. Visit Palácio Rio Negro + local markets. Lunch included. City tour + Teatro Amazonas.
Day 8 (Sun 9 Aug) - RIO DE JANEIRO: Checkout. LA3469 MAO 11:35->GRU 16:30. LA3874 GRU 17:45->GIG 18:45. Check-in Hilton Rio Copacabana. Guide Rio: Ana Raquel +5521988811192
Day 9 (Mon 10 Aug) - RIO: City tour: Sugarloaf Mountain, Sambodrome. Free afternoon. Optional: Stadtspaziergang Rio EUR 50 (downtown+caipirinha Santa Teresa). Dinner tip: Churrascaria Palace (walking distance).
Day 10 (Tue 11 Aug) - RIO: Free day. Beach Copacabana. Optional: Corcovado/Christ Redeemer EUR 125. Optional Samba Show EUR 120. Optional: Museu do Amanhã or walk Selarón Steps to Santa Teresa.
Day 11 (Wed 12 Aug) - SALVADOR: Checkout Hilton. LA3672 GIG 07:00->SSA 09:00. Check-in Novotel Salvador Rio Vermelho. Guide Salvador: Anke Landgraf +5571-999524442
Day 12 (Thu 13 Aug) - SALVADOR: Half-day historical city tour, Pelourinho, Capoeira. Optional Bahia by Night Show incl. dinner EUR 155.
Day 13 (Fri 14 Aug) - SALVADOR: Free day. Optional Cachoeira incl. lunch EUR 165. Farewell dinner with guide (included).
Day 14 (Sat 15 Aug) - OVERNIGHT RETURN: Checkout. LA3355 SSA 18:40->GRU 21:10. LA8070 GRU 23:45->FRA 16:25 (next day).
Day 15 (Sun 16 Aug) - ARRIVAL FRANKFURT.

HOTELS:
1. Recanto Cataratas Thermas Resort & Convention - Foz do Iguacu (Days 2-4), 2 nights, breakfast. Tel: +55 45 2102-3000. Av. Costa e Silva 3500.
2. Blue Tree Premium Manaus - Manaus (Day 4 + Days 7-8), 2 nights total, breakfast. Tel: +55 92 3303-2000. Av Umberto Calderaro Filho 817, Adrianópolis.
3. Amazon Village Jungle Lodge - Amazon (Days 5-7), 2 nights, full board + all activities. Tel: +55 92 3633-1444. ~30km from Manaus. Mosquito nets, fan, hot shower, hammock veranda, pool, bar, restaurant, 24h reception.
4. Hilton Rio de Janeiro Copacabana - Rio (Days 8-11), 3 nights, breakfast. Tel: +55 21 3501-8000. Av. Atlântica 1020, Copacabana.
5. Novotel Salvador Rio Vermelho - Salvador (Days 11-14), 3 nights, breakfast. Tel: +55 71 2103-2233. Rua Monte Conselho 505, Rio Vermelho. Restaurant, bar, gym, tennis, sauna. Near: Porto da Barra beach, fish market.

INCLUDED: All accommodation, breakfast all hotels, full board+activities at Jungle Lodge, all excursions+transfers as described, German-speaking local guides, caipirinha welcome drink Foz, lunches on Days 7 and 13.

NOT INCLUDED: Drinks, personal expenses, international and domestic flights + airport taxes, visa, optional excursions.

OPTIONAL EXCURSIONS: Macuco Boat Safari EUR 135 | Rafahin Show mit Dinner EUR 95 | Ausflug zu den Caboclos EUR 40 | Stadtspaziergang Rio EUR 50 | Corcovado EUR 125 | Samba Show EUR 120 | Bahia by Night incl. dinner EUR 155 | Cachoeira incl. lunch EUR 165

GUIDES: Foz: Jair Johanns +5548-84725462 | Manaus city: Rosalina Fernandes +5592993363882 | Lodge: Rosalina Fernandes +5592993363882 | Rio: Ana Raquel +5521988811192 | Salvador: Anke Landgraf +5571-999524442

AMAZON TIPS: Pack: light rain jacket, sturdy shoes, sunglasses, binoculars, flashlight, insect repellent, sunscreen, swimwear, personal medicine. Speedboat ~70min no AC. Dry season (Sep-Dec): lower water level, possible short walk. Wet season (Jan-Aug): higher water = better wildlife viewing. No luggage restrictions. Emergency flashlight in each room. Bring cash (Brazilian Real).`

const ERROR_MSGS = {
  de: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie OPCO Tours: carlos@opcotours.com',
  pt: 'Ocorreu um erro. Tente novamente ou contate a OPCO Tours: carlos@opcotours.com',
  en: 'An error occurred. Please try again or contact OPCO Tours: carlos@opcotours.com',
}

function BubbleText({ text }) {
  return (
    <div className="bubble" dangerouslySetInnerHTML={{
      __html: text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>'),
    }} />
  )
}

function TypingDots() {
  return (
    <div className="bubble">
      <div className="typing-dots"><span /><span /><span /></div>
    </div>
  )
}

function ExcursionCard({ excursion, lang, t, onBook, isBooking }) {
  return (
    <div className={`ex-card${isBooking ? ' ex-card--loading' : ''}`}>
      <div className="ex-card__meta">
        <span className="ex-card__loc">{excursion.locEmoji} {excursion.location}</span>
        <span className="ex-card__day">{t.day} {excursion.day}</span>
      </div>
      <h3 className="ex-card__name">{excursion[lang].name}</h3>
      <p className="ex-card__desc">{excursion[lang].desc}</p>
      <div className="ex-card__footer">
        <span className="ex-card__price">EUR {excursion.price}</span>
        <button className="ex-card__btn" onClick={() => onBook(excursion)} disabled={isBooking}>
          {isBooking ? t.booking : t.book}
          {!isBooking && <span className="ex-card__arrow">→</span>}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLangState] = useState('de')
  const [tab, setTab] = useState('chat')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingSet, setBookingSet] = useState(new Set())
  const [paymentBanner, setPaymentBanner] = useState(null)
  const historyRef = useRef([])
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const payment = params.get('payment')
    if (payment === 'success' || payment === 'cancelled') {
      setPaymentBanner(payment)
      setTab('excursoes')
      window.history.replaceState({}, '', window.location.pathname)
      setTimeout(() => setPaymentBanner(null), 7000)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'bot', text: LANGS['de'].welcome }])
    }, 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  function switchLang(l) {
    setLangState(l)
    historyRef.current = []
    setMessages([{ role: 'bot', text: LANGS[l].welcome }])
  }

  async function sendMessage(text) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)

    const newHistory = [...historyRef.current, { role: 'user', content: msg }]
    historyRef.current = newHistory

    setMessages(prev => [
      ...prev,
      { role: 'user', text: msg },
      { role: 'bot', typing: true },
    ])

    const sys =
      LANGS[lang].sysLang +
      '\n\nYou are the official travel assistant for "Die Vielfalt Brasiliens - Gebeco" by OPCO Tours. Answer questions accurately based on the trip information below. If something is not in the trip info, say you don\'t have that information but provide the guide or operator contact. Be concise.\n\n' +
      TRIP

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, system: sys }),
      })
      const data = await r.json()
      const reply = data?.content?.[0]?.text
      if (!reply) throw new Error('empty')
      historyRef.current = [...newHistory, { role: 'assistant', content: reply }]
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'bot', text: reply },
      ])
    } catch {
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'bot', text: ERROR_MSGS[lang] },
      ])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  async function bookExcursion(excursion) {
    setBookingSet(prev => new Set([...prev, excursion.id]))
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excursionId: excursion.id,
          excursionName: excursion[lang].name,
          price: excursion.price,
          location: excursion.location,
          origin: window.location.origin,
        }),
      })
      const data = await r.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error === 'stripe_not_configured'
          ? LANGS[lang].noStripe
          : data.error || 'Checkout error')
      }
    } catch {
      alert(LANGS[lang].noStripe)
    }
    setBookingSet(prev => {
      const next = new Set(prev)
      next.delete(excursion.id)
      return next
    })
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleInput(e) {
    const el = e.target
    setInput(el.value)
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 80) + 'px'
  }

  const t = LANGS[lang]

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__inner">
          <span className="site-header__flag">🇧🇷</span>
          <h1 className="site-header__title">
            Die Vielfalt<br /><em>Brasiliens</em>
          </h1>
          <p className="site-header__sub">Gebeco · OPCO Tours · 15 Tage · Frankfurt → Brasilien → Frankfurt</p>
          <div className="destinos">
            <span>✈ Frankfurt</span>
            <span className="destinos__sep">·</span>
            <span>💧 Foz do Iguaçu</span>
            <span className="destinos__sep">·</span>
            <span>🌿 Amazônia</span>
            <span className="destinos__sep">·</span>
            <span>🏖 Rio de Janeiro</span>
            <span className="destinos__sep">·</span>
            <span>🎭 Salvador</span>
          </div>
          <div className="lang-bar">
            {[['de', '🇩🇪 Deutsch'], ['pt', '🇧🇷 Português'], ['en', '🇬🇧 English']].map(([l, label]) => (
              <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => switchLang(l)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <nav className="tab-nav">
        <button className={`tab-btn${tab === 'chat' ? ' active' : ''}`} onClick={() => setTab('chat')}>
          💬 {t.tabChat}
        </button>
        <button className={`tab-btn${tab === 'excursoes' ? ' active' : ''}`} onClick={() => setTab('excursoes')}>
          🗺 {t.tabEx}
        </button>
      </nav>

      <main className="main-content">
        {paymentBanner && (
          <div className={`payment-banner payment-banner--${paymentBanner}`}>
            {paymentBanner === 'success' ? t.payOk : t.payCancel}
          </div>
        )}

        {tab === 'chat' && (
          <div className="chat-wrapper">
            <div className="chat-box">
              <div className="messages" ref={messagesRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    <div className={`avatar ${m.role}`}>{m.role === 'bot' ? '🌿' : '👤'}</div>
                    {m.typing ? <TypingDots /> : <BubbleText text={m.text} />}
                  </div>
                ))}
              </div>
              <div className="suggestions">
                {t.suggestions.map(s => (
                  <button key={s} className="sugg-btn" onClick={() => sendMessage(s)} disabled={loading}>{s}</button>
                ))}
              </div>
            </div>
            <div className="input-area">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                placeholder={t.placeholder}
                onKeyDown={handleKey}
                onInput={handleInput}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {tab === 'excursoes' && (
          <div className="ex-grid">
            {EXCURSIONS.map(ex => (
              <ExcursionCard
                key={ex.id}
                excursion={ex}
                lang={lang}
                t={t}
                onBook={bookExcursion}
                isBooking={bookingSet.has(ex.id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="site-footer">Powered by OPCO Tours · claude.ai</footer>
    </div>
  )
}
