/**
 * The Fairy Post Office & The Moon's Apartment - Data Layer
 * Handles loading books, journal entries, dreams, letters, telescope sightings,
 * discovery tracking, and wishes saved in localStorage.
 */

const STORAGE_LETTERS_KEY = 'fairy_post_office_letters_v2';
const STORAGE_VISITOR_LETTERS_KEY = 'fairy_post_office_visitor_letters_v1';
const STORAGE_WISHES_KEY = 'moon_apartment_wishes_v1';
const STORAGE_DISCOVERIES_KEY = 'moon_apartment_discoveries_v1';
const STORAGE_DRAWER_KEY = 'moon_apartment_drawer_v1';

export const DEFAULT_INCOMING_LETTERS = [
  {
    id: "incoming-moon",
    recipient: "Little human",
    sender: "The Moon",
    date: "Midnight • Sea of Serenity",
    stamp: "DELIVERED BY MOONLIGHT",
    paperTheme: "theme-moonlight",
    handwritingStyle: "hand-moon",
    decoration: "silver-star",
    tone: "Comforting",
    preview: "You looked tired tonight. I left the brightest star outside your window...",
    content: "Dear little human,\n\nYou looked tired tonight. I watched you walking home with your shoulders pulled up against the cold air, looking down at the pavement instead of up at the sky.\n\nI left the brightest star right outside your bedroom window. You're welcome.\n\nGo to sleep now. Close your eyes. I will stay awake and keep the dark from getting too close.\n\nYours in orbit,\nThe Moon"
  },
  {
    id: "incoming-fairy-shoe",
    recipient: "Whomever Found My Left Slipper",
    sender: "Pip (Under-Clover Mail)",
    date: "Dewdrop Hour",
    stamp: "👟",
    paperTheme: "theme-pink",
    handwritingStyle: "hand-fairy",
    decoration: "clover-petal",
    tone: "Absurd & Funny",
    preview: "If you find a shoe the size of a pumpkin seed made of spider silk...",
    content: "URGENT:\n\nIf you find a shoe the size of a pumpkin seed made of dried acorn cap and spun spider silk, PLEASE do not step on it or let a beetle drag it into an anthill.\n\nI danced far too vigorously at the firefly ball behind the chanterelles and now I am hopping on one bare foot across wet moss. My toes are freezing.\n\nReward: three dried wild blueberries and a very good secret about where the hedgehog hides his thimble.\n\n— Pip"
  },
  {
    id: "incoming-future-self",
    recipient: "You, Sitting Here Tonight",
    sender: "You, Seven Autumns Away",
    date: "Seven Autumns Hence",
    stamp: "⏳",
    paperTheme: "theme-cream",
    handwritingStyle: "hand-future",
    decoration: "gold-thread",
    tone: "Hopeful",
    preview: "The thing keeping you awake tonight? We barely remember the shape of it now...",
    content: "Hello from seven autumns away.\n\nI am writing to tell you that the thing keeping you awake tonight? We barely remember the shape of it now. You made it through that cold, stubborn spring. You learned how to bake that loaf of bread with the crunchy golden crust. You found the warm wool coat you thought was lost forever in the closet.\n\nDrink a glass of cold water. Put down your worries for six hours. Everything you are terrified of is already slowly working itself out into something softer.\n\nWith fond patience,\nYou"
  },
  {
    id: "incoming-old-tree",
    recipient: "Anyone Walking Too Fast",
    sender: "The Whispering Oak (Root No. 12)",
    date: "Ring 342 • Rainy Season",
    stamp: "🌳",
    paperTheme: "theme-sage",
    handwritingStyle: "hand-tree",
    decoration: "pressed-oak-leaf",
    tone: "Grounding",
    preview: "I watched you rush past my roots today with your glowing rectangle...",
    content: "Child of two legs,\n\nI watched you rush past my roots today with your little glowing rectangle held up to your face. You didn't even notice the scent of rain rising from the wet pine needles.\n\nI have stood on this hillside for three hundred and forty-two years. Moss takes twenty summers to climb a single handspan. Rings take a full year of freezing and thawing to knit together.\n\nNothing good in this world is ever hurried into being. Slow your stride. Put your palm against my bark the next time you pass. We trees don't talk very loudly, but we are extraordinarily good at listening.\n\n— The Whispering Oak"
  },
  {
    id: "incoming-lighthouse-girl",
    recipient: "The Ocean's Other Side",
    sender: "Maeve (Cape Solitary Lantern)",
    date: "Storm Watch • 10:15 PM",
    stamp: "🏮",
    paperTheme: "theme-ocean",
    handwritingStyle: "hand-ocean",
    decoration: "driftwood-mark",
    tone: "Nostalgic & Romantic",
    preview: "The beam is turning above my head—click, hum, sweep across black swells...",
    content: "Dear Ocean's Other Side,\n\nThe lens is turning above my bedroom ceiling—click, hum, sweep. A long arm of white light stroking the black water out to the horizon.\n\nEvery night at ten, I wind the brass clockwork weights and look out into the fog. I wonder who is standing on the ships that glide past like silent constellations made of sparks. Are you looking back toward my cliffs right now?\n\nIf you are, I am waving from behind the thick storm glass. I always leave the iron kettle simmering on the stove for anyone who might ever wash ashore.\n\n— Maeve"
  },
  {
    id: "incoming-whoever-needs",
    recipient: "Whoever Needs This Today",
    sender: "A Stranger Who Understood",
    date: "A Quiet Afternoon",
    stamp: "✉️",
    paperTheme: "theme-cream",
    handwritingStyle: "hand-gentle",
    decoration: "wax-heart",
    tone: "Comforting",
    preview: "Just in case nobody said it to you today: You are doing better than you know...",
    content: "To whoever holds this paper:\n\nJust in case nobody said it to you today: You are doing so much better than you give yourself credit for. The heavy seasons do not last forever, even when they feel like an endless winter. You are not late to your own life.\n\nBreathe all the way out. Unclench your jaw. Drop your shoulders down from your ears.\n\nYou survived today, you are sitting here breathing, and that is more than enough for one night.\n\n— A Friend"
  },
  {
    id: "incoming-cloud-baker",
    recipient: "Morning Walkers",
    sender: "Barnaby the Cloud Baker",
    date: "Overcast Wednesday",
    stamp: "☁️",
    paperTheme: "theme-moonlight",
    handwritingStyle: "hand-baker",
    decoration: "cloud-fluff",
    tone: "Whimsical & Absurd",
    preview: "Notice of Delayed Sunrise: The yeast for the sunrise clouds rose too quickly...",
    content: "Notice of Delayed Sunrise:\n\nI deeply apologize for the pale gray drizzle across your rooftops this morning. The sourdough yeast for the cumulus clouds rose far too vigorously near the hearth and spilled over the chimney flue into the stratosphere.\n\nTomorrow I will add two extra spoonfuls of vanilla starlight and cinnamon mist to compensate. Please accept this envelope of cloud dust as an apology. If sprinkled over lukewarm tea, it makes the foam taste like toasted marshmallows.\n\nWarmly,\nBarnaby"
  },
  {
    id: "incoming-library-ghost",
    recipient: "The Late-Night Reader",
    sender: "Silas (Aisle 4, 1891)",
    date: "Past Closing Time",
    stamp: "📖",
    paperTheme: "theme-aged",
    handwritingStyle: "hand-spidery",
    decoration: "ink-blot",
    tone: "Mysterious & Cozy",
    preview: "I noticed you dog-earing page 142 of the botany atlas. Please do not do that...",
    content: "Dear late-night reader,\n\nI noticed you dog-earing page 142 of the botany atlas. Please do not do that; the paper corner feels dreadfully bent in my spectral hands.\n\nHowever, I did nudge the green brass reading lamp two inches closer to your left elbow because the shadow was falling across the smaller print. And I blew out the draft leaking from beneath the fire escape door.\n\nStay as long as you like. Nobody reads the poetry in aisle 4 except you and me.\n\n— Silas (Deceased 1891, still browsing)"
  },
  {
    id: "incoming-rooftop-cat",
    recipient: "The Person Under the Skylight",
    sender: "Barnaby Paws (Rooftop Patrol)",
    date: "11:40 PM • Chimney Ridge",
    stamp: "🐈",
    paperTheme: "theme-hearth",
    handwritingStyle: "hand-cat",
    decoration: "paw-print",
    tone: "Funny",
    preview: "I watched you through your glass roof drop a piece of cheese on the floor...",
    content: "I looked down through your glass skylight at 11:40 PM.\n\nYou dropped a piece of sharp cheddar on the kitchen tile, looked around guiltily for four seconds, and then picked it up and ate it anyway.\n\nI respect this immensely. As an apex predator, I fully approve of floor food.\n\nIf you leave a small saucer of warm milk by the zinc drainpipe, I will ensure that no noisy pigeons land on your windowsill tomorrow morning before your alarm rings.\n\n— The Black Cat"
  },
  {
    id: "incoming-tea-reader",
    recipient: "The Skeptic",
    sender: "Madame Violette (Tea & Sage Stall)",
    date: "Dusk • Market Square",
    stamp: "🍵",
    paperTheme: "theme-lavender",
    handwritingStyle: "hand-violette",
    decoration: "tea-stain",
    tone: "Comforting & Mysterious",
    preview: "I emptied your porcelain cup after you walked away today...",
    content: "Dear skeptic,\n\nI emptied your porcelain cup after you hurried away from my stall today. The wet tea leaves didn't form an initial or a number or a dark omen. They settled into the shape of a tiny open birdcage with a door swinging wide.\n\nYou already know what choice you need to make. You are only waiting for someone in this loud world to grant you permission to be happy.\n\nConsider this stamped piece of paper your official permission.\n\n— Violette"
  },
  {
    id: "incoming-yellow-umbrella",
    recipient: "The Forgetful One",
    sender: "Your Yellow Duck-Handle Umbrella",
    date: "Platform 3 • Lost Property Bin",
    stamp: "🌧️",
    paperTheme: "theme-cream",
    handwritingStyle: "hand-umbrella",
    decoration: "raindrop-mark",
    tone: "Nostalgic & Cozy",
    preview: "You left me on the train four Tuesdays ago when the sun broke through the clouds...",
    content: "Dear Owner of the Yellow Duck Handle,\n\nYou left me on the 5:14 train four Tuesdays ago when the sun suddenly broke through the drizzle. Please do not feel guilty. I have met ninety-six other umbrellas here in the cedar bin.\n\nWe pass the long afternoons recounting the storms we sheltered people from. I told them all about your damp hair, your laughter when you leaped over that deep puddle on Elm Street, and the way you hummed off-key under my ribs.\n\nTake care in the next autumn squall. I hope you found another umbrella to keep your shoulders dry.\n\n— Your Yellow Umbrella"
  },
  {
    id: "incoming-starlight-map",
    recipient: "Anyone Gazing Upward",
    sender: "Orla (Observatory at the End of the World)",
    date: "Clear Meridian",
    stamp: "🧭",
    paperTheme: "theme-moonlight",
    handwritingStyle: "hand-orla",
    decoration: "constellation-dots",
    tone: "Poetic",
    preview: "People think darkness is empty. But darkness is simply light that hasn't arrived...",
    content: "A Field Note on the Dark:\n\nPeople imagine the night sky is empty because it is black. But here at the observatory, we know that darkness is simply light traveling so far that its photons haven't touched your eyelashes yet.\n\nYou are never truly abandoned in the dark. You are only waiting for light that set out across the universe a billion years before you were born.\n\nBe patient with your heart. It is almost here.\n\n— Orla"
  },
  {
    id: "incoming-hedgehog-tailor",
    recipient: "The Mender of Coats",
    sender: "Master Bramble (Hedge Tailor)",
    date: "Under the Briar",
    stamp: "🦔",
    paperTheme: "theme-sage",
    handwritingStyle: "hand-bramble",
    decoration: "silver-stitch",
    tone: "Whimsical & Cozy",
    preview: "I took the liberty of mending the tear in your wool pocket while you sat on the bench...",
    content: "Good evening,\n\nI took the liberty of mending the torn seam in your wool pocket while you were resting on the mossy park bench. I utilized spider-thread double-dyed with ripe blackberry juice. It will not part in the winter frost.\n\nInside the lining, I stitched one dried hazelnut for emergencies. Do not eat it unless you are truly lost in the woods; it has a small warmth spell attached to keep away the wet shivers.\n\nMay your hems hold fast and true.\n\n— Bramble, Tailor to the Hedge"
  },
  {
    id: "incoming-wild-fox",
    recipient: "The Window with the Yellow Curtain",
    sender: "Reynard of the Elderberry Briar",
    date: "Twilight Hour",
    stamp: "🦊",
    paperTheme: "theme-aged",
    handwritingStyle: "hand-fox",
    decoration: "pressed-fern",
    tone: "Romantic & Nostalgic",
    preview: "Every evening at dusk, I sit behind the elderberry bushes and listen to your violin...",
    content: "To the second-floor window where the violin plays:\n\nEvery evening at dusk, I sit behind the elderberry brambles and listen to you practice. You almost always stumble on that high F-sharp in the fourth measure, and then you pause, sigh audibly, and play it three times until it sings like polished glass.\n\nI could be hunting plump meadow mice, but I far prefer sitting in the damp clover listening to your stubbornness.\n\nPlay the slow piece again tomorrow evening.\n\n— The Fox with the White-Tipped Tail"
  },
  {
    id: "incoming-paper-balloon",
    recipient: "The Person Who Catches This",
    sender: "Clara (In the Westerly Drift)",
    date: "Launched from Alsace",
    stamp: "🎈",
    paperTheme: "theme-pink",
    handwritingStyle: "hand-clara",
    decoration: "buttercup-petal",
    tone: "Hopeful & Absurd",
    preview: "I launched this letter inside a tissue paper balloon. Inside is a riddle...",
    content: "If you unfold this paper:\n\nI launched this letter inside a balloon made of lavender tissue paper and baker's twine from a meadow above the valley. Folded inside is a dried buttercup and a riddle for you:\n\n'What has a mouth but never talks, has a bed but never sleeps, and runs forever without legs?'\n\nThe answer is a river. I hope you are sitting somewhere near cool running water right now, watching the sky change into sunset colors.\n\n— Clara, age 9 (or perhaps 90 by now)"
  },
  {
    id: "incoming-sea-tide",
    recipient: "The Dreamer on Dry Land",
    sender: "The High Tide at Midnight",
    date: "Spring Tide • Shingle Beach",
    stamp: "🐚",
    paperTheme: "theme-ocean",
    handwritingStyle: "hand-tide",
    decoration: "salt-crust",
    tone: "Comforting & Poetic",
    preview: "Hold this paper to your ear. Do you hear the slow pull of pebbles on the beach?...",
    content: "Hold this damp sheet to your ear.\n\nDo you hear the slow, heavy drag of gray pebbles on the shingle? The ocean is breathing for everyone who forgot to take a deep breath today. Five thousand miles of cold salt water rocking back and forth under the moon, washing the shore clean.\n\nWhatever happened today is washed smooth, like green sea glass with all the sharp edges worn away into soft frosted stone.\n\nSleep soundly now.\n\n— The Tide"
  },
  {
    id: "incoming-sparrow-post",
    recipient: "The Human with the Ink Pot",
    sender: "Barnaby Quill (Winged Mail Chief)",
    date: "First Light Flight",
    stamp: "🪶",
    paperTheme: "theme-cream",
    handwritingStyle: "hand-sparrow",
    decoration: "down-feather",
    tone: "Funny & Busy",
    preview: "Official Post Office Notice: Please stop using heavy sealing wax on letters to clouds...",
    content: "Official Post Office Warning:\n\nPlease cease using heavy leaded sealing wax on envelopes addressed to cloud dwellers and high constellations. My wings are only three inches across, and last Tuesday a letter to the North Star weighed as much as an overripe plum!\n\nUse starlight thread or wildflower gum instead. We courier sparrows have delicate hollow bones, you know.\n\nWarm chirps and ruffled feathers,\nBarnaby Quill, Winged Courier Service"
  },
  {
    id: "incoming-hearth-clock",
    recipient: "The Night Owl",
    sender: "The Clock Behind the Hearth",
    date: "2:15 AM • The Quiet Hours",
    stamp: "🕰️",
    paperTheme: "theme-hearth",
    handwritingStyle: "hand-clock",
    decoration: "brass-gear-mark",
    tone: "Cozy & Comforting",
    preview: "Tick, tock. It is 2:15 AM. You are still awake, and I am still counting for you...",
    content: "Tick, tock. Tick, tock.\n\nIt is 2:15 AM. You are still awake with your thoughts, and I am still counting each heartbeat of the house. Eight thousand one hundred seconds have passed since midnight, and every single one of them was gentle.\n\nYou do not have to solve the puzzle of your entire life before sunrise. You only have to let this single quiet minute pass into the next.\n\nI will keep the rhythm steady until the sparrows start singing.\n\n— The Hearth Clock"
  }
];

