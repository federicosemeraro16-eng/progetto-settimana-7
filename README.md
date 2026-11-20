⚽ SportsHub — App Squadre Sportive

Mini web app responsive che permette di cercare squadre sportive e vedere il loro ultimo risultato e il prossimo evento, usando i dati di TheSportsDB.

Progetto realizzato durante il percorso EPICODE (settimana 7) con HTML, Bootstrap 5 e JavaScript asincrono.

📸 Cosa fa l'app
🔍 Ricerca squadre per nome (parte al click su "Cerca" oppure da sola mentre scrivi)
🃏 Card con logo, nome, campionato e paese della squadra
📅 Eventi: cliccando una card vedi i prossimi eventi e gli ultimi risultati della squadra
🪟 Modale: cliccando una partita si apre una finestra con i dettagli (loghi, risultato, campionato, giornata, data, orario e stadio)
⭐ Preferiti salvati nel localStorage, che restano anche dopo aver ricaricato la pagina
🏷️ Filtro per sport (Calcio, Basket, Football americano)
⏳ Spinner durante il caricamento e alert in caso di errore
✅ Livelli della consegna
Versione base
[x] Pagina responsive con Bootstrap (mobile, tablet, desktop)
[x] Ricerca squadre con fetch e async/await
[x] Gestione errori con try/catch, spinner e alert
[x] Lista di card, con ultimo e prossimo evento al click
[x] All'avvio l'app parte vuota
Versione intermedia
[x] Preferiti in localStorage (aggiunta e rimozione)
[x] Debounce sulla ricerca (400 ms)
[x] AbortController per annullare la ricerca precedente
Versione avanzata
[x] Preferiti caricati all'avvio
[x] Eventi ordinati per data
[x] Filtro per sport
[x] Modale con i dettagli dell'evento
[x] JavaScript diviso in moduli
🛠️ Tecnologie usate
HTML5
CSS3 (con variabili CSS)
Bootstrap 5.3 (griglia, componenti, modale)
JavaScript (ES6+): classi, fetch, async/await, Promise.all, moduli import/export
API: TheSportsDB (versione gratuita)
📁 Struttura del progetto
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    └── scripts/
        ├── scripts.js   → file principale: listener, filtro, avvio dell'app
        ├── config.js    → URL dell'API e chiavi
        ├── models.js    → classi Team e Match
        ├── dom.js       → elementi della pagina
        ├── ui.js        → spinner e alert
        ├── api.js       → chiamate all'API
        ├── storage.js   → preferiti nel localStorage
        └── render.js    → creazione di card, eventi e modale

Ho diviso il codice in file in base alla responsabilità: ogni file si occupa di una cosa sola.

🌐 Endpoint dell'API usati
Endpoint	A cosa serve
searchteams.php?t=nome	cerca le squadre per nome
eventsnext.php?id=idTeam	prossimi eventi della squadra
eventslast.php?id=idTeam	ultimi risultati della squadra

L'app fa solo richieste in lettura (GET).

▶️ Come avviarlo
Scarica o clona il progetto
Aprilo con VS Code
Avvia index.html con l'estensione Live Server

⚠️ Il JavaScript usa i moduli (type="module"), quindi aprendo il file con doppio click (file://) non funziona: serve un server locale come Live Server.

Non serve installare niente: Bootstrap è collegato tramite CDN.

⚠️ Limiti della chiave gratuita

Uso la chiave pubblica gratuita di TheSportsDB (123), che ha alcuni limiti:

la ricerca è limitata: in pratica restituisce risultati quasi solo per "Arsenal"
gli eventi a volte mostrano solo le partite in casa, oppure nessun evento
c'è un limite di richieste al minuto

Per provare l'app ti consiglio quindi di cercare Arsenal.

💡 Cosa ho imparato
Usare fetch con async/await e gestire gli errori con try/catch/finally
Che fetch non va nel catch da sola con un errore 404: va controllato response.ok
Creare elementi con createElement invece di innerHTML
Fare partire più richieste insieme con Promise.all
Salvare e leggere dati dal localStorage con JSON.stringify e JSON.parse
Usare il reviver di JSON.parse per trasformare le date in oggetti Date
Debounce con setTimeout / clearTimeout
Annullare le richieste con AbortController
Dividere il codice in moduli con import ed export
Fare debug leggendo gli errori in console e usando console.log sui dati
🔮 Possibili miglioramenti
Usare l'oggetto URL con searchParams per costruire gli URL in modo più sicuro
Aggiungere una dark mode
Messaggio diverso quando il filtro per sport non trova squadre
Usare una chiave API premium per avere la ricerca completa
👤 Autore

Federico — studente del Master Full-Stack AI Developer di EPICODE
