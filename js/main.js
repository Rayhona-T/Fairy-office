/**
 * The Fairy Post Office & The Moon's Apartment - Main Application Controller
 * Manages object interactions, the bookshelf, journal, dream jars, telescope,
 * balcony with wishes, locked drawer mystery, discovery system, and random events.
 */

import {
  loadRecipients,
  loadLetters,
  saveNewLetter,
  getSavedLetters,
  loadIncomingLetters,
  getVisitorLetters,
  loadBooks,
  loadJournal,
  loadDreams,
  loadTelescopeSightings,
  loadWishes,
  saveWish,
  getDiscoveries,
  recordDiscovery,
  getTotalDiscoveryCount,
  getDrawerState,
  setHasBrassKey,
  unlockDrawer,
  resetAllLocalData
} from './data.js';

import {
  initFirefliesCanvas,
  initTelescopeCanvas,
  initBalconyCanvas,
  updateFairyClock,
  pauseClockTemporarily,
  isClockCurrentlyPaused,
  moonAudio
} from './interactions.js';

// Application State
let allRecipients = [];
let allLetters = [];
let allIncomingLetters = [];
let allVisitorLetters = [];
let allBooks = [];
let allJournalEntries = [];
let allDreams = [];
let allSightings = [];
let currentJournalIndex = 0;
let currentScene = 'glade'; // 'glade' or 'interior'
let currentStation = 'desk'; // 'desk', 'bookshelf', 'journal', 'dreams', 'telescope', 'balcony', 'mailbox', 'recipients', 'archive'
let currentMailboxTab = 'letters-for-you'; // 'letters-for-you' or 'my-letters'
let selectedStamp = '🌙';
let selectedWax = 'rose-gold';
let candleLit = true;
let deskLampOn = true;
let mailboxWarmTimeout = null;
let fairyFlybyCooldown = false;
const letterReadCounts = {};

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize ambient canvas
  initFirefliesCanvas('fireflies-canvas');

  // Fairy Clock
  updateFairyClock();
  setInterval(updateFairyClock, 30000);

  // Load all datasets
  [allRecipients, allLetters, allIncomingLetters, allBooks, allJournalEntries, allDreams, allSightings] = await Promise.all([
    loadRecipients(),
    loadLetters(),
    loadIncomingLetters(),
    loadBooks(),
    loadJournal(),
    loadDreams(),
    loadTelescopeSightings()
  ]);

  allVisitorLetters = getVisitorLetters();

  // Populate UI
  renderRecipientOptions();
  renderRecipientsGrid();
  renderLettersArchive();
  renderBookshelf();
  renderDreamJars();
  renderWishesList();
  setupMailboxSanctuary();
  updateDiscoveryBadge();
  updateMailboxStats();

  // Setup Systems
  setupSceneNavigation();
  setupStationNavigation();
  setupObjectInteractions();
  setupWritingDeskSanctuary();
  setupLockedDrawerSystem();
  setupJournalReader();
  setupTelescopeViewer();
  setupBalconyWishSystem();
  setupDiscoveryNotesModal();
  setupAudioControls();
  setupRandomMagicalEvents();
  setupModalHandlers();
});

/**
 * Scene Navigation: Exterior Forest Glade <-> The Moon's Apartment
 */
function setupSceneNavigation() {
  const gladeScene = document.getElementById('scene-glade');
  const interiorScene = document.getElementById('scene-interior');
  const btnEnter = document.getElementById('btn-enter-post-office');
  const cottageDoor = document.getElementById('cottage-door');
  const btnReturnOutside = document.getElementById('btn-return-outside');
  const tinyMailboxPost = document.getElementById('tiny-mailbox-post');
  const btnGladeWrite = document.getElementById('btn-glade-write-letter');
  const btnTopWrite = document.getElementById('btn-top-write-letter');

  function enterInterior(targetStation = 'desk') {
    moonAudio.playChime();
    currentScene = 'interior';
    gladeScene.style.display = 'none';
    interiorScene.classList.add('active');
    switchStation(targetStation);
    recordDiscovery('objects', 'apartment-door', "The Moon's Threshold", "Pushed open the oak door into the quiet sanctuary.");
    updateDiscoveryBadge();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function leaveToGlade() {
    moonAudio.playPaperRustle();
    currentScene = 'glade';
    interiorScene.classList.remove('active');
    gladeScene.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnEnter) btnEnter.addEventListener('click', () => enterInterior('desk'));
  if (cottageDoor) cottageDoor.addEventListener('click', () => enterInterior('desk'));
  if (btnReturnOutside) btnReturnOutside.addEventListener('click', leaveToGlade);

  if (btnGladeWrite) {
    btnGladeWrite.addEventListener('click', () => {
      enterInterior('desk');
      const textarea = document.getElementById('real-paper-textarea');
      if (textarea) setTimeout(() => textarea.focus(), 250);
    });
  }

  if (btnTopWrite) {
    btnTopWrite.addEventListener('click', () => {
      if (currentScene !== 'interior') {
        enterInterior('desk');
      } else {
        switchStation('desk');
      }
      const textarea = document.getElementById('real-paper-textarea');
      if (textarea) setTimeout(() => textarea.focus(), 250);
    });
  }

  const topBarMailBadge = document.getElementById('top-bar-mail-badge');
  if (topBarMailBadge) {
    topBarMailBadge.addEventListener('click', () => {
      if (currentScene !== 'interior') {
        enterInterior('mailbox');
      } else {
        switchStation('mailbox');
      }
      activateMailboxTab('letters-for-you');
    });
  }

  const btnMailboxWrite = document.getElementById('btn-mailbox-write');
  if (btnMailboxWrite) {
    btnMailboxWrite.addEventListener('click', () => {
      switchStation('desk');
      const textarea = document.getElementById('real-paper-textarea');
      if (textarea) setTimeout(() => textarea.focus(), 250);
    });
  }

  if (tinyMailboxPost) {
    tinyMailboxPost.addEventListener('click', () => {
      enterInterior('mailbox');
    });
  }
}

/**
 * Station Navigation within the Apartment
 */
function setupStationNavigation() {
  const stationButtons = document.querySelectorAll('.station-btn');
  stationButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const station = btn.getAttribute('data-station');
      if (station) {
        moonAudio.playPaperRustle();
        switchStation(station);
      }
    });
  });
}