// Default Books Fallback
export const DEFAULT_BOOKS = [
  {
    id: "book-1",
    title: "The Cartography of Forgotten Dreams",
    author: "M. Vance",
    category: "Geography of the Mind",
    description: "A worn, clothbound atlas with hand-inked coastlines of things people woke up before finishing.",
    memorableLine: "“Every morning, several million islands disappear beneath the breakfast table.”",
    notes: "She dog-eared page 42, where a coastal town called 'Almost Remembered' is drawn with tiny lighthouse ink.",
    color: "#4a5568",
    hasClue: true,
    clueText: "Tucked between pages 42 and 43 is a scrap of receipt from 1978: 'Key left where the clock pendulum never strikes.'"
  },
  {
    id: "book-2",
    title: "Letters I Never Sent to the Sun",
    author: "Anonymous",
    category: "Epistles",
    description: "A slender volume bound in gold leaf and scorched parchment edges.",
    memorableLine: "“You make everything so bright that nobody ever looks directly at you. I know what that is like, in reverse.”",
    notes: "There are dried chamomile petals pressed into the back cover.",
    color: "#b7791f"
  },
  {
    id: "book-3",
    title: "How to Recognize a Star",
    author: "Dr. E. Sterling",
    category: "Field Guides",
    description: "An astronomical field guide annotated in violet pencil with gentle corrections.",
    memorableLine: "“Do not confuse Sirius with a falling tear; Sirius stays until breakfast.”",
    notes: "In the margin she wrote: 'Sterling was wrong about Betelgeuse. It smells like roasted pecans when it blinks.'",
    color: "#2c5282"
  },
  {
    id: "book-4",
    title: "Tea Recipes for Sleepless Nights",
    author: "G. O'Malley",
    category: "Domestic Arts",
    description: "A damp-stained cookbook with recipes calling for rainwater gathered on Tuesdays.",
    memorableLine: "“A pinch of dried mint, two cloves, and the patience to watch the mug until your shoulders drop.”",
    notes: "The recipe for 'Midnight Oolong' has four exclamation marks next to 'Do NOT boil twice.'",
    color: "#702459"
  },
  {
    id: "book-5",
    title: "A Natural History of Silence",
    author: "K. Lindqvist",
    category: "Essays",
    description: "Studies on snow, empty rooms, deep trenches, and the space between two strangers on a bus.",
    memorableLine: "“Silence is not the absence of sound; it is the furniture of being alone.”",
    notes: "Underlined twice in soft pencil.",
    color: "#234e52"
  },
  {
    id: "book-6",
    title: "Why Humans Keep Dropping Teaspoons",
    author: "The Observer on the 4th Floor",
    category: "Earth Studies",
    description: "A humorous monograph documenting human clumsiness between 11:00 PM and 3:00 AM.",
    memorableLine: "“Gravity is merely an excuse for tired wrists.”",
    notes: "The margin contains a tally of dropped spoons seen through the telescope this month: 14.",
    color: "#744210"
  }
];

