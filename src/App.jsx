import { useState, useEffect, useRef } from 'react'

const LANGS = {
  de: {
    placeholder: 'Stellen Sie eine Frage zur Reise...',
    welcome: 'Herzlich willkommen bei Ihrem **Rio Karneval-Sieger Reiseassistenten**! 🎉\n\nIch begleite Sie auf der **8-tägigen Univentra-Reise** nach Rio de Janeiro — vom Corcovado über die Karnevals-Siegerparade bis zum Zuckerhut.\n\n**Wie kann ich Ihnen heute helfen?**',
    suggestions: ['Tagesablauf anzeigen', 'Hotel & Unterkünfte', 'Was ist inbegriffen?', 'Karnevalstickets', 'Preise & Optionen', 'Kontakt OPCO Tours'],
    sysLang: 'Antworte IMMER auf Deutsch. Sei freundlich, präzise und enthusiastisch für Rio Karneval. Nutze Emojis sparsam.',
    tabChat: 'Assistent',
    tabEx: 'Optionale Ausflüge',
    day: 'Tag',
    book: 'Jetzt buchen',
    booking: 'Wird gebucht…',
    payOk: '✓ Buchung erfolgreich! Bestätigung kommt per E-Mail.',
    payCancel: 'Buchung wurde abgebrochen.',
    noStripe: 'Online-Buchung noch nicht verfügbar — bitte kontaktieren Sie OPCO Tours: carlos@opcotours.com',
  },
  pt: {
    placeholder: 'Faça uma pergunta sobre a viagem...',
    welcome: 'Olá! Bem-vindo ao assistente de viagem **Rio Karneval-Sieger · Univentra**! 🎉\n\nEstou aqui para ajudá-lo nos **8 dias em Rio de Janeiro** — do Corcovado ao Desfile das Campeãs no Sambódromo e ao Pão de Açúcar.\n\n**Como posso te ajudar hoje?**',
    suggestions: ['Ver roteiro dia a dia', 'Hotel e hospedagem', 'O que está incluído?', 'Ingressos do Carnaval', 'Preços e opções', 'Contato OPCO Tours'],
    sysLang: 'Responda SEMPRE em português brasileiro. Seja amigável, preciso e entusiasmado com o Carnaval do Rio. Use emojis com moderação.',
    tabChat: 'Assistente',
    tabEx: 'Passeios Opcionais',
    day: 'Dia',
    book: 'Reservar',
    booking: 'Aguarde…',
    payOk: '✓ Reserva confirmada! Verifique seu e-mail.',
    payCancel: 'Reserva cancelada.',
    noStripe: 'Reservas online em breve — contate a OPCO Tours: carlos@opcotours.com',
  },
  en: {
    placeholder: 'Ask a question about the trip...',
    welcome: "Welcome to your **Rio Karneval-Sieger Travel Assistant**! 🎉\n\nI'm here to help throughout your **8-day Univentra journey** to Rio de Janeiro — from Corcovado and the Champion Samba School Parade to Sugarloaf Mountain.\n\n**How can I help you today?**",
    suggestions: ['Show daily itinerary', 'Hotel & accommodation', "What's included?", 'Carnival tickets', 'Prices & options', 'Contact OPCO Tours'],
    sysLang: 'ALWAYS respond in English. Be friendly, precise and enthusiastic about Rio Carnival. Use emojis sparingly.',
    tabChat: 'Assistant',
    tabEx: 'Optional Excursions',
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
    id: 'baleia',
    day: 2,
    location: 'Rio de Janeiro',
    locEmoji: '🦞',
    price: 100,
    currency: 'USD',
    de: {
      name: 'Dinner Restaurant Baleia',
      desc: 'Exquisites Meeresfrüchte-Restaurant im Aterro do Flamengo — unvergesslicher erster Abend in Rio.',
    },
    pt: {
      name: 'Jantar Restaurante Baleia',
      desc: 'Requintado restaurante de frutos do mar no Aterro do Flamengo — primeira noite inesquecível no Rio.',
    },
    en: {
      name: 'Dinner at Restaurant Baleia',
      desc: 'Exquisite seafood restaurant at Aterro do Flamengo — unforgettable first evening in Rio.',
    },
  },
  {
    id: 'carnaval-backstage',
    day: 3,
    location: 'Rio de Janeiro',
    locEmoji: '🎭',
    price: 99,
    currency: 'USD',
    de: {
      name: 'Carnaval Backstage-Tour',
      desc: 'Blick hinter die Kulissen im Cidade do Samba: Kostüme, Festwagenbau, Welcome Caipirinha — exklusiv.',
    },
    pt: {
      name: 'Tour Backstage Carnaval',
      desc: 'Bastidores do Cidade do Samba: fantasias, construção de carros alegóricos, Welcome Caipirinha.',
    },
    en: {
      name: 'Carnival Backstage Tour',
      desc: 'Behind the scenes at Cidade do Samba: costumes, float construction and welcome Caipirinha.',
    },
  },
  {
    id: 'marius',
    day: 5,
    location: 'Rio de Janeiro',
    locEmoji: '🦐',
    price: 60,
    currency: 'USD',
    de: {
      name: 'Marius Crustáceos Dinner',
      desc: 'Spektakuläres Meeresfrüchte-Buffet Rodízio — so viel wie man mag, direkt an der Copacabana.',
    },
    pt: {
      name: 'Jantar Marius Crustáceos',
      desc: 'Espetacular buffet rodízio de frutos do mar — à vontade, à beira da Copacabana.',
    },
    en: {
      name: 'Marius Crustáceos Dinner',
      desc: 'Spectacular all-you-can-eat seafood rodízio buffet, right by Copacabana beach.',
    },
  },
]