export function switchStation(stationName) {
  currentStation = stationName;

  // Update tabs
  document.querySelectorAll('.station-btn').forEach((btn) => {
    if (btn.getAttribute('data-station') === stationName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const stations = {
    desk: document.getElementById('stage-desk'),
    bookshelf: document.getElementById('stage-bookshelf'),
    journal: document.getElementById('stage-journal'),
    dreams: document.getElementById('stage-dreams'),
    telescope: document.getElementById('stage-telescope'),
    balcony: document.getElementById('stage-balcony'),
    mailbox: document.getElementById('stage-mailbox'),
    recipients: document.getElementById('stage-recipients'),
    archive: document.getElementById('stage-archive')
  };

  Object.entries(stations).forEach(([key, el]) => {
    if (el) {
      if (key === stationName) {
        el.style.display = key === 'desk' ? 'grid' : 'flex';
      } else {
        el.style.display = 'none';
      }
    }
  });

  // Station-specific initializations
  if (stationName === 'telescope') {
    initTelescopeCanvas('telescope-canvas', allSightings, onSelectSighting);
    recordDiscovery('objects', 'telescope', 'The Brass Celestial Telescope', 'Turned toward the sky to watch distant earthlights and satellites.');
    updateDiscoveryBadge();
  } else if (stationName === 'balcony') {
    initBalconyCanvas('balcony-sky-canvas');
    recordDiscovery('objects', 'balcony', 'The Moonlit Stone Balcony', 'Stepped out into the cosmic breeze overlooking distant Earth.');
    updateDiscoveryBadge();
  } else if (stationName === 'journal') {
    renderJournalEntry(currentJournalIndex);
    recordDiscovery('objects', 'moon-journal', "The Moon's Personal Journal", 'Read handwritten thoughts kept in violet ink.');
    updateDiscoveryBadge();
  } else if (stationName === 'mailbox') {
    renderMailboxExperience();
    recordDiscovery('objects', 'grand-mailbox', 'The Grand Mossy Mailbox', 'Inspected strange incoming mail from around the world.');
    updateDiscoveryBadge();
    // 25% chance of subtle rare arrival/warmth when opening the mailbox
    if (Math.random() < 0.25) {
      setTimeout(() => triggerMailboxRareEvent(), 1200);
    }
  }
}

/**
 * Object Interaction System (Reactions, Thoughts, Memories, Discoveries, Mini-Interactions)
 */
function setupObjectInteractions() {
  // 1. Teacup: Tiny reaction (crescent steam) & Thought
  const teacup = document.getElementById('interactive-teacup');
  if (teacup) {
    teacup.addEventListener('click', () => {
      moonAudio.playDroplet();
      const steam = document.getElementById('teacup-steam-crescent');
      if (steam) {
        steam.classList.add('active');
        setTimeout(() => steam.classList.remove('active'), 2200);
      }
      showThoughtBubble(
        teacup,
        "“Tea tastes better after midnight. Especially when the water was gathered from a Tuesday raincloud over Galway.”",
        "The Moon's Midnight Teacup"
      );
      recordDiscovery('objects', 'teacup', "The Porcelain Teacup", 'Steamed with rainwater gathered over Galway.');
      updateDiscoveryBadge();
    });
  }

  // 2. Desk Lamp: Environmental change (toggle warmth/glow)
  const lamp = document.getElementById('interactive-lamp');
  if (lamp) {
    lamp.addEventListener('click', () => {
      deskLampOn = !deskLampOn;
      moonAudio.playChime(deskLampOn ? 1.1 : 0.8);
      const roomBox = document.querySelector('.interior-room-box');
      if (roomBox) {
        if (deskLampOn) {
          roomBox.classList.remove('dimmed-lights');
          lamp.classList.remove('lamp-off');
          showNotificationToast("The brass desk lamp casts a warm amber circle across the blotter.");
        } else {
          roomBox.classList.add('dimmed-lights');
          lamp.classList.add('lamp-off');
          showNotificationToast("You switch off the lamp. Moonlight floods the floorboards.");
        }
      }
      recordDiscovery('objects', 'desk-lamp', 'The Green Banker’s Lamp', 'Adjusted the quiet amber reading glow.');
      updateDiscoveryBadge();
    });
  }

  // 3. Fountain Pen: Mini-interaction (stardust ink bloom on paper blotter)
  const pen = document.getElementById('interactive-pen');
  if (pen) {
    pen.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      createInkBloom();
      showThoughtBubble(
        pen,
        "“She writes with black ink infused with ground meteorite dust so the words catch starlight.”",
        "The Gold-Nibbed Fountain Pen"
      );
      recordDiscovery('objects', 'fountain-pen', 'The Stardust Fountain Pen', 'Dipped in ink ground from iron meteorites.');
      updateDiscoveryBadge();
    });
  }

  // 4. Desk Calendar: Impossible Calendar
  const calendar = document.getElementById('interactive-calendar');
  if (calendar) {
    calendar.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      const impossibleDates = [
        "“Octember 38: High Tide in Devon. Remember to pull the sea toward the cliffs gently.”",
        "“Silver 0th: No moon tonight. She has gone visiting a lighthouse in Brittany.”",
        "“Hour 25:14: All letters sent during this minute arrive before they were written.”",
        "“Aprille 41: Postmaster holiday. The owls take over letter routing.”"
      ];
      const picked = impossibleDates[Math.floor(Math.random() * impossibleDates.length)];
      showThoughtBubble(
        calendar,
        picked,
        "The Impossible Lunar Calendar"
      );
      recordDiscovery('secrets', 'impossible-calendar', 'The Impossible Calendar', 'Noticed dates that exist on no terrestrial calendar.');
      updateDiscoveryBadge();
    });
  }

  // 5. Framed Photographs: Memory Modals
  const photos = document.querySelectorAll('.desk-photo-frame');
  photos.forEach((frame) => {
    frame.addEventListener('click', () => {
      const memoryId = frame.getAttribute('data-memory-id');
      moonAudio.playChime(1.05);
      showPhotoMemoryModal(memoryId);
    });
  });

  // 6. Moon Primrose: Mini interaction (water drops / flower petal glow)
  const primrose = document.getElementById('interactive-primrose');
  if (primrose) {
    primrose.addEventListener('click', () => {
      moonAudio.playDroplet();
      primrose.classList.add('flower-bloom');
      setTimeout(() => primrose.classList.remove('flower-bloom'), 2500);
      showThoughtBubble(
        primrose,
        "“The moon primrose opens its petals only when spoken to in a whisper.”",
        "Night Primrose in Clay Pot"
      );
      recordDiscovery('objects', 'primrose', 'The Lunar Primrose', 'Opens only when spoken to in a quiet whisper.');
      updateDiscoveryBadge();
    });
  }

  // 7. Vintage Radio: Mini interaction (plays gentle tune or crackle)
  const radio = document.getElementById('interactive-radio');
  if (radio) {
    radio.addEventListener('click', () => {
      moonAudio.playRadioTune();
      radio.classList.add('radio-humming');
      setTimeout(() => radio.classList.remove('radio-humming'), 2800);
      showNotificationToast("The radio hums with distant terrestrial static... a soft waltz floats in.");
      recordDiscovery('objects', 'vintage-radio', 'The Bakelite Radio', 'Catches stray waltzes drifting through the thermosphere.');
      updateDiscoveryBadge();
    });
  }

  // 8. Interactive Candle: Environmental / flame toggle
  const candleStand = document.getElementById('candle-interactive');
  const candleFlame = document.getElementById('candle-flame');
  if (candleStand && candleFlame) {
    candleStand.addEventListener('click', () => {
      candleLit = !candleLit;
      if (candleLit) {
        candleFlame.classList.remove('extinguished');
        moonAudio.playChime();
        showNotificationToast('The candle flickers to life with a warm amber glow.');
      } else {
        candleFlame.classList.add('extinguished');
        moonAudio.playPaperRustle();
        showNotificationToast('The flame sighs into a soft ribbon of scented honeycomb smoke.');
      }
    });
  }

  // 9. Easter Egg: Lost Mother-of-Pearl Button on Floorboards
  const floorButton = document.getElementById('lost-floor-button');
  if (floorButton) {
    floorButton.addEventListener('click', () => {
      moonAudio.playChime(1.4);
      showThoughtBubble(
        floorButton,
        "“A tiny mother-of-pearl button caught in the grain of the floorboards. It dropped from an Apollo astronaut's tweed coat when he sat here in 1969.”",
        "The Lost Button"
      );
      recordDiscovery('secrets', 'lost-button', 'The Lost Mother-of-Pearl Button', 'Found between cedar floorboards; dropped by an Apollo traveler.');
      updateDiscoveryBadge();
    });
  }

  // 10. Easter Egg: Secret Postal Receipt Scrap ("POSTAGE: 1 secret")
  const receiptScrap = document.getElementById('postal-secret-receipt');
  if (receiptScrap) {
    receiptScrap.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      showThoughtBubble(
        receiptScrap,
        "“FAIRY POSTAL TARIFF RECEIPT #4489\nTendered: 1 whispered secret\nWeight: Light as thistledown\nRouting: Delivered by moonlight to whoever needs it today\nStatus: Paid in full”",
        "Official Postal Receipt"
      );
      recordDiscovery('secrets', 'postal-receipt', 'POSTAGE: 1 Secret', 'Inspected an official postal receipt stamped: Postage: 1 secret.');
      updateDiscoveryBadge();
    });
  }

  // 11. Easter Egg: Hidden Envelope Corner under Blotter Felt
  const blotterEnvelope = document.getElementById('blotter-hidden-envelope-corner') || document.getElementById('blotter-hidden-envelope');
  if (blotterEnvelope) {
    blotterEnvelope.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      const secretNote = {
        recipient: "Whoever finds this under the green felt",
        sender: "Luna",
        date: "Witching Murmur • Silver Crescent",
        content: "Dear wanderer,\n\nIf you found this envelope tucked under the blotter, it means you take your time in quiet rooms.\n\nMost people hurry through life without looking at floorboards or turning over photo frames. Thank you for walking softly here. The moon never forgets someone who listens to the quiet.",
        stamp: "🌙",
        tone: "💌 A Secret Inscription",
        decoration: "silver-ribbon",
        paperTheme: "parchment"
      };
      openLetterModal(secretNote);
      recordDiscovery('secrets', 'blotter-hidden-letter', 'The Letter Under the Blotter Felt', 'Found an unsent letter tucked beneath the green wool felt.');
      updateDiscoveryBadge();
    });
  }

  // 12. Easter Egg: Whimsical Sign - "Please do not feed the fairies."
  const fairySign = document.getElementById('sign-do-not-feed') || document.getElementById('fairy-sign-glade');
  if (fairySign) {
    fairySign.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      showThoughtBubble(
        fairySign,
        "“Courier fairies survive strictly on morning dew, starlight, and very small crumbs of buttered biscuit. Regular breadcrumbs give them hiccups that shake the postal sorting racks.”",
        "Notice to Glade Visitors"
      );
      recordDiscovery('secrets', 'sign-fairies', 'The Sign Beside the Cottage', 'Learned why one must never feed breadcrumbs to the courier fairies.');
      updateDiscoveryBadge();
    });
  }

  // 13. Easter Egg: Whimsical Sign - "Letters may arrive late. The moon has terrible scheduling."
  const moonSign = document.getElementById('sign-moon-scheduling') || document.getElementById('mailbox-moon-sign');
  if (moonSign) {
    moonSign.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      showThoughtBubble(
        moonSign,
        "“The moon refuses to observe terrestrial clock towers. A letter sent on Tuesday may arrive forty years later, or three minutes before you wrote it, carried on a high tide.”",
        "Postal Advisory"
      );
      recordDiscovery('secrets', 'sign-moon-time', 'The Moon Scheduling Notice', 'Read the little wooden sign warning of lunar postal delays.');
      updateDiscoveryBadge();
    });
  }

  // 14. Easter Egg: Wildflower Growing Beside Mailbox
  const wildflowers = [
    document.getElementById('glade-mailbox-flower'),
    document.getElementById('mailbox-wildflower'),
    document.getElementById('glade-mailbox-wildflower'),
    document.getElementById('shrine-mailbox-flower')
  ];
  wildflowers.forEach((flower) => {
    if (flower) {
      flower.addEventListener('click', () => {
        moonAudio.playDroplet();
        showNotificationToast("🌸 A night-blooming gentian. Its petals stay moist with dew even in deep winter.");
        recordDiscovery('secrets', 'mailbox-flower', 'Wildflower by the Mailbox', 'A night violet blooming faithfully beside the cedar post.');
        updateDiscoveryBadge();
      });
    }
  });

  // 15. Easter Egg: The Glade Moon Interactivity
  const gladeMoon = document.getElementById('glade-the-moon') || document.getElementById('glade-moon');
  if (gladeMoon) {
    gladeMoon.addEventListener('click', () => {
      moonAudio.playChime(1.1);
      showThoughtBubble(
        gladeMoon,
        "“‘Dear little human, you looked tired tonight. I left the brightest star outside your window. You are welcome.’ — Luna”",
        "The Moon Overhead"
      );
      recordDiscovery('secrets', 'glade-moon-tap', 'A Whisper from the Glade Moon', 'Tapped the round white face of the moon, which smiled back gently.');
      updateDiscoveryBadge();
    });
  }

  // 16. Easter Egg: Lone Celestial Star
  const easterStar = document.getElementById('easter-egg-celestial-star') || document.getElementById('easter-egg-star');
  if (easterStar) {
    easterStar.addEventListener('click', () => {
      moonAudio.playChime(1.5);
      showNotificationToast("⭐ You caught a stray star-whisper: “DELIVERED BY MOONLIGHT. Take your time.”");
      recordDiscovery('secrets', 'lone-star', 'The Wandering Celestial Star', 'Caught a stray star-whisper high above the glade.');
      updateDiscoveryBadge();
    });
  }
}

/**
 * Creates a delicate stardust ink bloom on the desk blotter
 */