// Default Journal Entries Fallback
export const DEFAULT_JOURNAL = [
  {
    id: "entry-1",
    date: "October 14 • 2:40 AM",
    title: "On the habit of lights",
    mood: "Quiet Wonder",
    content: "From up here, cities don't look like concrete and glass. They look like glowing moss spreading over dark velvet cushions.\n\nAt 2:30 AM, London goes slightly dim, but Tokyo is always murmuring. There is a single yellow window in a suburb of Oslo that stayed on until dawn. I wondered if whoever lived there was sick, or writing a novel, or simply couldn't find where the sorrow was coming from.\n\nI kept a silver beam on their windowsill just in case."
  },
  {
    id: "entry-2",
    date: "November 2 • Half-Past Midnight",
    title: "A funny thing about cats",
    mood: "Amused",
    content: "I am convinced cats know exactly what I am doing. \n\nEvery time I shift light across an alley in Lisbon, three ginger cats chase the edge of my glow like it's a slow moth. Humans never notice. Humans walk past, wrapped in woolen scarves, staring into small rectangular glass bricks they hold in their hands.\n\nI like cats. They don't pretend not to see magic."
  },
  {
    id: "entry-3",
    date: "November 19 • Fog over the Sea",
    title: "The dream of having cold feet",
    mood: "Longing",
    content: "A curious thought: What does it feel like to stand barefoot on a wooden floor in winter, then pull on a pair of thick wool socks?\n\nI have the tide, and I have five billion years of silence, and I have the best view in the galaxy. But I have never stepped into a puddle and cursed under my breath, or felt steam from a fresh bowl of lentil soup fog up my spectacles.\n\nSometimes perfection is very drafty."
  },
  {
    id: "entry-4",
    date: "December 4 • The Great Freeze",
    "title": "The Sun sent another postcard",
    mood: "Affectionate",
    content: "The Sun sent a solar flare across the belt today. Loud, gold, slightly arrogant as always.\n\n'Are you still freezing over there, Luna?'\n\nI sent back a shadow. We have been doing this dance since before the dinosaurs decided to look up. He thinks warmth is everything. He doesn't understand that things only truly shine when there is enough dark for them to stand against."
  },
  {
    id: "entry-5",
    date: "January 12 • 4:18 AM",
    title: "The locked drawer",
    mood: "Tender Nostalgia",
    content: "I haven't opened the bottom drawer of the mahogany desk in forty-seven years. Not because there is a monster in it, but because once you unfold an old letter, you let the air of that day escape.\n\nI tucked the little brass key behind the grandfather clock weight long ago. If someone curious ever finds it, I hope they treat the blue flower inside gently. It grew in a garden in Devon that doesn't exist anymore."
  },
  {
    id: "entry-6",
    date: "February 28 • Low Tide",
    title: "Inventory of tonight's treasures",
    mood: "Playful",
    content: "Things collected in the jars tonight:\n1. A moth that got too ambitious near Munich.\n2. The smell of fresh ozone after a summer thunderstorm.\n3. A boy who wished he could understand French verbs.\n4. Three teaspoons of pure silence from the middle of the Pacific.\n\nNumber 3 was too heavy, so I released him into the morning."
  }
];

