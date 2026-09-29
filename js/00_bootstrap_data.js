const VERSION='4.7.1';
// QA-only Project Intelligence bypass. Normal careers must earn the Creative 70 route.
const PROJECT_INTELLIGENCE_TEST_BYPASS=typeof location!=='undefined'&&new URLSearchParams(location.search).get('pitest')==='1';
const KEY='projectSlateCareer_v2';
const app=document.getElementById('app'),toast=document.getElementById('toast');
const genres=['Action Thriller','Action Comedy','Crime Thriller','Mystery Thriller','Psychological Horror','Supernatural Horror','Prestige Drama','Sports Drama','Comedy','Romantic Comedy','Science Fiction','Fantasy','Superhero','Family Adventure','Adventure','Historical Epic'];
// Genre affinity lets hybrid/new genres inherit credible experience from neighbouring lanes
// without pretending that every adjacent credit is identical to direct genre experience.
const GENRE_AFFINITIES={
 'Action Thriller':{'Action Comedy':.78,'Crime Thriller':.58,'Adventure':.52,'Superhero':.76,'Historical Epic':.34},
 'Action Comedy':{'Comedy':.84,'Crime Thriller':.42,'Adventure':.48,'Superhero':.56},
 'Crime Thriller':{'Mystery Thriller':.82,'Psychological Horror':.38,'Prestige Drama':.46},
 'Mystery Thriller':{'Psychological Horror':.56,'Prestige Drama':.42,'Supernatural Horror':.44},
 'Psychological Horror':{'Supernatural Horror':.84,'Prestige Drama':.36},
 'Supernatural Horror':{'Fantasy':.64,'Mystery Thriller':.44},
 'Prestige Drama':{'Sports Drama':.80,'Romantic Comedy':.42,'Historical Epic':.80},
 'Sports Drama':{'Action Thriller':.38,'Comedy':.28},
 'Comedy':{'Romantic Comedy':.88,'Family Adventure':.34},
 'Romantic Comedy':{'Prestige Drama':.42},
 'Science Fiction':{'Fantasy':.46,'Superhero':.74,'Adventure':.42},
 'Fantasy':{'Superhero':.72,'Family Adventure':.58,'Adventure':.62,'Historical Epic':.42},
 'Superhero':{'Adventure':.58,'Family Adventure':.44},
 'Family Adventure':{'Adventure':.82},
 'Adventure':{'Historical Epic':.56}
};
function genreAffinity(a,b){
 if(!a||!b)return 0;if(a===b)return 1;
 return Math.max(GENRE_AFFINITIES[a]?.[b]||0,GENRE_AFFINITIES[b]?.[a]||0);
}
function genreProfileAffinity(profileGenres,target){
 const scores=(profileGenres||[]).map(g=>genreAffinity(g,target)).filter(Boolean).sort((a,b)=>b-a);
 return clamp((scores[0]||0)+(scores[1]||0)*.22,0,1);
}
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
 ['Elena Park',88,92,87,63,.85,['Prestige Drama','Crime Thriller','Mystery Thriller','Historical Epic'],'Character specialist'],
 ['Jonas Reed',91,74,72,88,1.05,['Action Thriller','Crime Thriller','Science Fiction','Superhero'],'Structure and momentum'],
 ['Miriam Cole',77,90,94,61,.72,['Prestige Drama','Comedy','Romantic Comedy'],'Dialogue specialist'],
 ['Felix Ward',82,70,75,93,1.15,['Action Thriller','Action Comedy','Family Adventure','Adventure','Fantasy'],'Commercial screenwriter'],
 ['Anika Rao',84,86,81,78,.78,['Psychological Horror','Supernatural Horror','Science Fiction','Prestige Drama'],'Conceptual dramatist'],
 ['Tomás Vega',76,73,84,89,.68,['Comedy','Romantic Comedy','Family Adventure','Action Comedy'],'Audience-friendly writer'],
 ['June Mercer',89,80,77,72,.82,['Psychological Horror','Supernatural Horror','Crime Thriller','Mystery Thriller'],'Genre craftsman'],
 ['Liam Okafor',80,88,86,68,.62,['Prestige Drama','Sports Drama','Science Fiction','Historical Epic'],'Emotional storyteller'],
 ['Maeve Quinn',86,77,73,85,.76,['Fantasy','Family Adventure','Adventure','Superhero'],'Worldbuilding specialist'],
 ['Isaac Bell',78,69,79,91,.70,['Action Thriller','Action Comedy','Comedy','Superhero'],'High-concept writer'],
 ['Nadia Stone',83,91,88,70,.74,['Psychological Horror','Prestige Drama','Sports Drama','Romantic Comedy'],'Performance-led writer'],
 ['Owen Shah',92,75,70,82,.96,['Science Fiction','Fantasy','Crime Thriller','Mystery Thriller','Historical Epic'],'Architectural storyteller']
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