function createInkBloom() {
  const blotter = document.getElementById('desk-blotter-pad');
  if (!blotter) return;

  const dot = document.createElement('div');
  dot.className = 'stardust-ink-drop';
  dot.style.left = `${Math.random() * 80 + 10}%`;
  dot.style.top = `${Math.random() * 60 + 20}%`;
  blotter.appendChild(dot);

  setTimeout(() => dot.remove(), 4000);
}

/**
 * Thought Bubble Pop-in
 */
function showThoughtBubble(anchorEl, text, title) {
  const existing = document.getElementById('active-thought-bubble');
  if (existing) existing.remove();

  const bubble = document.createElement('div');
  bubble.id = 'active-thought-bubble';
  bubble.className = 'moon-thought-bubble';
  bubble.innerHTML = `
    <div class="thought-header">
      <span class="thought-crest">✨ ${title || 'A Passing Thought'}</span>
      <button class="thought-close-btn" type="button" aria-label="Return to the room">×</button>
    </div>
    <p class="thought-body">${text}</p>
  `;

  document.body.appendChild(bubble);

  // Position relative to element
  const rect = anchorEl.getBoundingClientRect();
  const top = Math.max(20, rect.top - 120 + window.scrollY);
  const left = Math.min(window.innerWidth - 320, Math.max(20, rect.left - 40));
  bubble.style.top = `${top}px`;
  bubble.style.left = `${left}px`;

  bubble.querySelector('.thought-close-btn').addEventListener('click', () => bubble.remove());
  setTimeout(() => {
    if (bubble.parentElement) bubble.remove();
  }, 7500);
}

/**
 * Memory Modal for Framed Desk Photos
 */
function showPhotoMemoryModal(memoryId) {
  const memories = {
    earthrise: {
      title: "Earthrise (December 1968)",
      desc: "“A human pointed a glass camera at Earth from behind my shoulder. Their hands were shaking so much they almost dropped the film cartridge. I watched them realize for the very first time that their entire world was smaller than a blue robin’s egg.”",
      symbol: "🌍",
      category: "A Memory of Earth",
      backNote: "Penciled on the back: “Apollo 8. They looked so cold and so brave. I held my breath the entire orbit.”"
    },
    cat: {
      title: "The Ginger Cat on the Red Tile Roof",
      desc: "“In Lisbon, in July. He climbed up to the terracotta chimney every Tuesday night to watch me rise over the Tagus river. He never purred for anyone in the daytime, but at night we had an understanding.”",
      symbol: "🐈",
      category: "A Quiet Habit",
      backNote: "Written in faded ink: “His name was Balthazar. He survived fourteen winters by sleeping against the warm baker’s oven.”"
    },
    eclipse: {
      title: "The Eclipse Corona",
      desc: "“The Sun and I meeting directly. He gave me a crown of white fire. For three minutes and twenty seconds, nobody in the world was thinking about money or wars; they were just looking upward together.”",
      symbol: "☀️",
      category: "A Shared Secret",
      backNote: "Inscribed in graphite: “Helios told me I wore his fire with gentle grace. Next celestial meeting in 2045.”"
    }
  };

  const mem = memories[memoryId] || memories.earthrise;
  recordDiscovery('memories', memoryId, mem.title, mem.desc.substring(0, 50) + '...');
  updateDiscoveryBadge();

  const modal = document.getElementById('photo-memory-modal');
  if (!modal) return;

  document.getElementById('modal-photo-title').textContent = mem.title;
  document.getElementById('modal-photo-desc').textContent = mem.desc;
  document.getElementById('modal-photo-badge').textContent = mem.category;
  document.getElementById('modal-photo-symbol').textContent = mem.symbol;

  const inspectBackBtn = document.getElementById('btn-inspect-frame-back');
  const backNote = document.getElementById('modal-photo-back-note');
  if (backNote) {
    backNote.style.display = 'none';
    backNote.textContent = mem.backNote || 'A blank cardboard backing, slightly dusty.';
  }
  if (inspectBackBtn) {
    inspectBackBtn.onclick = () => {
      if (backNote) {
        const isShown = backNote.style.display === 'block';
        backNote.style.display = isShown ? 'none' : 'block';
        if (!isShown) {
          moonAudio.playPaperRustle();
          recordDiscovery('secrets', `frame-back-${memoryId}`, 'Behind the Photo Frame', `Turned over the frame: ${mem.backNote.substring(0, 42)}...`);
          updateDiscoveryBadge();
        }
      }
    };
  }

  modal.classList.add('active');
}

/**
 * Bookshelf Station
 */
function renderBookshelf() {
  const container = document.getElementById('bookshelf-grid');
  if (!container) return;

  container.innerHTML = '';
  allBooks.forEach((b) => {
    const spine = document.createElement('div');
    spine.className = 'book-spine-card';
    spine.style.borderLeftColor = b.color;
    spine.innerHTML = `
      <div class="book-spine-header">
        <span class="book-category-tag">${b.category}</span>
        <span class="book-ribbon-marker">🔖</span>
      </div>
      <h3 class="book-spine-title">${b.title}</h3>
      <p class="book-spine-author">${b.author}</p>
      <p class="book-spine-quote">${b.memorableLine}</p>
      <button class="btn-inspect-book" type="button">Inspect Volume →</button>
    `;

    spine.addEventListener('click', () => inspectBook(b));
    container.appendChild(spine);
  });
}

function inspectBook(book) {
  moonAudio.playPaperRustle();
  recordDiscovery('books', book.id, book.title, `By ${book.author}`);
  updateDiscoveryBadge();

  const modal = document.getElementById('book-inspection-modal');
  if (!modal) return;

  document.getElementById('modal-book-title').textContent = book.title;
  document.getElementById('modal-book-author').textContent = `By ${book.author} • ${book.category}`;
  document.getElementById('modal-book-desc').textContent = book.description;
  document.getElementById('modal-book-line').textContent = book.memorableLine;
  document.getElementById('modal-book-notes').textContent = book.notes;

  const clueBox = document.getElementById('modal-book-clue');
  if (book.hasClue) {
    clueBox.style.display = 'block';
    clueBox.innerHTML = `<strong>Hidden Margin Note:</strong> ${book.clueText}`;
    recordDiscovery('secrets', 'book-clue', 'The Margin Note in Page 42', book.clueText);
    updateDiscoveryBadge();
  } else {
    clueBox.style.display = 'none';
  }

  modal.classList.add('active');
}

/**
 * Journal Reader Station
 */
function setupJournalReader() {
  const prevBtn = document.getElementById('btn-journal-prev');
  const nextBtn = document.getElementById('btn-journal-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentJournalIndex > 0) {
        currentJournalIndex--;
        moonAudio.playPaperRustle();
        renderJournalEntry(currentJournalIndex);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentJournalIndex < allJournalEntries.length - 1) {
        currentJournalIndex++;
        moonAudio.playPaperRustle();
        renderJournalEntry(currentJournalIndex);
      }
    });
  }

  // Quick entry list pills
  const entryList = document.getElementById('journal-entry-pills');
  if (entryList) {
    entryList.innerHTML = '';
    allJournalEntries.forEach((entry, idx) => {
      const pill = document.createElement('button');
      pill.className = `journal-pill-btn ${idx === currentJournalIndex ? 'active' : ''}`;
      pill.textContent = entry.title;
      pill.addEventListener('click', () => {
        currentJournalIndex = idx;
        moonAudio.playPaperRustle();
        renderJournalEntry(currentJournalIndex);
      });
      entryList.appendChild(pill);
    });
  }
}

function renderJournalEntry(index) {
  const entry = allJournalEntries[index];
  if (!entry) return;

  const dateEl = document.getElementById('journal-entry-date');
  const titleEl = document.getElementById('journal-entry-title');
  const moodEl = document.getElementById('journal-entry-mood');
  const contentEl = document.getElementById('journal-entry-content');

  if (dateEl) dateEl.textContent = entry.date;
  if (titleEl) titleEl.textContent = entry.title;
  if (moodEl) moodEl.textContent = `Mood: ${entry.mood}`;
  if (contentEl) contentEl.textContent = entry.content;

  // Update pills active state
  document.querySelectorAll('.journal-pill-btn').forEach((p, idx) => {
    if (idx === index) p.classList.add('active');
    else p.classList.remove('active');
  });

  // Track discovery
  recordDiscovery('memories', entry.id, entry.title, `Journal entry: ${entry.mood}`);
  updateDiscoveryBadge();
}

/**
 * Dream Jars Station
 */
function renderDreamJars() {
  const container = document.getElementById('dream-jars-shelf');
  if (!container) return;

  container.innerHTML = '';
  allDreams.forEach((d) => {
    const jar = document.createElement('div');
    jar.className = 'dream-jar-item';
    jar.setAttribute('tabindex', '0');
    jar.setAttribute('role', 'button');
    jar.setAttribute('aria-label', d.title);

    jar.innerHTML = `
      <div class="jar-glass-vessel" style="box-shadow: 0 0 25px ${d.glowColor}40;">
        <div class="jar-cork-lid"></div>
        <div class="jar-dream-essence" style="background: radial-gradient(circle, ${d.glowColor}, ${d.glowColor}30);"></div>
        <div class="jar-stardust-swirl">✨</div>
      </div>
      <span class="jar-label-tag">${d.title}</span>
    `;

    jar.addEventListener('click', () => openDreamModal(d));
    container.appendChild(jar);
  });
}

function openDreamModal(dream) {
  moonAudio.playChime(1.2);
  recordDiscovery('dreams', dream.id, dream.title, dream.whisper);
  updateDiscoveryBadge();

  const modal = document.getElementById('dream-jar-modal');
  if (!modal) return;

  document.getElementById('modal-dream-title').textContent = dream.title;
  document.getElementById('modal-dream-whisper').textContent = `“${dream.whisper}”`;
  document.getElementById('modal-dream-detail').textContent = dream.detail;
  document.getElementById('modal-dream-origin').textContent = `Captured: ${dream.dreamer}`;
  document.getElementById('modal-dream-scent').textContent = `Scent inside cork: ${dream.scent}`;

  const vesselGlow = document.getElementById('modal-dream-glow-orb');
  if (vesselGlow) {
    vesselGlow.style.boxShadow = `0 0 45px ${dream.glowColor}, 0 0 80px ${dream.glowColor}60`;
    vesselGlow.style.background = dream.glowColor;
  }

  modal.classList.add('active');
}