// Default Dreams Fallback
export const DEFAULT_DREAMS = [
  {
    id: "dream-1",
    title: "Kitchen at 2:13 AM",
    glowColor: "#ffd166",
    whisper: "A girl dancing alone in a kitchen at 2:13 AM.",
    detail: "The refrigerator hums in B-flat. She isn't performing for anyone. She's wearing mismatched woolen socks and buttering toast as though she just invented joy.",
    dreamer: "Captured over Copenhagen",
    scent: "Warm butter and lavender soap"
  },
  {
    id: "dream-2",
    title: "The Name Ocean",
    glowColor: "#06d6a0",
    whisper: "An ocean where the waves remember everyone's names.",
    detail: "Whenever a wave crests and spills upon the white pebbles, it whispers a name that was nearly forgotten. Nobody drowns here; they just float and listen to their grandparents being spoken by the water.",
    dreamer: "Captured over the South Pacific",
    scent: "Salt air and dried peppermint"
  },
  {
    id: "dream-3",
    title: "The All-Sunrise House",
    glowColor: "#f78c6b",
    whisper: "A house with windows facing every sunrise.",
    detail: "No matter which door you step through, it is always five minutes before the world wakes up. The kettle has just boiled. There is no email here.",
    dreamer: "Dreamed by an architect in Kyoto",
    scent: "Cedar shavings and green tea"
  },
  {
    id: "dream-4",
    title: "One Afternoon as a Human",
    glowColor: "#b8a3e8",
    whisper: "The dream of being human for one afternoon.",
    detail: "To feel the scrape of wool on skin. To wait at a bus stop under a broken yellow umbrella. To drop a silver coin into a musician's violin case and feel your ribs ache with gratitude.",
    dreamer: "The Moon's own recurring dream",
    scent: "Wet asphalt and bakery cinnamon"
  },
  {
    id: "dream-5",
    title: "The Whispering Library",
    glowColor: "#70c1b3",
    whisper: "A library where books read themselves aloud when you are lonely.",
    detail: "The volumes do not shout. They whisper from high walnut shelves in the exact voice of someone you wished had never left.",
    dreamer: "Captured over an attic in Prague",
    scent: "Old paper and beeswax"
  }
];

