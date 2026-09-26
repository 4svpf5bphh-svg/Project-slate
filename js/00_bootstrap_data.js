const VERSION='4.0d.4';
const KEY='projectSlateCareer_v2';
const app=document.getElementById('app'),toast=document.getElementById('toast');
const genres=['Action Thriller','Psychological Horror','Prestige Drama','Science Fiction','Comedy','Family Adventure','Crime Thriller','Fantasy'];
const audienceNames=['Mainstream Adults','Younger Audiences','Families','Genre Fans','Prestige / Arthouse'];

const scriptSeed=[
 ['The Last Lighthouse','Psychological Horror','A widowed lighthouse keeper begins receiving radio messages from his dead wife.',.5,10,80,75,86,58,55],
 ['Redline','Action Thriller','A disgraced getaway driver is forced into one final cross-country run with a protected witness.',1,24,68,90,61,86,84],
 ['The Small Hours','Prestige Drama','Three estranged siblings clear out the family home during one sleepless winter night.',.35,7.5,88,48,79,56,38],
 ['Glass City','Science Fiction','A memory architect learns that the perfect city she designed is built from stolen lives.',.85,28,84,79,91,66,79],
 ['Hollow Creek','Psychological Horror','A missing-child investigation leads a detective into a town where nobody remembers the same past.',.45,8,76,84,82,64,58],
 ['Borrowed Summer','Comedy','Two rival wedding planners are forced to share the same disastrous destination resort.',.35,9,69,80,55,88,42],
 ['Wildwood','Family Adventure','Three children discover an abandoned railway that only runs through places that no longer exist.',.65,18,78,82,85,84,67],
 ['The Ninth Room','Crime Thriller','A courthouse cleaner discovers a sealed jury room still being used for secret trials.',.55,12,82,87,74,78,61],
 ['Ash Kingdom','Fantasy','The last royal cartographer discovers that every map he draws creates the land it depicts.',.95,31,81,85,93,71,87],
 ['Satellite Hearts','Science Fiction','Two astronauts on separate dying stations discover they can speak through an impossible radio frequency.',.6,16,87,73,88,68,63]
];


const writerSeed=[
 ['Elena Park',88,92,87,63,.85,['Prestige Drama','Crime Thriller'],'Character specialist'],
 ['Jonas Reed',91,74,72,88,1.05,['Action Thriller','Crime Thriller','Science Fiction'],'Structure and momentum'],
 ['Miriam Cole',77,90,94,61,.72,['Prestige Drama','Comedy'],'Dialogue specialist'],
 ['Felix Ward',82,70,75,93,1.15,['Action Thriller','Family Adventure','Fantasy'],'Commercial screenwriter'],
 ['Anika Rao',84,86,81,78,.78,['Psychological Horror','Science Fiction','Prestige Drama'],'Conceptual dramatist'],
 ['Tomás Vega',76,73,84,89,.68,['Comedy','Family Adventure'],'Audience-friendly writer'],
 ['June Mercer',89,80,77,72,.82,['Psychological Horror','Crime Thriller'],'Genre craftsman'],
 ['Liam Okafor',80,88,86,68,.62,['Prestige Drama','Science Fiction'],'Emotional storyteller'],
 ['Maeve Quinn',86,77,73,85,.76,['Fantasy','Family Adventure'],'Worldbuilding specialist'],
 ['Isaac Bell',78,69,79,91,.70,['Action Thriller','Comedy'],'High-concept writer'],
 ['Nadia Stone',83,91,88,70,.74,['Psychological Horror','Prestige Drama'],'Performance-led writer'],
 ['Owen Shah',92,75,70,82,.96,['Science Fiction','Fantasy','Crime Thriller'],'Architectural storyteller']
];

const rivalSeed=[
 ['Northstar Studios','Blockbusters',78,2],
 ['Arcadia Pictures','Broad Commercial',70,2],
 ['Red Crown','Genre Specialist',61,1],
 ['Bluebird Films','Prestige',58,1],
 ['Ironwood Pictures','Franchise Builder',74,2],
 ['Lantern House','Indie / Prestige',49,1]
];

const firstNames=['Avery','Milo','Zara','Theo','June','Mina','Owen','Luca','Hana','Rowan','Ezra','Sasha','Lena','Isaac','Nora','Marek'];
const lastNames=['Voss','Hart','Chen','Quinn','Mercer','Vale','Brooks','North','Bell','Stone','Ito','Reed','Shah','Cole','Moreau','Sayeed'];
const titleA=['Silent','Broken','Golden','Last','Black','Neon','Cold','Burning','Hidden','Second','Wild','Hollow','Paper','Glass'];
const titleB=['Sky','Witness','Road','House','Harvest','Kingdom','Signal','Empire','Summer','Orbit','Crown','Water','City','Night'];

let state;
let simulationBenchmarkActive=false;