/**
 * Telescope Celestial Viewer
 */
function setupTelescopeViewer() {
  const container = document.getElementById('telescope-sightings-list');
  if (!container) return;

  container.innerHTML = '';
  allSightings.forEach((s) => {
    const item = document.createElement('div');
    item.className = 'sighting-card';
    item.innerHTML = `
      <div class="sighting-header">
        <span class="sighting-icon">${s.visual}</span>
        <div>
          <h4>${s.name}</h4>
          <span class="sighting-category">${s.category} • ${s.rarity}</span>
        </div>
      </div>
      <p class="sighting-desc">${s.description}</p>
      <p class="sighting-quote">${s.quote}</p>
    `;
    item.addEventListener('click', () => onSelectSighting(s));
    container.appendChild(item);
  });
}

function onSelectSighting(sighting) {
  moonAudio.playChime(1.1);
  recordDiscovery('secrets', sighting.id, sighting.name, sighting.description.substring(0, 45) + '...');
  updateDiscoveryBadge();

  const viewer = document.getElementById('telescope-active-focus');
  if (viewer) {
    viewer.innerHTML = `
      <div class="focused-sighting-box">
        <span class="focus-icon">${sighting.visual}</span>
        <div class="focus-info">
          <h3>${sighting.name}</h3>
          <p class="focus-quote">${sighting.quote}</p>
          <p class="focus-detail">${sighting.description}</p>
        </div>
      </div>
    `;
  }
}

/**
 * Balcony & Whispered Wishes System
 */
function setupBalconyWishSystem() {
  const form = document.getElementById('balcony-wish-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('balcony-wish-input');
    const text = input.value.trim();

    if (!text) {
      showNotificationToast("Whisper a few words for the night first.");
      return;
    }

    moonAudio.playChime(1.25);
    saveWish(text);
    input.value = '';

    // Feedback
    const confirmation = document.getElementById('balcony-wish-confirmation');
    if (confirmation) {
      confirmation.classList.add('visible');
      setTimeout(() => confirmation.classList.remove('visible'), 5000);
    }

    showNotificationToast("The Moon is keeping your wish.");
    renderWishesList();
    updateDiscoveryBadge();
  });
}

function renderWishesList() {
  const container = document.getElementById('balcony-wishes-kept-list');
  if (!container) return;

  const wishes = loadWishes();
  container.innerHTML = '';

  if (wishes.length === 0) {
    container.innerHTML = `<p style="font-family: var(--font-hand); color: #d8c3b4;">No wishes whispered tonight yet. The stars are listening.</p>`;
    return;
  }

  wishes.forEach((w) => {
    const item = document.createElement('div');
    item.className = 'kept-wish-card';
    item.innerHTML = `
      <p class="kept-wish-text">“${w.text}”</p>
      <span class="kept-wish-date">${w.date} • Held in safe gravity</span>
    `;
    container.appendChild(item);
  });
}

/**
 * Locked Drawer Mystery & The Crescent Key
 */
function setupLockedDrawerSystem() {
  const drawerBtn = document.getElementById('desk-locked-drawer');
  const clockPendulumArea = document.getElementById('clock-pendulum-click-area');

  const initialDrawerState = getDrawerState();
  if (initialDrawerState.isUnlocked && drawerBtn) {
    drawerBtn.classList.add('unlocked');
  }

  // Finding the brass key behind the grandfather clock weight / stopping the clock
  if (clockPendulumArea) {
    clockPendulumArea.addEventListener('click', () => {
      const state = getDrawerState();
      if (!state.hasKey) {
        setHasBrassKey(true);
        moonAudio.playKeyUnlock();
        showNotificationToast("✨ Behind the clock weight, your fingers find cold brass: A tiny crescent moon key!");
        recordDiscovery('secrets', 'brass-key', 'The Brass Crescent Key', 'Discovered hidden behind the swinging pendulum weights.');
        updateDiscoveryBadge();
      } else {
        // Clock pause Easter egg: "A clock that occasionally stops"
        if (!isClockCurrentlyPaused()) {
          pauseClockTemporarily(20000);
          moonAudio.playChime(0.85);
          showNotificationToast("🕰️ The grandfather clock pendulum pauses mid-swing. For a quiet moment, time ceases in the post office.");
          recordDiscovery('secrets', 'paused-clock', 'The Paused Grandfather Clock', 'Caught the pendulum mid-swing; time rested quietly on a moonbeam.');
          updateDiscoveryBadge();
        } else {
          showNotificationToast("🕰️ Time is currently resting quietly upon a moonbeam.");
        }
      }
    });
  }

  // Interacting with the locked drawer
  if (drawerBtn) {
    drawerBtn.addEventListener('click', () => {
      const state = getDrawerState();

      if (!state.isUnlocked) {
        if (state.hasKey) {
          // Unlock!
          moonAudio.playKeyUnlock();
          unlockDrawer();
          drawerBtn.classList.add('unlocked');
          showUnlockedDrawerModal();
          showNotificationToast("The brass tumbler turns with a soft click. The drawer slides open.");
          updateDiscoveryBadge();
        } else {
          // Locked
          moonAudio.playPaperRustle();
          showNotificationToast("The drawer hasn't been opened in 47 years. The brass keyhole is shaped like a tiny crescent moon.");
        }
      } else {
        // Already unlocked, open view
        moonAudio.playPaperRustle();
        showUnlockedDrawerModal();
      }
    });
  }
}

function showUnlockedDrawerModal() {
  const modal = document.getElementById('unlocked-drawer-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * Discovery System / "Things She Keeps" Modal
 */
function setupDiscoveryNotesModal() {
  const openBtn = document.getElementById('btn-open-discoveries');
  const modal = document.getElementById('discovery-notes-modal');
  const closeBtn = document.getElementById('modal-close-discoveries');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      renderDiscoveriesContent();
      if (modal) modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  // "Quietly forget everything" reset UI logic
  const btnQuietForget = document.getElementById('btn-quiet-forget');
  const confirmBox = document.getElementById('forget-confirm-box');
  const btnConfirmYes = document.getElementById('btn-forget-confirm-yes');
  const btnConfirmCancel = document.getElementById('btn-forget-confirm-cancel');

  if (btnQuietForget && confirmBox) {
    btnQuietForget.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      confirmBox.style.display = confirmBox.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (btnConfirmCancel && confirmBox) {
    btnConfirmCancel.addEventListener('click', () => {
      confirmBox.style.display = 'none';
    });
  }

  if (btnConfirmYes && confirmBox) {
    btnConfirmYes.addEventListener('click', () => {
      resetAllLocalData();
      moonAudio.playChime(0.85);
      confirmBox.style.display = 'none';
      renderDiscoveriesContent();
      updateDiscoveryBadge();
      updateMailboxStats();
      renderMailboxExperience();
      showNotificationToast('The slate is quietly forgotten. You may visit the Fairy Post Office as a stranger once more.');
    });
  }
}

function renderDiscoveriesContent() {
  const disc = getDiscoveries();
  const container = document.getElementById('discovery-log-sections');
  if (!container) return;

  container.innerHTML = `
    <div class="discovery-section-block">
      <h4>🚪 Objects & Thresholds (${disc.objects.length})</h4>
      <div class="discovery-tags-list">
        ${disc.objects.map((o) => `<span class="disc-tag"><strong>${o.title}</strong>: ${o.detail}</span>`).join('') || '<span class="disc-empty">Nothing recorded yet</span>'}
      </div>
    </div>

    <div class="discovery-section-block">
      <h4>📚 Books Examined (${disc.books.length})</h4>
      <div class="discovery-tags-list">
        ${disc.books.map((b) => `<span class="disc-tag"><strong>${b.title}</strong> (${b.detail})</span>`).join('') || '<span class="disc-empty">No books opened yet</span>'}
      </div>
    </div>

    <div class="discovery-section-block">
      <h4>✨ Dreams Witnessed (${disc.dreams.length})</h4>
      <div class="discovery-tags-list">
        ${disc.dreams.map((d) => `<span class="disc-tag"><strong>${d.title}</strong>: ${d.detail}</span>`).join('') || '<span class="disc-empty">No jars uncorked yet</span>'}
      </div>
    </div>

    <div class="discovery-section-block">
      <h4>🕰️ Memories & Whispers (${disc.memories.length})</h4>
      <div class="discovery-tags-list">
        ${disc.memories.map((m) => `<span class="disc-tag"><strong>${m.title}</strong>: ${m.detail}</span>`).join('') || '<span class="disc-empty">No memories witnessed yet</span>'}
      </div>
    </div>

    <div class="discovery-section-block">
      <h4>🗝️ Curiosities & Secrets (${disc.secrets.length})</h4>
      <div class="discovery-tags-list">
        ${disc.secrets.map((s) => `<span class="disc-tag secret-tag"><strong>${s.title}</strong>: ${s.detail}</span>`).join('') || '<span class="disc-empty">Secrets remain in shadow</span>'}
      </div>
    </div>
  `;
}

function updateDiscoveryBadge() {
  const count = getTotalDiscoveryCount();
  const badge = document.getElementById('discoveries-count-badge');
  if (badge) {
    badge.textContent = count;
  }
}

/**
 * Random Magical Events (Shooting stars, candle wavers, radio tunes, page turn)
 */
function setupRandomMagicalEvents() {
  const events = [
    () => {
      // Shooting star in balcony / window
      moonAudio.playChime(1.4);
      showNotificationToast("A shooting star streaks through Cassiopeia outside the window.");
    },
    () => {
      // Candle flame waver
      const flame = document.getElementById('candle-flame');
      if (flame && candleLit) {
        flame.classList.add('wavering');
        setTimeout(() => flame.classList.remove('wavering'), 2400);
        showNotificationToast("A gentle draft from an open door causes the candle flame to dance.");
      }
    },
    () => {
      // Radio brief crackle
      moonAudio.playRadioTune();
    },
    () => {
      // Distant bell
      moonAudio.playChime(0.7);
      showNotificationToast("A faint ship bell echoes from Earth across the solar wind.");
    },
    () => {
      // Clock occasionally stops naturally
      if (!isClockCurrentlyPaused()) {
        pauseClockTemporarily(16000);
        showNotificationToast("🕰️ The clock pendulum pauses mid-swing. Time rests quietly on a moonbeam.");
      }
    }
  ];

  // Trigger rare random events every 55-75 seconds
  setInterval(() => {
    if (Math.random() < 0.65) {
      const randomAction = events[Math.floor(Math.random() * events.length)];
      randomAction();
    }
  }, 60000);
}

/**
 * Audio Controls (Mute / Soundscape toggle)
 */
function setupAudioControls() {
  const audioBtn = document.getElementById('btn-sound-toggle');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    const isMuted = moonAudio.toggleMute();
    if (isMuted) {
      audioBtn.innerHTML = '🔕 Chimes Muted';
      showNotificationToast('Atmospheric chimes muted.');
    } else {
      audioBtn.innerHTML = '🔔 Chimes On';
      moonAudio.playChime();
      showNotificationToast('Atmospheric chimes awakened.');
    }
  });
}

/**
 * General Modal Close Handlers & Keyboard Accessibility
 */
function setupModalHandlers() {
  document.querySelectorAll('.modal-dismiss-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.fairy-modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.fairy-modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.fairy-modal-overlay.active').forEach((m) => m.classList.remove('active'));
      const activeBubble = document.getElementById('active-thought-bubble');
      if (activeBubble) activeBubble.remove();
    }
  });
}