const TRIP = `OPERATOR: OPCO Tours | opcotours.com | +5521-975655173 | carlos@opcotours.com
CLIENT: Univentra
DURATION: 8 Tage/7 Nächte | Rio de Janeiro | GROUP: 0 Personen (offen)
TRAVEL DATES: 11. Februar 2027 (Tag 1) — 18. Februar 2027 (Tag 8)
AUSSTELLUNGSDATUM: 18. Juni 2026

ITINERARY:
Tag 1 (Do, 11. Feb) - NACHTFLUG: Reisebeginn mit dem Nachtflug ab Deutschland/Luxemburg nach Rio de Janeiro. Entspannen an Bord und freuen Sie sich auf die "Cidade Maravilhosa".
Tag 2 (Fr, 12. Feb) - ANKUNFT RIO DE JANEIRO: Am Morgen Ankunft am Flughafen Galeão (GIG). Empfang durch deutschsprachige Reiseleitung. Da die Zimmer noch nicht bezugsfertig sind, beginnen wir mit einer ausführlichen Orientierungsfahrt entlang der berühmten Strände von Copacabana, Ipanema und Leblon. Möglichkeit zum ersten brasilianischen Frühstück. Am Nachmittag Check-in im Hilton Rio de Janeiro Copacabana. Freizeit. Optional: Abendessen Restaurant Baleia (Meeresfrüchte, Aterro do Flamengo) ~USD 100/Person, Guide & Transport inbegriffen.
Tag 3 (Sa, 13. Feb) - CORCOVADO & DESFILE DAS CAMPEÃS: Auffahrt zum Corcovado mit der Zahnradbahn zur weltberühmten Christusstatue (Cristo Redentor) und atemberaubendem Panorama. Danach exklusiver Spaziergang auf der Avenida Presidente Vargas: Besichtigung der Karnevalswagen (Carros Alegóricos) aus nächster Nähe, während sie für den Umzug vorbereitet werden. HÖHEPUNKT DER REISE: Desfile das Campeãs im Sambódromo (Arquibancada Sektor 9) — die Parade der siegreichen Sambaschulen, das spektakuläre Finale des Karnevals von Rio! Optional: Carnaval Experience Backstage-Tour mit Welcome Caipirinha ~USD 99/Person; Optional: Atelierbesuch Sambaschule ~USD 99/Person.
Tag 4 (So, 14. Feb) - FREIER TAG: Tag zur freien Verfügung. Strand Copacabana, Rio auf eigene Faust erkunden oder Eindrücke der Karnevalsnacht genießen.
Tag 5 (Mo, 15. Feb) - ZUCKERHUT: Auffahrt mit der Seilbahn auf den Zuckerhut (Pão de Açúcar) — grandiosen Ausblick über die Guanabara-Bucht, die Strände und die Stadt genießen. Optional: Dinner Marius Crustáceos (spektakuläres Meeresfrüchte-Buffet Rodízio) ~USD 60 Aufpreis/Person. Alternative: Hotel-Buffet-Dinner (~USD 60 Aufpreis/Person).
Tag 6 (Di, 16. Feb) - KOLONIALES RIO: Entdeckungstour durch das historische und koloniale Rio: Stadtzentrum, Künstlerviertel Santa Teresa, Lapa-Bögen, bunte Selarón-Treppe. Am Abend gemeinsames Abendessen in der bekannten Churrascaria Carretão, Ipanema (im Reisepreis enthalten, brasilianisches Rodízio-Grillbuffet).
Tag 7 (Mi, 17. Feb) - RÜCKFLUG: Freizeit bis zum Transfer zum Flughafen. Rückflug nach Deutschland/Luxemburg.
Tag 8 (Do, 18. Feb) - ANKUNFT FRANKFURT/LUXEMBURG. Ende einer unvergesslichen Reise.

TRANSFERS:
- 12. Feb: Flughafen Rio de Janeiro Galeão (GIG) → Hilton Rio de Janeiro Copacabana
- 17. Feb: Hilton Rio de Janeiro Copacabana → Flughafen Galeão (GIG)
- Geplanter Rückflug 17. Feb ab GIG nach FRA

HOTEL (Hauptunterkunft):
Hilton Rio de Janeiro Copacabana (4*+, direkt an der Copacabana) — 5 Übernachtungen, Frühstück inbegriffen
Adresse: Avenida Atlântica 1020, Rio de Janeiro, 22010-000 | Tel: +55 21 3501-8000
Ausstattung: Dachpool, Außenrestaurant, Fitnesscenter, Spa, Tagungsräume, Klimaanlage, WLAN, Minibar, Kaffee-/Teekocher, Haartrockner.
Lage: 15 Minuten bis Zuckerhut, Maracanã-Stadion und Selarón-Treppe.

HOTEL PREISOPTIONEN (pro Person, Doppelzimmer, USD):
1. Hilton Copacabana (4*+, direkt Copacabana): 15+1: USD 5.448 | 20+1: USD 5.118 | 25+1: USD 4.941 | EZ-Zuschlag: USD 3.897
2. PortoBay Copacabana (3,5+, direkt Copacabana): 15+1: USD 2.790 | 20+1: USD 2.528 | 25+1: USD 2.396 | EZ-Zuschlag: USD 1.590
3. Windsor Marapendi (3,5+, direkt Sernambetiba, Barra da Tijuca): 15+1: USD 1.767 | 20+1: USD 1.557 | 25+1: USD 1.143 | EZ-Zuschlag: USD 612
Erläuterung: 15+1 / 20+1 / 25+1 = Gruppengröße inkl. einem Freiplatz im Einzelzimmer pro Gruppe. EZ-Zuschlag = Aufpreis pro Person für Einzelzimmer. Hotels in 2. und 3. Reihe bereits ausgebucht.

INCLUDED: 5 Übernachtungen im gewählten Hotel inkl. Frühstück. Alle Transfers und Ausflüge im klimatisierten Reisebus. Deutschsprachige örtliche Reiseleitung. Eintritt Corcovado / Cristo Redentor. Eintritt Zuckerhut / Pão de Açúcar. Eintrittskarte Desfile das Campeãs (Arquibancada Sektor 9). Orientierungsfahrt. Spaziergang zu den Karnevalswagen (Av. Presidente Vargas). Tour "Koloniales Rio". Abendessen Churrascaria Carretão Ipanema (Tag 6).

NOT INCLUDED: Internationale Flüge. Inlandsflüge. Reiseversicherung. Mahlzeiten außer Frühstück und Abendessen Tag 6. Getränke. Trinkgelder und persönliche Ausgaben. Optionale Programme und Upgrades. VISA Services (Schengen-Besucher benötigen derzeit kein Visum für Brasilien).

OPTIONAL EXCURSIONS: Carnaval Experience Backstage-Tour (Cidade do Samba, inkl. Welcome Drink): ~USD 99/Person | Dinner Restaurant Baleia (Meeresfrüchte, Tag 2): ~USD 100/Person | Marius Crustáceos (Meeresfrüchte-Rodízio, Tag 5): ~USD 60 Aufpreis/Person | Atelierbesuch Sambaschule: ~USD 99/Person

PAYMENT & BOOKING: 20% sofortige Anzahlung. 60% nach 30 Tagen (damit können Hotels und Karnevalstickets garantiert werden). Restbetrag 60 Tage vor Reisebeginn. STORNIERUNG: 100% Stornierungsgebühr — keine Rückerstattung! Hotelsoptionen für die nächsten 2 Wochen reserviert.

CONTACT: Carlos Silva | carlos@opcotours.com | +5521-975655173 | opcotours.com
EMERGENCY: +5521-975655173 | carlos@opcotours.com`

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
        <span className="ex-card__price">{excursion.currency} {excursion.price}</span>
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
      '\n\nYou are the official travel assistant for "Rio Karneval-Sieger" by Univentra and OPCO Tours. Answer questions accurately based on the trip information below. If something is not in the trip info, say you don\'t have that information but provide the guide or operator contact. Be concise.\n\n' +
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
          <span className="site-header__flag">🎉🇧🇷🎊</span>
          <h1 className="site-header__title">
            Rio Karneval<br /><em>Sieger-Parade</em>
          </h1>
          <p className="site-header__sub">Univentra · OPCO Tours · 8 Tage · 11.–18. Februar 2027</p>
          <div className="destinos">
            <span>✈ Deutschland/Luxemburg</span>
            <span className="destinos__sep">·</span>
            <span>✝ Corcovado</span>
            <span className="destinos__sep">·</span>
            <span>🎭 Sambódromo</span>
            <span className="destinos__sep">·</span>
            <span>🌅 Copacabana</span>
            <span className="destinos__sep">·</span>
            <span>⛰ Zuckerhut</span>
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
                    <div className={`avatar ${m.role}`}>{m.role === 'bot' ? '🎭' : '👤'}</div>
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

      <footer className="site-footer">Powered by Univentra · OPCO Tours · claude.ai</footer>
    </div>
  )
}