// Default Telescope Sightings Fallback
export const DEFAULT_SIGHTINGS = [
  {
    id: "sight-earth",
    name: "Planet Earth (The Blue Pearl)",
    category: "Home of Wanderers",
    visual: "🌍",
    description: "Swirling clouds over the Atlantic. You can see clusters of gold light where millions of people are currently falling asleep or making midnight tea.",
    quote: "“Look at them down there, huddled around their little fires and lamp posts.”",
    rarity: "Common"
  },
  {
    id: "sight-saturn",
    name: "Saturn & Its Golden Rings",
    category: "Solar Neighbor",
    visual: "🪐",
    description: "Tilted rings made of trillions of tiny ice pebbles spinning in calm, solemn circles.",
    quote: "“Saturn always looks dressed for a ball nobody else was invited to.”",
    rarity: "Common"
  },
  {
    id: "sight-pleiades",
    name: "The Seven Sisters (Pleiades)",
    category: "Star Cluster",
    visual: "✨",
    description: "A dazzling cluster enveloped in ghostly blue nebulosity, shivering like jewels held in a palm.",
    quote: "“They whisper to each other across four hundred light years without raising their voices.”",
    rarity: "Uncommon"
  },
  {
    id: "sight-voyager",
    name: "A Lost Tin Satellite (Voyager)",
    category: "Human Artifact",
    visual: "🛰️",
    description: "A tiny brass and gold-plated craft drifting quietly into the void, carrying a phonograph record of laughter and river songs.",
    quote: "“A hello sent into the dark that will outlast every empire.”",
    rarity: "Rare"
  },
  {
    id: "sight-paper-plane",
    name: "The Impossible Paper Crane",
    category: "Celestial Anomaly",
    visual: "🕊️",
    description: "A small origami crane folded from ledger paper, gliding serenely through the zero-gravity vacuum with stardust on its wings.",
    quote: "“Folded by someone whose wish was too light for gravity to hold down.”",
    rarity: "Very Rare"
  },
  {
    id: "sight-aurora",
    name: "Northern Aurora Borealis",
    category: "Atmospheric Veil",
    visual: "🌌",
    description: "Emerald and violet ribbons dancing along the magnetic rim of the northern pole like sheer curtains in a slow draft.",
    quote: "“Earth's breath caught in the solar wind.”",
    rarity: "Uncommon"
  }
];