/**
 * Desk Letter Form & Letters Archive (Preserving Phase 1 functionality)
 */
function renderRecipientOptions() {
  const select = document.getElementById('letter-recipient-select');
  if (!select) return;

  select.innerHTML = '';
  allRecipients.forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r.name;
    opt.textContent = `${r.avatar} ${r.name} (${r.address})`;
    select.appendChild(opt);
  });

  const customOpt = document.createElement('option');
  customOpt.value = 'custom';
  customOpt.textContent = '✏️ Somewhere in another dream...';
  select.appendChild(customOpt);

  select.addEventListener('change', (e) => {
    const customInput = document.getElementById('custom-recipient-container');
    if (customInput) {
      customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
    }
  });
}

function renderRecipientsGrid() {
  const container = document.getElementById('recipients-list-grid');
  if (!container) return;

  container.innerHTML = '';
  allRecipients.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'recipient-pigeonhole';
    card.innerHTML = `
      <div>
        <div class="recipient-top">
          <div class="recipient-avatar-bubble">${r.avatar}</div>
          <div class="recipient-meta">
            <h3>${r.name}</h3>
            <p class="recipient-address">${r.address}</p>
          </div>
        </div>
        <p class="recipient-desc">${r.description}</p>
      </div>
      <div class="recipient-footer">
        <span class="delivery-badge">📮 ${r.deliveryMethod}</span>
        <button class="btn-write-to-recipient" data-name="${r.name}">Send Letter</button>
      </div>
    `;

    card.querySelector('.btn-write-to-recipient').addEventListener('click', () => {
      setWritingDeskRecipient(r.name);
      switchStation('desk');
      const textarea = document.getElementById('real-paper-textarea');
      if (textarea) setTimeout(() => textarea.focus(), 200);
    });

    container.appendChild(card);
  });
}

function renderLettersArchive() {
  const container = document.getElementById('archive-letters-grid');
  if (!container) return;

  allLetters = getSavedLetters();
  container.innerHTML = '';

  allLetters.forEach((letter) => {
    const card = document.createElement('div');
    card.className = 'saved-letter-card';
    card.innerHTML = `
      <span class="saved-letter-stamp">${letter.stamp || '🌙'}</span>
      <h4 class="saved-letter-recipient">To: ${letter.recipient}</h4>
      <span class="saved-letter-date">${letter.date || 'Starlight Hour'}</span>
      <p class="saved-letter-excerpt">${letter.preview || letter.content.substring(0, 110) + '...'}</p>
      <div class="saved-letter-bottom">
        <span class="wax-seal-badge">🏷️ Sealed</span>
        <button class="btn-read-letter" type="button">Unfold Letter →</button>
      </div>
    `;

    card.addEventListener('click', () => openLetterModal(letter));
    container.appendChild(card);
  });
}

function openLetterModal(letter) {
  moonAudio.playPaperRustle();
  const modal = document.getElementById('fairy-letter-modal');
  if (!modal) return;

  const recipientEl = document.getElementById('modal-letter-recipient');
  const senderEl = document.getElementById('modal-letter-sender');
  const dateEl = document.getElementById('modal-letter-date');
  const contentEl = document.getElementById('modal-letter-content');
  const stampEl = document.getElementById('modal-letter-stamp');
  const tonePillEl = document.getElementById('modal-letter-tone-pill');
  const decorEl = document.getElementById('modal-letter-decoration-emblem');
  const parchmentSheet = document.getElementById('modal-parchment-sheet');

  if (recipientEl) recipientEl.textContent = `To: ${letter.recipient || 'You'}`;
  if (senderEl) senderEl.textContent = letter.sender ? `From: ${letter.sender}` : 'From: Luna';
  if (dateEl) dateEl.textContent = letter.date || 'Starlight Drift';
  
  if (contentEl) {
    contentEl.textContent = letter.content || '';
    contentEl.className = 'modal-letter-content';
    if (letter.handwriting) {
      contentEl.classList.add(`font-hand-${letter.handwriting}`);
    } else {
      contentEl.classList.add('font-hand-fairy');
    }
  }

  if (stampEl) stampEl.textContent = letter.stamp || '🌙';

  if (tonePillEl) {
    tonePillEl.textContent = letter.tone || letter.letterType || '💌 Handcrafted';
  }

  if (decorEl) {
    const decorMap = {
      'pressed-fern': '🌿',
      'spider-thread': '🕸️',
      'clover-petal': '🍀',
      'star-pin': '⭐',
      'wax-seal': '🏷️',
      'sea-glass': '🫧',
      'moth-wing': '🦋',
      'silver-ribbon': '🎀',
      'ink-drop': '✒️',
      'driftwood-splinter': '🪵'
    };
    decorEl.textContent = decorMap[letter.decoration] || '✦';
  }

  // Paper Theme styling
  if (parchmentSheet) {
    parchmentSheet.className = 'modal-parchment-sheet';
    const theme = letter.paperTheme || letter.paperTone || 'cream';
    parchmentSheet.classList.add(`theme-${theme}`);
  }

  // Easter Egg: Second-Reading Secret Postscript
  const letterKey = letter.id || `${letter.recipient}-${letter.sender}`;
  letterReadCounts[letterKey] = (letterReadCounts[letterKey] || 0) + 1;

  const postscriptEl = document.getElementById('modal-second-reading-postscript');
  if (postscriptEl) {
    if (letterReadCounts[letterKey] >= 2) {
      postscriptEl.style.display = 'block';
      const secretNotes = [
        "✦ Second Reading Secret: Along the lower fold, a faint note in purple pencil reads: “Do not rush yourself through the dark. The stars are in no hurry to fall.”",
        "✦ Second Reading Secret: A dried forget-me-not petal falls softly into your palm from between the folded edges.",
        "✦ Second Reading Secret: Held to candlelight, a tiny watermark reveals the silhouette of an owl carrying a brass key.",
        "✦ Second Reading Secret: Inscribed in silver ink along the edge: “Delivered by moonlight. Tendered postage: one quiet thought.”"
      ];
      const charSum = letterKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      postscriptEl.textContent = secretNotes[charSum % secretNotes.length];

      recordDiscovery('secrets', `re-read-${letterKey}`, 'Second-Reading Secret Inscription', 'Discovered a hidden postscript revealed only when reading a letter twice.');
      updateDiscoveryBadge();
    } else {
      postscriptEl.style.display = 'none';
      postscriptEl.textContent = '';
    }
  }

  recordDiscovery(
    'memories',
    letter.id || `letter-${Date.now()}`,
    letter.title || `Letter to ${letter.recipient}`,
    letter.preview ? letter.preview.substring(0, 45) : 'Unfolded mysterious mail from the world.'
  );
  updateDiscoveryBadge();

  modal.classList.add('active');
}

/**
 * Phase 3: The Centerpiece Midnight Writing Desk Experience
 */
const WHIMSICAL_LETTER_TYPES = [
  {
    id: 'never-said',
    label: '💌 Something I Never Said',
    placeholder: 'I never said it out loud, but when midnight comes and the shadows stretch across the floor, I keep thinking about...'
  },
  {
    id: 'to-the-moon',
    label: '🌙 A Letter to the Moon',
    placeholder: 'Dear Moon,\n\nWatching your pale light pool upon this desk, I wondered if you ever feel tired of listening to our secrets...'
  },
  {
    id: 'thank-you',
    label: '🌷 A Thank You',
    placeholder: 'Thank you for the quiet gentleness you brought into my life when the weather turned cold...'
  },
  {
    id: 'miss-you',
    label: '🕊 I Miss You',
    placeholder: 'I miss you in the quiet corners of the morning, and again at midnight when the teacup cools down...'
  },
  {
    id: 'future-self',
    label: '✨ A Letter to My Future Self',
    placeholder: 'To me, wherever you are in the days ahead:\nPlease remember that on this night, you were trying your best...'
  },
  {
    id: 'something-silly',
    label: '🎀 Something Silly',
    placeholder: 'A completely absurd thought that made me smile in the dark and that only you would appreciate...'
  },
  {
    id: 'one-of-those-days',
    label: "🌧 I'm Having One of Those Days",
    placeholder: 'Today was heavy and gray, like wet slate. But sitting by this candle with hot tea, the world feels a little softer...'
  },
  {
    id: 'little-hope',
    label: '🌱 A Little Hope',
    placeholder: 'A small hope I am tucking away into the starlight: that tomorrow the sun finds a new way to warm us...'
  },
  {
    id: 'dont-know-who',
    label: "💭 I Don't Know Who This Is For",
    placeholder: "I don't know who this is for. Maybe someone wandering through the forest, or a stranger who needed these words..."
  }
];

let writingDeskState = {
  recipient: 'The Lady in the Moon',
  isCustomRecipient: false,
  customRecipient: '',
  letterType: '💌 Something I Never Said',
  paperTone: 'paper-cream',
  envelopeStyle: 'env-linen',
  stamp: '🌙',
  waxSeal: 'wax-rose',
  sender: 'A Quiet Dreamer',
  content: ''
};

let ritualStep = 'folded'; // 'folded' -> 'sealed' -> 'sending'

export function setWritingDeskRecipient(name) {
  writingDeskState.recipient = name;
  writingDeskState.isCustomRecipient = false;

  document.querySelectorAll('#writer-recipients-pills .recipient-pill').forEach((pill) => {
    pill.classList.toggle('active', pill.getAttribute('data-name') === name);
  });

  const customBox = document.getElementById('writer-custom-recipient-box');
  if (customBox) customBox.style.display = 'none';

  const salutation = document.getElementById('paper-salutation-title');
  if (salutation) salutation.textContent = `To: ${name},`;
}

function renderWriterRecipientPills() {
  const container = document.getElementById('writer-recipients-pills');
  if (!container) return;

  container.innerHTML = '';

  const recipientList = [
    ...allRecipients.map((r) => ({ name: r.name, avatar: r.avatar })),
    { name: 'Someone I Miss Most', avatar: '🕊️' },
    { name: 'Someone Far Away', avatar: '🌌' },
    { name: 'Somewhere in Another Dream...', avatar: '✏️', isCustom: true }
  ];

  recipientList.forEach((r, idx) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `recipient-pill ${(!r.isCustom && (r.name === writingDeskState.recipient || idx === 0)) ? 'active' : ''}`;
    pill.setAttribute('data-name', r.name);
    pill.innerHTML = `<span>${r.avatar}</span> <span>${r.name}</span>`;

    pill.addEventListener('click', () => {
      document.querySelectorAll('#writer-recipients-pills .recipient-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const customBox = document.getElementById('writer-custom-recipient-box');
      const salutation = document.getElementById('paper-salutation-title');

      if (r.isCustom) {
        writingDeskState.isCustomRecipient = true;
        if (customBox) customBox.style.display = 'block';
        const customInput = document.getElementById('writer-custom-recipient-input');
        if (customInput) {
          customInput.focus();
          const customVal = customInput.value.trim() || 'A Secret Destination';
          writingDeskState.recipient = customVal;
          if (salutation) salutation.textContent = `To: ${customVal},`;
        }
      } else {
        writingDeskState.isCustomRecipient = false;
        writingDeskState.recipient = r.name;
        if (customBox) customBox.style.display = 'none';
        if (salutation) salutation.textContent = `To: ${r.name},`;
      }
      moonAudio.playPaperRustle();
    });

    container.appendChild(pill);
  });

  const customInput = document.getElementById('writer-custom-recipient-input');
  if (customInput) {
    customInput.addEventListener('input', (e) => {
      if (writingDeskState.isCustomRecipient) {
        const val = e.target.value.trim() || 'A Secret Destination';
        writingDeskState.recipient = val;
        const salutation = document.getElementById('paper-salutation-title');
        if (salutation) salutation.textContent = `To: ${val},`;
      }
    });
  }
}

function renderWriterLetterTypes() {
  const container = document.getElementById('writer-letter-types-grid');
  if (!container) return;

  container.innerHTML = '';
  WHIMSICAL_LETTER_TYPES.forEach((lt, idx) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `letter-type-card ${idx === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <span class="letter-type-icon">${lt.label.split(' ')[0]}</span>
      <span class="letter-type-name">${lt.label.substring(lt.label.indexOf(' ') + 1)}</span>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('#writer-letter-types-grid .letter-type-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      writingDeskState.letterType = lt.label;
      const sub = document.getElementById('paper-type-subtitle');
      if (sub) sub.textContent = lt.label;

      const textarea = document.getElementById('real-paper-textarea');
      if (textarea && !textarea.value.trim()) {
        textarea.placeholder = lt.placeholder;
      }

      moonAudio.playChime(1.1);
    });

    container.appendChild(card);
  });
}

function setupPaperCustomizationControls() {
  // Paper tint
  const paperCanvas = document.getElementById('real-paper-canvas');
  document.querySelectorAll('#paper-tone-picker .swatch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#paper-tone-picker .swatch-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tone = btn.getAttribute('data-tone');
      writingDeskState.paperTone = tone;
      if (paperCanvas) {
        paperCanvas.className = `real-paper-canvas ${tone}`;
      }
      moonAudio.playPaperRustle();
    });
  });

  // Envelope style
  document.querySelectorAll('#envelope-style-picker .swatch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#envelope-style-picker .swatch-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const env = btn.getAttribute('data-env');
      writingDeskState.envelopeStyle = env;
      moonAudio.playPaperRustle();
    });
  });

  // Decorative stamp
  document.querySelectorAll('#writer-stamp-picker .swatch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#writer-stamp-picker .swatch-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const stamp = btn.getAttribute('data-stamp');
      writingDeskState.stamp = stamp;
      const currentStamp = document.getElementById('paper-current-stamp');
      if (currentStamp) currentStamp.textContent = stamp;
      moonAudio.playChime(1.2);
    });
  });

  // Wax seal color
  document.querySelectorAll('#writer-wax-picker .wax-bubble').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#writer-wax-picker .wax-bubble').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      const wax = btn.getAttribute('data-wax');
      writingDeskState.waxSeal = wax;
      moonAudio.playChime(1.05);
    });
  });
}

function setupPaperWritingArea() {
  const textarea = document.getElementById('real-paper-textarea');
  const counter = document.getElementById('paper-word-count-display');
  const senderInput = document.getElementById('writer-sender-name-input');
  const btnErase = document.getElementById('btn-paper-erase');
  const btnFold = document.getElementById('btn-fold-letter');

  function updateWordCount() {
    if (!textarea || !counter) return;
    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    counter.textContent = `Your letter has ${words} little ${words === 1 ? 'word' : 'words'}.`;
  }

  if (textarea) {
    textarea.addEventListener('input', updateWordCount);
  }

  if (senderInput) {
    senderInput.addEventListener('input', (e) => {
      writingDeskState.sender = e.target.value.trim() || 'A Quiet Dreamer';
    });
  }

  if (btnErase) {
    btnErase.addEventListener('click', () => {
      if (!textarea) return;
      if (textarea.value.trim()) {
        textarea.value = '';
        updateWordCount();
        showNotificationToast('The paper is quiet and blank once more.');
        moonAudio.playPaperRustle();
      }
    });
  }

  if (btnFold) {
    btnFold.addEventListener('click', startFoldingRitual);
  }
}

function startFoldingRitual() {
  const textarea = document.getElementById('real-paper-textarea');
  const content = textarea ? textarea.value.trim() : '';

  if (!content) {
    showNotificationToast('Please write a few quiet words before folding the paper.');
    if (textarea) textarea.focus();
    return;
  }

  writingDeskState.content = content;
  const senderInput = document.getElementById('writer-sender-name-input');
  if (senderInput) {
    writingDeskState.sender = senderInput.value.trim() || 'A Quiet Dreamer';
  }

  moonAudio.playPaperRustle();

  const ritualStage = document.getElementById('folding-ritual-stage');
  const ritualFlow = document.getElementById('letter-writing-flow');
  const ritualEnvelope = document.getElementById('ritual-envelope-wrapper');
  const ritualStamp = document.getElementById('envelope-ritual-stamp');
  const ritualRecipient = document.getElementById('envelope-ritual-recipient');
  const ritualType = document.getElementById('envelope-ritual-type');
  const ritualWax = document.getElementById('envelope-ritual-wax');
  const ritualInstruction = document.getElementById('ritual-instruction-text');
  const btnRitualAction = document.getElementById('btn-ritual-action');

  if (ritualEnvelope) {
    ritualEnvelope.className = `ritual-envelope-wrapper ${writingDeskState.envelopeStyle} anim-letter-fold`;
  }
  if (ritualStamp) ritualStamp.textContent = writingDeskState.stamp;
  if (ritualRecipient) ritualRecipient.textContent = writingDeskState.recipient;
  if (ritualType) ritualType.textContent = writingDeskState.letterType;
  if (ritualWax) {
    ritualWax.className = `envelope-wax-seal-spot ${writingDeskState.waxSeal}`;
    ritualWax.innerHTML = `<span>${writingDeskState.stamp}</span>`;
    ritualWax.style.opacity = '0.35';
    ritualWax.classList.remove('anim-wax-press');
  }

  if (ritualInstruction) {
    ritualInstruction.textContent = 'The paper folds gently along its creases into the envelope...';
  }

  if (btnRitualAction) {
    btnRitualAction.innerHTML = '<span>Seal it</span> <span>🕯️</span>';
    btnRitualAction.disabled = false;
  }

  ritualStep = 'folded';

  if (ritualFlow) ritualFlow.style.display = 'none';
  if (ritualStage) {
    ritualStage.classList.add('active');
    ritualStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  recordDiscovery('memories', 'folded-letter', 'A Folded Letter', `Addressed to ${writingDeskState.recipient}`);
  updateDiscoveryBadge();
}

function handleRitualAction() {
  const btnRitualAction = document.getElementById('btn-ritual-action');
  const ritualInstruction = document.getElementById('ritual-instruction-text');
  const ritualWax = document.getElementById('envelope-ritual-wax');
  const ritualEnvelope = document.getElementById('ritual-envelope-wrapper');
  const ritualStage = document.getElementById('folding-ritual-stage');
  const confirmationBox = document.getElementById('letter-sent-confirmation-box');

  if (ritualStep === 'folded') {
    // Transition to SEALED
    ritualStep = 'sealed';
    moonAudio.playChime(1.15);

    if (ritualWax) {
      ritualWax.style.opacity = '1';
      ritualWax.classList.add('anim-wax-press');
    }

    if (ritualInstruction) {
      ritualInstruction.textContent = 'Warm sealing wax is pressed into the paper fibers.';
    }

    if (btnRitualAction) {
      btnRitualAction.innerHTML = '<span>Send it into the night</span> <span>🕊️</span>';
    }

    showNotificationToast('The wax cools with a soft starlight stamp. 🕯️');
  } else if (ritualStep === 'sealed') {
    // Transition to SENDING
    ritualStep = 'sending';
    if (btnRitualAction) btnRitualAction.disabled = true;

    moonAudio.playChime(0.85);

    if (ritualInstruction) {
      ritualInstruction.textContent = 'The envelope catches the cool midnight breeze...';
    }

    if (ritualEnvelope) {
      ritualEnvelope.classList.remove('anim-letter-fold');
      ritualEnvelope.classList.add('anim-send-night');
    }

    const newLetter = {
      id: `letter-${Date.now()}`,
      recipient: writingDeskState.recipient,
      sender: writingDeskState.sender,
      content: writingDeskState.content,
      stamp: writingDeskState.stamp,
      waxSeal: writingDeskState.waxSeal,
      envelope: writingDeskState.envelopeStyle,
      paperTone: writingDeskState.paperTone,
      letterType: writingDeskState.letterType,
      date: `Midnight Hour • ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
      preview: writingDeskState.content.substring(0, 110) + '...'
    };

    saveNewLetter(newLetter);
    renderLettersArchive();
    renderMyLettersGrid();
    updateMailboxStats();

    recordDiscovery('objects', `letter-${Date.now()}`, `Letter to ${writingDeskState.recipient}`, `${writingDeskState.letterType} sent into the midnight sky.`);
    updateDiscoveryBadge();

    setTimeout(() => {
      if (ritualStage) ritualStage.classList.remove('active');
      if (confirmationBox) confirmationBox.classList.add('active');
      confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      moonAudio.playChime(1.3);
    }, 1100);
  }
}