export async function loadBooks() {
  try {
    const res = await fetch('/data/books.json');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback to default books', e);
  }
  return DEFAULT_BOOKS;
}

export async function loadJournal() {
  try {
    const res = await fetch('/data/journal.json');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback to default journal', e);
  }
  return DEFAULT_JOURNAL;
}

export async function loadDreams() {
  try {
    const res = await fetch('/data/dreams.json');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback to default dreams', e);
  }
  return DEFAULT_DREAMS;
}

export async function loadTelescopeSightings() {
  try {
    const res = await fetch('/data/telescope.json');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback to default sightings', e);
  }
  return DEFAULT_SIGHTINGS;
}

export async function loadRecipients() {
  try {
    const res = await fetch('/data/recipients.json');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback to default recipients', e);
  }
  return [
    {
      id: "recipient-moon",
      name: "The Lady in the Moon",
      address: "Crescent Bower, The Sea of Tranquility",
      avatar: "🌙",
      description: "Prefers letters written on thin parchment that can catch starlight.",
      stampType: "silver-crescent",
      deliveryMethod: "Starbeam Express"
    },
    {
      id: "recipient-willow",
      name: "The Old Whispering Willow",
      address: "Bent Riverbank, Hollow Root No. 4",
      avatar: "🌿",
      description: "Listens through the moss. Letters are rolled up and tucked between its bark folds.",
      stampType: "moss-seal",
      deliveryMethod: "River Breeze"
    },
    {
      id: "recipient-tomorrow",
      name: "Tomorrow Morning",
      address: "Just Past the Horizon of Sleep",
      avatar: "✨",
      description: "Always one step ahead. Best reached by leaving notes under your pillow.",
      stampType: "dawn-petal",
      deliveryMethod: "First Sparrow Flight"
    }
  ];
}

export async function loadLetters() {
  const local = localStorage.getItem(STORAGE_LETTERS_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn('Failed parsing local letters', e);
    }
  }

  try {
    const res = await fetch('/data/letters.json');
    if (res.ok) {
      const data = await res.json();
      saveLettersToStorage(data);
      return data;
    }
  } catch (err) {
    console.warn('Could not load letters.json, using defaults', err);
  }
  return [];
}

export function saveLettersToStorage(letters) {
  try {
    localStorage.setItem(STORAGE_LETTERS_KEY, JSON.stringify(letters));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

export async function loadIncomingLetters() {
  try {
    const res = await fetch('/data/incoming_letters.json');
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback to default incoming letters', e);
  }
  return DEFAULT_INCOMING_LETTERS;
}

export function getVisitorLetters() {
  try {
    const raw = localStorage.getItem(STORAGE_VISITOR_LETTERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading visitor letters', e);
  }

  // Check if there are user letters in legacy storage key
  const legacy = getSavedLetters().filter(l => l.isUserLetter || l.letterType);
  if (legacy.length > 0) {
    return legacy;
  }

  // Starter sample visitor letter so the visitor sees a real example
  const starter = [
    {
      id: 'visitor-letter-sample',
      isUserLetter: true,
      recipient: 'The Lady in the Moon',
      sender: 'A Quiet Wanderer',
      letterType: '🌙 A Letter to the Moon',
      envelope: 'env-linen',
      paperTone: 'paper-cream',
      stamp: '🌙',
      waxSeal: 'wax-rose',
      date: 'Midnight Hour • Yesterday',
      preview: 'I never knew moonlight could pool on oak boards like quiet milk until tonight...',
      content: 'Dear Moon,\n\nI never knew moonlight could pool on oak boards like quiet milk until tonight. Watching the trees sway outside this window, I wanted to whisper that you don\'t have to carry every secret in the world alone.\n\nRest gently behind your clouds.\n\n— A Quiet Wanderer'
    }
  ];

  return starter;
}

export function saveNewLetter(letterData) {
  const letters = getSavedLetters();
  const visitorLetters = getVisitorLetters().filter(l => l.id !== 'visitor-letter-sample');

  const newLetter = {
    id: 'user-letter-' + Date.now(),
    isUserLetter: true,
    date: `Midnight Hour • ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
    ...letterData
  };

  visitorLetters.unshift(newLetter);
  letters.unshift(newLetter);

  try {
    localStorage.setItem(STORAGE_VISITOR_LETTERS_KEY, JSON.stringify(visitorLetters));
    localStorage.setItem(STORAGE_LETTERS_KEY, JSON.stringify(letters));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

  return newLetter;
}

export function getSavedLetters() {
  try {
    const raw = localStorage.getItem(STORAGE_LETTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Wishes System
export function loadWishes() {
  try {
    const raw = localStorage.getItem(STORAGE_WISHES_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: 'wish-demo-1',
        text: "May my grandmother remember the garden in springtime.",
        date: "Kept under the Pleiades"
      }
    ];
  } catch {
    return [];
  }
}

export function saveWish(wishText) {
  const wishes = loadWishes();
  const newWish = {
    id: 'wish-' + Date.now(),
    text: wishText,
    date: formatFairyDate()
  };
  wishes.unshift(newWish);
  try {
    localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(wishes));
  } catch (e) {
    console.error('Could not save wish', e);
  }
  recordDiscovery('secrets', 'wish-made', 'A Wish Entrusted to the Moon', wishText.substring(0, 45) + '...');
  return newWish;
}

// Discovery System ("Things she keeps" / "A Visitor's Notes")
export function getDiscoveries() {
  try {
    const raw = localStorage.getItem(STORAGE_DISCOVERIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load discoveries', e);
  }
  return {
    objects: [],
    books: [],
    dreams: [],
    memories: [],
    secrets: []
  };
}

export function recordDiscovery(category, id, title, detail) {
  const disc = getDiscoveries();
  if (!disc[category]) disc[category] = [];

  const existing = disc[category].find((item) => item.id === id);
  if (!existing) {
    disc[category].push({
      id,
      title,
      detail,
      time: formatFairyDate()
    });
    try {
      localStorage.setItem(STORAGE_DISCOVERIES_KEY, JSON.stringify(disc));
    } catch (e) {
      console.error('Error saving discovery', e);
    }
    return true; // was newly discovered
  }
  return false;
}

export function getTotalDiscoveryCount() {
  const disc = getDiscoveries();
  return (
    disc.objects.length +
    disc.books.length +
    disc.dreams.length +
    disc.memories.length +
    disc.secrets.length
  );
}

// Drawer & Brass Key System
export function getDrawerState() {
  try {
    const raw = localStorage.getItem(STORAGE_DRAWER_KEY);
    return raw ? JSON.parse(raw) : { hasKey: false, isUnlocked: false };
  } catch {
    return { hasKey: false, isUnlocked: false };
  }
}

export function setHasBrassKey(value = true) {
  const state = getDrawerState();
  state.hasKey = value;
  localStorage.setItem(STORAGE_DRAWER_KEY, JSON.stringify(state));
  if (value) {
    recordDiscovery('secrets', 'brass-key', 'The Tiny Crescent Key', 'Found tucked behind the swinging grandfather clock weight.');
  }
}

export function unlockDrawer() {
  const state = getDrawerState();
  state.isUnlocked = true;
  localStorage.setItem(STORAGE_DRAWER_KEY, JSON.stringify(state));
  recordDiscovery('secrets', 'unlocked-drawer', 'The Drawer Closed for 47 Years', 'Opened with the crescent key, revealing Apollo 11 memories.');
}

export function formatFairyDate() {
  const hours = new Date().getHours();
  const timesOfDay = [
    "Dewy Dawn",
    "Morning Sunbeam",
    "Noon Bell",
    "Honeyed Afternoon",
    "Twilight Whisper",
    "Moonlit Hour",
    "Midnight Dew",
    "Witching Murmur"
  ];
  const timeName = timesOfDay[Math.floor((hours / 24) * timesOfDay.length)] || "Starlight Hour";
  const moons = ["Waxing Crescent", "Full Moon Flower", "Silver Waning", "New Star Night"];
  const moon = moons[new Date().getDate() % moons.length];
  return `${timeName} • ${moon}`;
}

export function resetAllLocalData() {
  try {
    localStorage.removeItem(STORAGE_LETTERS_KEY);
    localStorage.removeItem(STORAGE_VISITOR_LETTERS_KEY);
    localStorage.removeItem(STORAGE_WISHES_KEY);
    localStorage.removeItem(STORAGE_DISCOVERIES_KEY);
    localStorage.removeItem(STORAGE_DRAWER_KEY);
    return true;
  } catch (e) {
    console.error('Failed to reset data', e);
    return false;
  }
}