function setupDeskConfirmationActions() {
  const btnWriteAnother = document.getElementById('btn-write-another-letter');
  const btnViewArchive = document.getElementById('btn-view-my-archive');
  const confirmationBox = document.getElementById('letter-sent-confirmation-box');
  const ritualFlow = document.getElementById('letter-writing-flow');
  const textarea = document.getElementById('real-paper-textarea');
  const counter = document.getElementById('paper-word-count-display');

  if (btnWriteAnother) {
    btnWriteAnother.addEventListener('click', () => {
      if (confirmationBox) confirmationBox.classList.remove('active');
      if (ritualFlow) ritualFlow.style.display = 'block';
      if (textarea) {
        textarea.value = '';
        textarea.focus();
      }
      if (counter) counter.textContent = 'Your letter has 0 little words.';
      moonAudio.playPaperRustle();
    });
  }

  if (btnViewArchive) {
    btnViewArchive.addEventListener('click', () => {
      if (confirmationBox) confirmationBox.classList.remove('active');
      if (ritualFlow) ritualFlow.style.display = 'block';
      switchStation('mailbox');
      activateMailboxTab('my-letters');
    });
  }
}

function setupDeskPropsInteractions() {
  const teaProp = document.getElementById('prop-desk-tea');
  const candleProp = document.getElementById('prop-desk-candle');

  if (teaProp) {
    teaProp.addEventListener('click', () => {
      moonAudio.playChime(1.2);
      showNotificationToast('Hot Earl Grey steeped with rainwater gathered from low-hanging clouds.');
      recordDiscovery('habits', 'midnight-tea', 'Hot Earl Grey at Midnight', 'Warm tea cooling slowly by the window.');
      updateDiscoveryBadge();
    });
  }

  if (candleProp) {
    candleProp.addEventListener('click', () => {
      moonAudio.playChime(0.9);
      showNotificationToast('Honeycomb beeswax candle burning quietly beside the parchment.');
      recordDiscovery('habits', 'beeswax-candle', 'Honeycomb Beeswax Candle', 'Soft light keeping the dark outside at bay.');
      updateDiscoveryBadge();
    });
  }
}

function setupWritingDeskSanctuary() {
  renderWriterRecipientPills();
  renderWriterLetterTypes();
  setupPaperCustomizationControls();
  setupPaperWritingArea();
  setupDeskConfirmationActions();
  setupDeskPropsInteractions();

  const btnRitualAction = document.getElementById('btn-ritual-action');
  if (btnRitualAction) {
    btnRitualAction.addEventListener('click', handleRitualAction);
  }
}

/* ========================================================================= */
/* PHASE 4: THE MAGICAL MAILBOX EXPERIENCE (SANCTUARY)                       */
/* ========================================================================= */

function setupMailboxSanctuary() {
  const tabForYou = document.getElementById('tab-btn-letters-for-you');
  const tabMyLetters = document.getElementById('tab-btn-my-letters');
  const btnUnexpected = document.getElementById('btn-mailbox-unexpected');
  const slot = document.getElementById('interactive-mailbox-slot');
  const crest = document.getElementById('mailbox-crest');
  const inworldNotice = document.getElementById('mailbox-inworld-notice');

  if (tabForYou) {
    tabForYou.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      activateMailboxTab('letters-for-you');
    });
  }

  if (tabMyLetters) {
    tabMyLetters.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      activateMailboxTab('my-letters');
    });
  }

  if (btnUnexpected) {
    btnUnexpected.addEventListener('click', () => {
      triggerUnexpectedLetter();
    });
  }

  if (slot) {
    slot.addEventListener('click', () => {
      handleMailboxSlotInteraction();
    });
    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMailboxSlotInteraction();
      }
    });
  }

  if (crest) {
    crest.addEventListener('click', () => {
      moonAudio.playChime(1.15);
      showThoughtBubble(
        crest,
        "“Carved from ancient peat cedar. The brass postal horn has summoned night-hawks, storm petrels, and shooting stars.”",
        "The Postal Crest"
      );
      recordDiscovery('objects', 'mailbox-crest', 'The Enchanted Postal Crest', 'Carved from cedar and tuned to call night-hawks.');
      updateDiscoveryBadge();
    });
  }

  if (inworldNotice) {
    inworldNotice.addEventListener('click', () => {
      moonAudio.playPaperRustle();
      activateMailboxTab('letters-for-you');
      const firstCard = document.querySelector('#letters-for-you-grid .fairy-letter-card');
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstCard.classList.add('anim-badge-glow');
        setTimeout(() => firstCard.classList.remove('anim-badge-glow'), 2000);
      }
    });
  }

  renderMailboxExperience();
  setupMailboxRareEvents();
}

export function activateMailboxTab(tabKey) {
  currentMailboxTab = tabKey;
  const tabForYou = document.getElementById('tab-btn-letters-for-you');
  const tabMyLetters = document.getElementById('tab-btn-my-letters');
  const secForYou = document.getElementById('section-letters-for-you');
  const secMyLetters = document.getElementById('section-my-letters');

  if (tabKey === 'letters-for-you') {
    if (tabForYou) {
      tabForYou.classList.add('active');
      tabForYou.setAttribute('aria-selected', 'true');
    }
    if (tabMyLetters) {
      tabMyLetters.classList.remove('active');
      tabMyLetters.setAttribute('aria-selected', 'false');
    }
    if (secForYou) {
      secForYou.style.display = 'block';
      secForYou.classList.add('active');
    }
    if (secMyLetters) {
      secMyLetters.style.display = 'none';
      secMyLetters.classList.remove('active');
    }
  } else {
    if (tabMyLetters) {
      tabMyLetters.classList.add('active');
      tabMyLetters.setAttribute('aria-selected', 'true');
    }
    if (tabForYou) {
      tabForYou.classList.remove('active');
      tabForYou.setAttribute('aria-selected', 'false');
    }
    if (secMyLetters) {
      secMyLetters.style.display = 'block';
      secMyLetters.classList.add('active');
    }
    if (secForYou) {
      secForYou.style.display = 'none';
      secForYou.classList.remove('active');
    }
    renderMyLettersGrid();
  }
}

export function renderMailboxExperience() {
  renderLettersForYouGrid();
  renderMyLettersGrid();
  updateMailboxStats();
}

function renderLettersForYouGrid() {
  const container = document.getElementById('letters-for-you-grid');
  if (!container) return;

  container.innerHTML = '';

  const decorMap = {
    'pressed-fern': '🌿',
    'spider-thread': '🕸️',
    'clover-petal': '🍀',
    'star-pin': '⭐',
    'wax-seal': '🏷️',
    'sea-glass': '🫧',
    'moth-wing': '🦋',
    'silver-ribbon': '🎀',
    'ink-drop': '✒️',
    'driftwood-splinter': '🪵'
  };

  allIncomingLetters.forEach((letter) => {
    const card = document.createElement('article');
    const themeClass = letter.paperTheme ? `theme-${letter.paperTheme}` : 'theme-cream';
    card.className = `fairy-letter-card ${themeClass}`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Read letter from ${letter.sender} to ${letter.recipient}`);

    const emblem = decorMap[letter.decoration] || '✦';

    card.innerHTML = `
      <div>
        <div class="letter-card-header">
          <div class="letter-card-stamp">${letter.stamp || '🌙'}</div>
          <span class="letter-card-tone-pill">${letter.tone || '💌 Comforting'}</span>
          <span class="letter-card-decor-emblem" title="${letter.decoration || 'Enclosure'}">${emblem}</span>
        </div>
        <h4 class="letter-card-recipient">To: ${letter.recipient}</h4>
        <p class="letter-card-sender">From: ${letter.sender}</p>
        <p class="letter-card-date">${letter.date || 'Midnight Drift'}</p>
        <p class="letter-card-preview">“${letter.preview || letter.content.substring(0, 95) + '...'}”</p>
      </div>
      <div class="letter-card-footer">
        <span class="letter-envelope-type-tag">Sealed in starlight</span>
        <button class="btn-unfold-letter" type="button">Unfold Letter →</button>
      </div>
    `;

    const triggerRead = () => {
      openLetterModal(letter);
    };

    card.addEventListener('click', triggerRead);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerRead();
      }
    });

    container.appendChild(card);
  });
}

function renderMyLettersGrid() {
  const container = document.getElementById('my-letters-grid');
  if (!container) return;

  allVisitorLetters = getVisitorLetters();
  container.innerHTML = '';

  if (allVisitorLetters.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-letters-card';
    empty.innerHTML = `
      <span class="empty-icon">✉️</span>
      <h4>Your Pigeonhole is Quiet</h4>
      <p>
        You haven&apos;t folded any letters at the midnight desk yet.
        Choose a recipient, pick your stationery, and pour out what you haven&apos;t said out loud.
      </p>
      <button class="btn-mailbox-write" id="btn-empty-desk-link" type="button">
        <span>🖋️</span>
        <span>Sit at the Writing Desk →</span>
      </button>
    `;

    empty.querySelector('#btn-empty-desk-link')?.addEventListener('click', () => {
      switchStation('desk');
      const textarea = document.getElementById('real-paper-textarea');
      if (textarea) setTimeout(() => textarea.focus(), 250);
    });

    container.appendChild(empty);
    return;
  }

  allVisitorLetters.forEach((letter) => {
    const card = document.createElement('article');
    const themeClass = letter.paperTone ? `theme-${letter.paperTone}` : 'theme-cream';
    card.className = `fairy-letter-card ${themeClass}`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Read your letter to ${letter.recipient}`);

    card.innerHTML = `
      <div>
        <div class="letter-card-header">
          <div class="letter-card-stamp">${letter.stamp || '🌙'}</div>
          <span class="letter-card-tone-pill">${letter.letterType || '💌 Something I Said'}</span>
          <span class="letter-card-decor-emblem">🕯️</span>
        </div>
        <h4 class="letter-card-recipient">To: ${letter.recipient}</h4>
        <p class="letter-card-sender">From: ${letter.sender || 'You'}</p>
        <p class="letter-card-date">${letter.date || 'Starlight Hour'}</p>
        <p class="letter-card-preview">“${letter.preview || letter.content.substring(0, 95) + '...'}”</p>
      </div>
      <div class="letter-card-footer">
        <span class="letter-envelope-type-tag">Envelope: ${letter.envelope || 'Linen'}</span>
        <button class="btn-unfold-letter" type="button">Unfold Letter →</button>
      </div>
    `;

    const triggerRead = () => {
      openLetterModal(letter);
    };

    card.addEventListener('click', triggerRead);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerRead();
      }
    });

    container.appendChild(card);
  });
}

function triggerUnexpectedLetter() {
  const pool = allIncomingLetters.length > 0 ? allIncomingLetters : allLetters;
  if (pool.length === 0) return;

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  moonAudio.playChime(1.3);
  moonAudio.playPaperRustle();

  // Visual feedback on the slot
  const slot = document.getElementById('interactive-mailbox-slot');
  if (slot) {
    slot.classList.add('anim-slot-drop');
    setTimeout(() => slot.classList.remove('anim-slot-drop'), 1600);
  }

  showNotificationToast(`✨ An unexpected letter addressed to "${chosen.recipient}" slipped out.`);

  recordDiscovery('secrets', 'unexpected-letter', 'An Unexpected Letter', `Read words from ${chosen.sender} found by chance.`);
  updateDiscoveryBadge();

  setTimeout(() => {
    openLetterModal(chosen);
  }, 450);
}

function handleMailboxSlotInteraction() {
  moonAudio.playPaperRustle();
  const slot = document.getElementById('interactive-mailbox-slot');
  const sensoryText = document.getElementById('mailbox-sensory-text');

  if (slot) {
    slot.classList.add('anim-slot-drop');
    setTimeout(() => slot.classList.remove('anim-slot-drop'), 1400);
  }

  if (sensoryText) {
    const whispers = [
      "🌙 You tap the brass slot. Deep within, letters shift like dry autumn leaves.",
      "✨ A faint draft of cedar and saltwater blows outward through the slot.",
      "🕊️ You hear the distant beating of feathered wings above the chimney.",
      "📮 The postal slot clinks softly. All letters have settled safely for the night."
    ];
    sensoryText.textContent = whispers[Math.floor(Math.random() * whispers.length)];
  }

  // 35% chance to trigger an unexpected arrival rare event
  if (Math.random() < 0.35) {
    setTimeout(() => triggerMailboxRareEvent('arrival'), 700);
  }
}

/**
 * Rare Events Engine for the Mailbox
 * 📮 "The mailbox is warm."
 * ✨ A letter arrives while the visitor is looking at the mailbox.
 * 🪽 A tiny fairy flies past carrying an envelope.
 * 🌙 The mailbox glows when the moon reaches midnight.
 */
function setupMailboxRareEvents() {
  // Check periodically for rare atmospheric occurrences
  setInterval(() => {
    if (Math.random() < 0.45) {
      triggerMailboxRareEvent();
    }
  }, 65000);
}

export function triggerMailboxRareEvent(forceType = null) {
  const types = ['warm', 'arrival', 'fairy', 'midnight'];
  const eventType = forceType || types[Math.floor(Math.random() * types.length)];
  const shrine = document.getElementById('mailbox-visual-shrine');
  const sensoryText = document.getElementById('mailbox-sensory-text');
  const tempLabel = document.getElementById('stat-temperature-label');
  const inworldNotice = document.getElementById('mailbox-inworld-notice');
  const noticeSub = document.getElementById('mailbox-notice-subtext');

  if (eventType === 'warm') {
    if (shrine) {
      shrine.classList.remove('anim-mailbox-warm', 'anim-mailbox-midnight');
      shrine.classList.add('anim-mailbox-warm');
    }
    if (sensoryText) {
      sensoryText.textContent = "📮 The mailbox is warm to the touch. A letter must have traveled through summer somewhere.";
    }
    if (tempLabel) tempLabel.textContent = "Warm (82°F)";
    moonAudio.playChime(1.1);
    showNotificationToast("📮 The mailbox is warm to the touch.");

    recordDiscovery('secrets', 'mailbox-warm', 'The Warm Mailbox', 'Felt summer heat retained within the cedar and brass.');
    updateDiscoveryBadge();

    clearTimeout(mailboxWarmTimeout);
    mailboxWarmTimeout = setTimeout(() => {
      if (shrine) shrine.classList.remove('anim-mailbox-warm');
      if (sensoryText) sensoryText.textContent = "🌙 The brass feels cool under starlight.";
      if (tempLabel) tempLabel.textContent = "Cool";
    }, 15000);

  } else if (eventType === 'arrival') {
    const slot = document.getElementById('interactive-mailbox-slot');
    if (slot) {
      slot.classList.add('anim-slot-drop');
      setTimeout(() => slot.classList.remove('anim-slot-drop'), 1600);
    }
    moonAudio.playPaperRustle();
    moonAudio.playChime(1.2);

    if (sensoryText) {
      sensoryText.textContent = "✨ A soft rustle! An envelope just slid down through the brass chute.";
    }
    if (noticeSub) {
      noticeSub.textContent = "Just arrived! Carried by a night-hawk.";
    }
    showNotificationToast("A fresh envelope slips through the postal slot with a quiet flutter.");

    recordDiscovery('secrets', 'mailbox-arrival', 'Midnight Delivery', 'Watched a letter arrive through the cedar slot.');
    updateDiscoveryBadge();

    // Pulse the top card
    const firstCard = document.querySelector('#letters-for-you-grid .fairy-letter-card');
    if (firstCard) {
      firstCard.classList.add('anim-badge-glow');
      setTimeout(() => firstCard.classList.remove('anim-badge-glow'), 3000);
    }

  } else if (eventType === 'fairy') {
    triggerFairyFlyby();

  } else if (eventType === 'midnight') {
    if (shrine) {
      shrine.classList.remove('anim-mailbox-warm', 'anim-mailbox-midnight');
      shrine.classList.add('anim-mailbox-midnight');
    }
    if (sensoryText) {
      sensoryText.textContent = "🌙 Under the midnight moon, the brass hinges softly hum with silver light.";
    }
    moonAudio.playChime(0.9);
    showNotificationToast("🌙 The moon has touched the mailbox. The hinges glow with silver starlight.");

    recordDiscovery('secrets', 'mailbox-midnight', 'Midnight Luminescence', 'The postal shrine glowed as the moon reached its peak.');
    updateDiscoveryBadge();

    clearTimeout(mailboxWarmTimeout);
    mailboxWarmTimeout = setTimeout(() => {
      if (shrine) shrine.classList.remove('anim-mailbox-midnight');
      if (sensoryText) sensoryText.textContent = "🌙 The brass feels cool under starlight.";
    }, 15000);
  }
}

function triggerFairyFlyby() {
  if (fairyFlybyCooldown) return;
  fairyFlybyCooldown = true;
  setTimeout(() => { fairyFlybyCooldown = false; }, 35000);

  const container = document.getElementById('fairy-flyby-container');
  if (!container) return;

  const fairy = document.createElement('div');
  fairy.className = 'flying-fairy-sprite anim-fairy-flyby';
  const startTop = Math.floor(18 + Math.random() * 45);
  fairy.style.top = `${startTop}vh`;
  fairy.innerHTML = `
    <span class="anim-wing-flutter" style="display:inline-block;">🪽</span>
    <span>🧚</span>
    <span class="flying-fairy-envelope">✉️</span>
    <span class="flying-fairy-dust">✦ ✦</span>
  `;

  container.appendChild(fairy);
  moonAudio.playChime(1.45);
  showNotificationToast("🪽 A courier fairy darted past with an envelope sealed in silver thread.");

  recordDiscovery('secrets', 'courier-fairy', 'The Courier Fairy', 'Spotted a winged postal courier in swift flight.');
  updateDiscoveryBadge();

  setTimeout(() => {
    fairy.remove();
  }, 7800);
}

function updateMailboxStats() {
  allVisitorLetters = getVisitorLetters();
  const visitorCount = allVisitorLetters.length;
  const incomingCount = allIncomingLetters.length;

  const countEl = document.getElementById('stat-letters-count');
  const incomingEl = document.getElementById('stat-incoming-count');
  const badgeForYou = document.getElementById('badge-for-you-count');
  const badgeMyLetters = document.getElementById('badge-my-letters-count');

  if (countEl) countEl.textContent = visitorCount;
  if (incomingEl) incomingEl.textContent = incomingCount;
  if (badgeForYou) badgeForYou.textContent = incomingCount;
  if (badgeMyLetters) badgeMyLetters.textContent = visitorCount;
}

/**
 * Toast Notification Helper
 */
let toastTimer;
export function showNotificationToast(msg) {
  const toast = document.getElementById('fairy-toast');
  const toastMsg = document.getElementById('fairy-toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

