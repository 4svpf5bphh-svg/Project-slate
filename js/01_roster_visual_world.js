// PRIVATE PLAYTEST ROSTER.
// Real names and selected public credits are reference data.
// Numeric ratings, game fees, availability, relationships and simulated career outcomes are fictional game mechanics.
const ROSTER_MODE='private-real-world';

const actorSeed=[
 ['Florence Pugh',91,83,91,86,6.0,['Prestige Drama','Psychological Horror','Science Fiction'],'Prestige / Event Lead',30,['Midsommar','Little Women','Oppenheimer','Dune: Part Two']],
 ['Zendaya',88,94,94,87,9.0,['Science Fiction','Prestige Drama'],'Global Star',30,['Dune: Part Two','Challengers','Spider-Man: No Way Home']],
 ['Timothée Chalamet',91,95,92,84,10.0,['Science Fiction','Prestige Drama','Fantasy'],'Global Star',30,['Dune: Part Two','Wonka','Call Me by Your Name']],
 ['Margot Robbie',89,96,82,88,10.0,['Comedy','Prestige Drama','Crime Thriller'],'A-List Producer-Star',36,['Barbie','I, Tonya','Once Upon a Time in Hollywood']],
 ['Ryan Gosling',90,95,80,88,9.5,['Comedy','Action Thriller','Prestige Drama'],'A-List Draw',45,['Barbie','La La Land','The Nice Guys']],
 ['Emma Stone',94,92,88,90,8.5,['Prestige Drama','Comedy','Fantasy'],'Awards / Commercial Lead',37,['Poor Things','La La Land','The Favourite']],
 ['Daniel Kaluuya',94,82,78,88,5.5,['Psychological Horror','Prestige Drama','Science Fiction'],'Prestige Genre Lead',37,['Get Out','Judas and the Black Messiah','Nope']],
 ['Lupita Nyong’o',93,84,75,90,5.5,['Psychological Horror','Prestige Drama','Science Fiction'],'Prestige Genre Lead',43,['12 Years a Slave','Us','A Quiet Place: Day One']],
 ['Michael B. Jordan',87,93,86,87,8.5,['Action Thriller','Prestige Drama'],'Event / Franchise Lead',39,['Creed','Black Panther','Sinners']],
 ['Saoirse Ronan',95,78,72,91,4.5,['Prestige Drama','Crime Thriller'],'Prestige Specialist',32,['Lady Bird','Little Women','Brooklyn']],
 ['Oscar Isaac',93,84,72,88,5.5,['Science Fiction','Prestige Drama','Crime Thriller'],'Versatile Prestige Lead',47,['Dune','Ex Machina','Inside Llewyn Davis']],
 ['Rebecca Ferguson',88,85,82,89,5.5,['Science Fiction','Action Thriller','Psychological Horror'],'Genre / Event Lead',42,['Dune: Part Two','Mission: Impossible – Fallout','Doctor Sleep']],
 ['Pedro Pascal',86,94,91,86,9.0,['Action Thriller','Science Fiction','Comedy'],'High-Momentum Star',51,['Gladiator II','The Unbearable Weight of Massive Talent','The Mandalorian']],
 ['Anya Taylor-Joy',91,87,83,86,6.0,['Psychological Horror','Fantasy','Action Thriller'],'Distinctive Genre Star',30,['Furiosa: A Mad Max Saga','The Menu','The Witch']],
 ['Dev Patel',91,76,82,89,4.2,['Action Thriller','Prestige Drama','Fantasy'],'Actor-Filmmaker',36,['Monkey Man','Lion','The Green Knight']],
 ['John Boyega',86,78,72,86,3.8,['Science Fiction','Action Thriller','Prestige Drama'],'Versatile Genre Lead',34,['Attack the Block','The Woman King','They Cloned Tyrone']],
 ['Jodie Comer',94,82,88,91,5.0,['Prestige Drama','Crime Thriller','Action Thriller'],'Performance Lead',33,['The Bikeriders','The Last Duel','Free Guy']],
 ['Paul Mescal',94,83,92,88,5.3,['Prestige Drama','Action Thriller'],'Hot Prestige Lead',30,['Aftersun','Gladiator II','All of Us Strangers']],
 ['Austin Butler',89,90,89,84,6.8,['Prestige Drama','Crime Thriller','Action Thriller'],'Rising A-List Lead',35,['Elvis','Dune: Part Two','The Bikeriders']],
 ['Mikey Madison',92,71,94,87,3.0,['Prestige Drama','Comedy','Crime Thriller'],'Breakout Awards Lead',27,['Anora','Scream','Once Upon a Time in Hollywood']],
 ['Colman Domingo',94,76,89,92,4.0,['Prestige Drama','Crime Thriller'],'Prestige Character Lead',56,['Sing Sing','Rustin','Ma Rainey’s Black Bottom']],
 ['Da’Vine Joy Randolph',93,69,84,91,3.2,['Prestige Drama','Comedy'],'Character Specialist',40,['The Holdovers','Dolemite Is My Name','High Fidelity']],
 ['Andrew Scott',95,75,84,91,4.0,['Prestige Drama','Crime Thriller','Psychological Horror'],'Prestige Character Lead',49,['All of Us Strangers','1917','Spectre']],
 ['Carey Mulligan',94,80,73,92,4.8,['Prestige Drama','Crime Thriller'],'Prestige Lead',41,['Maestro','Promising Young Woman','An Education']],
 ['Robert Pattinson',92,91,86,85,7.5,['Crime Thriller','Psychological Horror','Fantasy'],'Prestige / Franchise Star',40,['The Batman','The Lighthouse','Good Time']],
 ['LaKeith Stanfield',91,73,70,84,3.3,['Crime Thriller','Comedy','Prestige Drama'],'Distinctive Character Lead',35,['Judas and the Black Messiah','Sorry to Bother You','Knives Out']],
 ['Tessa Thompson',89,80,71,88,4.0,['Science Fiction','Prestige Drama','Action Thriller'],'Versatile Lead',42,['Creed','Passing','Thor: Ragnarok']],
 ['Jessie Buckley',95,72,86,90,3.8,['Prestige Drama','Psychological Horror'],'Performance Specialist',36,['Women Talking','Men','I’m Thinking of Ending Things']],
 ['Jonathan Bailey',88,84,93,87,5.0,['Fantasy','Prestige Drama','Family Adventure'],'High-Momentum Lead',38,['Wicked','Jurassic World Rebirth','Bridgerton']],
 ['Cailee Spaeny',90,71,88,86,3.0,['Psychological Horror','Prestige Drama','Science Fiction'],'Rising Genre Lead',28,['Priscilla','Civil War','Alien: Romulus']],
 ['Glen Powell',85,91,92,88,7.0,['Action Thriller','Comedy','Crime Thriller'],'Commercial Lead',37,['Top Gun: Maverick','Hit Man','Twisters']],
 ['Ayo Edebiri',90,73,91,89,3.2,['Comedy','Prestige Drama','Family Adventure'],'Comedy / Prestige Breakout',30,['Bottoms','Inside Out 2','The Bear']],
 ['Mahershala Ali',96,82,70,93,5.5,['Prestige Drama','Crime Thriller','Science Fiction'],'Prestige Heavyweight',52,['Moonlight','Green Book','Leave the World Behind']],
 ['Viola Davis',97,88,76,94,6.5,['Prestige Drama','Action Thriller','Crime Thriller'],'Prestige Heavyweight',61,['Fences','The Woman King','Air']],
 ['Denzel Washington',97,96,77,95,10.0,['Prestige Drama','Crime Thriller','Action Thriller'],'Legendary Star',71,['Training Day','Fences','Gladiator II']],
 ['Cate Blanchett',97,89,74,94,6.5,['Prestige Drama','Fantasy','Crime Thriller'],'Prestige Heavyweight',57,['Tár','Carol','Nightmare Alley']],
 ['Cillian Murphy',96,90,88,93,7.0,['Prestige Drama','Crime Thriller','Science Fiction'],'Awards / Prestige Star',50,['Oppenheimer','28 Days Later','Peaky Blinders']],
 ['Rami Malek',90,84,67,86,4.5,['Prestige Drama','Crime Thriller','Action Thriller'],'Distinctive Lead',45,['Bohemian Rhapsody','No Time to Die','Oppenheimer']],
 ['Letitia Wright',87,78,70,87,3.4,['Science Fiction','Prestige Drama','Action Thriller'],'Franchise / Prestige Lead',32,['Black Panther: Wakanda Forever','Aisha','Ready Player One']],
 ['Barry Keoghan',92,81,84,81,4.5,['Prestige Drama','Crime Thriller','Psychological Horror'],'Unpredictable Character Lead',33,['The Banshees of Inisherin','Saltburn','The Killing of a Sacred Deer']],
 ['Jenna Ortega',86,91,93,84,6.5,['Psychological Horror','Comedy','Fantasy'],'Younger-Audience Star',23,['Beetlejuice Beetlejuice','Scream','Wednesday']],
 ['Jacob Elordi',86,86,86,82,5.2,['Prestige Drama','Crime Thriller'],'Rising Star',29,['Priscilla','Saltburn','Euphoria']],
 ['Steven Yeun',94,78,72,90,4.4,['Prestige Drama','Science Fiction','Psychological Horror'],'Prestige Genre Lead',42,['Minari','Nope','Burning']],
 ['Greta Lee',92,70,78,89,3.4,['Prestige Drama','Science Fiction'],'Prestige Lead',43,['Past Lives','Spider-Man: Across the Spider-Verse','The Morning Show']],
 ['Jeremy Allen White',91,82,91,85,4.8,['Prestige Drama','Crime Thriller'],'High-Momentum Lead',35,['The Iron Claw','The Bear','Fingernails']],
 ['Keke Palmer',88,80,77,88,4.0,['Comedy','Psychological Horror','Prestige Drama'],'Comedy / Genre Lead',33,['Nope','Hustlers','One of Them Days']],
 ['Mia Goth',91,72,80,82,3.4,['Psychological Horror','Crime Thriller'],'Horror Specialist',32,['Pearl','MaXXXine','X']],
 ['David Jonsson',89,62,92,87,2.2,['Science Fiction','Prestige Drama','Comedy'],'Breakout Lead',33,['Alien: Romulus','Rye Lane','Industry']],
 ['Nicole Kidman',94,91,75,93,6.5,['Prestige Drama','Psychological Horror','Crime Thriller'],'Prestige Star',59,['Babygirl','The Northman','Eyes Wide Shut']],
 ['Sydney Sweeney',84,88,87,82,5.5,['Psychological Horror','Comedy','Prestige Drama'],'Commercial / Genre Lead',29,['Anyone But You','Immaculate','Reality']],
 ['Josh O’Connor',94,74,88,90,3.8,['Prestige Drama','Crime Thriller','Comedy'],'Prestige Lead',36,['Challengers','La Chimera','God’s Own Country']],
 ['Harris Dickinson',88,72,85,86,3.2,['Prestige Drama','Crime Thriller','Action Thriller'],'Rising Lead',30,['Babygirl','Triangle of Sadness','The Iron Claw']],
 ['Sophie Thatcher',88,60,90,84,2.2,['Psychological Horror','Science Fiction'],'Genre Breakout',26,['Companion','Heretic','Yellowjackets']],
 ['Danielle Deadwyler',95,64,83,92,2.8,['Prestige Drama','Crime Thriller'],'Performance Specialist',44,['Till','The Piano Lesson','Carry-On']],
 ['Brian Tyree Henry',94,76,79,90,4.0,['Prestige Drama','Action Thriller','Comedy'],'Character / Genre Lead',44,['Causeway','Bullet Train','Godzilla x Kong']],
 ['Rachel Sennott',87,62,85,84,2.3,['Comedy','Prestige Drama','Psychological Horror'],'Comedy Breakout',31,['Bottoms','Shiva Baby','Bodies Bodies Bodies']],
 ['Emily Blunt',91,91,82,90,6.2,['Action Thriller','Prestige Drama','Comedy'],'A-List Versatile Lead',43,['Oppenheimer','A Quiet Place','Edge of Tomorrow']],
 ['Andrew Garfield',93,88,81,89,5.8,['Prestige Drama','Crime Thriller','Fantasy'],'Prestige / Event Lead',43,['Tick, Tick... Boom!','The Social Network','Hacksaw Ridge']],
 ['Ana de Armas',87,90,84,85,5.5,['Action Thriller','Crime Thriller','Prestige Drama'],'Commercial / Prestige Lead',38,['Knives Out','No Time to Die','Blonde']],
 ['Adam Driver',95,87,76,88,6.0,['Prestige Drama','Crime Thriller','Science Fiction'],'Prestige Heavyweight',42,['Marriage Story','Ferrari','Star Wars: The Last Jedi']],
 ['Sylvester Stallone',84,96,62,89,6.0,['Action Thriller','Prestige Drama','Crime Thriller'],'Legacy Action Icon',80,['Rocky','First Blood','Creed']],
 ['Arnold Schwarzenegger',77,97,60,89,5.5,['Action Thriller','Science Fiction','Comedy'],'Legacy Action Icon',79,['Terminator 2: Judgment Day','Predator','True Lies']],
 ['Bruce Willis',88,95,52,88,5.5,['Action Thriller','Crime Thriller','Science Fiction'],'Legacy Action Star',71,['Die Hard','Pulp Fiction','The Sixth Sense']],
 ['Scott Eastwood',69,62,54,81,1.8,['Action Thriller','Crime Thriller'],'Commercial Supporting Lead',40,['Fury','The Outpost','Fast X']],
 ['Ruby Rose',67,58,48,74,1.4,['Action Thriller','Crime Thriller','Science Fiction'],'Genre Supporting Lead',40,['John Wick: Chapter 2','Pitch Perfect 3','Batwoman']],
 ['Jai Courtney',72,61,50,82,1.8,['Action Thriller','Science Fiction','Crime Thriller'],'Action Ensemble Player',40,['The Suicide Squad','Jack Reacher','Terminator Genisys']],
 ['Samara Weaving',84,67,72,86,2.4,['Psychological Horror','Comedy','Action Thriller'],'Genre Lead',34,['Ready or Not','Guns Akimbo','The Babysitter']],
 ['Maika Monroe',87,64,79,88,2.2,['Psychological Horror','Crime Thriller','Science Fiction'],'Indie Genre Lead',33,['It Follows','Longlegs','Watcher']],
 ['Boyd Holbrook',82,66,65,85,2.4,['Crime Thriller','Action Thriller','Science Fiction'],'Character / Genre Lead',45,['Logan','The Bikeriders','Narcos']],
 ['Betty Gilpin',88,61,63,89,2.0,['Comedy','Prestige Drama','Action Thriller'],'Character Lead',40,['The Hunt','GLOW','The Tomorrow War']],
 ['Dan Stevens',89,70,82,88,3.5,['Psychological Horror','Fantasy','Comedy'],'Versatile Genre Lead',43,['The Guest','Abigail','Godzilla x Kong: The New Empire']],
 ['Alison Brie',88,72,66,90,3.6,['Comedy','Prestige Drama','Crime Thriller'],'Comedy / Drama Lead',43,['GLOW','Community','Promising Young Woman']],
 ['Taron Egerton',87,82,72,87,5.5,['Action Thriller','Prestige Drama','Crime Thriller'],'Commercial Lead',36,['Rocketman','Kingsman: The Secret Service','Tetris']],
 ['Nicholas Hoult',90,82,88,90,5.5,['Fantasy','Comedy','Action Thriller','Prestige Drama'],'Versatile Event Lead',36,['Mad Max: Fury Road','The Menu','Juror #2']],
 ['Dave Bautista',81,85,80,90,6.5,['Action Thriller','Science Fiction','Crime Thriller'],'Event Character Star',57,['Guardians of the Galaxy','Dune: Part Two','Knock at the Cabin']],
 ['Megan Fox',68,82,57,78,4.5,['Action Thriller','Comedy','Psychological Horror'],'Commercial Genre Name',40,['Transformers','Jennifer’s Body','Teenage Mutant Ninja Turtles']],
 ['Jason Statham',74,94,80,92,14.0,['Action Thriller','Crime Thriller'],'Global Action Star',59,['The Beekeeper','Crank','Fast & Furious Presents: Hobbs & Shaw']],
 ['Chris Pratt',78,94,76,88,14.0,['Action Thriller','Science Fiction','Comedy','Family Adventure'],'Global Franchise Star',47,['Guardians of the Galaxy','Jurassic World','The Super Mario Bros. Movie']]
];

const directorSeed=[
 ['Christopher Nolan',97,94,82,82,12.0,['Science Fiction','Action Thriller','Crime Thriller'],'Event Auteur',56,['Oppenheimer','Inception','Dunkirk']],
 ['Greta Gerwig',95,91,84,96,9.0,['Comedy','Prestige Drama','Family Adventure'],'Performance / Commercial Auteur',43,['Barbie','Little Women','Lady Bird']],
 ['Denis Villeneuve',97,90,80,85,10.0,['Science Fiction','Crime Thriller','Action Thriller'],'Large-Scale Auteur',58,['Dune: Part Two','Arrival','Blade Runner 2049']],
 ['Jordan Peele',94,90,86,90,7.5,['Psychological Horror','Science Fiction','Comedy'],'High-Concept Auteur',47,['Get Out','Nope','Us']],
 ['Bong Joon Ho',97,84,82,93,7.0,['Prestige Drama','Crime Thriller','Science Fiction'],'Genre-Bending Auteur',57,['Parasite','Memories of Murder','Snowpiercer']],
 ['Ryan Coogler',94,94,89,94,8.5,['Action Thriller','Prestige Drama','Psychological Horror'],'Performance / Event Director',40,['Sinners','Black Panther','Creed']],
 ['Chloé Zhao',94,72,81,95,5.5,['Prestige Drama','Fantasy'],'Prestige Naturalist',44,['Nomadland','Eternals','The Rider']],
 ['Yorgos Lanthimos',96,70,72,88,6.0,['Prestige Drama','Comedy','Fantasy'],'Distinctive Auteur',52,['Poor Things','The Favourite','Kinds of Kindness']],
 ['Emerald Fennell',91,79,77,91,4.8,['Prestige Drama','Crime Thriller','Comedy'],'Provocative Auteur',40,['Promising Young Woman','Saltburn']],
 ['Celine Song',93,68,86,96,3.5,['Prestige Drama','Comedy'],'Performance Auteur',38,['Past Lives','Materialists']],
 ['Sean Baker',96,69,91,94,4.0,['Prestige Drama','Comedy'],'Independent Auteur',55,['Anora','The Florida Project','Tangerine']],
 ['Ari Aster',93,75,68,88,5.0,['Psychological Horror','Prestige Drama'],'Horror Auteur',40,['Hereditary','Midsommar','Beau Is Afraid']],
 ['Robert Eggers',95,74,73,85,5.5,['Psychological Horror','Fantasy','Prestige Drama'],'Period / Horror Auteur',43,['Nosferatu','The Lighthouse','The Northman']],
 ['James Gunn',89,97,88,86,10.0,['Action Thriller','Science Fiction','Comedy'],'Franchise Showrunner',60,['Guardians of the Galaxy Vol. 3','The Suicide Squad','Superman']],
 ['Joseph Kosinski',88,96,93,78,8.5,['Action Thriller','Science Fiction'],'Technical Event Director',52,['Top Gun: Maverick','F1','TRON: Legacy']],
 ['Gina Prince-Bythewood',91,83,88,95,5.5,['Action Thriller','Prestige Drama'],'Performance / Action Director',57,['The Woman King','The Old Guard','Love & Basketball']],
 ['Damien Chazelle',94,83,70,91,6.5,['Prestige Drama','Comedy'],'Ambitious Auteur',41,['La La Land','Whiplash','Babylon']],
 ['Kogonada',92,65,86,92,3.2,['Prestige Drama','Science Fiction'],'Visual Humanist',49,['After Yang','Columbus','A Big Bold Beautiful Journey']],
 ['Kelly Reichardt',96,52,92,94,2.8,['Prestige Drama','Crime Thriller'],'Independent Auteur',62,['First Cow','Showing Up','Certain Women']],
 ['Nia DaCosta',87,82,82,89,4.0,['Psychological Horror','Action Thriller','Prestige Drama'],'Genre / Studio Director',36,['Candyman','The Marvels','Hedda']],
 ['David Fincher',98,89,86,84,9.0,['Crime Thriller','Psychological Horror','Prestige Drama'],'Precision Auteur',64,['The Social Network','Gone Girl','Zodiac']],
 ['Alfonso Cuarón',98,82,83,93,8.0,['Science Fiction','Prestige Drama','Fantasy'],'Technical Humanist',64,['Roma','Gravity','Children of Men']],
 ['Kathryn Bigelow',95,85,91,87,7.0,['Action Thriller','Crime Thriller','Prestige Drama'],'Tension Specialist',74,['The Hurt Locker','Zero Dark Thirty','Point Break']],
 ['Steven Spielberg',99,98,90,97,12.0,['Family Adventure','Prestige Drama','Science Fiction'],'Master Event Storyteller',79,['Jaws','E.T. the Extra-Terrestrial','Saving Private Ryan']],
 ['Martin Scorsese',99,86,81,98,9.5,['Crime Thriller','Prestige Drama','Comedy'],'Master Filmmaker',83,['Goodfellas','The Departed','The Wolf of Wall Street']]
];

const fictionalActorSeed=[
 ['Elara Vale',88,59,63,86,1.8,['Prestige Drama','Science Fiction'],'Indie Breakout',29,'femme'],
 ['Marcus Quinn',80,72,68,78,2.1,['Action Thriller','Crime Thriller'],'Commercial Upstart',34,'masc'],
 ['Nina Hart',82,61,70,83,1.6,['Comedy','Family Adventure'],'Warm Audience Favourite',31,'femme'],
 ['Dominic Mercer',86,64,66,80,2.0,['Crime Thriller','Prestige Drama'],'Intense Character Lead',38,'masc'],
 ['Talia Sayeed',89,58,74,84,1.9,['Psychological Horror','Prestige Drama'],'Festival Discovery',27,'femme'],
 ['Gabriel North',81,69,73,79,2.0,['Action Thriller','Comedy'],'Charisma-First Lead',33,'masc'],
 ['Kiara Moreau',84,66,71,82,1.7,['Fantasy','Family Adventure'],'Young Fantasy Lead',28,'femme'],
 ['Rafael Cole',83,65,62,85,1.8,['Crime Thriller','Action Thriller'],'Reliable Ensemble Lead',36,'masc'],
 ['Mei Brooks',87,57,69,88,1.7,['Science Fiction','Prestige Drama'],'Thoughtful Breakout',30,'femme'],
 ['Leo Shah',79,67,76,77,1.9,['Comedy','Crime Thriller'],'Fast-Rising Crowd-Pleaser',32,'masc']
];

const fictionalDirectorSeed=[
 ['Celeste Quinn',90,68,82,88,2.5,['Prestige Drama','Psychological Horror'],'Visual Stylist',39,'femme'],
 ['Jonah Vale',86,74,79,81,2.6,['Crime Thriller','Action Thriller'],'Taut Craftsman',44,'masc'],
 ['Priya North',88,70,77,90,2.4,['Family Adventure','Fantasy'],'Actor-First Worldbuilder',37,'femme'],
 ['Adrian Mercer',84,80,75,78,2.8,['Science Fiction','Action Thriller'],'Commercial Modernist',42,'masc'],
 ['Mara Okafor',91,62,84,92,2.3,['Prestige Drama','Comedy'],'Performance Whisperer',41,'femme'],
 ['Victor Stone',85,76,86,80,2.7,['Action Thriller','Crime Thriller'],'Big-Canvas Technician',46,'masc']
];

// THE LEGENDS ARCHIVE.
// Locked historical talent is not part of the live market until earned through the player's studio career.
// Ages below represent a deliberately timeless prime-casting version for this private what-if universe.
const LEGEND_ARCHIVE=[
 {id:'LGA1',type:'Actor',unlock:'heath',clue:'Turn performance acclaim into the industry’s biggest prize.',seed:['Heath Ledger',98,95,90,89,9.0,['Prestige Drama','Crime Thriller','Fantasy'],'Archive Legend · Transformative Lead',29,['Brokeback Mountain','The Dark Knight','A Knight’s Tale']]},
 {id:'LGA2',type:'Actor',unlock:'brandon',clue:'Make an action film that earns respect as well as devotion.',seed:['Brandon Lee',88,91,86,87,5.5,['Action Thriller','Crime Thriller','Fantasy'],'Archive Legend · Cult Action Lead',28,['The Crow','Rapid Fire','Showdown in Little Tokyo']]},
 {id:'LGA3',type:'Actor',unlock:'hoffman',clue:'Build a sustained home for genuinely elite dramatic work.',seed:['Philip Seymour Hoffman',99,83,87,95,7.5,['Prestige Drama','Crime Thriller','Comedy'],'Archive Legend · Performance Titan',40,['Capote','The Master','Doubt']]},
 {id:'LGA4',type:'Actor',unlock:'rickman',clue:'Prove that supporting performances can own Awards Night.',seed:['Alan Rickman',98,89,81,95,7.0,['Fantasy','Prestige Drama','Action Thriller'],'Archive Legend · Character Icon',45,['Die Hard','Harry Potter and the Deathly Hallows','Sense and Sensibility']]},
 {id:'LGA5',type:'Actor',unlock:'boseman',clue:'Create the rare event film audiences truly love.',seed:['Chadwick Boseman',95,93,91,94,8.0,['Action Thriller','Prestige Drama','Science Fiction'],'Archive Legend · Event / Prestige Lead',40,['Black Panther','Ma Rainey’s Black Bottom','42']]},
 {id:'LGA6',type:'Actor',unlock:'river',clue:'Find something extraordinary without hiding behind scale.',seed:['River Phoenix',97,85,89,88,5.0,['Prestige Drama','Crime Thriller','Comedy'],'Archive Legend · Naturalistic Lead',24,['My Own Private Idaho','Stand by Me','Running on Empty']]},
 {id:'LGA7',type:'Actor',unlock:'robin',clue:'Show that one studio can make audiences laugh and break their hearts.',seed:['Robin Williams',98,96,86,91,8.5,['Comedy','Prestige Drama','Family Adventure'],'Archive Legend · Comic / Dramatic Icon',39,['Good Will Hunting','Dead Poets Society','Mrs. Doubtfire']]},
 {id:'LGA8',type:'Actor',unlock:'gandolfini',clue:'Make crime drama a showcase for an unforgettable performance.',seed:['James Gandolfini',98,87,81,93,6.5,['Crime Thriller','Prestige Drama','Comedy'],'Archive Legend · Crime / Character Titan',42,['The Sopranos','Enough Said','Killing Them Softly']]},
 {id:'LGA9',type:'Actor',unlock:'carrie',clue:'Build a science-fiction release big enough to become part of the culture.',seed:['Carrie Fisher',91,96,82,92,7.0,['Science Fiction','Comedy','Prestige Drama'],'Archive Legend · Science-Fiction Icon',32,['Star Wars','When Harry Met Sally...','The Blues Brothers']]},
 {id:'LGA10',type:'Actor',unlock:'walker',clue:'Turn action success into a franchise audiences actually return for.',seed:['Paul Walker',84,93,86,92,6.0,['Action Thriller','Crime Thriller','Comedy'],'Archive Legend · Franchise Action Lead',36,['Fast Five','Furious 7','Running Scared']]},
 {id:'LGA11',type:'Actor',unlock:'dean',clue:'Become known for discovering stars while still making undeniable cinema.',seed:['James Dean',98,97,91,87,8.0,['Prestige Drama','Crime Thriller'],'Archive Legend · Screen Icon',24,['Rebel Without a Cause','East of Eden','Giant']]},
 {id:'LGA12',type:'Actor',unlock:'wilder',clue:'Make a comedy critics respect and audiences adore.',seed:['Gene Wilder',97,91,82,93,6.5,['Comedy','Family Adventure','Prestige Drama'],'Archive Legend · Comic Auteur-Actor',38,['Young Frankenstein','Willy Wonka & the Chocolate Factory','The Producers']]},
 {id:'LGA13',type:'Actor',unlock:'hurt',clue:'Prove your studio can make acclaimed work across very different worlds.',seed:['John Hurt',99,82,78,96,6.5,['Prestige Drama','Science Fiction','Psychological Horror'],'Archive Legend · Genre Chameleon',45,['The Elephant Man','Alien','1984']]},
 {id:'LGA14',type:'Actor',unlock:'murphy',clue:'Make a modestly scaled film connect far beyond its budget.',seed:['Brittany Murphy',91,87,87,89,5.0,['Comedy','Prestige Drama','Psychological Horror'],'Archive Legend · Charismatic Character Lead',28,['Clueless','8 Mile','Girl, Interrupted']]},
 {id:'LGA15',type:'Actor',unlock:'julia',clue:'Build an ensemble where character work earns real awards recognition.',seed:['Raul Julia',98,88,82,94,6.5,['Prestige Drama','Comedy','Fantasy'],'Archive Legend · Theatrical Character Icon',42,['The Addams Family','Kiss of the Spider Woman','Street Fighter']]},
 {id:'LGD1',type:'Director',unlock:'kubrick',clue:'Make masterpieces in more than one cinematic language.',seed:['Stanley Kubrick',99,87,93,97,11.0,['Science Fiction','Prestige Drama','Psychological Horror'],'Archive Legend · Formal Master',50,['2001: A Space Odyssey','The Shining','Dr. Strangelove']]},
 {id:'LGD2',type:'Director',unlock:'tony',clue:'Build a repeatable action machine without sacrificing audience excitement.',seed:['Tony Scott',94,98,93,88,8.5,['Action Thriller','Crime Thriller','Science Fiction'],'Archive Legend · Kinetic Event Director',48,['Top Gun','Man on Fire','Crimson Tide']]},
 {id:'LGD3',type:'Director',unlock:'lumet',clue:'Sustain a run of actor-driven crime and prestige films.',seed:['Sidney Lumet',99,83,95,99,8.0,['Prestige Drama','Crime Thriller'],'Archive Legend · Actor’s Director',45,['12 Angry Men','Network','Dog Day Afternoon']]},
 {id:'LGD4',type:'Director',unlock:'leone',clue:'Make crime and action feel mythic — and prove audiences will follow.',seed:['Sergio Leone',99,92,90,92,8.5,['Crime Thriller','Action Thriller','Prestige Drama'],'Archive Legend · Mythic Crime Auteur',45,['Once Upon a Time in the West','The Good, the Bad and the Ugly','Once Upon a Time in America']]},
 {id:'LGD5',type:'Director',unlock:'kurosawa',clue:'Become the kind of studio where directing itself repeatedly wins the night.',seed:['Akira Kurosawa',99,90,95,98,10.0,['Action Thriller','Prestige Drama','Crime Thriller'],'Archive Legend · Humanist Epic Master',50,['Seven Samurai','High and Low','Ran']]}
];

const LEGEND_TIER_META={
 accessible:{label:'Accessible',rank:1,desc:'A focused career achievement that can emerge naturally from a strong run.'},
 challenging:{label:'Challenging',rank:2,desc:'Requires deliberate success in a particular lane or awards path.'},
 storied:{label:'Storied',rank:3,desc:'A multi-film career story that usually takes sustained planning.'},
 mythic:{label:'Mythic',rank:4,desc:'An era-defining achievement intended to remain exceptional even in a long career.'}
};
const LEGEND_TIER_BY_ID={
 LGA2:'accessible',LGA6:'accessible',LGA8:'accessible',LGA12:'accessible',LGA14:'accessible',
 LGA4:'challenging',LGA5:'challenging',LGA7:'challenging',LGA9:'challenging',LGA10:'challenging',LGA15:'challenging',
 LGA1:'storied',LGA3:'storied',LGA11:'storied',LGA13:'storied',LGD2:'storied',
 LGD1:'mythic',LGD3:'mythic',LGD4:'mythic',LGD5:'mythic'
};
function legendTier(entry){const id=typeof entry==='string'?entry:entry?.id,key=LEGEND_TIER_BY_ID[id]||'challenging';return {key,...LEGEND_TIER_META[key]}}
function legendTierSort(a,b){const ta=legendTier(a),tb=legendTier(b);return ta.rank-tb.rank||a.type.localeCompare(b.type)||a.seed[0].localeCompare(b.seed[0])}

function legendProfileFromEntry(entry){
 const p=rosterProfileFromSeed(entry.seed,entry.type,0);p.id=entry.id;p.isLegend=true;p.legendId=entry.id;p.careerState='Legend';p.archivePrimeAge=entry.seed[8];return p;
}
function legendEntryById(id){return LEGEND_ARCHIVE.find(x=>x.id===id)||null}


function privateRosterFee(seed,type){
 const raw=Number(seed[5])||1;
 if(type==='Actor'){
  const acting=Number(seed[1])||70,star=Number(seed[2])||40,momentum=Number(seed[3])||60;
  const market=raw*.72+Math.max(0,star-70)*.13+Math.max(0,acting-88)*.05+Math.max(0,momentum-75)*.03;
  return +clamp(market,.45,12.5).toFixed(2);
 }
 const mult=raw>=10?.70:raw>=7?.62:raw>=5?.56:.50;
 return +Math.max(1.0,raw*mult).toFixed(2);
}

function rosterProfileFromSeed(seed,type,index){
 if(type==='Actor')return {
  id:'A'+(index+1),type:'Actor',name:seed[0],acting:seed[1],star:seed[2],momentum:seed[3],reliability:seed[4],fee:privateRosterFee(seed,'Actor'),genres:seed[6],tag:seed[7],
  age:seed[8],realCredits:seed[9]||[],isRealPerson:true,busyUntil:0,retired:false,credits:[],relationship:0,
  careerState:seed[2]>90?'Established Star':seed[3]>89?'Hot Streak':seed[2]<68?'Rising Talent':'Established Actor'
 };
 return {
  id:'D'+(index+1),type:'Director',name:seed[0],craft:seed[1],commercial:seed[2],budgetControl:seed[3],actorDirection:seed[4],fee:privateRosterFee(seed,'Director'),genres:seed[6],tag:seed[7],
  age:seed[8],realCredits:seed[9]||[],isRealPerson:true,busyUntil:0,retired:false,credits:[],relationship:0,momentum:Math.round(clamp(56+(seed[1]-80)*.55+(seed[2]-70)*.22,48,91)),careerState:seed[1]>=95?'Acclaimed Director':'Established Director'
 };
}

function fictionalTalentProfileFromSeed(seed,type,index){
 if(type==='Actor')return {
  id:'FA'+(index+1),type:'Actor',name:seed[0],isRealPerson:false,realCredits:[],acting:seed[1],star:seed[2],momentum:seed[3],reliability:seed[4],fee:+Number(seed[5]).toFixed(2),genres:seed[6],tag:seed[7],
  age:seed[8],busyUntil:0,retired:false,credits:[],relationship:0,careerState:seed[2]>=70?'Rising Name':'Working Actor',avatarHint:seed[9]||null,emerging:false,introducedWeek:1,discoveryWindowUntil:0,firstMajorBreakStudio:null
 };
 return {
  id:'FD'+(index+1),type:'Director',name:seed[0],isRealPerson:false,realCredits:[],craft:seed[1],commercial:seed[2],budgetControl:seed[3],actorDirection:seed[4],momentum:Math.round(clamp(52+(seed[1]-75)*.7+(seed[2]-60)*.25,48,88)),fee:+Number(seed[5]).toFixed(2),genres:seed[6],tag:seed[7],
  age:seed[8],busyUntil:0,retired:false,credits:[],relationship:0,careerState:seed[1]>=89?'Acclaimed Indie Director':'Working Director',avatarHint:seed[9]||null,emerging:false,introducedWeek:1,discoveryWindowUntil:0,firstMajorBreakStudio:null
 };
}

function ensureBaseFictionalRoster(st){
 st.talent=st.talent||[];
 const hasName=name=>st.talent.some(t=>t.name===name);
 fictionalActorSeed.forEach((seed,i)=>{const p=fictionalTalentProfileFromSeed(seed,'Actor',i);if(!st.talent.some(t=>t.id===p.id)&&!hasName(p.name))st.talent.push(p)});
 fictionalDirectorSeed.forEach((seed,i)=>{const p=fictionalTalentProfileFromSeed(seed,'Director',i);if(!st.talent.some(t=>t.id===p.id)&&!hasName(p.name))st.talent.push(p)});
}
function syncPrivateRealRoster(st){
 st.talent=st.talent||[];
 const existing=new Map(st.talent.map(t=>[t.id,t])),next=[];
 actorSeed.forEach((seed,i)=>{
  const profile=rosterProfileFromSeed(seed,'Actor',i),old=existing.get(profile.id);
  if(old)Object.assign(profile,{
   busyUntil:old.busyUntil||0,retired:!!old.retired,credits:old.credits||[],relationship:old.relationship||0,
   careerState:old.careerState||profile.careerState,momentum:Math.round(old.momentum??profile.momentum),star:Math.round(old.star??profile.star),
   momentumDelta:old.momentumDelta||0,momentumHistory:old.momentumHistory||[],careerMilestones:old.careerMilestones||[],
   careerPeakMomentum:old.careerPeakMomentum??old.momentum??profile.momentum,careerPeakStar:old.careerPeakStar??old.star??profile.star,
   personalStatus:old.personalStatus||null,personalStatusUntil:old.personalStatusUntil||0,fee:old.fee??profile.fee,marketEconomyVersion:old.marketEconomyVersion||0
  });
  next.push(profile);
 });
 directorSeed.forEach((seed,i)=>{
  const profile=rosterProfileFromSeed(seed,'Director',i),old=existing.get(profile.id);
  if(old)Object.assign(profile,{
   busyUntil:old.busyUntil||0,retired:!!old.retired,credits:old.credits||[],relationship:old.relationship||0,
   careerState:old.careerState||profile.careerState,momentum:Math.round(old.momentum??profile.momentum),
   momentumDelta:old.momentumDelta||0,momentumHistory:old.momentumHistory||[],careerMilestones:old.careerMilestones||[],
   careerPeakMomentum:old.careerPeakMomentum??old.momentum??profile.momentum,
   personalStatus:old.personalStatus||null,personalStatusUntil:old.personalStatusUntil||0,fee:old.fee??profile.fee,marketEconomyVersion:old.marketEconomyVersion||0
  });
  next.push(profile);
 });
 // Locked Legends are deliberately absent from the talent market. Once earned, they become ordinary live-world talent.
 (LEGEND_ARCHIVE||[]).filter(e=>st.legends?.unlocked?.[e.id]).forEach(entry=>{
  const profile=legendProfileFromEntry(entry),old=existing.get(profile.id);
  if(old)Object.assign(profile,{
   busyUntil:old.busyUntil||0,retired:!!old.retired,credits:old.credits||[],relationship:old.relationship||0,
   careerState:old.careerState||profile.careerState,momentum:Math.round(old.momentum??profile.momentum),
   star:profile.type==='Actor'?Math.round(old.star??profile.star):profile.star,
   momentumDelta:old.momentumDelta||0,momentumHistory:old.momentumHistory||[],careerMilestones:old.careerMilestones||[],
   careerPeakMomentum:old.careerPeakMomentum??old.momentum??profile.momentum,careerPeakStar:old.careerPeakStar??old.star??profile.star,
   personalStatus:old.personalStatus||null,personalStatusUntil:old.personalStatusUntil||0,fee:old.fee??profile.fee,marketEconomyVersion:old.marketEconomyVersion||0,
   genreCareer:old.genreCareer||{},relationshipHistory:old.relationshipHistory||[],trustedBudget:old.trustedBudget||0
  });
  next.push(profile);
 });
 st.talent.filter(t=>t.isRealPerson===false).forEach(t=>next.push(t));
 st.talent=next;
}


function portraitInitials(name){
 return (name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
}
function normalizePortraitSource(src){
 if(!src||src==='__none__')return null;
 return String(src).trim();
}
const GENERATED_FICTIONAL_PORTRAITS={};
function fictionalPortraitPersona(t){
 if(t?.avatarHint)return t.avatarHint;
 const first=String(t?.name||'').split(/\s+/)[0].toLowerCase();
 const femme=new Set(['zara','june','mina','hana','lena','nora','elara','nina','talia','kiara','mei','celeste','priya','mara']);
 const masc=new Set(['milo','theo','owen','luca','ezra','isaac','marek','marcus','dominic','gabriel','rafael','leo','jonah','adrian','victor']);
 if(femme.has(first))return 'femme';if(masc.has(first))return 'masc';
 return hash(`portrait-persona|${t?.id||t?.name||'talent'}`)%2?'femme':'masc';
}
function fictionalPortraitData(t){
 if(!t||t.isRealPerson!==false)return null;
 const key=t.id||t.name;if(GENERATED_FICTIONAL_PORTRAITS[key])return GENERATED_FICTIONAL_PORTRAITS[key];
 const persona=fictionalPortraitPersona(t),folder=persona==='femme'?'women':'men';
 let slot;
 const seedNum=Number(String(t.id||'').replace(/\D/g,''));
 if(/^FA\d+$/.test(t.id||''))slot=(seedNum*7+11)%90+1;
 else if(/^FD\d+$/.test(t.id||''))slot=(seedNum*11+37)%90+1;
 else slot=hash(`stock-headshot|${key}|${t.name}|${t.type}`)%90+1;
 const out=`https://randomuser.me/api/portraits/${folder}/${slot}.jpg`;
 GENERATED_FICTIONAL_PORTRAITS[key]=out;
 return out;
}
function portraitSourceForTalent(t){
 state.portraitCache=state.portraitCache||{};
 const cached=normalizePortraitSource(state.portraitCache[t.id]);
 if(t?.isRealPerson===false)return cached&&/^https?:\/\//i.test(cached)?cached:fictionalPortraitData(t);
 return cached;
}
function portraitHTML(t,size='md'){
 if(!t)return `<div class="portrait portrait-${size}"><span>?</span></div>`;
 const src=portraitSourceForTalent(t),needsHydrate=t?.isRealPerson&&!src;
 return `<div class="portrait portrait-${size}"${needsHydrate?` data-portrait-wrap="${t.id}"`:''} title="${t.name}"><span class="portrait-fallback">${portraitInitials(t.name)}</span>${src?`<img src="${src}" alt="${t.name}" referrerpolicy="no-referrer" onerror="this.remove()">`:''}</div>`;
}
async function fetchPortraitForTalent(t){
 if(!t?.isRealPerson)return null;
 state.portraitCache=state.portraitCache||{};
 const cached=normalizePortraitSource(state.portraitCache[t.id]);
 if(cached)return cached;
 try{
  const title=encodeURIComponent(t.name.replace(/’/g,"'"));
  const url=`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=320&titles=${title}`;
  const res=await fetch(url,{mode:'cors'});
  if(!res.ok)throw new Error('portrait lookup failed');
  const payload=await res.json(),page=Object.values(payload?.query?.pages||{})[0],src=page?.thumbnail?.source||null;
  if(src){state.portraitCache[t.id]=src;save();}
  return src;
 }catch(e){return null}
}
async function hydratePortraits(){
 const nodes=[...document.querySelectorAll('[data-portrait-wrap]')];
 const ids=[...new Set(nodes.map(n=>n.dataset.portraitWrap).filter(Boolean))];
 await Promise.allSettled(ids.map(async id=>{
  const t=talentById(id);if(!t)return;
  const src=await fetchPortraitForTalent(t);if(!src)return;
  document.querySelectorAll(`[data-portrait-wrap="${id}"]`).forEach(node=>{
   if(node.querySelector('img'))return;
   node.innerHTML=`<img src="${src}" alt="${t.name}" referrerpolicy="no-referrer">`;
  });
 }));
}


function money(n){return '$'+Number(n||0).toFixed(1)+'m'}
function moneyFine(n){n=Number(n||0);return Math.abs(n)<.1?`$${Math.round(n*1000)}k`:money(n)}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function pct(n){return Math.round(n)+'%'}
function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function makeRng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function pick(r,a){return a[Math.floor(r()*a.length)]}
function uid(prefix,state){state.ids[prefix]=(state.ids[prefix]||0)+1;return prefix+state.ids[prefix]}
function deep(v){return JSON.parse(JSON.stringify(v))}
function fmtStage(s){return s.replaceAll('_',' ').replace(/\b\w/g,m=>m.toUpperCase())}
function showToast(msg){toast.textContent=msg;toast.classList.remove('hidden');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.add('hidden'),2200)}


// Visual identity system — presentation only.
// All marks/key art are inline SVG/CSS so long careers do not accumulate image files.

const BRAND_THEMES={
 violet:{name:'Electric Violet',accent:'#7b6cff',accent2:'#b8b0ff',dark:'#201c48'},
 ocean:{name:'Cobalt',accent:'#3187f5',accent2:'#8fc6ff',dark:'#112e54'},
 ember:{name:'Ember',accent:'#ed644f',accent2:'#ffad91',dark:'#4c211b'},
 jade:{name:'Jade',accent:'#2fa77e',accent2:'#8be0bd',dark:'#123a30'},
 gold:{name:'Studio Gold',accent:'#d5a348',accent2:'#f1d28d',dark:'#443518'},
 rose:{name:'Rose',accent:'#d55283',accent2:'#f2a8c2',dark:'#42192a'}
};
const BRAND_MARKS={
 aperture:{name:'Aperture'},star:{name:'North Star'},frame:{name:'Frame'},
 orbit:{name:'Orbit'},monolith:{name:'Monolith'},prism:{name:'Prism'}
};
const BRAND_WORDMARKS={
 modern:{name:'Modern',className:'word-modern'},
 editorial:{name:'Editorial',className:'word-editorial'},
 bold:{name:'Bold',className:'word-bold'}
};
const RIVAL_BRANDS={
 'Northstar Studios':{theme:'ocean',mark:'star',wordmark:'modern'},
 'Arcadia Pictures':{theme:'ember',mark:'frame',wordmark:'editorial'},
 'Red Crown':{theme:'rose',mark:'prism',wordmark:'bold'},
 'Bluebird Films':{theme:'violet',mark:'orbit',wordmark:'editorial'},
 'Ironwood Pictures':{theme:'gold',mark:'monolith',wordmark:'bold'},
 'Lantern House':{theme:'jade',mark:'aperture',wordmark:'editorial'}
};
const PRESS_BRANDS={
 'Screen Trade':{abbr:'ST',tone:'#4e78ff',mark:'frame'},
 'The Industry Ledger':{abbr:'IL',tone:'#a69a6a',mark:'monolith'},
 'Production Bulletin':{abbr:'PB',tone:'#eb704e',mark:'prism'},
 'Box Office Weekly':{abbr:'BOW',tone:'#25a7a0',mark:'frame'},
 'Exhibitor Report':{abbr:'ER',tone:'#876bd8',mark:'orbit'},
 'Awards Wire':{abbr:'AW',tone:'#c79b39',mark:'star'},
 'Screen Awards':{abbr:'SA',tone:'#b34c67',mark:'star'},
 'The Call Sheet':{abbr:'CS',tone:'#d49334',mark:'frame'},
 'Talent Wire':{abbr:'TW',tone:'#d6619e',mark:'orbit'},
 'Development Weekly':{abbr:'DW',tone:'#4b9b70',mark:'aperture'},
 'Film Finance':{abbr:'FF',tone:'#5579a6',mark:'monolith'},
 'Rights & Sales':{abbr:'R&S',tone:'#b16b50',mark:'prism'},
 'First Frame':{abbr:'1F',tone:'#5f8bc7',mark:'aperture'},
 'Aurelia Daily':{abbr:'AD',tone:'#d95f9a',mark:'aperture'}
};
const GENRE_ART={
 'Action Thriller':{a:'#1b1d24',b:'#6e1717',c:'#ef5a36',symbol:'//',template:'slash'},
 'Psychological Horror':{a:'#101016',b:'#25203b',c:'#b74568',symbol:'◯',template:'void'},
 'Prestige Drama':{a:'#27241f',b:'#645a4d',c:'#d0b27b',symbol:'—',template:'horizon'},
 'Science Fiction':{a:'#081d2d',b:'#174e64',c:'#5ad8d0',symbol:'○',template:'orbit'},
 'Comedy':{a:'#44305a',b:'#d95b74',c:'#ffd166',symbol:'+',template:'pop'},
 'Family Adventure':{a:'#17495f',b:'#3b8d72',c:'#f2c75c',symbol:'△',template:'sun'},
 'Crime Thriller':{a:'#171a1c',b:'#39424a',c:'#d4493f',symbol:'▥',template:'city'},
 'Fantasy':{a:'#182e38',b:'#3f5174',c:'#d2b46c',symbol:'◇',template:'peak'}
};
function defaultPlayerBrand(name='Studio'){
 const keys=Object.keys(BRAND_THEMES),marks=Object.keys(BRAND_MARKS),h=Math.abs(hash(`brand|${name}`));
 return {theme:keys[h%keys.length],mark:marks[Math.floor(h/7)%marks.length],wordmark:'modern'};
}
function normalizeBrand(b,name='Studio'){
 const fallback=defaultPlayerBrand(name),x={...fallback,...(b||{})};
 if(!BRAND_THEMES[x.theme])x.theme=fallback.theme;
 if(!BRAND_MARKS[x.mark])x.mark=fallback.mark;
 if(!BRAND_WORDMARKS[x.wordmark])x.wordmark='modern';
 return x;
}
function ensurePlayerBrand(st=state){
 if(!st)return defaultPlayerBrand();
 st.uiBrandDraft=normalizeBrand(st.uiBrandDraft,st.uiStudioNameDraft||st.studio?.name||'Studio');
 if(st.studio)st.studio.brand=normalizeBrand(st.studio.brand||st.uiBrandDraft,st.studio.name);
 return st.studio?.brand||st.uiBrandDraft;
}
function brandTheme(brand){return BRAND_THEMES[normalizeBrand(brand).theme]||BRAND_THEMES.violet}
function rivalBrand(r){return normalizeBrand(RIVAL_BRANDS[r?.name]||defaultPlayerBrand(r?.name||'Studio'),r?.name||'Studio')}
function brandForStudioName(name,owner=null){
 if(owner==='player'||name===state?.studio?.name)return ensurePlayerBrand();
 const r=(state?.rivals||[]).find(x=>x.id===owner||x.name===name);
 return r?rivalBrand(r):defaultPlayerBrand(name||'Studio');
}
function markSVG(mark='aperture',tone='currentColor'){
 const common=`fill="none" stroke="${tone}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
 if(mark==='star')return `<svg viewBox="0 0 40 40" aria-hidden="true"><path ${common} d="M20 5l3.9 10.9L35 20l-11.1 4.1L20 35l-3.9-10.9L5 20l11.1-4.1z"/><circle cx="20" cy="20" r="3.4" fill="${tone}"/></svg>`;
 if(mark==='frame')return `<svg viewBox="0 0 40 40" aria-hidden="true"><path ${common} d="M8 12V8h8M24 8h8v8M32 24v8h-8M16 32H8v-8"/><rect x="13" y="13" width="14" height="14" rx="2" ${common}/></svg>`;
 if(mark==='orbit')return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="5" fill="${tone}"/><ellipse cx="20" cy="20" rx="15" ry="7" ${common} transform="rotate(-24 20 20)"/><circle cx="32" cy="13" r="2.2" fill="${tone}"/></svg>`;
 if(mark==='monolith')return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 7h12l4 26H10z" fill="${tone}" opacity=".95"/><path d="M17 11h6l2 17H15z" fill="#0f1115" opacity=".38"/></svg>`;
 if(mark==='prism')return `<svg viewBox="0 0 40 40" aria-hidden="true"><path ${common} d="M20 6L34 31H6z"/><path ${common} d="M20 6v25M6 31l14-10 14 10"/></svg>`;
 return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14" ${common}/><path ${common} d="M20 6l5 10 9 4-9 4-5 10-5-10-9-4 9-4z"/><circle cx="20" cy="20" r="4" fill="${tone}"/></svg>`;
}
function studioLogoHTML(name,brand,size='md',withName=true){
 const b=normalizeBrand(brand,name),t=brandTheme(b),wc=BRAND_WORDMARKS[b.wordmark]?.className||'word-modern';
 return `<div class="studio-lockup studio-lockup-${size}" style="--brand:${t.accent};--brand2:${t.accent2};--branddark:${t.dark}"><span class="studio-mark">${markSVG(b.mark,'currentColor')}</span>${withName?`<span class="studio-wordmark ${wc}">${name}</span>`:''}</div>`;
}
function playerStudioLogoHTML(size='md',withName=true){return studioLogoHTML(state?.studio?.name||state?.uiStudioNameDraft||'Your Studio',ensurePlayerBrand(),size,withName)}
function pressIdentity(pub){return PRESS_BRANDS[pub]||{abbr:(pub||'Trade').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase(),tone:'#6f7cff',mark:'frame'}}
function pressLogoHTML(pub,size='sm',withName=true){
 const p=pressIdentity(pub);
 return `<span class="press-lockup press-${size}" style="--press:${p.tone}"><span class="press-mark">${markSVG(p.mark,'currentColor')}<b>${p.abbr}</b></span>${withName?`<span class="press-name">${pub}</span>`:''}</span>`;
}
function genreArt(genre){return GENRE_ART[genre]||GENRE_ART['Prestige Drama']}
function filmArtSeed(f){return Math.abs(hash(`keyart|${f?.id||''}|${f?.title||''}|${f?.genre||''}`))}
function keyArtShapes(f){
 const g=genreArt(f.genre),h=filmArtSeed(f),shift=(h%19)-9,op=.22+(h%5)*.035;
 if(g.template==='void')return `<circle cx="68" cy="35" r="20" fill="none" stroke="var(--pc)" stroke-width="2" opacity=".45"/><rect x="47" y="18" width="9" height="95" fill="#020205" opacity=".72"/><path d="M8 105L92 28" stroke="var(--pc)" stroke-width="1" opacity=".25"/>`;
 if(g.template==='orbit')return `<circle cx="${58+shift*.4}" cy="45" r="24" fill="none" stroke="var(--pc)" stroke-width="2" opacity=".52"/><ellipse cx="58" cy="45" rx="39" ry="12" fill="none" stroke="var(--pc)" opacity=".35" transform="rotate(-16 58 45)"/><circle cx="26" cy="25" r="3" fill="var(--pc)"/>`;
 if(g.template==='city')return `<g opacity=".48">${[10,24,39,55,70,84].map((x,i)=>`<rect x="${x}" y="${35+(i%3)*10}" width="${9+(i%2)*4}" height="${75-(i%3)*9}" fill="var(--pc)" opacity="${.16+i*.045}"/>`).join('')}</g><path d="M5 82L95 56" stroke="var(--pc)" stroke-width="3" opacity=".6"/>`;
 if(g.template==='slash')return `<path d="M-10 96L54 4h18L8 118z" fill="var(--pc)" opacity=".44"/><path d="M38 118L102 22" stroke="var(--pc)" stroke-width="4" opacity=".28"/><circle cx="73" cy="36" r="22" fill="none" stroke="var(--pc)" opacity=".2"/>`;
 if(g.template==='pop')return `<circle cx="24" cy="34" r="17" fill="var(--pc)" opacity=".35"/><circle cx="72" cy="57" r="25" fill="none" stroke="var(--pc)" stroke-width="5" opacity=".32"/><path d="M9 88l18-9 9 17 16-24 16 18 22-12" fill="none" stroke="var(--pc)" stroke-width="3" opacity=".42"/>`;
 if(g.template==='sun')return `<circle cx="73" cy="29" r="18" fill="var(--pc)" opacity=".5"/><path d="M0 90L28 53l18 20 15-16 39 43v18H0z" fill="var(--pc)" opacity=".22"/><path d="M0 101Q28 82 53 97t47-5v26H0z" fill="#fff" opacity=".08"/>`;
 if(g.template==='peak')return `<path d="M3 104L38 36l17 31 11-17 31 54z" fill="var(--pc)" opacity=".25"/><path d="M19 105L53 25l28 80" fill="none" stroke="var(--pc)" stroke-width="2.5" opacity=".48"/><circle cx="75" cy="26" r="9" fill="none" stroke="var(--pc)" opacity=".35"/>`;
 return `<rect x="0" y="${63+shift*.3}" width="100" height="55" fill="var(--pc)" opacity=".13"/><path d="M0 ${70+shift*.2}L100 ${48-shift*.15}" stroke="var(--pc)" stroke-width="2" opacity=".45"/><circle cx="76" cy="30" r="14" fill="var(--pc)" opacity="${op}"/>`;
}
function filmKeyArtHTML(f,size='md',showMeta=true){
 const g=genreArt(f.genre),h=filmArtSeed(f),variant=h%3;
 return `<div class="filmkeyart filmkeyart-${size} keyart-v${variant}" style="--pa:${g.a};--pb:${g.b};--pc:${g.c}">
  <svg class="keyart-svg" viewBox="0 0 100 118" preserveAspectRatio="none" aria-hidden="true">${keyArtShapes(f)}</svg>
  <div class="keyart-grain"></div>
  <div class="keyart-copy"><span class="keyart-symbol">${g.symbol}</span><strong>${f.title}</strong>${showMeta?`<small>${f.genre}</small>`:''}</div>
 </div>`;
}
function filmIdentityHero(f){
 const studioName=f.studio||state?.studio?.name||'Studio',brand=brandForStudioName(studioName,f.owner);
 return `<div class="film-identity-hero"><div class="film-identity-poster">${filmKeyArtHTML(f,'hero')}</div><div class="film-identity-copy">${studioLogoHTML(studioName,brand,'xs',true)}<div class="badge" style="margin-top:12px">${f.genre}</div><div class="film-identity-title">${f.title}</div><div class="small">${fmtStage(f.stage)}${f.releaseWeek?` · ${typeof releaseDayForWeek==='function'?calendarShortDate(releaseDayForWeek(f.releaseWeek)):'Week '+f.releaseWeek}`:''}</div></div></div>`;
}
function applyPlayerBrandTheme(){
 if(typeof document==='undefined'||!document.documentElement)return;
 const b=ensurePlayerBrand(),t=brandTheme(b);
 document.documentElement.style.setProperty('--accent',t.accent);
 document.documentElement.style.setProperty('--accent2',t.accent2);
 document.documentElement.style.setProperty('--brand-dark',t.dark);
}


const SEGMENT_KEYS=['Mainstream Adults','Younger Audiences','Families','Genre Fans','Prestige / Arthouse'];
const BASE_SEGMENT_GENRES={
 'Mainstream Adults':{'Prestige Drama':5,'Crime Thriller':5,'Comedy':5,'Action Thriller':3,'Psychological Horror':1,'Science Fiction':1,'Family Adventure':1,'Fantasy':0},
 'Younger Audiences':{'Action Thriller':5,'Science Fiction':5,'Psychological Horror':4,'Comedy':4,'Fantasy':4,'Family Adventure':2,'Crime Thriller':2,'Prestige Drama':0},
 'Families':{'Family Adventure':8,'Fantasy':6,'Comedy':5,'Science Fiction':2,'Action Thriller':-2,'Prestige Drama':-2,'Crime Thriller':-5,'Psychological Horror':-8},
 'Genre Fans':{'Psychological Horror':7,'Science Fiction':7,'Fantasy':7,'Action Thriller':5,'Crime Thriller':4,'Family Adventure':1,'Comedy':1,'Prestige Drama':0},
 'Prestige / Arthouse':{'Prestige Drama':8,'Crime Thriller':4,'Psychological Horror':3,'Science Fiction':3,'Comedy':2,'Fantasy':1,'Action Thriller':0,'Family Adventure':-1}
};
function freshAudienceMarket(){
 const heat={},supply={},affinity={};genres.forEach(g=>{heat[g]=0;supply[g]=0});SEGMENT_KEYS.forEach(s=>affinity[s]=0);
 return {heat,supply,affinity,lastTrendNews:0,history:[]};
}
function ensureAudienceMarket(target=state){
 if(!target.audienceMarket)target.audienceMarket=freshAudienceMarket();
 const a=target.audienceMarket;a.heat=a.heat||{};a.supply=a.supply||{};a.affinity=a.affinity||{};
 genres.forEach(g=>{if(a.heat[g]===undefined)a.heat[g]=0;if(a.supply[g]===undefined)a.supply[g]=0});
 SEGMENT_KEYS.forEach(s=>{if(a.affinity[s]===undefined)a.affinity[s]=0});
 a.history=a.history||[];return a;
}
function rawGenreSignal(genre){
 const a=ensureAudienceMarket(),heat=a.heat[genre]||0,supply=a.supply[genre]||0;
 return heat-Math.max(0,supply-5)*.82;
}
function genreMarketBaseline(){
 const vals=genres.map(g=>rawGenreSignal(g));
 return vals.reduce((a,b)=>a+b,0)/Math.max(1,vals.length);
}
function industryGenreSignal(genre){
 return clamp(rawGenreSignal(genre)-genreMarketBaseline(),-12,12);
}
function genreMarketLabel(genre){
 const a=ensureAudienceMarket(),signal=industryGenreSignal(genre),supply=a.supply[genre]||0;
 if(supply>=17&&signal<=3)return {label:'Crowded',cls:'warn',text:'A lot of similar product is already in or approaching the market.'};
 if(signal>=7.5)return {label:'Surging',cls:'good',text:'Recent audience behaviour is pulling buyers and studios toward this space.'};
 if(signal>=3.5)return {label:'Healthy',cls:'blue',text:'Demand looks supportive without obvious frenzy.'};
 if(signal<=-6.5)return {label:'Cooling',cls:'bad',text:'Recent releases have softened audience confidence in this space.'};
 if(signal<=-2)return {label:'Soft',cls:'warn',text:'Interest is present, but recent evidence is not especially encouraging.'};
 return {label:'Balanced',cls:'',text:'No strong market swing is visible.'};
}
function segmentGenreSignal(segment,genre){return (BASE_SEGMENT_GENRES[segment]?.[genre]||0)+industryGenreSignal(genre)*.55}
function segmentCurrentInterests(segment){return genres.map(g=>({genre:g,score:segmentGenreSignal(segment,g)})).sort((a,b)=>b.score-a.score)}
function audienceProfileForFilm(f,overallAudience=null){
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),m=f.metrics||{},c=f.creative||defaultCreative(),p=f.post||{},cast=(f.cast||[]).map(talentById).filter(Boolean);
 const star=cast.length?cast.reduce((a,b)=>a+(b.star||40),0)/cast.length:45,ending=p.endingStrength||65;
 const perf=m.performances||68,pacing=m.pacing||68,clarity=m.clarity||68,tech=m.technical||68,direction=m.direction||68,chem=m.chemistry||65;
 const raw={
  'Mainstream Adults':s.access*.20+clarity*.18+perf*.17+pacing*.14+s.hook*.11+star*.08+ending*.07+segmentGenreSignal('Mainstream Adults',f.genre),
  'Younger Audiences':star*.17+s.hook*.17+pacing*.17+tech*.15+s.genreFulfillment*.13+chem*.08+segmentGenreSignal('Younger Audiences',f.genre),
  'Families':s.access*.20+clarity*.20+pacing*.12+s.emotion*.12+ending*.11+s.genreFulfillment*.08+(c.rating==='broad'?7:c.rating==='mature'?-14:0)+segmentGenreSignal('Families',f.genre),
  'Genre Fans':s.genreFulfillment*.24+s.hook*.15+s.originality*.12+tech*.13+direction*.12+ending*.08+segmentGenreSignal('Genre Fans',f.genre),
  'Prestige / Arthouse':perf*.20+direction*.19+s.originality*.16+s.emotion*.15+s.characters*.12+ending*.08+(c.positioning==='prestige'?6:0)+segmentGenreSignal('Prestige / Arthouse',f.genre)
 };
 const vals={};for(const [k,v] of Object.entries(raw))vals[k]=clamp(v+(overallAudience!==null?(overallAudience-68)*.24:0),8,98);return vals;
}
function audienceReleaseContext(f,overallAudience){
 const market=ensureAudienceMarket(),segments=audienceProfileForFilm(f,overallAudience),entries=Object.entries(segments).sort((a,b)=>b[1]-a[1]);
 const weighted=segments['Mainstream Adults']*.30+segments['Younger Audiences']*.22+segments['Families']*.14+segments['Genre Fans']*.20+segments['Prestige / Arthouse']*.14;
 const affinityLift=SEGMENT_KEYS.reduce((sum,k)=>sum+(market.affinity[k]||0)*(segments[k]/100),0)/SEGMENT_KEYS.length;
 return {segments,weighted,strongest:entries[0][0],openingLift:industryGenreSignal(f.genre)*.28+affinityLift*.08,nicheWom:Math.max(0,entries[0][1]-weighted)*.0035};
}
function registerMarketRelease(f){const a=ensureAudienceMarket();if(f.marketRegisteredRelease)return;f.marketRegisteredRelease=true;a.supply[f.genre]=clamp((a.supply[f.genre]||0)+5,0,30)}
function registerAudienceOutcome(f,profit){
 const a=ensureAudienceMarket();if(f.marketRegisteredOutcome)return;f.marketRegisteredOutcome=true;
 const aud=f.review?.audience??65,crit=f.review?.critics??65,response=(aud-67)*.18+(crit-67)*.05+clamp((profit||0)/8,-5,7);
 a.heat[f.genre]=clamp((a.heat[f.genre]||0)+response,-18,18);
 const redistribution=response>0?response*.10:response*.04;
 genres.filter(g=>g!==f.genre).forEach(g=>a.heat[g]=clamp((a.heat[g]||0)-redistribution/(genres.length-1),-18,18));
 const segments=f.audienceSegments||audienceProfileForFilm(f,aud);
 if(f.owner==='player')SEGMENT_KEYS.forEach(k=>{a.affinity[k]=clamp((a.affinity[k]||0)+(segments[k]-67)*.035+(profit>5?.35:profit<-5?-.25:0),-12,18)});
 a.history.unshift({week:state.week,genre:f.genre,audience:aud,profit:profit||0,studio:f.studio||state.studio?.name||'Unknown'});a.history=a.history.slice(0,80);
}
function tickAudienceMarket(){
 const a=ensureAudienceMarket();
 genres.forEach(g=>{a.heat[g]*=.965;a.supply[g]*=.91});
 const avg=genres.reduce((sum,g)=>sum+(a.heat[g]||0),0)/genres.length;
 genres.forEach(g=>a.heat[g]=clamp((a.heat[g]||0)-avg*.22,-18,18));
 SEGMENT_KEYS.forEach(k=>a.affinity[k]*=.995);
}
function maybeGenerateTrendNews(){
 const a=ensureAudienceMarket();if(state.week-(a.lastTrendNews||0)<6)return;
 const list=genres.map(g=>({g,s:industryGenreSignal(g),supply:a.supply[g]||0})).sort((x,y)=>Math.abs(y.s)-Math.abs(x.s)),top=list[0];if(!top||Math.abs(top.s)<4)return;
 a.lastTrendNews=state.week;
 if(top.s>=7)addNews(state,`Buyers are leaning into ${top.g.toLowerCase()} material after a run of strong audience response, though competing projects are beginning to follow.`,'Market Watch');
 else if(top.s<=-6)addNews(state,`Exhibitors and development executives are reporting softer appetite for ${top.g.toLowerCase()} releases after recent disappointments.`,'Market Watch');
 else if(top.supply>=16)addNews(state,`${top.g} is becoming a crowded lane, with multiple studios chasing the same audience at once.`,'Market Watch');
}
function audienceAffinityLabel(v){return v>=8?'Loyal following':v>=3?'Recognises the studio':v<=-4?'Cool toward the studio':'No strong studio loyalty'}


function ensureTalentCareer(t){
 if(!t)return null;
 if(t.momentum===undefined)t.momentum=60;
 t.momentum=Math.round(t.momentum);
 if(t.type==='Actor'&&t.star!==undefined)t.star=Math.round(t.star);
 if(t.baseCareerFee===undefined)t.baseCareerFee=t.fee||1;
 if(t.careerPeakMomentum===undefined)t.careerPeakMomentum=t.momentum||60;
 if(t.careerFloorMomentum===undefined)t.careerFloorMomentum=t.momentum||60;
 if(t.type==='Actor'&&t.careerPeakStar===undefined)t.careerPeakStar=t.star||20;
 t.careerMilestones=t.careerMilestones||[];
 t.lastCreditWeek=t.lastCreditWeek||0;
 t.careerStartWeek=t.careerStartWeek||1;
 t.previousCareerState=t.previousCareerState||t.careerState||'Established';
 t.momentumDelta=t.momentumDelta||0;t.momentumHistory=t.momentumHistory||[];
 t.lastCareerTick=t.lastCareerTick||1;
 t.watchLastBusyUntil=t.watchLastBusyUntil??(t.busyUntil||0);
 if(t.type==='Director'&&t.careerState==='Established Director'&&t.momentum>=84)t.careerState='Hot Director';
 return t;
}

function applyMomentumChange(t,delta,reason='Industry movement',source='career'){ensureTalentCareer(t);const old=Math.round(t.momentum||60),next=Math.round(clamp(old+delta,20,98));t.momentum=next;t.momentumDelta=next-old;if(next!==old)t.momentumHistory.unshift({week:state.week,from:old,to:next,delta:next-old,reason,source});t.momentumHistory=t.momentumHistory.slice(0,24);return next}
function momentumIndicator(t){ensureTalentCareer(t);const d=t.momentumDelta||0;if(d>0)return `<span class="momentum up">▲ ${Math.round(t.momentum)}</span>`;if(d<0)return `<span class="momentum down">▼ ${Math.round(t.momentum)}</span>`;return `<span class="momentum flat">→ ${Math.round(t.momentum)}</span>`}

function watchedTalent(t){return !!t&&state.talentWatchlist?.includes(t.id)}
function notifyWatchedTalent(t,title,body,type='info'){
 if(!watchedTalent(t))return;
 notify(`watch:${t.id}:${state.week}:${title}`,title,body,null,false,type,{screen:'industry',detail:{type:'talent',id:t.id}});
}
function addCareerMilestone(t,label,kind='career'){
 ensureTalentCareer(t);
 if(t.careerMilestones.some(x=>x.label===label&&Math.abs((x.week||0)-state.week)<4))return;
 t.careerMilestones.unshift({week:state.week,label,kind});
 t.careerMilestones=t.careerMilestones.slice(0,16);
}
function recentGeneratedCredits(t,weeks=52){
 ensureTalentCareer(t);
 return (t.credits||[]).filter(c=>typeof c==='object'&&c.week&&state.week-c.week<=weeks);
}
function awardRecordBelongsToTalent(t,f,rec){
 if(!t||!f||!rec)return false;
 if(t.type==='Director')return rec.category==='director'&&(!rec.talentId||rec.talentId===t.id);
 const castIds=[...(f.cast||[]),...(f.supportingCastIds||[])];
 if(!castIds.includes(t.id))return false;
 if(rec.category==='ensemble')return true;
 if(rec.category==='lead')return rec.talentId?rec.talentId===t.id:awardLeadTalent(f)?.id===t.id;
 if(rec.category==='support')return rec.talentId?rec.talentId===t.id:awardSupportingTalent(f)?.id===t.id;
 return false;
}
function talentAwardCount(t){
 let noms=0,wins=0;
 state.films.filter(f=>f.stage==='complete'&&(f.directorId===t.id||(f.cast||[]).includes(t.id)||(f.supportingCastIds||[]).includes(t.id))).forEach(f=>{
  const a=ensureAfterlifeState(f);noms+=(a.nominations||[]).filter(x=>awardRecordBelongsToTalent(t,f,x)).length;wins+=(a.wins||[]).filter(x=>awardRecordBelongsToTalent(t,f,x)).length;
 });
 return {noms,wins};
}
function determineCareerState(t,oldState=''){
 ensureTalentCareer(t);
 const recent=state.week-(t.lastCreditWeek||0),mom=t.momentum||60,age=t.age||35;
 if(t.retired)return 'Retired';
 if(oldState&&['Cooling','Fading Star','Veteran','Fading Director','Veteran Director'].includes(oldState)&&mom>=74&&recent<=20)return 'Comeback';
 if(t.type==='Actor'){
  if((t.star||0)<66&&mom>=84&&recent<=26)return 'Breakout';
  if(mom>=88)return 'Hot Streak';
  if((t.star||0)>=86&&mom>=66)return 'A-List Prime';
  if(age>=57&&mom<52)return 'Fading Star';
  if(mom<50)return 'Cooling';
  if(age>=58)return 'Veteran';
  if((t.star||0)<58&&mom>=68)return 'Rising Talent';
  return (t.star||0)>=72?'Established Star':'Established Actor';
 }
 if(mom>=88)return 'Hot Director';
 if((t.craft||0)>=94&&mom>=70)return 'Acclaimed Director';
 if(age>=65&&mom<52)return 'Fading Director';
 if(mom<50)return 'Cooling';
 if(age>=63)return 'Veteran Director';
 if((t.craft||0)<82&&mom>=72)return 'Rising Director';
 return 'Established Director';
}
function targetTalentFee(t){
 ensureTalentCareer(t);
 const awards=talentAwardCount(t),mom=t.momentum||60;
 if(t.type==='Actor'){
  const draw=Number(t.star||20),acting=Number(t.acting||70);
  const star=Math.max(0,Math.min(draw,70)-35)*.055+Math.max(0,draw-70)*.18;
  const heat=Math.max(0,mom-55)*.035;
  const craft=Math.max(0,acting-78)*.045;
  const status=draw>=92?1.5:draw>=88?.75:['A-List Prime','Hot Streak','Comeback'].includes(t.careerState)?.75:t.careerState==='Breakout'?.35:0;
  const target=.45+star+heat+craft+status+awards.wins*.45+awards.noms*.08;
  return clamp(target,.35,12.5);
 }
 const target=.70+Math.max(0,(t.craft||70)-70)*.070+Math.max(0,(t.commercial||55)-55)*.045+Math.max(0,mom-50)*.025+awards.wins*.22+awards.noms*.04;
 return clamp(target,.55,8.5);
}
function repriceTalent(t){
 ensureTalentCareer(t);
 const target=targetTalentFee(t),old=t.fee||target;
 let next=old+(target-old)*.30;
 if(t.momentum<45)next*=.96;
 if(t.careerState==='Hot Streak'||t.careerState==='Hot Director')next*=1.025;
 t.fee=+clamp(next,t.type==='Actor'?.35:.55,t.type==='Actor'?12.5:8.5).toFixed(2);
}
function ensureTalentMarketEconomy(t){
 ensureTalentCareer(t);if(!t)return t;
 if(t.marketEconomyVersion!==3111){
  const target=targetTalentFee(t);
  t.fee=+clamp((t.fee||target)*.35+target*.65,t.type==='Actor'?.35:.55,t.type==='Actor'?12.5:8.5).toFixed(2);
  t.marketEconomyVersion=3111;
 }
 return t;
}
function actorCommercialDraw(t){
 ensureTalentCareer(t);
 const awards=talentAwardCount(t),career=t.careerState||'';
 const status=['A-List Prime','Hot Streak'].includes(career)?6:career==='Comeback'?3:career==='Breakout'?2:0;
 return clamp((t.star||30)*.74+(t.momentum||60)*.18+Math.min(7,awards.wins*1.8+awards.noms*.35)+status,10,99);
}
function actorIndustryShortlistScore(t){return (t.acting||70)*.44+actorCommercialDraw(t)*.34+(t.reliability||70)*.10+(t.momentum||60)*.12}
function careerStateNews(t,oldState,newState){
 if(oldState===newState)return;
 const big=['Breakout','Hot Streak','A-List Prime','Comeback','Fading Star','Hot Director','Acclaimed Director','Fading Director'];
 if(!big.includes(newState))return;
 const text=newState==='Breakout'?`${t.name} is being described as a breakout performer after a rapid rise in industry heat.`:
  newState==='Hot Streak'?`${t.name} has entered a genuine hot streak and is becoming harder to book.`:
  newState==='A-List Prime'?`${t.name} is now operating firmly in the industry's top star tier.`:
  newState==='Comeback'?`${t.name} is enjoying a career comeback after a quieter period.`:
  newState==='Fading Star'?`${t.name}'s market position has cooled after a long run near the top.`:
  newState==='Hot Director'?`${t.name} has become one of the industry's hottest directors.`:
  newState==='Acclaimed Director'?`${t.name}'s recent work has reinforced an elite creative reputation.`:
  `${t.name}'s directing career has entered a quieter phase.`;
 addNews(state,text,'Talent Watch');notifyWatchedTalent(t,`${t.name}: ${newState}`,text);
 addCareerMilestone(t,newState,'state');
}
function maybeRetireTalent(t,r){
 if(t.retired)return false;
 const age=t.age||35,inactive=state.week-(t.lastCreditWeek||0);
 let chance=0;
 if(t.type==='Actor'){
  if(age>=76)chance=.13;
  else if(age>=70)chance=.055;
  else if(age>=64&&inactive>=78)chance=.018;
 }else{
  if(age>=80)chance=.12;
  else if(age>=74)chance=.045;
  else if(age>=67&&inactive>=104)chance=.015;
 }
 if(chance&&r()<chance){
  t.retired=true;t.retiredWeek=state.week;t.careerState='Retired';
  addCareerMilestone(t,'Retired','retirement');
  addNews(state,`${t.name} announced their retirement from the industry after a long career.`,'Talent Watch');
  notifyWatchedTalent(t,`${t.name} retires`,`${t.name} has retired from the industry.`);
  return true;
 }
 return false;
}
function advanceOneTalentCareer(t,r){
 ensureTalentCareer(t);if(t.retired)return;
 const oldMom=t.momentum||60,oldState=t.careerState||'Established',recent=state.week-(t.lastCreditWeek||0);
 let drift=(r()-.5)*4+(60-oldMom)*.04;
 if(recent<=20)drift+=1.4;
 else if(recent>=78)drift-=1.15;
 if(t.type==='Actor'&&(t.star||0)>=88)drift-=.20;
 if(t.careerState==='Breakout')drift+=.6;
 applyMomentumChange(t,Math.round(clamp(oldMom+drift,20,97))-oldMom,'Quarterly industry movement','career');
 t.careerPeakMomentum=Math.max(t.careerPeakMomentum||0,t.momentum);
 t.careerFloorMomentum=Math.min(t.careerFloorMomentum??t.momentum,t.momentum);
 if(t.type==='Actor'){
  const age=t.age||30;
  let starDelta=t.momentum>=86?.55:t.momentum<45?-.55:-.08;
  if(recent>=104)starDelta-=.25;
  if(age<35&&t.momentum>=78&&r()<.28)t.acting=clamp((t.acting||70)+1,40,98);
  t.star=Math.round(clamp((t.star||20)+starDelta,8,97));
  t.careerPeakStar=Math.max(t.careerPeakStar||0,t.star);
 }else{
  if((t.age||40)<48&&t.momentum>=80&&r()<.22)t.craft=clamp((t.craft||70)+1,45,98);
  if(t.momentum>=86&&r()<.18)t.commercial=clamp((t.commercial||60)+1,35,98);
 }
 const newState=determineCareerState(t,oldState);t.previousCareerState=oldState;t.careerState=newState;
 careerStateNews(t,oldState,newState);repriceTalent(t);
 if(watchedTalent(t)&&t.watchLastBusyUntil>state.week-13&&t.watchLastBusyUntil<=state.week){
  notifyWatchedTalent(t,`${t.name} is available`,`${t.name}'s previous commitment has ended and they are available for new projects.`);
 }
 t.watchLastBusyUntil=t.busyUntil||0;t.lastCareerTick=state.week;
 maybeRetireTalent(t,r);
}
function advanceTalentCareers(){
 if(state.week%13!==0)return;
 const r=makeRng(hash(state.seed+'|career-v2|'+state.week));
 if(state.week%52===0)state.talent.forEach(t=>{if(!t.retired)t.age=(t.age||30)+1});
 state.talent.forEach(t=>advanceOneTalentCareer(t,r));
 // New-generation talent is now introduced through the controlled Emerging Talent pipeline.
 // This keeps the roster alive without adding several disposable names every year.
 if(typeof maybeIntroduceEmergingTalent==='function')maybeIntroduceEmergingTalent(r);
 else if(r()<.20)addNewGenerationTalent(r);
}
function addNewGenerationTalent(r){
 const type=r()<.76?'Actor':'Director',name=pick(r,firstNames)+' '+pick(r,lastNames),id=(type==='Actor'?'NGA':'NGD')+(state.ids.talent=(state.ids.talent||0)+1);
 let t;
 if(type==='Actor'){
  const potential=Math.round(68+r()*29);
  t={id,type,name,isRealPerson:false,realCredits:[],acting:Math.round(62+r()*24),star:Math.round(8+r()*25),momentum:Math.round(50+r()*28),reliability:Math.round(58+r()*34),fee:+(.25+r()*.75).toFixed(2),genres:[pick(r,genres),pick(r,genres)],tag:'New Generation',age:19+Math.floor(r()*11),busyUntil:0,retired:false,credits:[],relationship:0,careerState:'Newcomer',potential};
 }else{
  const potential=Math.round(70+r()*27);
  t={id,type,name,isRealPerson:false,realCredits:[],craft:Math.round(66+r()*20),commercial:Math.round(48+r()*32),budgetControl:Math.round(55+r()*34),actorDirection:Math.round(62+r()*30),momentum:Math.round(50+r()*25),fee:+(.5+r()*1.0).toFixed(2),genres:[pick(r,genres),pick(r,genres)],tag:'New Generation Director',age:27+Math.floor(r()*14),busyUntil:0,retired:false,credits:[],relationship:0,careerState:'Newcomer',potential};
 }
 t.emerging=true;t.introducedWeek=state.week;t.discoveryWindowUntil=t.discoveryWindowUntil||0;t.firstMajorBreakStudio=t.firstMajorBreakStudio||null;
 ensureTalentCareer(t);state.talent.push(t);
 addNews(state,`${name} is beginning to attract industry attention as a new ${type.toLowerCase()}.`,'Talent Watch');
 return t;
}
function recordGenreAssociation(t,genre,success){
 ensureTalentCareer(t);t.genreCareer=t.genreCareer||{};const g=t.genreCareer[genre]||{credits:0,strong:0,score:0};
 g.credits++;if(success)g.strong++;g.score=clamp((g.score||0)+(success?2:.35),0,20);t.genreCareer[genre]=g;
 if(g.credits>=3&&g.strong>=2&&!g.milestone){g.milestone=true;addCareerMilestone(t,`Industry association: ${genre}`,'genre')}
}
function applyFilmCareerConsequences(f,profit){
 const d=talentById(f.directorId),actors=packageActors(f),aud=f.review?.audience||60,crit=f.review?.critics||60,success=aud>=78||crit>=82||profit>=8;
 if(d){
  recordGenreAssociation(d,f.genre,success);
  if((f.budget||0)>=20&&((aud+crit)/2)>=74&&profit>-6){
   const old=d.trustedBudget||0;d.trustedBudget=Math.max(old,f.budget||0);
   if(d.trustedBudget>old+4)addCareerMilestone(d,`${f.title}: proved at ${money(f.budget)} scale`,'scale');
  }
 }
 ensureFilmRoles(f);
 actors.forEach(a=>{
  recordGenreAssociation(a,f.genre,success);
  const role=roleForTalent(f,a.id),support=role?.type==='support';
  const r=makeRng(hash(state.seed+`|career-consequence|${f.id}|${a.id}`));
  if(support&&aud>=82&&(a.acting||0)>=82&&(a.star||0)<88&&r()<.48){
   applyMomentumChange(a,4,`${f.title}: breakout supporting turn`,'film');
   a.star=Math.round(clamp((a.star||40)+2,10,97));
   addCareerMilestone(a,`${f.title}: breakout supporting turn as ${role.name}`,'breakout');
   f.careerStories=f.careerStories||[];f.careerStories.push(`${a.name} emerged from ${role.name} as a breakout supporting performer.`);
  }else if(!support&&aud>=88&&(a.star||0)<72&&r()<.55){
   applyMomentumChange(a,3,`${f.title}: lead breakout`,'film');a.star=Math.round(clamp((a.star||40)+3,10,97));
   addCareerMilestone(a,`${f.title}: lead breakout`,'breakout');f.careerStories=f.careerStories||[];f.careerStories.push(`${a.name}'s lead performance materially raised their market profile.`);
  }
  ensureTalentCareer(a);
  const recent=(a.credits||[]).slice(0,3);
  if(recent.length===3&&recent.every(c=>(c.audience||65)<61||(c.profit||0)<-5)&&!a.careerMilestones.some(x=>x.label==='Three-film market cooling'&&state.week-(x.week||0)<80)){
   applyMomentumChange(a,-2,'Three difficult releases cooled the market','film');addCareerMilestone(a,'Three-film market cooling','career');
  }
 });
}
function registerReleaseRipple(f,profit){
 const aud=f.review?.audience||60,crit=f.review?.critics||60;
 state.industryRipples=state.industryRipples||[];
 let text=null,type=null;
 if((profit>=18&&(f.finalGross||0)>=100)||aud>=90){
  type='breakout';text=`${f.title}'s result has put fresh attention on ${f.genre.toLowerCase()} packages across the market. Rival development teams are expected to test whether the audience is responding to the genre or to this film specifically.`;
 }else if(profit<=-16&&(f.investment||0)>=22){
  type='warning';text=`The scale of ${f.title}'s loss has made expensive ${f.genre.toLowerCase()} packages a tougher internal sell around the industry, even as smaller projects in the genre remain viable.`;
 }else if(crit>=90){
  type='prestige';text=`The critical response to ${f.title} has increased prestige interest around ${f.genre.toLowerCase()} material without guaranteeing equivalent commercial demand.`;
 }
 if(!text)return;
 state.industryRipples.unshift({week:state.week,filmId:f.id,genre:f.genre,type,text});state.industryRipples=state.industryRipples.slice(0,30);
 addNews(state,text,type==='warning'?'Industry Alert':'Trade Report');
}
function talentFilmMomentumDelta(t,f,profit){
 ensureTalentCareer(t);const crit=f.review?.critics||60,aud=f.review?.audience||60,investment=Math.max(1,f.investment||f.budget||1),roi=profit/investment;
 let commercial=profit>=35?3:profit>=18?2:profit>=7?1:profit<=-20?-5:profit<=-10?-3:profit<=-3?-2:0;
 if(f.releaseProfile?.type==='bomb')commercial-=2;
 else if(f.releaseProfile?.type==='breakout')commercial+=1;
 if(roi<=-.55)commercial-=1;else if(roi>=.75)commercial+=1;
 let delta=t.type==='Director'?(crit-67)*.10+(aud-67)*.04+commercial:(aud-67)*.105+(crit-67)*.04+commercial;
 const performance=f.metrics?.performances||65,direction=f.metrics?.direction||65;
 if(t.type==='Director'&&direction>=84)delta+=1;
 if(t.type==='Actor'&&performance>=84)delta+=1;
 // Major stars carry more opening-week blame, while acclaimed work can protect talent from a commercial failure.
 if(t.type==='Actor'&&(t.star||0)>=86&&commercial<=-3)delta-=1;
 if(crit>=88&&t.type==='Director')delta+=1;
 if(performance>=88&&t.type==='Actor')delta+=1;
 return Math.round(clamp(delta,-7,7));
}
function talentFilmMomentumReason(t,f,delta,profit){
 if(delta<=-4)return `${f.title}: box-office and reception setback`;
 if(delta<0)return `${f.title}: market cooled after release`;
 if(delta>=4)return `${f.title}: major career momentum`;
 if(delta>0)return `${f.title}: positive release response`;
 return `${f.title}: mixed release impact`;
}

function recordTalentFilmOutcome(f,profit){
 const d=talentById(f.directorId),cast=packageActors(f),week=state.week;
 const creditBase={title:f.title,week,gross:f.finalGross||0,critics:f.review?.critics||0,audience:f.review?.audience||0,profit:profit||0,genre:f.genre,studio:f.studio||state.studio?.name};
 if(d){
  ensureTalentCareer(d);d.credits.unshift({...creditBase,role:'Director'});d.lastCreditWeek=week;
  if(d.emerging&&!d.firstMajorBreakStudio&&f.owner==='player'&&((f.review?.critics||0)>=72||(f.finalGross||0)>=45)){
   d.firstMajorBreakStudio=state.studio.name;addCareerMilestone(d,`${state.studio.name} gave ${d.name} a first major directing break on ${f.title}`,'breakout');f.careerStories=f.careerStories||[];f.careerStories.push(`${d.name} received a first major directing break from ${state.studio.name} on ${f.title}.`);state.reputation.talent=clamp((state.reputation.talent||50)+1,0,100);addNews(state,`${f.title} is being discussed as ${d.name}'s first major directing break — and ${state.studio.name} is getting credit for backing them early.`,'Talent Watch');
  }
  if((f.review?.critics||0)>=85)addCareerMilestone(d,`${f.title}: major critical success`,'film');
 }
 cast.forEach(a=>{
  ensureTalentCareer(a);const character=typeof roleForTalent==='function'?roleForTalent(f,a.id):null;a.credits.unshift({...creditBase,role:(f.supportingCastIds||[f.supportingCastId]).filter(Boolean).includes(a.id)?'Supporting Cast':'Principal Cast',character:character?.name||null});a.lastCreditWeek=week;
  if(a.emerging&&!a.firstMajorBreakStudio&&f.owner==='player'&&((f.review?.audience||0)>=74||(f.finalGross||0)>=55)){
   a.firstMajorBreakStudio=state.studio.name;addCareerMilestone(a,`${state.studio.name} gave ${a.name} a first major screen break on ${f.title}`,'breakout');f.careerStories=f.careerStories||[];f.careerStories.push(`${a.name} received a first major screen break from ${state.studio.name} on ${f.title}.`);state.reputation.talent=clamp((state.reputation.talent||50)+1,0,100);addNews(state,`${f.title} has become ${a.name}'s first major screen break, strengthening ${state.studio.name}'s reputation for spotting talent early.`,'Talent Watch');
  }
  if((f.finalGross||0)>=120)addCareerMilestone(a,`${f.title}: major box-office hit`,'film');
  if((f.review?.audience||0)>=86)addCareerMilestone(a,`${f.title}: audience breakout`,'film');
 });
}
function setTalentWatch(tid,on){
 state.talentWatchlist=state.talentWatchlist||[];
 if(on&&!state.talentWatchlist.includes(tid))state.talentWatchlist.push(tid);
 if(!on)state.talentWatchlist=state.talentWatchlist.filter(id=>id!==tid);
 save();render();
}
function watchlistButton(t){
 const watching=watchedTalent(t);
 return `<button id="toggleTalentWatch" class="btn ${watching?'primary':''}">${watching?'Watching':'☆ Watch talent'}</button>`;
}
function maybeGenerateIndustryYearbook(){
 if(state.week%52!==0)return;
 const year=Math.max(1,Math.floor(state.week/52));
 state.yearbooks=state.yearbooks||[];
 if(state.yearbooks.some(y=>y.year===year))return;
 const start=state.week-51,films=state.films.filter(f=>f.stage==='complete'&&(f.completeWeek||0)>=start&&(f.completeWeek||0)<=state.week);
 const era=yearEraLabel(year,films);
 const gross=[...films].sort((a,b)=>(b.finalGross||0)-(a.finalGross||0))[0];
 const reviewed=films.filter(f=>f.review),crit=reviewed.length?[...reviewed].sort((a,b)=>b.review.critics-a.review.critics)[0]:null;
 const profits=films.map(f=>({f,p:f.owner==='player'?(f.studioRevenue-f.investment):(f.estimatedProfit||0)}));
 const best=[...profits].sort((a,b)=>b.p-a.p)[0],worst=[...profits].sort((a,b)=>a.p-b.p)[0];
 const actor=state.talent.filter(t=>t.type==='Actor'&&!t.retired).sort((a,b)=>(b.momentum||0)-(a.momentum||0))[0];
 const director=state.talent.filter(t=>t.type==='Director'&&!t.retired).sort((a,b)=>(b.momentum||0)-(a.momentum||0))[0];
 const playerFilms=films.filter(f=>f.owner==='player');
 const playerHeadline=playerFilms.length?[...playerFilms].sort((a,b)=>filmStudioLegacyScore(b)-filmStudioLegacyScore(a))[0]:null;
 state.yearbooks.unshift({year,week:state.week,era,biggestGross:gross?{id:gross.id,title:gross.title,value:gross.finalGross}:null,bestReviewed:crit?{id:crit.id,title:crit.title,value:crit.review.critics}:null,bestResult:best?{id:best.f.id,title:best.f.title,value:best.p}:null,worstResult:worst?{id:worst.f.id,title:worst.f.title,value:worst.p}:null,hotActor:actor?{id:actor.id,name:actor.name,momentum:actor.momentum}:null,hotDirector:director?{id:director.id,name:director.name,momentum:director.momentum}:null,playerHeadline:playerHeadline?{id:playerHeadline.id,title:playerHeadline.title,critics:playerHeadline.review?.critics||null,gross:playerHeadline.finalGross||0}:null});
 state.yearbooks=state.yearbooks.slice(0,50);
 addNews(state,`Year ${year}: ${era}. ${gross?`${gross.title} set the pace at ${money(gross.finalGross)} worldwide.`:'The studio kept its slate in development while the industry moved around it.'}`,'Yearbook');
}



const PRESS_PERSONALITIES={
 'mara-vance':{id:'mara-vance',name:'Mara Vance',publication:'Screen Trade',beat:'Studios & strategy',tone:'Trade analyst',bio:'Measured, sceptical of easy narratives and unusually interested in how a studio is changing over time.'},
 'imani-kerr':{id:'imani-kerr',name:'Imani Kerr',publication:'The Call Sheet',beat:'Talent & The Lot',tone:'Industry columnist',bio:'Fast on agency chatter, casting politics and the small professional slights that turn into bigger stories.'},
 'ruth-bell':{id:'ruth-bell',name:'Ruth Bell',publication:'Awards Wire',beat:'Prestige & awards',tone:'Critic-columnist',bio:'Takes filmmakers seriously, remembers disappointments and is slow to declare anything a masterpiece.'},
 'daniel-mercer':{id:'daniel-mercer',name:'Daniel Mercer',publication:'Box Office Weekly',beat:'Exhibition & finance',tone:'Box-office reporter',bio:'Obsessed with cost, release windows and whether a studio is believing its own publicity.'},
 'celia-hart':{id:'celia-hart',name:'Celia Hart',publication:'Aurelia Daily',beat:'Culture & campaigns',tone:'Culture reporter',bio:'Tracks how films are sold to audiences, remembers overpromises and notices when a studio lets filmmakers speak for themselves.'}
};

const PRESS_OUTLET_VOICES={
 'Screen Trade':{label:'Measured trade read',style:'trade'},
 'The Industry Ledger':{label:'Hard-numbers industry read',style:'finance'},
 'Production Bulletin':{label:'Production-floor read',style:'production'},
 'Box Office Weekly':{label:'Commercial read',style:'boxoffice'},
 'Exhibitor Report':{label:'Exhibitor read',style:'boxoffice'},
 'Awards Wire':{label:'Prestige read',style:'awards'},
 'Screen Awards':{label:'Awards-season read',style:'awards'},
 'The Call Sheet':{label:'Talent-market read',style:'talent'},
 'Talent Wire':{label:'Talent-market read',style:'talent'},
 'Development Weekly':{label:'Development read',style:'development'},
 'Film Finance':{label:'Finance read',style:'finance'},
 'Rights & Sales':{label:'Rights-market read',style:'development'},
 'First Frame':{label:'Campaign read',style:'culture'},
 'Aurelia Daily':{label:'Culture-and-campaign read',style:'culture'}
};
function pressOutletVoice(pub){return PRESS_OUTLET_VOICES[pub]||{label:'Industry desk read',style:'trade'}}
function pressVoicePick(seed,bank){if(!bank?.length)return '';const r=makeRng(hash(String(seed)));return pick(r,bank)}
function pressVoicePerspective(st,story,kind,publication,journalistId,text,seed){
 const film=pressMatchFilm(st,text),talent=pressMatchTalent(st,text),rival=pressMatchRival(st,text),outlet=pressOutletVoice(publication),subject=film?.title||talent?.name||rival?.name||st.studio?.name||'the story';
 let bank=[];
 if(journalistId==='mara-vance')bank=[
  `The Lot loves declaring turning points. Most are just Tuesdays. The useful question is whether ${subject} fits a pattern that will still be visible six months from now.`,
  `Taken alone, this is a headline. Put beside the studio's recent choices and it starts to look more like policy.`,
  `The announcement matters less for what it says today than for what it suggests the next phone call, greenlight or negotiation will look like.`
 ];
 else if(journalistId==='imani-kerr')bank=[
  `Agents will notice the headline; they will care more about what it does to leverage around ${subject}. On the Lot, momentum is never abstract for long.`,
  `The interesting part is not the announcement itself. It is who gets a better meeting, a firmer quote or a faster callback because of it.`,
  `Nobody in representation hears “heat” as a compliment. They hear the opening number in the next negotiation.`
 ];
 else if(journalistId==='ruth-bell')bank=[
  `Prestige is one of Hollywood's easiest words to print and one of its hardest conditions to earn. ${subject} will have to survive contact with the work itself.`,
  `A serious-film label can open the door. It cannot make the conversation serious once people are inside the room.`,
  `The industry will be tempted to reduce this to a score, a laurel or a category. The more interesting question is whether the film leaves an argument behind.`
 ];
 else if(journalistId==='daniel-mercer')bank=[
  `Strip away the adjectives and the business question is simple: what did it cost, what can it return, and how much room is left if the answer disappoints?`,
  `Hollywood is very good at turning confidence into copy. Cash flow remains less impressionable.`,
  `The release language can be expansive. The maths will be considerably less sentimental.`
 ];
 else if(journalistId==='celia-hart')bank=[
  `A campaign can buy reach. It cannot buy a reason for people to repeat the story to each other, which is the test ${subject} is really facing now.`,
  `The studio can control the rollout; it cannot control which detail audiences decide belongs to them.`,
  `Publicity works best when it stops looking like publicity. The next question is whether this moment escapes the media plan and becomes ordinary conversation.`
 ];
 else if(outlet.style==='finance')bank=[
  `The creative headline is easy to repeat. The balance-sheet consequence is the part finance desks will keep open in another tab.`,
  `Whatever the public framing, the decision ultimately lands in cash, commitments and the amount of room left for the next film.`
 ];
 else if(outlet.style==='talent')bank=[
  `The Call Sheet version of the story is always the same question: whose leverage changed before lunch?`,
  `Around the agencies, this will be translated quickly from publicity language into availability, quotes and negotiating position.`
 ];
 else if(outlet.style==='production')bank=[
  `Production people are less interested in the announcement than in what it does to tomorrow's call sheet.`,
  `The practical consequence is the story here: schedule, crew, coverage and the amount of flexibility still left on set.`
 ];
 else if(outlet.style==='boxoffice')bank=[
  `Exhibitors will give the campaign its moment. They will give the hold a much longer memory.`,
  `Opening attention is useful; repeat business is the part nobody can manufacture from a press release.`
 ];
 else if(outlet.style==='awards')bank=[
  `Awards conversation can be started by a campaign. It still has to be sustained by people wanting to keep talking about the film.`,
  `The prestige machinery is now in motion. Whether the film deserves to stay inside it remains a separate question.`
 ];
 else if(outlet.style==='development')bank=[
  `Development executives will read this less as a finished story than as evidence about what material, packages and rights may move next.`,
  `The market consequence is likely to arrive quietly: a faster read, a higher ask or one more studio deciding it does not want to miss the next version of this package.`
 ];
 else if(outlet.style==='culture')bank=[
  `The sell is becoming clearer. That is not the same thing as the audience caring, but it is at least something they can react to.`,
  `Campaigns are full of messages. Culture tends to remember the one nobody in the room planned.`
 ];
 else bank=[
  `The trade read is less about the announcement than what it changes next.`,
  `One beat rarely changes the industry. Repeated beats are how a reputation becomes difficult to argue with.`
 ];
 return pressVoicePick(`${seed}|${journalistId||publication}|voice`,bank);
}
function voicePressStory(st,story,kind,publication,journalistId,text,seed){
 if(!story)return story;
 const body=Array.isArray(story.body)?story.body.slice():[story.body].filter(Boolean),line=pressVoicePerspective(st,story,kind,publication,journalistId,text,seed),j=journalistProfileById(journalistId);
 if(line){const at=body.length>1?1:body.length;body.splice(at,0,line)}
 return {...story,body:body.slice(0,5),voiceLabel:j?`${j.name} · ${j.tone}`:pressOutletVoice(publication).label};
}
function journalistProfileById(id){return PRESS_PERSONALITIES[id]||null}
function journalistIdFromByline(byline=''){const name=String(byline).split(' · ')[0].trim();return Object.values(PRESS_PERSONALITIES).find(x=>x.name===name)?.id||null}
function recurringJournalistForKind(kind,r){
 const map={
  'Box Office Alert':'daniel-mercer','Box Office':'daniel-mercer','Trade Finance':'daniel-mercer','Studio Finance':'daniel-mercer',
  'Awards':'ruth-bell','Press Release':'celia-hart','Release Calendar':'celia-hart',
  'Talent Watch':'imani-kerr','Industry Drama':'imani-kerr','Casting':'imani-kerr','Production':'imani-kerr',
  'Development':'mara-vance','Market Watch':'mara-vance','Script Market':'mara-vance','Your Studio':'mara-vance','Studio Watch':'mara-vance','Industry':'mara-vance','Trade Report':'mara-vance','Industry Alert':'mara-vance','Rights':'mara-vance','Franchise':'mara-vance','Library':'mara-vance'
 };
 const id=map[kind];return id&&r()<.82?PRESS_PERSONALITIES[id]:null;
}
function ensurePressMemory(st=state){st.pressMemory=st.pressMemory||{};return st.pressMemory}
function pressMemoryEntry(st,id){
 const mem=ensurePressMemory(st),x=mem[id]||(mem[id]={stories:0,playerMentions:0,lastWeek:0,lastPlayerWeek:0,lastPlayerHeadline:null});
 if(x.rapport===undefined)x.rapport=0;if(x.interactions===undefined)x.interactions=0;if(x.lastInteractionWeek===undefined)x.lastInteractionWeek=0;
 x.choiceHistory=x.choiceHistory||[];x.kinds=x.kinds||{};return x;
}
function pressRapportLabel(v){return v>=5?'Open line':v>=2?'Constructive':v<=-5?'Frosty':v<=-2?'Guarded':'Professional'}
const PRESS_INTERACTION_EFFECTS={
 'press-budget':{transparent:2,confident:0,decline:-2},
 'press-release':{event:0,measured:1,filmmaker:1},
 'critic-narrative':{respect:2,audience:0,fight:-3},
 'finance-question':{open:1,deny:-1,decline:-2}
};
function recordPressInteraction(item,key){
 if(!item?.journalistId)return;
 const j=journalistProfileById(item.journalistId);if(!j)return;
 const mem=pressMemoryEntry(state,item.journalistId),delta=PRESS_INTERACTION_EFFECTS[item.templateId]?.[key]??0;
 mem.rapport=clamp((mem.rapport||0)+delta,-10,10);mem.interactions=(mem.interactions||0)+1;mem.lastInteractionWeek=state.week;mem.lastChoice=key;mem.lastTemplateId=item.templateId;
 mem.choiceHistory.unshift({week:state.week,templateId:item.templateId,choice:key,delta});mem.choiceHistory=mem.choiceHistory.slice(0,12);
}
function newsTouchesPlayer(st,item){
 const q=`${item?.text||''} ${item?.headline||''}`.toLowerCase();
 if(st.studio?.name&&q.includes(st.studio.name.toLowerCase()))return true;
 return (st.films||[]).some(f=>f.owner==='player'&&f.title&&q.includes(f.title.toLowerCase()));
}
function ordinal(n){const m=n%100;if(m>=11&&m<=13)return `${n}th`;return `${n}${n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'}`}
function applyJournalistCallback(st,item){
 if(!item?.journalistId||!newsTouchesPlayer(st,item))return item;
 const mem=pressMemoryEntry(st,item.journalistId),j=journalistProfileById(item.journalistId);if(!j)return item;
 const extras=[],n=mem.playerMentions||0;
 if(n>=2&&st.week-(mem.lastPlayerWeek||0)<=30){
  const lines={
   'mara-vance':`${j.name} has been following ${st.studio.name}'s trajectory closely; this is the ${ordinal(n+1)} time she has returned to the studio in her recent coverage.`,
   'imani-kerr':`${j.name}'s column has circled back to ${st.studio.name} repeatedly, with agents and talent now treating the studio as part of the ongoing Lot conversation.`,
   'ruth-bell':`${j.name} has covered the studio before and is reading this result against the expectations created by its earlier films, not as an isolated release.`,
   'daniel-mercer':`${j.name} has built a running commercial read on ${st.studio.name}, comparing this move with the studio's earlier spending and box-office results.`,
   'celia-hart':`${j.name} has been tracking how ${st.studio.name} sells its films, comparing the current message with promises made on earlier campaigns.`
  };
  if(lines[item.journalistId])extras.push(lines[item.journalistId]);
 }
 if((mem.interactions||0)>0&&st.week-(mem.lastInteractionWeek||0)<=40){
  if(mem.rapport>=3)extras.push(`${j.name} has had relatively open access to the studio in recent exchanges. That access informs the reporting, but not the outlet's verdict.`);
  else if(mem.rapport<=-3)extras.push(`Recent requests from ${j.name} have often met limited access or pushback, a tension now sitting behind the reporter's continuing coverage of the studio.`);
 }
 if(typeof state!=='undefined'&&st===state&&typeof executivePersonaSnapshot==='function'&&Math.abs(hash(item.id+'|exec-frame'))%3===0){
  const exec=executivePersonaSnapshot();
  if(!exec.unformed)extras.push(`The move also fits an increasingly familiar executive pattern: the trade currently reads the studio leadership as ${exec.primary.label.toLowerCase()}.`);
 }
 if(extras.length){item.body=item.body||[];item.body=[...item.body,...extras].slice(0,5)}
 return item;
}
function recordJournalistCoverage(st,item){
 if(!item?.journalistId)return;const x=pressMemoryEntry(st,item.journalistId);
 x.stories++;x.lastWeek=st.week;x.kinds[item.kind]=(x.kinds[item.kind]||0)+1;
 if(newsTouchesPlayer(st,item)){x.playerMentions++;x.lastPlayerWeek=st.week;x.lastPlayerHeadline=item.headline}
}

function ensureExecutivePersona(st=state){
 st.executivePersona=st.executivePersona||{history:[],lastPrimary:null,lastEvaluatedWeek:0};st.executivePersona.history=st.executivePersona.history||[];return st.executivePersona;
}
const EXECUTIVE_DECISION_WEIGHTS={
 'press-budget:transparent':{discipline:2,publicity:1},'press-budget:confident':{commercial:2,publicity:1},'press-budget:decline':{publicity:-1},
 'press-release:event':{commercial:2,publicity:2,risk:1},'press-release:measured':{discipline:2,publicity:1},'press-release:filmmaker':{creative:2,talent:1},
 'agency-package:meet':{talent:2},'agency-package:hardball':{commercial:1,talent:-1,risk:1},'talent-pitch:meet':{talent:2},
 'crew-story:spend':{talent:2,creative:1},'crew-story:meet':{talent:1},'crew-story:hold':{discipline:1,talent:-1},
 'festival-invite:accept':{creative:2,publicity:1,risk:1},'festival-invite:private':{creative:1,discipline:1},
 'critic-narrative:respect':{creative:1,publicity:2},'critic-narrative:audience':{commercial:2,publicity:1},'critic-narrative:fight':{risk:2,publicity:1},
 'star-interview:book':{commercial:1,publicity:2},'star-interview:film':{creative:1,discipline:1},'star-interview:joint':{creative:1,talent:1,publicity:1},
 'catalogue-call:decline':{discipline:1},'catalogue-call:listen':{commercial:1},'finance-question:open':{discipline:2,publicity:1},'finance-question:deny':{risk:1}
};
const EXECUTIVE_PERSONA_DEFS={
 creative:{id:'creative',label:'Creative Patron',desc:'The business increasingly expects leadership to protect filmmakers, performance and distinctive material even when the easier commercial answer is available.'},
 commercial:{id:'commercial',label:'Market Operator',desc:'Leadership is becoming associated with audience reach, positioning, release confidence and a willingness to treat films as commercial events.'},
 talent:{id:'talent',label:'Talent Builder',desc:'Agents and collaborators increasingly see the company as a place where relationships can compound across films rather than reset after every deal.'},
 discipline:{id:'discipline',label:'Disciplined Steward',desc:'The executive reputation is being built around controlled spending, measured promises and preserving enough runway to keep making films.'},
 publicity:{id:'publicity',label:'Public-Facing Showman',desc:'Campaign choices and press engagement have made leadership unusually visible in how the studio creates attention around its films.'},
 risk:{id:'risk',label:'High-Conviction Gambler',desc:'The studio is increasingly associated with taking conspicuous swings: scale, originals, aggressive positioning or choices that accept volatility for upside.'}
};
function executiveDecisionSignals(){
 const d=ensureDesk(),all=[...(d.items||[]),...(d.archive||[])].filter(x=>x.resolved&&x.choice),score={creative:0,commercial:0,talent:0,discipline:0,publicity:0,risk:0};
 all.forEach(x=>{const w=EXECUTIVE_DECISION_WEIGHTS[`${x.templateId}:${x.choice}`];Object.entries(w||{}).forEach(([k,v])=>score[k]=(score[k]||0)+v)});
 return {count:all.length,score};
}
function executivePersonaSnapshot(){
 const done=playerFilms().filter(f=>f.stage==='complete'),rep=state.reputation||{},dec=executiveDecisionSignals(),n=Math.max(1,done.length);
 const worked=(state.talent||[]).filter(t=>(t.relationship||0)!==0||(t.credits||[]).some(c=>typeof c==='object'&&c.studio===state.studio?.name));
 const directors=worked.filter(t=>t.type==='Director'),avgRel=worked.length?worked.reduce((a,t)=>a+(t.relationship||0),0)/worked.length:0,avgDirRel=directors.length?directors.reduce((a,t)=>a+(t.relationship||0),0)/directors.length:0;
 const prestige=done.filter(f=>f.creative?.positioning==='prestige').length/n,commercial=done.filter(f=>f.creative?.positioning==='commercial').length/n,event=done.filter(f=>f.campaign==='event').length/n;
 const disciplined=done.filter(f=>{const sc=scriptById(f.scriptId),ratio=(f.budget||0)/Math.max(1,sc?.naturalBudget||f.budget||1);return ratio>=.84&&ratio<=1.20}).length/n;
 const profitable=done.filter(f=>(f.studioRevenue||0)-(f.investment||0)>0).length/n;
 const highScale=done.filter(f=>{const sc=scriptById(f.scriptId),ratio=(f.budget||0)/Math.max(1,sc?.naturalBudget||f.budget||1);return ratio>1.22||(f.budget||0)>=35}).length/n;
 const originals=done.filter(f=>/original/i.test(scriptById(f.scriptId)?.source||'')).length/n,selfDist=done.filter(f=>(f.distributionStrategy||'self')==='self').length/n;
 const bridge=state.finance?.bridgeDebt||0,press=rep.press??50;
 const signals=[
  {...EXECUTIVE_PERSONA_DEFS.creative,score:clamp(28+(rep.creative??45)*.42+prestige*18+Math.max(0,avgDirRel)*.30+dec.score.creative*2,0,100),evidence:`${Math.round(prestige*100)}% of completed releases are prestige-positioned; director relationship signal ${avgDirRel>=8?'strong':avgDirRel<=-4?'strained':'mixed'}.`},
  {...EXECUTIVE_PERSONA_DEFS.commercial,score:clamp(28+(rep.commercial??45)*.42+profitable*12+commercial*10+event*10+dec.score.commercial*2,0,100),evidence:`${Math.round(profitable*100)}% of completed releases are profitable; ${Math.round(event*100)}% used event-style campaigns.`},
  {...EXECUTIVE_PERSONA_DEFS.talent,score:clamp(28+(rep.talent??45)*.42+clamp(avgRel+10,0,30)*.55+dec.score.talent*2,0,100),evidence:`Working-talent relationship average ${avgRel>=0?'+':''}${avgRel.toFixed(1)} across ${worked.length||0} established studio relationships.`},
  {...EXECUTIVE_PERSONA_DEFS.discipline,score:clamp(24+(rep.financial??50)*.50+disciplined*18+profitable*7-Math.min(14,bridge*.35)+dec.score.discipline*2,0,100),evidence:`${Math.round(disciplined*100)}% of completed films stayed near natural production scale${bridge?`; bridge debt is ${money(bridge)}`:'; no bridge debt is outstanding'}.`},
  {...EXECUTIVE_PERSONA_DEFS.publicity,score:clamp(26+press*.42+studioUpgradeLevel('publicity')*6+event*8+dec.score.publicity*2,0,100),evidence:`Press standing is ${Math.round(press)}/100 with ${studioUpgradeLevel('publicity')} publicity department upgrade${studioUpgradeLevel('publicity')===1?'':'s'} and ${dec.count} recorded Desk decisions.`},
  {...EXECUTIVE_PERSONA_DEFS.risk,score:clamp(32+highScale*18+originals*13+selfDist*7+dec.score.risk*2.5-dec.score.discipline*.6,0,100),evidence:`${Math.round(highScale*100)}% of completed releases were high-scale bets; ${Math.round(originals*100)}% came from original material.`}
 ].sort((a,b)=>b.score-a.score);
 const evidenceCount=done.length+dec.count,unformed=evidenceCount<4;
 let primary=signals[0],secondary=signals[1];
 if(!unformed&&primary.score>=58&&secondary&&Math.abs(primary.score-secondary.score)<=4){
  const pair=[primary.id,secondary.id].sort().join('+'),hybrids={
   'creative+talent':{id:'filmmaker-ally',label:'Filmmaker Ally',desc:'The strongest signal combines creative protection with durable talent relationships.'},
   'commercial+discipline':{id:'studio-operator',label:'Studio Operator',desc:'The trade increasingly reads leadership as commercially minded without losing control of the balance sheet.'},
   'commercial+publicity':{id:'showman-operator',label:'Showman Operator',desc:'Audience ambition and visible campaign instincts are becoming the clearest executive signature.'},
   'creative+risk':{id:'creative-gambler',label:'Creative Gambler',desc:'Leadership is developing a reputation for backing distinctive material with unusually high conviction.'},
   'commercial+talent':{id:'talent-broker',label:'Talent Broker',desc:'The company is becoming known for using relationships and star packages as part of its commercial strategy.'}
  };
  primary=hybrids[pair]||{id:`hybrid-${pair}`,label:'Hybrid Executive',desc:'No single operating instinct dominates; the industry is reading a combination of strong, recurring behaviours.'};
  primary.score=(signals[0].score+signals[1].score)/2;
 }
 if(unformed)primary={id:'unformed',label:'Still Being Defined',desc:'There is not yet enough repeated behaviour for the industry to put a durable label on how this studio is run.',score:0};
 return {primary,signals,unformed,evidenceCount,done:done.length,decisionCount:dec.count};
}
function updateExecutivePersonaHistory(){
 const mem=ensureExecutivePersona(),snap=executivePersonaSnapshot();mem.lastEvaluatedWeek=state.week;if(snap.unformed)return snap;
 if(mem.lastPrimary!==snap.primary.id){
  const previous=mem.lastPrimary;mem.lastPrimary=snap.primary.id;mem.history.unshift({week:state.week,id:snap.primary.id,label:snap.primary.label});mem.history=mem.history.slice(0,16);
  if(previous)addNews(state,`The trade's read on ${state.studio.name}'s leadership is shifting. Recent decisions increasingly fit a ${snap.primary.label.toLowerCase()} pattern.`,'Studio Watch');
  else addNews(state,`${state.studio.name}'s leadership is beginning to acquire a recognisable executive reputation: ${snap.primary.label}.`,'Studio Watch');
 }
 return snap;
}
function executivePersonaSnapshotCard(){
 const x=executivePersonaSnapshot(),top=x.signals.slice(0,2);
 return `<div class="section-title"><h2>Executive reputation</h2><button class="btn ghost" data-studio-tab="identity">Open Identity</button></div><div class="card ${x.unformed?'':'goodline'}"><div class="row"><div><div class="badge">EARNED · NOT SELECTED</div><strong style="display:block;margin-top:5px">${x.primary.label}</strong></div>${x.unformed?'':`<span class="pill blue">${Math.round(x.primary.score)} signal</span>`}</div><div class="body" style="margin-top:7px">${x.primary.desc}</div>${!x.unformed?`<div class="small" style="margin-top:8px">Strongest underlying reads: ${top.map(s=>s.label).join(' · ')}</div>`:''}</div>`;
}
function executivePersonaIdentitySection(){
 const x=executivePersonaSnapshot(),history=ensureExecutivePersona().history||[];
 return `<div class="section-title"><h2>Executive reputation</h2><span class="small">Derived from repeated decisions, results and relationships</span></div><div class="card ${x.unformed?'':'goodline'}"><div class="row"><div><div class="badge">CURRENT TRADE READ</div><div class="quote" style="margin-top:6px">${x.primary.label}</div></div>${x.unformed?'':`<span class="pill blue">${Math.round(x.primary.score)} signal</span>`}</div><div class="body" style="margin-top:8px">${x.primary.desc}</div></div><div class="grid cols3" style="margin-top:10px">${x.signals.slice(0,3).map(sig=>`<div class="card"><div class="row"><strong>${sig.label}</strong><span class="pill">${Math.round(sig.score)}</span></div><div class="small" style="margin-top:7px">${sig.evidence}</div></div>`).join('')}</div>${history.length?`<div class="small" style="margin-top:10px">Recent executive labels: ${history.slice(0,4).map(h=>`${h.label} · W${h.week}`).join('  ·  ')}</div>`:''}`;
}

function ensureIndustryMood(st=state){st.industryMood=st.industryMood||{history:[],lastQuarter:0};st.industryMood.history=st.industryMood.history||[];return st.industryMood}
function industryMoodSnapshot(){
 ensureAudienceMarket();const recent=state.films.filter(f=>f.stage==='complete'&&state.week-(f.completeWeek||0)<=13);
 const audiences=recent.map(f=>f.review?.audience).filter(Number.isFinite),avgAudience=audiences.length?audiences.reduce((a,b)=>a+b,0)/audiences.length:68;
 const profits=recent.map(f=>f.owner==='player'?(f.studioRevenue||0)-(f.investment||0):(f.estimatedProfit||0)),avgProfit=profits.length?profits.reduce((a,b)=>a+b,0)/profits.length:0;
 const treasuries=(state.rivals||[]).map(aiTreasurySnapshot),capital=treasuries.length?treasuries.reduce((a,x)=>a+(x.available||0),0)/treasuries.length:10,debt=(state.rivals||[]).length?(state.rivals||[]).reduce((a,x)=>a+(x.debt||0),0)/state.rivals.length:0;
 const market=ensureAudienceMarket(),crowding=genres.reduce((a,g)=>a+(market.supply[g]||0),0)/genres.length;
 const talentHeat=(state.talent||[]).filter(t=>!t.retired).sort((a,b)=>(b.momentum||60)-(a.momentum||60)).slice(0,12),talentMomentum=talentHeat.length?talentHeat.reduce((a,t)=>a+(t.momentum||60),0)/talentHeat.length:70;
 const genreReads=genres.map(g=>({genre:g,signal:industryGenreSignal(g),...genreMarketLabel(g)})).sort((a,b)=>b.signal-a.signal),hot=genreReads[0],cold=genreReads.at(-1);
 const financing=capital>=18&&debt<15?'Capital available':capital<6||debt>30?'Capital tight':'Selective financing';
 const talent=talentMomentum>=85?'Talent has leverage':talentMomentum>=77?'Competitive talent market':'Balanced talent market';
 const releases=crowding>=10?'Crowded release lanes':crowding<=4.5?'Open release lanes':'Competitive release lanes';
 const audience=avgAudience>=76?'Audience confidence high':avgAudience<=60?'Audiences cautious':'Audience response mixed';
 const confidence=(avgAudience-67)*.55+avgProfit*.32+(capital-10)*.16-Math.max(0,crowding-7)*.55;
 let label='Selective market';
 if(recent.length<2&&Math.abs(confidence)<5)label='Market still forming';
 else if(confidence>=10&&crowding<9)label='Expansionary';
 else if(confidence>=5&&crowding>=9)label='Confident but crowded';
 else if(confidence>=5)label='Confident';
 else if(confidence<=-7)label='Risk-off';
 const summary=`${financing}; ${talent.toLowerCase()}. ${hot?.genre||'No genre'} is the hottest visible lane${cold?.signal<=-3?`, while ${cold.genre} is cooling`:''}.`;
 return {label,summary,financing,talent,releases,audience,hot,cold,avgAudience,avgProfit,capital,crowding,recentCount:recent.length};
}
function captureIndustryMoodQuarter(){
 const box=ensureIndustryMood(),quarter=Math.ceil(state.week/13),key=quarter;if(box.lastQuarter===key)return box.history[0]||null;
 const x=industryMoodSnapshot(),entry={week:state.week,year:Math.ceil(state.week/52),quarter:((quarter-1)%4)+1,label:x.label,summary:x.summary,financing:x.financing,talent:x.talent,releases:x.releases,audience:x.audience,hotGenre:x.hot?.genre||null,coldGenre:x.cold?.genre||null};
 box.lastQuarter=key;box.history.unshift(entry);box.history=box.history.slice(0,20);
 addNews(state,`Quarterly trade read: ${x.label}. ${x.summary}`,'Market Watch');return entry;
}
function industryMoodPanel(mood=industryMoodSnapshot()){
 const hist=ensureIndustryMood().history||[];
 return `<div class="grid cols4" style="margin-top:12px"><div class="card"><div class="badge">Financing</div><strong>${mood.financing}</strong></div><div class="card"><div class="badge">Talent</div><strong>${mood.talent}</strong></div><div class="card"><div class="badge">Release market</div><strong>${mood.releases}</strong></div><div class="card"><div class="badge">Audience</div><strong>${mood.audience}</strong></div></div>${hist.length?`<div class="section-title"><h2>Quarterly tape</h2><span class="small">Persistent trade snapshots</span></div><div class="card">${hist.slice(0,4).map(h=>`<div class="listrow"><div><strong>Y${h.year} Q${h.quarter} · ${h.label}</strong><div class="small">${h.summary}</div></div><span class="small">W${h.week}</span></div>`).join('')}</div>`:''}`;
}
function pressRoomSnapshot(){
 const rows=Object.values(PRESS_PERSONALITIES).map(j=>({j,m:pressMemoryEntry(state,j.id)})).sort((a,b)=>(b.m.playerMentions||0)-(a.m.playerMentions||0)||(b.m.stories||0)-(a.m.stories||0)).slice(0,5);
 return `<div class="section-title"><h2>Press room</h2><span class="small">Recurring journalists remember access, pushback and prior coverage</span></div><div class="grid cols2">${rows.map(({j,m})=>`<div class="journalist-card"><div><div class="badge">${j.publication}</div><strong>${j.name}</strong><span>${j.beat} · ${j.tone}</span></div><div><div class="row"><strong>${pressRapportLabel(m.rapport||0)}</strong><span class="small">${m.playerMentions||0} studio mention${(m.playerMentions||0)===1?'':'s'}</span></div><div class="small" style="margin-top:6px">${m.lastPlayerHeadline?`Latest studio coverage: ${m.lastPlayerHeadline}`:j.bio}</div>${m.interactions?`<div class="small" style="margin-top:5px">Last direct exchange: W${m.lastInteractionWeek} · ${m.lastChoice||'response recorded'}</div>`:''}</div></div>`).join('')}</div>`;
}


const NEWS_KIND_LABELS={
 'Industry':'Industry','Press Release':'First Look','Trade Report':'Business','Talent Watch':'Talent','Your Studio':'Studios',
 'Studio Finance':'Finance','Trade Finance':'Finance','Industry Alert':'Breaking','Box Office Alert':'Box Office','Box Office':'Box Office',
 'Market Watch':'Development','Library':'Catalogue','Awards':'Awards','Yearbook':'Yearbook','Rights':'Rights','Franchise':'Franchise',
 'Casting':'Casting','Production':'Production','Industry Drama':'People','Studio Watch':'Studios','Development':'Development','Release Calendar':'Release','Script Market':'Development'
};
const PRESS_PUBLICATIONS={
 'Box Office Alert':['Box Office Weekly','Exhibitor Report','Screen Trade'],
 'Box Office':['Box Office Weekly','Exhibitor Report','Screen Trade'],
 'Awards':['Awards Wire','Screen Awards','Screen Trade'],
 'Talent Watch':['The Call Sheet','Talent Wire','Screen Trade'],
 'Industry Drama':['The Call Sheet','Talent Wire','Screen Trade'],
 'Market Watch':['Development Weekly','Screen Trade','The Industry Ledger'],
 'Development':['Development Weekly','Screen Trade','The Industry Ledger'],
 'Casting':['The Call Sheet','Talent Wire','Screen Trade'],
 'Production':['Production Bulletin','The Call Sheet','Screen Trade'],
 'Studio Finance':['Film Finance','The Industry Ledger','Screen Trade'],
 'Trade Finance':['Film Finance','The Industry Ledger','Screen Trade'],
 'Rights':['Rights & Sales','Screen Trade','The Industry Ledger'],
 'Franchise':['Rights & Sales','Screen Trade','Development Weekly'],
 'Library':['Rights & Sales','The Industry Ledger','Screen Trade'],
 'Your Studio':['Screen Trade','The Industry Ledger','Production Bulletin'],
 'Studio Watch':['Screen Trade','The Industry Ledger','Development Weekly'],
 'Press Release':['Screen Trade','First Frame','The Call Sheet'],
 'Release Calendar':['Screen Trade','Exhibitor Report','First Frame'],
 'Script Market':['Development Weekly','Screen Trade','The Industry Ledger'],
 'Industry':['Screen Trade','The Industry Ledger','The Call Sheet']
};
function newsKindLabel(k){return NEWS_KIND_LABELS[k]||k||'Industry'}
function cleanSentence(x){
 let y=(x||'').replace(/\s+/g,' ').trim().replace(/\s+([,.!?])/g,'$1');
 y=y.replace(/fictional-industry/gi,'industry').replace(/fictional career/gi,'career').replace(/fictional industry/gi,'industry').replace(/fictional new/gi,'new');
 y=y.replace(/strong momentum/gi,'strong recent form').replace(/sharp drop in momentum/gi,'immediate damage to market standing').replace(/renewed industry support/gi,'renewed support from agents and casting teams');
 y=y.replace(/Internal packaging view:[^.]*\.?/gi,'').replace(/^A a /,'A ').replace(/^A an /,'An ').replace(/\s{2,}/g,' ').trim();
 return y;
}
function trimPeriod(x){return cleanSentence(x).replace(/[.!?]+$/,'')}
function pressPublication(kind,r){return pick(r,PRESS_PUBLICATIONS[kind]||PRESS_PUBLICATIONS.Industry)}
function pressByline(kind,r){
 const recurring=recurringJournalistForKind(kind,r);if(recurring)return `${recurring.name} · ${newsKindLabel(kind)} desk`;
 const desks={
  'Box Office Alert':['Lucy Shaw','Tom Vance'],'Box Office':['Lucy Shaw','Tom Vance'],
  'Awards':['Elise Price'],'Talent Watch':['Nadia Rowe'],'Casting':['Nadia Rowe'],
  'Industry Drama':['Nadia Rowe'],'Production':['Cal Hale','Jon Quinn'],'Development':['Theo Bell'],
  'Market Watch':['Theo Bell'],'Studio Finance':['Jon Mercer','Elise Shaw'],'Trade Finance':['Jon Mercer','Elise Shaw'],
  'Rights':['Ruth Kerr','Theo Price'],'Franchise':['Ruth Kerr','Theo Price'],'Library':['Ruth Kerr','Theo Price'],
  'Your Studio':['Cal Mercer','Mara Hale'],'Studio Watch':['Cal Mercer','Mara Hale']
 };
 const pool=desks[kind]||['Mara Hale','Jon Mercer','Elise Price'];
 return `${pick(r,pool)} · ${newsKindLabel(kind)} desk`;
}
function pressWorldContext(st){
 const live=typeof state!=='undefined'&&state&&state.studio&&Array.isArray(state.films);
 const chart=live&&typeof currentBoxChart==='function'?currentBoxChart():[],top=chart[0]||null;
 const table=live&&typeof studioStandings==='function'?studioStandings():[],leader=table[0]||null,player=table.find(x=>x.player)||null;
 const trends=live&&typeof genres!=='undefined'&&typeof industryGenreSignal==='function'?genres.map(g=>({g,s:industryGenreSignal(g)})).sort((a,b)=>b.s-a.s):[];
 return {chart,top,leader,player,hot:trends[0]||null,cold:trends.at(-1)||null};
}
function pressMatchFilm(st,text){
 const q=(text||'').toLowerCase();
 return (st.films||[]).filter(f=>f?.title&&q.includes(f.title.toLowerCase())).sort((a,b)=>b.title.length-a.title.length)[0]||null;
}
function pressMatchScript(st,text){
 const q=(text||'').toLowerCase();
 return (st.scripts||[]).filter(s=>s?.title&&q.includes(s.title.toLowerCase())).sort((a,b)=>b.title.length-a.title.length)[0]||null;
}
function pressMatchTalent(st,text){
 const q=(text||'').toLowerCase();
 return (st.talent||[]).filter(t=>t?.name&&q.includes(t.name.toLowerCase())).sort((a,b)=>b.name.length-a.name.length)[0]||null;
}
function pressMatchRival(st,text){
 const q=(text||'').toLowerCase();
 return (st.rivals||[]).filter(x=>x?.name&&q.includes(x.name.toLowerCase())).sort((a,b)=>b.name.length-a.name.length)[0]||null;
}
function pressFilmCumulative(f){return (f?.weeklyResults||[]).reduce((a,w)=>a+(w.dom||0)+(w.intl||0),0)}
function pressFilmCurrent(f){return f?.weeklyResults?.at(-1)||null}
function naturalNames(list){list=(list||[]).filter(Boolean);if(!list.length)return '';if(list.length===1)return list[0];if(list.length===2)return `${list[0]} and ${list[1]}`;return `${list.slice(0,-1).join(', ')}, and ${list.at(-1)}`}
function storyResult(headline,deck,body){return {headline:trimPeriod(headline),deck:cleanSentence(deck),body:(body||[]).map(cleanSentence).filter(Boolean).slice(0,3)}}
function studioLaunchStory(st){
 const rivals=(st.rivals||[]).slice(0,3).map(r=>r.name),market=(st.market||[]).length;
 return storyResult(
  `${st.studio.name} launches with ${money(st.cash)} and first slate still to be set`,
  `The new independent begins operations without a film in production or a release date on the calendar.`,
  [
   `${st.studio.name} has formally opened for business with ${money(st.cash)} in available cash and capacity to have two films shooting at the same time. The company has yet to define a house style, attach talent or greenlight its first production.`,
   `It enters a market already populated by ${naturalNames(rivals)}${market?`, with ${market} finished screenplays currently circulating on the open market`:''}. No first project has yet been announced.`
  ]
 );
}
function studioUpgradeStory(st,text){
 const h=st.studioGrowth?.history?.find(x=>x.week===st.week),active=(st.films||[]).filter(f=>f.owner==='player'&&!['complete','shelved'].includes(f.stage));
 if(!h)return null;
 const capability=h.key==='production'?`raise simultaneous production capacity to ${typeof playerProductionCapacity==='function'?playerProductionCapacity():'an additional film'}`:h.key==='casting'?`expand the company’s casting and agency reach`:`expand the studio’s publicity and awards operation`;
 return storyResult(
  `${st.studio.name} approves ${h.name} expansion`,
  `${money(h.cost)} has been committed to the upgrade, adding ${moneyFine(STUDIO_UPGRADES[h.key][(st.studioGrowth.upgrades[h.key]||1)-1].overhead)} a week in fixed costs.`,
  [
   `${st.studio.name} has completed a ${money(h.cost)} expansion of its ${h.name}, a move designed to ${capability}. The additional operation adds ${moneyFine(STUDIO_UPGRADES[h.key][(st.studioGrowth.upgrades[h.key]||1)-1].overhead)} to weekly overhead.`,
   active.length?`The studio currently has ${active.length} active project${active.length===1?'':'s'} on its slate, including ${naturalNames(active.slice(0,3).map(f=>f.title))}.`:`The company has not tied the expansion to a specific film and currently has no active project in production.`
  ]
 );
}
function developmentStory(st,text,script,film){
 const s=script||film&&scriptById(film.scriptId);if(!s)return null;
 const writer=writerById?.(s.writerId),range=[Math.floor((s.naturalBudget||10)*.85),Math.ceil((s.naturalBudget||10)*1.15)],source=sourceRouteLabel?.(s.source)||s.source||'development';
 let action='sets';
 if(/commission/i.test(text))action='commissions';else if(/original property|put .* into development/i.test(text))action='sets';else if(/acquir|purchased|bought/i.test(text))action='acquires';
 return storyResult(
  `${st.studio.name} ${action} ${s.title} as ${s.genre.toLowerCase()} project`,
  `${writer?`${writer.name} is writing the screenplay. `:''}The project is being developed as a ${source.toLowerCase()} title with a likely production range of about ${money(range[0])}–${money(range[1])}.`,
  [
   `${st.studio.name} has moved ${s.title} into active development. ${s.logline}`,
   `${writer?`${writer.name} is attached as screenwriter. `:''}${s.dueWeek?`A first draft is expected around Week ${s.dueWeek}. `:''}No release date has been set.`
  ]
 );
}
function castingStory(st,text,film,talent){
 const f=film;if(!f)return null;
 const director=f.directorId?talentById(f.directorId):null,cast=packageActors?.(f)||((f.cast||[]).map(talentById).filter(Boolean));
 let headline=talent?`${talent.name} joins ${f.title}`:`${f.title} adds to cast`;if(/available/i.test(text)&&talent)headline=`${talent.name} clears schedule for ${f.title}`;
 return storyResult(
  headline,
  `${st.studio.name} continues to assemble the ${f.genre.toLowerCase()} project, which has not yet been dated for release.`,
  [
   talent?`${talent.name} is now part of the package for ${f.title}${director?`, directed by ${director.name}`:''}.`:`${st.studio.name} has made another casting move on ${f.title}${director?`, which is being directed by ${director.name}`:''}.`,
   cast.length?`The announced cast currently includes ${naturalNames(cast.map(x=>x.name))}. ${f.stage==='development'?'The film remains in development while the package is completed.':`The project is currently in ${fmtStage(f.stage).toLowerCase()}.`}`:`The remainder of the principal cast has not been announced.`
  ]
 );
}
function boxOfficeStory(st,text,f,ctx){
 if(!f)return null;const row=pressFilmCurrent(f),cum=pressFilmCumulative(f),stats=typeof boxRunStats==='function'?boxRunStats(f):null,rank=stats?.current||ctx.chart.find(x=>x.id===f.id)?.rank||null,studio=f.studio||st.studio?.name||'the distributor';
 if(!row)return storyResult(trimPeriod(text),`${studio} has a film in active theatrical release.`,[text]);
 let headline=`${f.title} takes ${money(row.dom)} domestic in Week ${f.cinemaWeek||f.weeklyResults.length}`;
 if(f.releaseProfile?.type==='bomb'&&f.weeklyResults.length===1)headline=`${f.title} stumbles with ${money(row.dom)} domestic opening`;
 else if(f.releaseProfile?.type==='breakout'&&f.weeklyResults.length===1)headline=`${f.title} beats tracking with ${money(row.dom)} domestic debut`;
 else if(rank===1&&stats?.weeksAtOne>=2)headline=`${f.title} holds No. 1 with ${money(row.dom)} domestic`;
 else if(row.drop!==null&&row.drop<0)headline=`${f.title} grows ${Math.round(Math.abs(row.drop)*100)}% in rare weekend gain`;
 const movement=row.drop===null?'opened this week':row.drop<0?`rose ${Math.round(Math.abs(row.drop)*100)}% from the previous frame`:`fell ${Math.round(row.drop*100)}% from the previous frame`;
 const leader=ctx.top&&ctx.top.id!==f.id?ctx.top:null;
 return storyResult(
  headline,
  `${studio}’s ${f.genre.toLowerCase()} release has reached ${money(cum)} worldwide${rank?` and currently sits at No. ${rank} domestically`:''}.`,
  [
   `${f.title} earned ${money(row.dom)} domestically and ${money(row.intl)} internationally in its latest frame. The film ${movement}${rank?`, leaving it at No. ${rank}`:''}.`,
   `${f.review?`Critics are at ${f.review.critics}% and audiences at ${f.review.audience}%. `:''}${leader?`${leader.title} leads the domestic chart with ${money(leader.gross)} this week.`:`The film currently leads the domestic chart.`}`,
   filmPressAngle(f,'boxoffice')
  ]
 );
}
function awardsStory(st,text){
 const c=st.awardsArchive?.[0];if(!c)return null;const picture=c.categories?.find(x=>x.id==='picture'),winner=picture?.nominees?.find(x=>x.filmId===picture.winnerId),director=c.categories?.find(x=>x.id==='director'),dw=director?.nominees?.find(x=>x.filmId===director.winnerId);
 return storyResult(
  winner?`${winner.title} wins Best Picture at Year ${c.season} awards`:`Year ${c.season} awards close across the major categories`,
  `${c.playerWins?`${st.studio.name} collected ${c.playerWins} win${c.playerWins===1?'':'s'} from ${c.playerNoms} nomination${c.playerNoms===1?'':'s'}.`:`The annual ceremony has closed and the results are now part of the industry record.`}`,
  [
   winner?`${winner.title}, from ${winner.studio}, took Best Picture at the Year ${c.season} ceremony${dw?`, while ${dw.subject} won Best Director`:''}.`:`The Year ${c.season} ceremony concluded with winners across picture, directing, performances, screenplay, ensemble, craft, soundtrack and audience achievement.`,
   c.playerNoms?`${st.studio.name} finished the night with ${c.playerWins} win${c.playerWins===1?'':'s'} from ${c.playerNoms} nomination${c.playerNoms===1?'':'s'}. The awards remain attached to the films and talent involved.`:`No title from ${st.studio.name} was among the winners this year.`
  ]
 );
}
function rightsStory(st,text,f,rival){
 if(!f)return null;const ip=ensureIPAsset?.(f),buyer=rival||rivalById?.(ip?.soldTo),amount=ip?.saleValue;
 if(ip?.sold&&buyer)return storyResult(
  `${buyer.name} acquires future rights to ${f.title}${amount?` in ${money(amount)} deal`:''}`,
  `${st.studio.name} has transferred sequel and remake control of the property to ${buyer.name}.`,
  [
   `${buyer.name} has acquired future screen rights to ${f.title}${amount?` for ${money(amount)}`:''}, giving the company control of any sequel or remake development.`,
   `${st.studio.name} retains the economics of the completed film but no longer controls future screen development of the property.`
  ]
 );
 return storyResult(trimPeriod(text),`${f.title} remains active in the rights market.`,[text]);
}
function productionStory(st,text,f,talent){
 if(!f)return null;const director=f.directorId?talentById(f.directorId):null;
 return storyResult(
  /walked off|walks off/i.test(text)&&talent?`${talent.name} leaves ${f.title} set after dispute`:trimPeriod(text),
  `${st.studio.name}’s ${f.genre.toLowerCase()} project is in Production Week ${f.productionWeek||1}${director?` under director ${director.name}`:''}.`,
  [
   cleanSentence(text),
   `The film is budgeted at roughly ${money(f.budget||0)} and is scheduled to wrap around Week ${f.productionEnd||'—'}. ${f.pendingEvent?'Production is waiting on a studio decision before moving forward.':'Filming remains active.'}`,
   filmPressAngle(f,'production')
  ]
 );
}
function talentStory(st,text,talent,film){
 if(!talent)return null;const recent=(talent.credits||[])[0],fee=talent.fee?` Current asking terms are around ${money(talent.fee)}.`:'';
 return storyResult(
  trimPeriod(text),
  `${talent.name} remains active in the market${recent?` after ${recent.title}`:''}.`,
  [
   cleanSentence(text),
   `${recent?`The most recent listed credit is ${recent.title}${recent.role?` (${recent.role})`:''}. `:''}${fee}${film?` ${film.title} is currently in ${fmtStage(film.stage).toLowerCase()}.`:''}`
  ]
 );
}
function pressMoneyRange(v){const rr=typeof aiTradeRange==='function'?aiTradeRange(v):[v*.85,v*1.15];return `$${Math.max(0,rr[0]).toFixed(1)}m–$${Math.max(0,rr[1]).toFixed(1)}m`}
function financeStory(st,text,rival=null){
 if(rival){
  const status=typeof aiFinancialHealth==='function'?aiFinancialHealth(rival):'Stable',active=(st.films||[]).filter(f=>f.owner===rival.id&&!['complete','shelved'].includes(f.stage)),debt=rival.debt||0;
  let headline=trimPeriod(text);
  if(/deferred a planned/i.test(text)){const g=(text.match(/planned ([a-z ]+?) package/i)||[])[1];headline=`${rival.name} shelves ${g||'planned'} package as spending tightens`}
  else if(/co-financing/i.test(text))headline=`${rival.name} turns to co-financing to restart production`;
  else if(/project financing/i.test(text))headline=`${rival.name} raises financing for new production package`;
  else if(/working-capital/i.test(text))headline=`${rival.name} expands credit line ahead of release slate`;
  else if(/restructuring/i.test(text))headline=`${rival.name} enters restructuring as liquidity tightens`;
  return storyResult(
   headline,
   `${rival.name} is currently described by trade sources as ${status.toLowerCase()}, with cash estimated in the ${pressMoneyRange(rival.cash||0)} range${debt?` and about ${money(debt)} of debt`:''}.`,
   [
    cleanSentence(text),
    active.length?`The studio has ${active.length} active project${active.length===1?'':'s'} across development, production and release, including ${naturalNames(active.slice(0,3).map(f=>f.title))}.`:`The company currently has no active film on its slate.`
   ]
  );
 }
 const debt=st.finance?.bridgeDebt||0,active=(st.films||[]).filter(f=>f.owner==='player'&&!['complete','shelved'].includes(f.stage)).length,over=typeof studioWeeklyOverhead==='function'?studioWeeklyOverhead():0;
 let headline=trimPeriod(text);if(/drew .*emergency finance/i.test(text)){const m=text.match(/drew (\$[0-9.]+m)/i);headline=`${st.studio.name} draws ${m?.[1]||'emergency'} financing`}else if(/repaid/i.test(text)){const m=text.match(/repaid (\$[0-9.]+m)/i);headline=`${st.studio.name} repays ${m?.[1]||'part of'} bridge debt`}
 return storyResult(
  headline,
  `${st.studio.name} currently holds ${money(st.cash)} in cash${debt?` and ${money(debt)} in bridge debt`:' with no bridge debt outstanding'}.`,
  [cleanSentence(text),`The company is carrying ${active} active project${active===1?'':'s'} and roughly ${moneyFine(over)} in weekly studio and slate overhead.`]
 );
}
function marketStory(st,text,ctx){
 const recent=(st.films||[]).filter(f=>f.stage==='complete').sort((a,b)=>(b.completeWeek||0)-(a.completeWeek||0))[0];
 return storyResult(
  ctx.hot?`${ctx.hot.g} draws the heaviest development interest this week`:trimPeriod(text),
  ctx.hot&&ctx.cold?`${ctx.hot.g} is seeing the most activity while ${ctx.cold.g} has cooled relative to the rest of the market.`:`Development activity remains mixed across genres.`,
  [
   cleanSentence(text),
   recent?`The most recent completed release in the wider market is ${recent.title}, which finished with ${money(recent.finalGross||0)} worldwide${recent.review?` and a ${recent.review.audience}% audience score`:''}.`:`Studios continue to source material across the open market, commissions and internally originated projects.`
  ]
 );
}
function releaseStory(st,text,f){
 if(!f)return null;const director=f.directorId?talentById(f.directorId):null,lead=(f.cast||[]).map(talentById).find(Boolean),studio=f.studio||st.studio?.name||'The studio',textWeek=Number((text.match(/Week (\d+)/i)||[])[1]||0),releaseWeek=f.releaseWeek||textWeek||null;
 let headline=releaseWeek?`${studio} sets ${f.title} for Week ${releaseWeek}`:`${studio} begins release push for ${f.title}`;
 if(/first look|unveils/i.test(text))headline=`${studio} unveils first look at ${f.title}`;
 else if(/campaign|begins a/i.test(text))headline=releaseWeek?`${f.title} begins release campaign ahead of Week ${releaseWeek}`:`${f.title} begins release campaign`;
 return storyResult(
  headline,
  `${f.genre} title ${f.title}${releaseWeek?` is scheduled for Week ${releaseWeek}`:' has entered its public release phase'}${director?` with ${director.name} directing`:''}.`,
  [
   /first look|unveils/i.test(text)?`${studio} has released the first public look at ${f.title}${lead?`, starring ${lead.name}`:''}.${releaseWeek?` The film is currently set to open in Week ${releaseWeek}.`:''}`:`${studio} has moved ${f.title} into its public release campaign${releaseWeek?`, with the film dated for Week ${releaseWeek}`:''}.`,
   `${director?`${director.name} directs`:''}${director&&lead?' and ':''}${lead?`${lead.name} leads the cast`:''}${director||lead?'. ':''}${f.marketing?`The current campaign budget is about ${money(f.marketing)}.`:'No further campaign details have been disclosed.'}`,
   filmPressAngle(f,'release')
  ]
 );
}
function holdStory(st,text,f){
 if(!f)return null;const paused=/hold|paused/i.test(text)&&!/resumed/i.test(text);
 return storyResult(
  `${f.title} development ${paused?'paused':'resumes'} at ${st.studio.name}`,
  `${st.studio.name} has ${paused?'temporarily stopped active packaging on':'returned'} the ${f.genre.toLowerCase()} project${paused?' while keeping it on the slate':''}.`,
  [
   `${f.title} has ${paused?'been placed on hold':'returned to active development'} at ${st.studio.name}. ${f.directorId?`${talentById(f.directorId)?.name||'A director'} remains attached. `:''}${f.cast?.length?`${naturalNames(f.cast.map(talentById).filter(Boolean).map(t=>t.name))} ${f.cast.length===1?'is':'are'} attached to star.`:''}`,
   `The project has no release date${paused?' and will remain inactive until the studio resumes development.':'. Packaging work can now continue.'}`
  ]
 );
}
function theatricalCloseStory(st,f){
 if(!f)return null;const pnl=(f.studioRevenue||0)-(f.investment||0),studio=f.studio||st.studio?.name||'The studio';
 return storyResult(
  `${f.title} closes theatrical run with ${money(f.finalGross||pressFilmCumulative(f))} worldwide`,
  `${studio} ends the cinema run with an estimated ${pnl>=0?'profit':'loss'} of about ${money(Math.abs(pnl))} before longer-tail catalogue activity.`,
  [
   `${f.title} has completed its theatrical run at ${money(f.finalGross||pressFilmCumulative(f))} worldwide. The release generated roughly ${money(f.studioRevenue||0)} in studio theatrical receipts against ${money(f.investment||0)} invested.`,
   `${f.review?`The film finished with ${f.review.critics}% from critics and ${f.review.audience}% from audiences. `:''}${f.releaseProfile?.type==='bomb'?'The run never recovered from its weak opening.':f.releaseProfile?.type==='breakout'?'The result finished well above its initial tracking.':'The title now moves into catalogue and licensing exploitation.'}`,
   filmPressAngle(f,'close')
  ]
 );
}
function scriptMarketStory(st,text,s,rival){
 if(!s)return null;let headline=`${s.title} enters open screenplay market`;
 if(/acquired|won a contested auction/i.test(text))headline=`${rival?.name||st.studio?.name||'Buyer'} acquires ${s.title}`;
 else if(/left the .*market/i.test(text))headline=`${s.title} exits screenplay market`;
 const owner=(s.owner==='player'&&st.studio?.name)||rival?.name||null;
 return storyResult(
  headline,
  `${s.genre} screenplay ${s.title} carries an asking value of about ${money(s.price||s.acquisitionCost||0)} and a natural production scale near ${money(s.naturalBudget||0)}.`,
  [
   `${s.logline||cleanSentence(text)}`,
   owner?`${owner} now controls the screenplay after the latest market move.`:`The script remains part of the wider development market unless another buyer closes a deal.`
  ]
 );
}
function genericStory(st,text,kind,ctx,film,talent,rival=null){
 const rivalActive=rival?(st.films||[]).filter(f=>f.owner===rival.id&&!['complete','shelved'].includes(f.stage)):[];
 const contextual=film?`${film.title} is currently in ${fmtStage(film.stage).toLowerCase()}${film.releaseWeek?` and dated for Week ${film.releaseWeek}`:''}.`:talent?`${talent.name} remains active in the talent market.`:rival?`${rival.name} currently has ${rivalActive.length} active project${rivalActive.length===1?'':'s'} on its slate.`:ctx.top?`${ctx.top.title} currently leads the domestic box office with ${money(ctx.top.gross)}.`:`The wider market remains active across development, production and release.`;
 return storyResult(trimPeriod(text),contextual,[cleanSentence(text)]);
}
function realisticPressStory(st,text,kind,r){
 const ctx=pressWorldContext(st),film=pressMatchFilm(st,text),script=pressMatchScript(st,text),talent=pressMatchTalent(st,text),rival=pressMatchRival(st,text);
 if(kind==='Your Studio'&&/officially opened for business/i.test(text))return studioLaunchStory(st);
 if(kind==='Your Studio'&&/opened its /i.test(text)){const x=studioUpgradeStory(st,text);if(x)return x}
 if(film&&/development .*hold|development paused|placed on hold|development resumed/i.test(text)){const x=holdStory(st,text,film);if(x)return x}
 if(kind==='Development'||/commissioned a screenplay|original property|put .* into development|moved .* into film development|completed a .* pass|delivered a completed draft/i.test(text)){const x=developmentStory(st,text,script,film);if(x)return x}
 if(script&&(/entered the market|left the .*market|acquired|auction/i.test(text)||kind==='Script Market')){const x=scriptMarketStory(st,text,script,rival);if(x)return x}
 if(film&&/completed its theatrical run|closes at .*worldwide/i.test(text)){const x=theatricalCloseStory(st,film);if(x)return x}
 if(kind==='Box Office Alert'||kind==='Box Office'||(film&&/opened to|second-week hold|collapses|sleeper-hit|audience scores|word of mouth|#1|domestic position|worldwide/i.test(text))){const x=boxOfficeStory(st,text,film,ctx);if(x)return x}
 if(kind==='Awards'){const x=awardsStory(st,text);if(x)return x}
 if(kind==='Rights'||kind==='Franchise'||kind==='Library'){const x=rightsStory(st,text,film,rival);if(x)return x}
 if(film&&(kind==='Production'||/entered production|wrapped principal photography|production overrun|production .*course/i.test(text))){const x=productionStory(st,text,film,talent);if(x)return x}
 if(kind==='Press Release'||kind==='Release Calendar'){const x=releaseStory(st,text,film);if(x)return x}
 if(kind==='Casting'){const x=castingStory(st,text,film,talent);if(x)return x}
 if(kind==='Talent Watch'||kind==='Industry Drama'){const x=talentStory(st,text,talent,film);if(x)return x}
 if(kind==='Studio Finance'||kind==='Trade Finance')return financeStory(st,text,rival);
 if(kind==='Market Watch')return marketStory(st,text,ctx);
 return genericStory(st,text,kind,ctx,film,talent,rival);
}
function buildNewsItem(st,text,kind='Industry'){
 st.ids=st.ids||{};st.ids.news=(st.ids.news||0)+1;
 const id='NEWS'+st.ids.news,r=makeRng(hash((st.seed||1)+'|news-v3143|'+id+'|'+text)),baseStory=realisticPressStory(st,text,kind,r),initialPublication=pressPublication(kind,r),byline=pressByline(kind,r),journalistId=journalistIdFromByline(byline),publication=journalistProfileById(journalistId)?.publication||initialPublication,story=voicePressStory(st,baseStory,kind,publication,journalistId,text,id);
 return {id,pressVersion:3143,week:st.week,day:Number.isFinite(st.calendarDay)?st.calendarDay:null,text,headline:story.headline,kind,publication,byline,journalistId,voiceLabel:story.voiceLabel,deck:story.deck,body:story.body};
}
function normalizeNewsItem(st,n){
 if((n?.pressVersion===291||n?.pressVersion===364||n?.pressVersion===3140)&&n?.id&&n?.publication&&n?.body){if(!n.journalistId)n.journalistId=journalistIdFromByline(n.byline||'');return n;}
 const x=buildNewsItem(st,n?.text||String(n||''),n?.kind||'Industry');if(n?.week!==undefined)x.week=n.week;return x;
}


const STUDIO_UPGRADES={
 production:[{name:'Expanded Production Office',cost:5,overhead:.018,recognition:26,desc:'Adds one concurrent production slot with a leaner operating footprint.'},{name:'Full Production Unit',cost:11,overhead:.038,recognition:54,desc:'Adds a second additional production slot and brings the department to full studio scale.'}],
 casting:[{name:'Agency Relationships',cost:2.5,overhead:.009,recognition:20,desc:'Adds an audition slot and materially sharpens scouting.'},{name:'In-house Casting Team',cost:5.5,overhead:.019,recognition:44,desc:'Expands to six audition slots, improves scouting again and makes extra rounds cheaper.'}],
 publicity:[{name:'Awards & Publicity Desk',cost:3,overhead:.011,recognition:24,desc:'Cuts awards-campaign cost by 25% and strengthens campaign execution.'},{name:'Full Publicity Department',cost:7,overhead:.024,recognition:50,desc:'Cuts awards-campaign cost by 45% and gives publicity a major execution lift.'}],
 development:[{name:'Story Department',cost:4.5,overhead:.014,recognition:30,desc:'Keeps one additional screenplay live and adds two weeks to departmental First Look access.'},{name:'Rights & Packaging Unit',cost:9,overhead:.030,recognition:56,desc:'Keeps three additional scripts live versus launch and adds four weeks to First Look access.'}],
 post:[{name:'In-house Editorial Suite',cost:4,overhead:.013,recognition:32,desc:'Surfaces one additional editorial option and expands music-supervisor choice.'},{name:'Post & Music Campus',cost:8.5,overhead:.027,recognition:58,desc:'Surfaces three additional editorial options and expands licensed-song shortlists to eight.'}]
};
function ensureStudioGrowth(t=state){
 if(!t.studioGrowth)t.studioGrowth={fans:.04,recognition:12,upgrades:{},history:[]};
 t.studioGrowth.upgrades=t.studioGrowth.upgrades||{};
 Object.keys(STUDIO_UPGRADES).forEach(k=>{if(t.studioGrowth.upgrades[k]===undefined)t.studioGrowth.upgrades[k]=0});
 t.studioGrowth.history=t.studioGrowth.history||[];return t.studioGrowth;
}
function studioUpgradeLevel(k){return ensureStudioGrowth().upgrades[k]||0}
function nextStudioUpgrade(k){return STUDIO_UPGRADES[k]?.[studioUpgradeLevel(k)]||null}
function studioUpgradeOverhead(){const u=ensureStudioGrowth().upgrades;return Object.keys(STUDIO_UPGRADES).reduce((sum,k)=>sum+STUDIO_UPGRADES[k].slice(0,u[k]||0).reduce((a,x)=>a+x.overhead,0),0)}
const CAPITAL_ASSETS={
 lot:{id:'lot',name:'Studio Lot & Soundstages',cost:18,recognition:35,upkeep:.012,value:20,effect:'18% lower active-slate carrying overhead',desc:'Own core stages and production space instead of carrying the full cost through outside facilities.'},
 archive:{id:'archive',name:'Archive & Rights Division',cost:16,recognition:45,upkeep:.010,value:18,effect:'15% stronger recurring catalogue receipts',desc:'Build permanent rights, licensing and archive operations around the films the studio owns.'},
 distribution:{id:'distribution',name:'Distribution Operations',cost:28,recognition:55,upkeep:.018,value:30,effect:'18% lower self-distribution release-operations cost',desc:'Bring more theatrical release operations in-house without changing the revenue share retained at the box office.'}
};
function ensureCapitalAssets(st=state){
 const c=ensureCorporateState(st);c.capitalAssets=c.capitalAssets||{owned:{},history:[]};c.capitalAssets.owned=c.capitalAssets.owned||{};c.capitalAssets.history=c.capitalAssets.history||[];return c.capitalAssets;
}
function capitalAssetOwned(id,st=state){return !!ensureCapitalAssets(st).owned[id]}
function capitalAssetCount(st=state){return Object.keys(ensureCapitalAssets(st).owned||{}).length}
function capitalAssetValue(st=state){return Object.keys(ensureCapitalAssets(st).owned||{}).reduce((n,id)=>n+(CAPITAL_ASSETS[id]?.value||0),0)}
function capitalAssetWeeklyOverhead(st=state){return Object.keys(ensureCapitalAssets(st).owned||{}).reduce((n,id)=>n+(CAPITAL_ASSETS[id]?.upkeep||0),0)}
function capitalSlateMultiplier(){return capitalAssetOwned('lot')?.82:1}
function capitalCatalogueMultiplier(){return capitalAssetOwned('archive')?1.15:1}
function capitalDistributionMultiplier(){return capitalAssetOwned('distribution')?.82:1}
function capitalReserveTarget(extraUpkeep=0){
 const b=studioOverheadBreakdown(),weekly=Math.max(.05,(b.total||0)+Math.max(0,extraUpkeep||0));
 return +Math.max(8,weekly*20+5).toFixed(1);
}
function capitalDeployableCash(){return +Math.max(0,state.cash-capitalReserveTarget()).toFixed(1)}
function capitalAssetEligibility(id){ensureFinance();const a=CAPITAL_ASSETS[id],reasons=[];if(!a)return {ok:false,reasons:['Unknown capital asset.']};if(capitalAssetOwned(id))reasons.push('Already owned.');if(ensureCareerCycle().activePlan?.id==='lean')reasons.push('Capital expansion is frozen during a Lean Rebuild.');const recognition=ensureStudioGrowth().recognition||0;if(recognition<a.recognition)reasons.push('Reach '+a.recognition+' Studio Recognition.');if((state.finance.bridgeDebt||0)>.5)reasons.push('Repay emergency bridge debt before making a permanent capital investment.');const reserve=capitalReserveTarget(a.upkeep),required=+(a.cost+reserve).toFixed(1);if(state.cash<required)reasons.push('Hold '+money(required)+' cash so the '+money(a.cost)+' purchase leaves the operating reserve intact.');return {ok:reasons.length===0,reasons,reserve,required,asset:a}}
function buyCapitalAsset(id){
 const e=capitalAssetEligibility(id);if(!e.ok)return showToast(e.reasons[0]||'That capital investment is not available.');
 const a=e.asset,ca=ensureCapitalAssets();state.cash-=a.cost;ca.owned[id]={week:state.week,cost:a.cost};ca.history.unshift({id,week:state.week,cost:a.cost});ca.history=ca.history.slice(0,20);
 state.reputation.financial=clamp((state.reputation.financial||50)+1,15,95);
 addNews(state,state.studio.name+' acquired '+a.name+' for '+money(a.cost)+'. The asset adds '+moneyFine(a.upkeep)+'/week of fixed operating cost in exchange for '+a.effect+'.','Trade Finance');
 notify('capital-asset:'+id,'Capital investment complete',a.name+' is now part of the studio infrastructure.',null,false,'milestone',{screen:'studio',detail:{type:'finance'}});
 if(typeof checkStudioMilestones==='function')checkStudioMilestones();save();render();return true;
}
function capitalAllocationPanel(){
 const recognition=ensureStudioGrowth().recognition||0,count=capitalAssetCount();if(recognition<25&&!count)return '';
 const reserve=capitalReserveTarget(),deployable=capitalDeployableCash();
 let html='<div class="section-title"><h2>Capital allocation</h2><span class="small">Permanent business assets</span></div>';
 html+='<div class="grid cols3"><div class="card"><div class="badge">Operating reserve</div><div class="kpi">'+money(reserve)+'</div><div class="small">Target held back from expansion</div></div><div class="card"><div class="badge">Deployable cash</div><div class="kpi">'+money(deployable)+'</div><div class="small">Cash above the current reserve</div></div><div class="card"><div class="badge">Permanent assets</div><div class="kpi">'+count+'/3</div><div class="small">'+money(capitalAssetValue())+' added studio value</div></div></div>';
 html+='<div class="grid cols3" style="margin-top:12px">';
 Object.values(CAPITAL_ASSETS).forEach(a=>{const owned=capitalAssetOwned(a.id),e=capitalAssetEligibility(a.id),reason=e.reasons[0]||'';html+='<div class="card '+(owned?'goodline':'')+'"><div class="row"><strong>'+a.name+'</strong><span class="pill '+(owned?'good':e.ok?'blue':'')+'">'+(owned?'OWNED':money(a.cost))+'</span></div><div class="body" style="margin-top:8px">'+a.desc+'</div><div class="listrow"><span>Effect</span><strong>'+a.effect+'</strong></div><div class="listrow"><span>Maintenance</span><strong>'+moneyFine(a.upkeep)+'/week</strong></div><div class="listrow"><span>Asset value</span><strong>'+money(a.value)+'</strong></div><div class="small" style="margin-top:8px">'+(owned?'This investment is permanent.':e.ok?'The purchase keeps the current operating reserve intact.':reason)+'</div><button class="btn '+(e.ok?'primary':'')+' block" data-capital-asset="'+a.id+'" style="margin-top:10px" '+(e.ok?'':'disabled')+'>'+(owned?'Owned':e.ok?'Acquire for '+money(a.cost):'Not yet available')+'</button></div>'});
 html+='</div>';return html;
}
function capitalAssetsCorporatePanel(){
 const count=capitalAssetCount();if(!count)return '';
 return '<div class="section-title"><h2>Permanent studio assets</h2><span class="small">'+count+' of 3 acquired</span></div><div class="card">'+Object.values(CAPITAL_ASSETS).filter(a=>capitalAssetOwned(a.id)).map(a=>'<div class="listrow"><div><strong>'+a.name+'</strong><div class="small">'+a.effect+'</div></div><strong>'+money(a.value)+'</strong></div>').join('')+'<div class="listrow"><span>Total capital-asset value</span><strong>'+money(capitalAssetValue())+'</strong></div></div>';
}

function playerProductionCapacity(){return Math.max(1,2+studioUpgradeLevel('production')-recoveryCapacityPenalty())}
function auditionSlotLimit(){return [3,4,6][Math.min(2,studioUpgradeLevel('casting'))]}
function scoutingPrecisionMultiplier(){return [1,.82,.64][Math.min(2,studioUpgradeLevel('casting'))]}
function extraAuditionCost(){return [.15,.11,.07][Math.min(2,studioUpgradeLevel('casting'))]}
function awardsCampaignDiscount(){return [0,.25,.45][Math.min(2,studioUpgradeLevel('publicity'))]}
function publicityExecutionBonus(){return [0,2.5,5][Math.min(2,studioUpgradeLevel('publicity'))]}
function screenplayMarketCapacity(){return [9,10,12][Math.min(2,studioUpgradeLevel('development'))]}
function firstLookDepartmentWeeks(){return [0,2,4][Math.min(2,studioUpgradeLevel('development'))]}
function postOptionLimit(){return [4,5,7][Math.min(2,studioUpgradeLevel('post'))]}
function soundtrackShortlistSize(){return [5,6,8][Math.min(2,studioUpgradeLevel('post'))]}
function totalStudioUpgradeLevels(){const u=ensureStudioGrowth().upgrades;return Object.keys(STUDIO_UPGRADES).reduce((n,k)=>n+(u[k]||0),0)}
function studioUpgradeBenefitLabel(k){
 if(k==='production')return `${playerProductionCapacity()} production slots`;
 if(k==='casting')return `${auditionSlotLimit()} audition slots · ${Math.round((1-scoutingPrecisionMultiplier())*100)}% clearer scouting`;
 if(k==='publicity')return `${Math.round(awardsCampaignDiscount()*100)}% awards saving · +${publicityExecutionBonus()} execution`;
 if(k==='development')return `${screenplayMarketCapacity()} live scripts · +${firstLookDepartmentWeeks()} First Look weeks`;
 if(k==='post')return `${postOptionLimit()} edit options · ${soundtrackShortlistSize()} songs`;
 return 'Department capability';
}
function studioUpgradeNewsBenefit(k){return {production:'more production capacity',casting:'deeper casting access and scouting',publicity:'a stronger publicity operation',development:'a larger rights-and-development pipeline',post:'deeper editorial and music-supervision options'}[k]||'a stronger studio operation'}
function buyStudioUpgrade(k){const g=ensureStudioGrowth(),n=nextStudioUpgrade(k);if(!n)return showToast('This department is already fully developed.');if(ensureCareerCycle().activePlan?.id==='lean')return showToast('Department expansion is frozen during a Lean Rebuild.');if(g.recognition<n.recognition)return showToast(`Studio recognition ${n.recognition} is required.`);if(!spend(n.cost))return;g.upgrades[k]=(g.upgrades[k]||0)+1;g.history.unshift({week:state.week,key:k,name:n.name,cost:n.cost});addNews(state,`${state.studio.name} opened its ${n.name}. The expansion adds ${moneyFine(n.overhead)} to weekly overhead in exchange for ${studioUpgradeNewsBenefit(k)}.`,'Your Studio');save();render()}
function studioFansLabel(v){return v>=10?`${v.toFixed(1)}m global followers`:v>=1?`${v.toFixed(2)}m followers`:`${Math.round(v*1000)}k followers`}
function playerStudioEntity(){const g=ensureStudioGrowth(),done=playerFilms().filter(f=>f.stage==='complete'),recent=done.filter(f=>state.week-(f.completeWeek||0)<=52);return {id:'player',name:state.studio.name,player:true,fans:g.fans,recognition:g.recognition,awards:done.reduce((s,f)=>s+(ensureAfterlifeState(f).wins?.length||0),0),recentProfit:recent.reduce((s,f)=>s+((f.studioRevenue||0)-(f.investment||0)),0),reputation:Object.values(state.reputation).reduce((a,b)=>a+b,0)/Math.max(1,Object.values(state.reputation).length),style:studioIdentityPrimary().label}}
function rivalStudioEntity(rv){const done=state.films.filter(f=>f.owner===rv.id&&f.stage==='complete'),recent=done.filter(f=>state.week-(f.completeWeek||0)<=52);return {id:rv.id,name:rv.name,player:false,fans:rv.fans||.5,recognition:rv.recognition??rv.reputation??50,awards:done.reduce((s,f)=>s+(ensureAfterlifeState(f).wins?.length||0),0),recentProfit:recent.reduce((s,f)=>s+(f.estimatedProfit||0),0),reputation:rv.reputation||50,style:rv.style}}
function studioRankingScore(e){return (e.recognition||0)*.58+Math.min(24,Math.sqrt(Math.max(0,e.fans||0))*6.2)+Math.max(-10,Math.min(16,(e.recentProfit||0)*.18))+Math.min(12,(e.awards||0)*1.8)+(e.reputation||50)*.12}
function studioStandings(){return [playerStudioEntity(),...state.rivals.map(rivalStudioEntity)].map(x=>({...x,score:studioRankingScore(x)})).sort((a,b)=>b.score-a.score).map((x,i)=>({...x,rank:i+1}))}
function playerStudioStanding(){return studioStandings().find(x=>x.player)}
function playerRecognitionGainMultiplier(rec){
 rec=Number.isFinite(rec)?rec:ensureStudioGrowth().recognition;
 if(rec>=90)return .18;
 if(rec>=82)return .32;
 if(rec>=70)return .50;
 if(rec>=55)return .72;
 return 1;
}
function playerRecognitionDelta(base,rec){return base>0?base*playerRecognitionGainMultiplier(rec):base}

function registerStudioFilmImpact(f,profit){
 const aud=f.review?.audience||60,crit=f.review?.critics||60,gross=f.finalGross||0;
 if(f.owner==='player'){
  const g=ensureStudioGrowth(),baseRecognition=gross*.014+(crit-65)*.020+(profit>5?1:profit<-8?-1.2:0);
  g.fans=Math.max(.02,+(g.fans+Math.max(-.10,gross*.0035*(aud/70)+(aud-70)*.004+(profit>0?.05:-.03))).toFixed(3));
  g.recognition=clamp(g.recognition+playerRecognitionDelta(baseRecognition,g.recognition),5,100);
  updateStudioIdentityHistory();
 }else{
  const rv=rivalById(f.owner);if(rv){rv.fans=Math.max(.1,+((rv.fans||1)+gross*.0027*(aud/70)+(aud-70)*.003).toFixed(3));rv.recognition=clamp((rv.recognition??rv.reputation??50)+gross*.013+(crit-65)*.018+(profit>5?.8:profit<-8?-.8:0),15,100)}
 }
}
function registerStudioAwardImpact(f,wins,noms){
 if(!wins&&!noms)return;
 if(f.owner==='player'){
  const g=ensureStudioGrowth(),baseRecognition=wins*2+noms*.40;
  g.recognition=clamp(g.recognition+playerRecognitionDelta(baseRecognition,g.recognition),5,100);
  g.fans=+(g.fans+wins*.08+noms*.015).toFixed(3);
 }else{
  const rv=rivalById(f.owner);if(rv){rv.recognition=clamp((rv.recognition??rv.reputation??50)+wins*1.8+noms*.4,15,100);rv.fans=+((rv.fans||1)+wins*.05+noms*.01).toFixed(3)}
 }
}


const DISTRIBUTORS=['Meridian Releasing','Atlas Distribution','Crownline Releasing','Northlight Pictures','Beacon International','Harbour Releasing'];
const DISTRIBUTION_OPTIONS={
 self:{id:'self',name:'Self-distribute',short:'Self',desc:'Finance the full theatrical rollout yourself. Highest upfront cost and risk, but you keep the strongest share of box-office receipts.',opsMult:1.00,domShare:.47,intlShare:.35,awareness:0,opening:1,legs:0,pressure:1},
 partner:{id:'partner',name:'Distribution partner',short:'Partner',desc:'A larger distributor carries part of the release operation and expands reach. Lower upfront exposure, but they take a larger share of theatrical receipts.',opsMult:.52,domShare:.39,intlShare:.28,awareness:3.4,opening:1.04,legs:.015,pressure:.92},
 platform:{id:'platform',name:'Platform release',short:'Platform',desc:'Open in a smaller number of markets and expand if response is strong. Cheap to launch with a smaller opening ceiling, but better conditions for word of mouth.',opsMult:.38,domShare:.44,intlShare:.32,awareness:.8,opening:.66,legs:.17,pressure:.78}
};

function ensureStudioIdentity(st=state){
 if(!st.studioIdentity)st.studioIdentity={history:[],lastPrimary:null,lastEvaluatedWeek:0};
 st.studioIdentity.history=st.studioIdentity.history||[];
 return st.studioIdentity;
}
function identityCompletedFilms(st=state){return (st.films||[]).filter(f=>f.owner==='player'&&f.stage==='complete')}
function identityAverage(arr,fn){return arr.length?arr.reduce((a,x)=>a+fn(x),0)/arr.length:0}
function identityGenreRecord(done){
 const rows={};
 done.forEach(f=>{const r=rows[f.genre]||(rows[f.genre]={count:0,gross:0,profit:0,critics:0,audience:0});r.count++;r.gross+=f.finalGross||0;r.profit+=(f.studioRevenue||0)-(f.investment||0);r.critics+=f.review?.critics||60;r.audience+=f.review?.audience||60});
 return Object.entries(rows).map(([genre,r])=>({genre,...r,share:r.count/Math.max(1,done.length),avgCritics:r.critics/r.count,avgAudience:r.audience/r.count})).sort((a,b)=>b.count-a.count||b.profit-a.profit);
}
function studioIdentitySnapshot(st=state){
 const done=identityCompletedFilms(st),r=st.reputation||{creative:45,commercial:45,talent:45,financial:50},genres=identityGenreRecord(done);
 const avgCritics=identityAverage(done,f=>f.review?.critics||60),avgAudience=identityAverage(done,f=>f.review?.audience||60),avgBudget=identityAverage(done,f=>f.budget||0),avgGross=identityAverage(done,f=>f.finalGross||0);
 const profitable=done.filter(f=>(f.studioRevenue||0)>(f.investment||0)).length/Math.max(1,done.length),awards=done.reduce((a,f)=>a+(ensureAfterlifeState(f).wins?.length||0),0);
 const mid=done.filter(f=>(f.budget||0)>=6&&(f.budget||0)<=22),big=done.filter(f=>(f.budget||0)>=28),sequels=done.filter(f=>f.ipParentId).length;
 const producerCredits=done.filter(f=>f.directorAuthority?.producerCredit).length;
 const dirRels=(st.talent||[]).filter(t=>t.type==='Director'&&(t.credits||[]).some(c=>c.studio===st.studio?.name)).map(t=>t.relationship||0);
 const avgDirRel=dirRels.length?dirRels.reduce((a,b)=>a+b,0)/dirRels.length:0;
 const strongFranchises=done.filter(f=>{try{return franchiseOpportunity(f).score>=62}catch{return false}}).length;
 const traits=[];
 const add=(id,label,score,desc,effect)=>traits.push({id,label,score:clamp(score,0,100),desc,effect});
 if(done.length){
  add('critical','Critics’ Studio',avgCritics*.70+r.creative*.25+Math.min(12,awards*2.2),'The slate repeatedly earns strong critical attention and awards credibility.','Prestige material is more likely to reach you early, and established directors are slightly more receptive.');
  add('audience','Audience Favourite',avgAudience*.72+r.commercial*.23+Math.min(8,Math.sqrt(Math.max(0,ensureStudioGrowth(st).fans||0))*2.2),'Audiences have learned to trust the studio name across releases.','Recognisable studio branding can add a small awareness lift to new releases.');
  add('filmmaker','Filmmaker Friendly',r.talent*.65+(avgDirRel+20)*.45+Math.min(10,producerCredits*2),'Directors increasingly see the studio as a place where creative relationships can last.','Directors can show more enthusiasm in negotiations, particularly on strong-fit material.');
  add('midbudget','Mid-Budget Hitmaker',(mid.length/Math.max(1,done.length))*65+(mid.filter(f=>(f.studioRevenue||0)>(f.investment||0)).length/Math.max(1,mid.length))*25+r.financial*.10,'The studio has built a reputation for making disciplined films without relying on blockbuster scale.','Distribution partners view sensible mid-budget packages as lower-risk propositions.');
  add('event','Event Studio',(big.length/Math.max(1,done.length))*58+Math.min(28,avgGross*.18)+r.commercial*.14,'The company increasingly operates in the large-scale, opening-weekend business.','Large commercial releases carry extra brand awareness, but audience expectations rise with it.');
  add('franchise','Franchise House',Math.min(70,sequels*13+strongFranchises*9)+r.commercial*.25,'Repeat properties and recognisable worlds are becoming a meaningful part of the company’s business.','Established IP gains a small awareness advantage when it returns.');
  add('talent','Talent Launchpad',r.talent*.80+Math.min(18,done.length*1.2),'The studio is becoming associated with performers and filmmakers whose careers grow through its projects.','Less-established actors are somewhat more flexible on terms for a strong-fit role.');
  const top=genres[0];
  if(top&&top.count>=3)add('genre',`${top.genre} House`,top.share*70+top.avgAudience*.20+top.avgCritics*.10,`${Math.round(top.share*100)}% of the released slate has been ${top.genre.toLowerCase()}, creating a recognisable house association.`,`New ${top.genre.toLowerCase()} material is more likely to be offered to the studio before the open market.`);
 }
 traits.sort((a,b)=>b.score-a.score);
 const established=traits.filter(x=>x.score>=62).slice(0,3);
 const primary=established[0]||{id:'emerging',label:done.length<3?'Unformed Studio':'Independent Studio',score:done.length?55:20,desc:done.length<3?'There is not enough released work for the industry to put a durable label on the company yet.':'The slate is varied enough that no single identity dominates.',effect:'Future releases will continue shaping the studio’s reputation.'};
 return {done,genres,avgCritics,avgAudience,avgBudget,avgGross,profitable,awards,traits,established,primary,topGenre:genres[0]||null};
}
function studioIdentityPrimary(){return studioIdentitySnapshot().primary}
function updateStudioIdentityHistory(){
 const mem=ensureStudioIdentity(),snap=studioIdentitySnapshot();if(snap.done.length<3)return snap;
 if(mem.lastPrimary!==snap.primary.id){
  const prev=mem.lastPrimary;mem.lastPrimary=snap.primary.id;mem.history.unshift({week:state.week,id:snap.primary.id,label:snap.primary.label});mem.history=mem.history.slice(0,16);
  if(prev)addNews(state,`${state.studio.name} is increasingly being described in the trade as a ${snap.primary.label.toLowerCase()}, reflecting the direction of its recent slate.`,'Studio Watch');
  else addNews(state,`${state.studio.name} is beginning to develop a recognisable industry identity as a ${snap.primary.label.toLowerCase()}.`,'Studio Watch');
 }
 return snap;
}
function identityHas(id){return studioIdentitySnapshot().established.some(x=>x.id===id)}
function studioIdentityContractMultiplier(t,f){
 const snap=studioIdentitySnapshot();let mult=1;
 if(t.type==='Director'&&snap.established.some(x=>x.id==='filmmaker'))mult*=.96;
 if(t.type==='Actor'&&(t.star||50)<78&&snap.established.some(x=>x.id==='talent'))mult*=.96;
 if(snap.topGenre?.genre===f.genre&&snap.topGenre.share>=.42&&snap.topGenre.count>=3)mult*=.98;
 return clamp(mult,.90,1.02);
}
function studioIdentityPassionBonus(t,f){
 const snap=studioIdentitySnapshot();let b=0;
 if(t.type==='Director'&&snap.established.some(x=>x.id==='filmmaker'))b+=.07;
 if(t.type==='Actor'&&(t.star||50)<78&&snap.established.some(x=>x.id==='talent'))b+=.06;
 if(snap.topGenre?.genre===f.genre&&snap.topGenre.share>=.42)b+=.03;
 return b;
}
function studioIdentityAwarenessLift(f){
 const snap=studioIdentitySnapshot();let x=0;
 if(snap.established.some(t=>t.id==='audience'))x+=2.1;
 if(snap.established.some(t=>t.id==='event')&&(f.budget||0)>=28)x+=1.6;
 if(snap.established.some(t=>t.id==='franchise')&&f.ipParentId)x+=1.3;
 if(snap.topGenre?.genre===f.genre&&snap.topGenre.share>=.42&&snap.topGenre.count>=3)x+=1.2;
 return Math.min(4.2,x);
}
function studioIdentityCriticLift(f){return identityHas('critical')&&f.creative?.positioning==='prestige'?1.2:0}
function maybeGrantFirstLook(s){
 const snap=studioIdentitySnapshot(),g=ensureStudioGrowth();if(snap.done.length<3||g.recognition<30)return false;
 const dev=studioUpgradeLevel('development');let chance=.05+Math.min(.14,g.recognition*.0015)+dev*.04;
 if(snap.topGenre?.genre===s.genre&&snap.topGenre.share>=.40)chance+=.16;
 if(identityHas('critical')&&s.originality>=78)chance+=.06;
 const r=makeRng(hash(state.seed+'|first-look|'+s.id+'|'+state.week));if(r()>chance)return false;
 s.firstLookUntil=state.week+4+firstLookDepartmentWeeks();s.firstLookReason=snap.topGenre?.genre===s.genre?`${snap.topGenre.genre} track record`:snap.primary.label;return true;
}
function scriptFirstLookActive(s){return !!(s?.firstLookUntil&&s.firstLookUntil>state.week&&s.available)}

function ensureDistributionState(f){
 if(!f)return null;
 if(!f.distributionStrategy)f.distributionStrategy='self';
 return f;
}
function platformReleaseEligible(f){
 const c=f.creative||defaultCreative();return c.positioning==='prestige'||(f.budget||0)<=18||['Psychological Horror','Prestige Drama','Comedy','Crime Thriller'].includes(f.genre);
}
function distributionPartnerStrength(owner='player'){
 if(owner==='player')return clamp((ensureStudioGrowth().recognition-25)/70+(state.reputation.commercial-45)/100,0,.75);
 const rv=typeof owner==='string'?rivalById(owner):owner;return rv?clamp(((rv.recognition||50)-30)/75+((rv.reputation||50)-45)/120,0,.70):0;
}
function distributionPlan(f,owner='player'){
 ensureDistributionState(f);let id=f.distributionStrategy||'self';if(id==='platform'&&!platformReleaseEligible(f))id='self';
 const base=DISTRIBUTION_OPTIONS[id]||DISTRIBUTION_OPTIONS.self,strength=distributionPartnerStrength(owner),opsBase=Math.max(1.35,(f.budget||0)*.065)+(f.marketing||0)*.055;
 let dom=base.domShare,intl=base.intlShare,awareness=base.awareness;
 if(id==='partner'){dom+=strength*.025;intl+=strength*.022;awareness+=strength*1.8}
 if(id==='platform'&&owner==='player'&&identityHas('critical'))awareness+=.5;
 return {...base,id,opsCost:+(opsBase*base.opsMult*(owner==='player'&&id==='self'?capitalDistributionMultiplier():1)).toFixed(2),domShare:+dom.toFixed(3),intlShare:+intl.toFixed(3),awareness:+awareness.toFixed(2)};
}
function distributionPartnerName(f){return DISTRIBUTORS[Math.abs(hash(state.seed+'|distributor|'+f.id))%DISTRIBUTORS.length]}
function setDistributionStrategy(f,id){
 if(!DISTRIBUTION_OPTIONS[id])return;if(id==='platform'&&!platformReleaseEligible(f))return showToast('This film is not a natural fit for a platform rollout.');
 const y=typeof window!=='undefined'?(window.scrollY||0):0;
 f.distributionStrategy=id;if(id==='partner')f.distributorName=distributionPartnerName(f);else f.distributorName=null;save();render();
 if(typeof window!=='undefined')setTimeout(()=>window.scrollTo(0,y),0);
}
function distributionCostPreview(f){const p=distributionPlan(f);return +(f.marketing+p.opsCost+publicityCost(f)+launchCost(f)).toFixed(2)}
function distributionAwarenessLift(f){const p=f.distributionDeal||distributionPlan(f);return p.awareness||0}
function distributionOpeningMultiplier(f){const p=f.distributionDeal||distributionPlan(f);return p.opening||1}
function distributionLegsBias(f){const p=f.distributionDeal||distributionPlan(f);return p.legs||0}
function distributionPressureMultiplier(f){const p=f.distributionDeal||distributionPlan(f);return p.pressure||1}
function theatricalStudioRevenue(f,row){const p=f.distributionDeal||distributionPlan(f);return row.dom*(p.domShare??.50)+row.intl*(p.intlShare??.38)}
function distributionLabel(f){const p=f?.distributionDeal||distributionPlan(f);return p.name}
function distributionTradeoff(f){
 const p=f.distributionDeal||distributionPlan(f);if(p.id==='self')return `You fund ${money(p.opsCost)} of release operations and retain roughly ${Math.round(p.domShare*100)}% domestic / ${Math.round(p.intlShare*100)}% international theatrical receipts.`;
 if(p.id==='partner')return `${f.distributorName||distributionPartnerName(f)} reduces your release-operation bill to ${money(p.opsCost)} and expands reach, in exchange for a larger distribution share.`;
 return `A smaller initial footprint cuts release operations to ${money(p.opsCost)}. The opening is deliberately constrained, with expansion depending on word of mouth.`;
}
function aiDistributionStrategy(rv,f){
 const r=makeRng(hash(state.seed+'|ai-distribution|'+rv.id+'|'+f.id));
 if((rv.style==='Prestige'||rv.style==='Indie / Prestige')&&platformReleaseEligible(f)&&r()<.42)return 'platform';
 if(rv.style==='Broad Commercial'&&r()<.58)return 'partner';
 if(rv.style==='Genre Specialist'&&platformReleaseEligible(f)&&r()<.22)return 'platform';
 if(rv.style==='Genre Specialist'&&r()<.42)return 'partner';
 if(rv.style==='Blockbusters'||rv.style==='Franchise Builder')return r()<.28?'partner':'self';
 return r()<.35?'partner':'self';
}
function rivalSignature(rv){
 const map={
  'Blockbusters':{label:'Tentpole Machine',philosophy:'Big stars, large production commitments and event openings.',distribution:'Usually self-distributes its biggest releases.'},
  'Broad Commercial':{label:'Mainstream Operator',philosophy:'Accessible concepts, reliable packages and disciplined commercial positioning.',distribution:'Frequently uses major distribution partners to spread release risk.'},
  'Genre Specialist':{label:'Genre House',philosophy:'Contained genre bets, repeat audiences and sharp positioning.',distribution:'Mixes self-distribution with targeted partner and platform rollouts.'},
  'Prestige':{label:'Prestige House',philosophy:'Filmmaker-led material, critical credibility and cautious balance-sheet exposure.',distribution:'Comfortable with platform releases and specialist partners.'},
  'Franchise Builder':{label:'IP Builder',philosophy:'Recognisable worlds, scalable concepts and repeatable audience assets.',distribution:'Protects upside by self-distributing established properties.'},
  'Indie / Prestige':{label:'Independent Curator',philosophy:'Smaller budgets, emerging talent and selective filmmaker-driven work.',distribution:'Relies heavily on platform rollouts and distribution partners.'}
 };
 return map[rv.style]||map['Broad Commercial'];
}


const SCRIPT_TITLE_BANK={
 'Action Thriller':{
  singles:['Deadfall','Crossfire','Overdrive','Lockdown','Hardline','Backchannel','Waystation','Fallback','Ricochet','Killzone','Switchback','Redeye','Breakwater','Blacksite','Overwatch','Nocturne'],
  places:['Calder Pass','Orchid Station','Mile Zero','Harbour Nine','Mercy Bridge','Raven Point','The Kestrel Line','Checkpoint Blue','Station Eleven','The Narrows'],
  nouns:['convoy','courier','witness','operative','driver','bodyguard','smuggler','defector','mercenary','dispatcher'],
  settings:['a sealed border city','a night train crossing three countries','a storm-battered island airstrip','an abandoned motorway network','a diplomatic convoy','a cargo ship under military quarantine','a city during a communications blackout'],
  engines:['is hunted after receiving evidence that exposes both sides of a covert war','has one night to move a witness before every agency in the city turns against them','discovers the extraction mission was designed to erase the team carrying it out','must cross hostile territory with a passenger whose identity could collapse a government','is trapped inside a moving operation where every checkpoint has already been compromised']
 },
 'Psychological Horror':{
  singles:['Afterimage','Hush','Undertow','The Unsaid','Palehouse','Stillwater','Murmur','Wakeful','Hollowing','The Listening','Inheritance','Nightjar','Static','Devotion','Threshold'],
  places:['Marrow House','Bellweather Farm','Room Seventeen','Saint Mercy','Morrow Lake','The Briar Estate','Candlewick','Greywater','The Quiet Ward','Ashdown'],
  nouns:['widow','night nurse','teacher','archivist','mother','therapist','caretaker','photographer','social worker','composer'],
  settings:['an isolated rehabilitation centre','a family home scheduled for demolition','a coastal village cut off by winter storms','a private sleep clinic','an empty boarding school','a remote archive beneath a hospital','a half-finished housing development where only one family has moved in'],
  engines:['begins receiving messages that predict private memories rather than future events','realises everyone around them remembers a different version of the same death','discovers a room that only appears when somebody in the house lies','becomes convinced a missing person is communicating through other people’s dreams','finds evidence that the person they are grieving may never have existed']
 },
 'Prestige Drama':{
  singles:['Inheritance','After Winter','The Distance Home','Ordinary Weather','Good Country','The Long Return','Small Mercies','Northbound','Ashes in April','What Remains','Open Water','Second Language','Sunday Clothes','Tenderness'],
  places:['Mercer County','The Orchard House','Lake Aurelia','Union Street','Saint Agnes','The Larkspur Hotel','Cedar County','The Old Assembly Rooms'],
  nouns:['teacher','surgeon','musician','judge','farmer','translator','union organiser','architect','care worker','journalist'],
  settings:['a declining industrial town','the family home after a parent’s death','a provincial theatre during its final season','a rural hospital facing closure','a coastal community after a public tragedy','an old hotel being sold after three generations','a city neighbourhood being cleared for redevelopment'],
  engines:['returns home and discovers the family’s version of an old betrayal was incomplete','must choose between protecting a public reputation and admitting the private truth','is forced to live with an estranged sibling while settling an inheritance neither of them wants','reconnects with the person whose life was changed by one decision decades earlier','tries to repair a family while the institution that defined their identity disappears']
 },
 'Science Fiction':{
  singles:['Afterimage','Elsewhen','Parallax','Continuum','Drift','Second Earth','Ghostlight','The Recall','Lacuna','Eventide','Signal Loss','Tomorrow Archive','The Fold','Proxy','Aperture'],
  places:['Orison Station','Kepler Nine','The Far Shore','Colony Aster','Lagrange House','Europa Dawn','Station Meridian','The Caligo Array','New Carthage','Vesper Orbit'],
  nouns:['memory architect','orbital mechanic','linguist','climate engineer','pilot','archaeologist','synthetic-rights lawyer','mission controller','quantum cartographer','emergency physician'],
  settings:['a city where memories are licensed property','a failing orbital habitat','the first permanent settlement beneath an alien ocean','a research station receiving broadcasts from its own future','a generation ship approaching a destination nobody remembers choosing','a near-future country where citizens can legally delete one year of their lives'],
  engines:['discovers the system keeping society stable was built from stolen human experiences','receives proof that the mission has already failed in another version of events','finds a message encoded in technology that humanity has not invented yet','must decide whether to expose a discovery that would make personal identity impossible to prove','learns the supposedly artificial intelligence governing the crisis is a copied human mind']
 },
 'Comedy':{
  singles:['Plus One','Soft Launch','The Backup Plan','Best Intentions','Terms & Conditions','Second Choice','Open Bar','Very Professional','Fine, Actually','Group Chat','The Plus Side','Out of Office','Good Enough'],
  places:['The Palm Court','Briar Weekend','Hotel Verona','Maple Junction','The Marigold Club','Terminal B','Honeymoon Suite 4','Cedar Ridge'],
  nouns:['wedding planner','failed actor','divorce lawyer','museum guide','junior diplomat','school teacher','chef','estate agent','podcaster','local politician'],
  settings:['a destination wedding where two exes share responsibility for the ceremony','a disastrous corporate retreat','a family reunion built around a lie nobody wants to correct','an airport hotel during a three-day cancellation','a small town preparing for an absurdly prestigious visitor','a luxury wellness weekend where nobody is remotely well'],
  engines:['is forced to keep a ridiculous deception alive after it unexpectedly improves everyone else’s life','teams up with a professional rival when both are mistaken for the same expert','agrees to fake a relationship and discovers both families take the arrangement far too seriously','accidentally becomes the public face of a cause they do not understand','must organise one perfect event while every guest is hiding a different catastrophe']
 },
 'Family Adventure':{
  singles:['Wayfarers','Wildlight','Starling','Moonrail','The Compass Club','Skybound','Homeward','The Wonder Map','Lantern Road','Cloudbreak','Foxfire','The Hidden Mile','Brightwater'],
  places:['Starling Valley','The Impossible Railway','Foxglove Island','Lantern Wood','The Copper Mountains','Whisper Bay','Cloudbreak Station','Juniper Hollow','Northstar Ridge'],
  nouns:['three siblings','a runaway inventor','two best friends','a shy eleven-year-old','a young mapmaker','a foster child','a school robotics team','a brother and sister'],
  settings:['an abandoned railway that travels to forgotten places','a valley missing from every modern map','a lighthouse that points toward impossible islands','a museum whose exhibits move after closing','a mountain town where the stars can be reached by climbing','an old amusement park built over a hidden machine'],
  engines:['must find their way home before the secret route disappears forever','discover adults have been searching for the same impossible place for decades','accidentally wake a machine designed to protect something the world has forgotten','race a charming treasure hunter to return a stolen object before it changes their hometown','learn the adventure only works while they still trust one another']
 },
 'Crime Thriller':{
  singles:['The Informant','Dead Letter','Chain of Custody','Blind Trust','The Fixer','No Witness','The Ninth Juror','Blue Ledger','Clean Hands','The Arrangement','Evidence','Hard Proof','The Quiet Case'],
  places:['Courtroom Nine','Calder District','Mercy Precinct','The Black Ledger','Westhaven','Saint Jude County','Dock Seven','The Ninth Room','Harbour Court'],
  nouns:['public defender','detective','forensic accountant','court clerk','crime reporter','internal-affairs investigator','professional thief','prosecutor','coroner','political aide'],
  settings:['a courthouse with a sealed room still being used after hours','a city where an anti-corruption unit is quietly disappearing','a luxury tower whose residents all share the same lawyer','a police evidence warehouse scheduled to close overnight','a mayoral campaign financed through impossible donations','a port where every customs record for one week has vanished'],
  engines:['discovers the official case was manufactured to protect a much larger crime','finds evidence that the missing witness has been testifying under different names for years','realises the person hiring them is also secretly paying the opposition','must prove a conspiracy using evidence that will incriminate their own family','uncovers a justice system operating a second set of rules for people who can afford them']
 },
 'Fantasy':{
  singles:['Wayfarer','The Unwritten','Ashwake','Glassborn','Riverbound','The Last Name','Mooncourt','The Hollow Crown','Spellbreaker','Brightfall','The Remembering','Wild Oath','Cinderheart','Evermere'],
  places:['The Vale of Orison','Cinder Court','The Drowned Kingdom','Saint Rowan','Evermere','The Moon Archive','Ashen Ford','The Glass Marches','Rookwood','The Ninth Province'],
  nouns:['cartographer','disgraced knight','village healer','royal archivist','young smuggler','failed prophet','monster hunter','apprentice judge','river guide','last dragon keeper'],
  settings:['a kingdom where maps physically create new land','a city that forgets one district every winter','an empire built around a sleeping god nobody believes is real','a borderland where spoken promises become binding magic','a river that carries the memories of the dead','a royal court where names can be stolen and worn'],
  engines:['discovers the law holding the kingdom together was deliberately written to fail','must protect an heir whose existence would restart a forgotten war','learns the monster they were raised to hunt is the only thing keeping the border intact','breaks an ancient oath and accidentally frees everyone else bound by it','must choose whether to restore a lost kingdom or prevent it from returning']
 }
};
const SCRIPT_TITLE_EXTRAS={
 'Action Thriller':{characters:['Rourke','Mason','Knox','Hale','Ricky'],commercial:['Zero Hour','One Last Run','Direct Action','Exit Wound','Hard Reset','The Extraction','Protocol Black','Dead Run'],homages:['Spy Another Day','Mission: Improbable','Fast & Curious','Die Tomorrow']},
 'Psychological Horror':{characters:['Mara','Rosemary','Agnes','Evelyn','The Bell Child'],commercial:['The Visitor','Don’t Look Upstairs','The Empty Bed','Sleep Study','The Thing in Room Six','Come Home Before Dark'],homages:['Friday the 14th','A Nightmare on Elm Avenue','The Exorcist Next Door']},
 'Prestige Drama':{characters:['Ricky','Marlowe','Evelyn','The Carters','Joan','Arthur'],commercial:['Blue Valentine County','The Long Goodbye Home','An American Winter','Ordinary People Like Us','The Last Good Summer'],homages:['Ricky','The Goddaughter','One Flew Over the Country Club']},
 'Science Fiction':{characters:['Cyborg','EVA','Nova','Orion','Ada'],commercial:['Future Imperfect','Memory Machine','Dark Orbit','The Tomorrow War Room','Human Error','Protocol Zero','Earth Two'],homages:['Cyborg','Blade Runner-Up','2002: A Space Problem']},
 'Comedy':{characters:['Barry','Maggie','The Hendersons','Kevin Again','Sally & Mark'],commercial:['Bad Plus One','Weekend Parents','The Wrong Wedding','Absolutely Fine','Terms Apply','Three Weddings Too Many'],homages:['When Barry Met Sally','The 41-Year-Old Bachelor','Dude, Where’s My Career?']},
 'Family Adventure':{characters:['Pip','Milo & June','The Robinson Kids','Matilda Jones','Scout'],commercial:['The Secret Railway','Treasure Club','The Great Escape Plan','Adventureland Express','The Lost Playground','Map to Somewhere'],homages:['Raiders of the Lost Park','Back to the Playground','E.T. Phone Mum']},
 'Crime Thriller':{characters:['Jango','Sloane','Vega','Marlowe','The Costellos'],commercial:['The Getaway Man','Inside Job','The Last Alibi','Dirty Money','Witness Protection','The Good Cop','Cold Case'],homages:['Jango Chained','The Goodfella','Reservoir Cats','The Usual Suspect']},
 'Fantasy':{characters:['Arden','Morrigan','The Rowan Boy','Elara','Cinder'],commercial:['Kingdom Come Again','The Dragon Road','Crownless','The Last Spell','Sword & Shadow','The Witch Road'],homages:['Lord of the Wings','Harry Plotter','The Hobbit: An Unexpected Invoice']}
};
function titleStyleKey(t){
 if(/^(No One|Nobody|Someone|Everyone)\b/i.test(t))return 'quantifier';
 if(/^The (Last|Quiet|Hidden|Broken|Forgotten|Impossible|Unfinished|Other)\b/i.test(t))return 'the-adjective';
 if(/^(When|After|Before) the\b/i.test(t))return 'temporal';
 if(/^A .+ of\b/i.test(t))return 'a-of';
 if(/^[^:]+:\s/.test(t))return 'subtitle';
 if(/^\w+(?:\s*&\s*\w+)?$/.test(t))return 'short';
 return 'natural';
}
function titleLeadKey(t){return String(t||'').replace(/^(the|a|an)\s+/i,'').split(/[\s:,&-]+/)[0].toLowerCase()}
function genreTitleShape(r,genre,b,e){
 const location=pick(r,b.places),single=pick(r,b.singles);
 if(genre==='Action Thriller')return pick(r,[`Operation ${single}`,`${single} Protocol`,`Code ${pick(r,['Black','Red','Zero','Mercy','Raven'])}`,`Run ${2+Math.floor(r()*97)}`]);
 if(genre==='Psychological Horror')return pick(r,[`The ${pick(r,['Guest','Patient','Watcher','Tenant','Daughter','Mirror'])}`,`${location} Tapes`,`Don’t ${pick(r,['Sleep','Answer','Open It','Turn Around'])}`]);
 if(genre==='Prestige Drama')return pick(r,[`${pick(r,['Winter','August','Sunday','Spring'])} in ${location}`,`The ${pick(r,['Mercers','Bell Family','Goodmans','Orchards'])}`,`${pick(r,e.characters)}`]);
 if(genre==='Science Fiction')return pick(r,[`Project ${single}`,`Sector ${2+Math.floor(r()*98)}`,`The ${pick(r,['Memory','Human','Tomorrow','Proxy'])} Machine`,`${single} Protocol`]);
 if(genre==='Comedy')return pick(r,[`How to ${pick(r,['Lose Gracefully','Fake a Wedding','Survive Monday','Meet the Parents Again'])}`,`Please Don’t ${pick(r,['Invite Him','Tell Mum','Post That','Call It Networking'])}`,`${pick(r,e.characters)}`]);
 if(genre==='Family Adventure')return pick(r,[`The ${pick(r,['Compass','Treasure','Rocket','Adventure'])} Club`,`${pick(r,['Journey','Race','Road'])} to ${location}`,`${pick(r,e.characters)} and the ${pick(r,['Moon Map','Clockwork Fox','Hidden Railway','Sky Door'])}`]);
 if(genre==='Crime Thriller')return pick(r,[`The ${pick(r,['Calder','Midnight','Mercy','Harbour'])} Job`,`Case ${2+Math.floor(r()*98)}`,`${location} Confidential`,`${pick(r,e.characters)}`]);
 if(genre==='Fantasy')return pick(r,[`The ${pick(r,['Sword','Crown','Book','City','Oath'])} of ${pick(r,['Ash','Winter','Glass','Stars','Cinders'])}`,`House of ${pick(r,['Crows','Embers','Moons','Thorns'])}`,`${pick(r,e.characters)}`]);
 return single;
}
function scriptTitleCandidate(r,genre,b){
 const e=SCRIPT_TITLE_EXTRAS[genre]||SCRIPT_TITLE_EXTRAS['Prestige Drama'],roll=r();
 if(roll<.24)return pick(r,b.singles);
 if(roll<.39)return pick(r,b.places);
 if(roll<.51)return pick(r,e.characters);
 if(roll<.68)return pick(r,e.commercial);
 if(roll<.83)return genreTitleShape(r,genre,b,e);
 if(roll<.91)return `${pick(r,['When','After','Before'])} the ${pick(r,['Lights','Sirens','River','Stars','Music','Letters','Roads','Voices'])} ${pick(r,['Stop','Return','Burn','Disappear','Go Quiet','Come Back'])}`;
 if(roll<.96)return `A ${pick(r,['Map','History','Catalogue','Theory','List','Book','Portrait','Memory'])} of ${pick(r,['Empty Roads','Small Things','Lost Names','Bad Decisions','Unfinished Lives','Hidden Rooms','Distant Fires'])}`;
 return pick(r,e.homages);
}
function uniqueScriptTitle(st,r,genre){
 const b=SCRIPT_TITLE_BANK[genre]||SCRIPT_TITLE_BANK['Prestige Drama'],scripts=st.scripts||[],used=new Set(scripts.map(x=>(x.title||'').toLowerCase()));
 const recent=scripts.filter(x=>x.title).slice(-8),styleCounts={},leadCounts={};
 recent.forEach(x=>{const style=titleStyleKey(x.title),lead=titleLeadKey(x.title);styleCounts[style]=(styleCounts[style]||0)+1;if(lead)leadCounts[lead]=(leadCounts[lead]||0)+1});
 for(let i=0;i<32;i++){
  const t=scriptTitleCandidate(r,genre,b).replace(/\s+/g,' ').trim(),key=t.toLowerCase(),style=titleStyleKey(t),lead=titleLeadKey(t);
  if(used.has(key))continue;
  if((styleCounts[style]||0)>=2&&['temporal','a-of','the-adjective','subtitle'].includes(style))continue;
  if(lead&&(leadCounts[lead]||0)>=1&&recent.length>=4)continue;
  return t;
 }
 return `${pick(r,b.singles)} ${2+Math.floor(r()*97)}`;
}
function protagonistWithArticle(p){
 if(/^(a|an)\s/i.test(p)||/^(two|three|four|five|six|seven|eight|nine|ten|several|multiple)\s/i.test(p))return p;
 return `${/^[aeiou]/i.test(p)?'an':'a'} ${p}`;
}
function capPhrase(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x}

const PREMISE_DNA_BANK={
 'Action Thriller':{
  roles:['CIA field officer','counterterrorism analyst','bomb-disposal officer','federal air marshal','former special-forces medic'],
  settings:['Prague during a diplomatic summit','Berlin on election night','Istanbul airport during a security lockdown','London during a NATO summit','an Alpine border crossing during a blizzard'],
  goals:['stop a coordinated attack on an international summit','recover a stolen bioweapon before it crosses the border','rescue a kidnapped intelligence source before a prisoner exchange','intercept a weapons shipment hidden inside a civilian convoy','expose a false-flag operation before it triggers a military response'],
  pressures:['a terrorist cell stays one step ahead of the security services','a private military contractor starts erasing everyone connected to the operation','a rogue intelligence unit turns the city into a hunting ground','an arms-smuggling network begins moving its final shipment','a former agency asset starts using classified tactics against the people who trained them'],
  complications:['the evidence points back to the operation that destroyed their career','their own handler may be protecting the people they are hunting','the architect of the plot is a former partner they once trusted','their government has already disavowed the mission','someone they love is trapped inside the target zone']
 },
 'Psychological Horror':{
  roles:['sleep researcher','bereavement counsellor','forensic psychologist','documentary sound recordist','night-shift doctor'],
  settings:['an inherited mountain hotel','a coastal clinic cut off by storms','a condemned apartment block scheduled for demolition','a remote sleep laboratory','a small town preparing for its centenary'],
  goals:['discover why strangers are sharing the same nightmare','learn what happened to the patients erased from the building records','prove that a series of impossible memories belong to real missing people','trace a voice appearing on recordings made in empty rooms','understand why patients are describing deaths that have not happened yet'],
  pressures:['the visions begin predicting real deaths','the building seems to react whenever anyone tries to leave','each new witness remembers a different version of the same tragedy','the recordings start answering questions nobody spoke aloud','people connected to the case begin disappearing from photographs and records'],
  complications:['every clue leads back to their own missing parent','they have begun experiencing the same symptoms as the victims','their closest ally insists the investigation already happened years ago','the only surviving witness knows a secret about their childhood','the phenomenon appears to know why they came there']
 },
 'Prestige Drama':{
  roles:['public defender','palliative-care nurse','failed concert pianist','local newspaper editor','union organiser'],
  settings:['a fading industrial town','a family home being cleared for sale','a rural hospital facing closure','a city neighbourhood being redeveloped','a coastal community after a factory shutdown'],
  goals:['repair a relationship with an estranged child before leaving town','keep a vulnerable family together through one final court case','reconcile with the sibling who stayed behind to care for their father','decide whether to expose a story that will destroy a lifelong friendship','hold a fractured community together through a bitter final negotiation'],
  pressures:['old resentments resurface as money and memory pull the family apart','a decision made decades earlier returns with consequences nobody can avoid','the town begins choosing survival over loyalty','a private grief becomes impossible to keep separate from public responsibility','the people depending on them want mutually incompatible things'],
  complications:['they are carrying responsibility for the event everyone else blames on someone else','the person they most need forgiveness from has no interest in giving it','their version of the family history may be the least reliable one','success would require betraying the principle that once defined them','the truth threatens the only relationship they have managed to preserve']
 },
 'Science Fiction':{
  roles:['memory architect','orbital rescue pilot','xenobiologist','systems engineer','climate modeller'],
  settings:['a city built inside a failing weather shield','a research station drifting beyond lunar orbit','a generation ship approaching an uncharted signal','a corporate colony on a tidally locked world','an underwater data centre storing human memories'],
  goals:['find the source of memories appearing in people who never lived them','bring a stranded crew home before their orbit decays','determine whether an alien signal is a warning or an invitation','stop an autonomous city system from choosing who is allowed to survive','recover a missing consciousness before the network is permanently wiped'],
  pressures:['the system designed to protect the population starts rewriting its own rules','the signal begins responding to private memories instead of transmissions','the rescue window shrinks each time the crew uses life support','the corporation running the colony orders the evidence destroyed','the copied memories begin claiming they are the originals'],
  complications:['their own memories contain gaps matching the anomaly','the missing person is the scientist who ended their career','the only workable solution would erase thousands of stored lives','their closest crewmate may already have been altered by the phenomenon','the system insists they personally authorised the disaster']
 },
 'Comedy':{
  roles:['wedding photographer','struggling restaurateur','junior talent agent','divorce lawyer','local radio host'],
  settings:['a luxury resort hosting two weddings at once','a failing family restaurant during festival week','a film festival where every hotel room is overbooked','a small town competing for a national tourism prize','an expensive wellness retreat they cannot afford'],
  goals:['survive a weekend working for two families who hate each other','fake a successful new life long enough to impress an ex','land one impossible client before their agency fires them','keep a disastrous public mistake from becoming national news','pretend to be part of a couple to secure a career-changing opportunity'],
  pressures:['every lie requires a larger and more public lie to protect it','two rival families keep forcing them into contradictory promises','their supposed professional breakthrough is actually a complete fraud','an accidental viral video turns every private humiliation into content','the one person who can expose them decides to help for entirely selfish reasons'],
  complications:['their ex arrives with the person they are supposed to impress','their most competent rival is also the only person willing to help','their family assumes the fake story is finally proof they have grown up','the client they are deceiving turns out to be unexpectedly decent','the lie starts producing opportunities they genuinely want to keep']
 },
 'Family Adventure':{
  roles:['young amateur cartographer','museum intern','three runaway siblings','apprentice lighthouse keeper','school science-club captain'],
  settings:['an abandoned railway that appears only at dusk','a museum whose closed exhibits lead somewhere impossible','an island omitted from every modern map','a forest growing over a forgotten observatory','a seaside town built above a buried mechanical city'],
  goals:['follow a hidden route to find a missing parent','return a stolen object before their town disappears from the map','reach a legendary observatory before a developer destroys the site','rescue a friend trapped beyond a doorway that opens only once a year','solve the route left in an explorer’s unfinished journal'],
  pressures:['each step of the journey permanently changes the map behind them','a wealthy collector is following the same clues for very different reasons','the magical route is closing earlier every night','the adults trying to help cannot see the places the children can enter','the machine beneath the town has begun waking up'],
  complications:['the final clue suggests the missing parent chose not to come home','one member of the group has secretly been helping their pursuer','finishing the journey may close the magical route forever','the object they are trying to return has become attached to one of them','the person who wrote the clues expected them specifically to find them']
 },
 'Crime Thriller':{
  roles:['courthouse cleaner','internal-affairs detective','financial-crimes investigator','night-shift dispatcher','crime-scene photographer'],
  settings:['a courthouse with a sealed underground jury room','a port city during a police corruption inquiry','a casino preparing for a billion-dollar sale','a precinct scheduled to close in seven days','an evidence warehouse after a citywide blackout'],
  goals:['discover who is still using a room officially sealed for twenty years','identify the officer leaking witness locations to organised crime','trace a missing account that connects judges, police and developers','find the caller who knows details from crimes that were never reported','prove that evidence is being replaced before a murder trial begins'],
  pressures:['every official channel they use alerts someone inside the conspiracy','a professional crew starts cleaning up witnesses faster than they can find them','the money trail leads into institutions meant to investigate it','the anonymous source begins demanding crimes in exchange for information','the case starts collapsing as evidence disappears from secure storage'],
  complications:['their closest colleague appears in the records they uncover','the witness they need is someone they previously helped convict','their own signature is attached to a piece of falsified evidence','the conspiracy is protecting a person they owe their life to','solving the case would expose the secret that got them promoted']
 },
 'Fantasy':{
  roles:['royal cartographer','disgraced court mage','graveyard keeper','young diplomat','monster hunter'],
  settings:['a kingdom whose borders move every night','a city built around a sleeping dragon','an archive containing maps of places that do not yet exist','a valley where the dead return for one day each winter','a shattered empire connected by forbidden gates'],
  goals:['find the missing province that vanished from every map','break the spell binding the capital to a dying monarch','carry a message to a kingdom erased from history','close the gates before an ancient army learns how to cross them','protect a child whose dreams are physically reshaping the world'],
  pressures:['each use of magic removes another memory from the caster','the royal court would rather preserve the lie than save the kingdom','a rival expedition is rewriting the map as quickly as they can follow it','the dead have begun refusing to return to their graves','the creatures guarding the gates remember a war humanity deliberately forgot'],
  complications:['their family helped create the curse they are trying to break','the missing kingdom is where they were actually born','the child they must protect may be causing the disaster intentionally','their enemy is the only person who understands the old magic','saving the kingdom requires destroying the institution they swore to serve']
 }
};
const PREMISE_FIRST_NAMES=['Jack','Mara','Elena','Noah','Leah','Daniel','Nina','Elias','Maya','Theo','Rosa','Adrian','Lena','Jonah','Sofia','Marcus','Amira','Sam','Eva','Miles'];
const PREMISE_LAST_NAMES=['Barry','Voss','Hart','Vale','Mercer','Quinn','Reed','Stone','Chen','Moreau','Shah','Cole','Brooks','North','Bell','Rao','Ward','Park','Okafor','Vega'];
function generatedPremise(st,r,genre){
 const bank=PREMISE_DNA_BANK[genre]||PREMISE_DNA_BANK['Prestige Drama'],name=`${pick(r,PREMISE_FIRST_NAMES)} ${pick(r,PREMISE_LAST_NAMES)}`,role=pick(r,bank.roles),setting=pick(r,bank.settings),goal=pick(r,bank.goals),pressure=pick(r,bank.pressures),complication=pick(r,bank.complications);
 const loglines=[
  `${capPhrase(role)} ${name} must ${goal} in ${setting} as ${pressure}, while ${complication}.`,
  `In ${setting}, ${role} ${name} must ${goal}; ${pressure}, and ${complication}.`,
  `${capPhrase(role)} ${name} enters ${setting} determined to ${goal}, only to discover that ${pressure} — and ${complication}.`
 ];
 const premiseDNA={version:3141,name,role,setting,goal,pressure,complication};
 return {title:uniqueScriptTitle(st,r,genre),logline:pick(r,loglines),shape:{protagonist:`${role} ${name}`,setting,engine:goal},premiseDNA};
}
function premiseReviewContext(s){
 const p=s?.premiseDNA;if(p?.name&&p?.goal)return p;
 return null;
}
function premiseReviewParagraph(f,tier){
 const s=scriptById(f.scriptId),p=premiseReviewContext(s),focus=scriptFocus(s);
 if(!p){
  return variationPick(f,'premise-review-generic-'+tier,[
   `The film is built around ${focus}. Crucially, the finished version treats that premise as dramatic material rather than merely a hook for the trailer.`,
   `What matters here is how ${focus} changes from a logline into scene-by-scene pressure; the better stretches keep the premise active rather than simply explaining it.`,
   `The screenplay's central promise — ${s.logline.replace(/\.$/,'')} — remains visible in the finished film, and the review ultimately turns on how convincingly the production develops that promise.`
  ]);
 }
 const positive=[
  `${p.name}'s attempt to ${p.goal} gives the film a clear dramatic spine. ${capPhrase(p.pressure)} supplies the external pressure, but the more useful complication is that ${p.complication}.`,
  `The premise works because ${p.name} is not simply being pushed through plot. As a ${p.role}, they have to ${p.goal}, while ${p.pressure}; the personal turn — ${p.complication} — keeps the machinery attached to a character.`,
  `${p.setting} is more than backdrop. It forces ${p.name}, a ${p.role}, to pursue a concrete objective — ${p.goal} — while ${p.pressure}. The film gets its personality from the fact that ${p.complication}.`
 ];
 const critical=[
  `The setup is specific enough: ${p.name}, a ${p.role}, must ${p.goal} in ${p.setting} while ${p.pressure}. The problem is that the film does not always make ${p.complication} feel as consequential as the logline promises.`,
  `There is a strong movie buried in the premise of ${p.name} trying to ${p.goal}. ${capPhrase(p.pressure)} should keep tightening the story, but too many scenes treat the complication — ${p.complication} — as information rather than pressure.`,
  `${p.name}'s problem is clear, and ${p.setting} gives it shape, but the film occasionally reduces its opposition to mechanics. ${capPhrase(p.complication)} should be the element making the premise personal; it is not always given enough room.`
 ];
 return variationPick(f,'premise-review-'+tier,(tier==='poor'||tier==='mixed')?critical:positive);
}

function marketBudgetForGenre(r,genre){
 const ranges={
  'Psychological Horror':[4,13],'Prestige Drama':[5,15],'Comedy':[6,17],'Crime Thriller':[8,20],
  'Family Adventure':[12,28],'Action Thriller':[14,34],'Science Fiction':[14,38],'Fantasy':[16,40]
 };
 const [lo,hi]=ranges[genre]||[7,25];return +(lo+r()*(hi-lo)).toFixed(1);
}
function marketScriptPrice(s,r){
 const quality=(s.story+s.hook+s.originality+s.access)/4,writer=writerById?.(s.writerId);
 return +clamp(.14+(quality-45)*.0065+(writer?.fee||.7)*.075+r()*.12,.18,.72).toFixed(2);
}
function sourceRouteLabel(source){return source==='Original Concept'?'Studio Original':source==='Commission'?'Commissioned':source==='Sequel Development'?'Franchise Development':source==='Turnaround'?'Turnaround':source==='Industry Invitation'?'Industry Invitation':'Open Market'}
function sourceControlLabel(source){return source==='Original Concept'?'Maximum control':source==='Commission'?'Guided control':source==='Sequel Development'?'Existing-property control':'Material as written'}

function looksLegacyGeneratedTitle(s){
 if(!s||/^S([1-9]|10)$/.test(s.id||''))return false;
 const title=s.title||'',bits=title.split(/\s+/);
 if(bits.length===2&&titleA.includes(bits[0])&&titleB.includes(bits[1]))return true;
 return /^(No One|Nobody|Someone|Everyone)\b/i.test(title)||/^The (Last|Quiet|Hidden|Broken|Forgotten|Impossible|Unfinished|Other) (Witness|Passenger|House|Map|Signal|Promise|Trial|Road|Season|Room)$/i.test(title)||/^(When|After|Before) the (Lights|Sirens|River|Stars|Music|Letters|Roads|Voices) /i.test(title)||/^A (Map|History|Catalogue|Theory|List|Book|Portrait|Memory) of /i.test(title);
}
function refreshLegacyMarketPresentation(st){
 (st.scripts||[]).filter(s=>s.available&&s.status==='market'&&!s.filmStarted&&looksLegacyGeneratedTitle(s)).forEach(s=>{
  const r=makeRng(hash(st.seed+'|v28-refresh|'+s.id)),concept=generatedPremise(st,r,s.genre);
  s.title=concept.title;s.logline=concept.logline;s.shape=concept.shape;s.premiseDNA=concept.premiseDNA;
 });
}


const PRODUCER_STRATEGIES={
 lean:{name:'Budget-Control Producer',cost:.45,desc:'Keeps the unit disciplined. Improves stability and reduces overrun exposure, but offers little creative upside.',effects:{stability:4,technical:-1}},
 creative:{name:'Creative Producer',cost:.70,desc:'Supports director and cast. Improves performance/direction potential, with slightly looser cost control.',effects:{direction:2,performances:2,stability:-1}},
 commercial:{name:'Commercial Producer',cost:.80,desc:'Pushes clarity, pace and audience accessibility. Useful for broad releases, less helpful to prestige nuance.',effects:{pacing:3,clarity:2,direction:-1}}
};
const EFFECTS_APPROACHES={
 practical:{name:'Practical-first',costRate:.025,desc:'More work is solved in camera. Strong for grounded films; schedule pressure can increase.',effects:{technical:2,performances:1,stability:-1}},
 hybrid:{name:'Hybrid',costRate:.045,desc:'A balanced practical/digital plan with moderate cost and risk.',effects:{technical:3,stability:1}},
 digital:{name:'VFX-forward',costRate:.075,desc:'More ambitious digital execution. Highest technical ceiling, but punishes underfunding.',effects:{technical:5,pacing:1,stability:-2}}
};
function ensureProductionDepth(f){
 if(!f)return f;
 f.supportingCastIds=Array.isArray(f.supportingCastIds)?f.supportingCastIds.filter(Boolean):(f.supportingCastId?[f.supportingCastId]:[]);
 f.supportingCastIds=[...new Set(f.supportingCastIds)].filter(id=>!(f.cast||[]).includes(id));
 f.supportingCastId=f.supportingCastIds[0]||null; // compatibility alias for older saves/systems
 if(!f.producerStrategy)f.producerStrategy='lean';
 if(!f.effectsApproach)f.effectsApproach='hybrid';
 return f;
}
function requiredSupportingRoles(f){
 ensureProductionDepth(f);const b=+(f.budget||0);
 return b>=25?2:b>=12?1:0;
}
function maxSupportingRoles(f){return requiredSupportingRoles(f)>=2?2:1}
function supportingActors(f){ensureProductionDepth(f);return f.supportingCastIds.map(talentById).filter(Boolean)}
function supportingActor(f){return supportingActors(f)[0]||null}
function supportingCastRequirement(f){
 const required=requiredSupportingRoles(f),selected=supportingActors(f).length;
 return {required,selected,max:maxSupportingRoles(f),complete:selected>=required,label:required===0?'Optional ensemble':required===1?'Mid-scale ensemble':'Event-scale ensemble'};
}
function packageTalentIds(f){
 ensureProductionDepth(f);return [f.directorId,...(f.cast||[]),...f.supportingCastIds].filter(Boolean);
}
function packageActors(f){return [...(f.cast||[]),...supportingActors(f).map(t=>t.id)].filter(Boolean).map(talentById).filter(Boolean)}
function setSupportingCast(f,tid){
 ensureProductionDepth(f);ensureFilmRoles(f);const ids=f.supportingCastIds||[],idx=ids.indexOf(tid),t=talentById(tid);
 if(idx>=0){
  const roleId=Object.entries(f.roleAssignments||{}).find(([k,id])=>k.startsWith('support')&&id===tid)?.[0];
  if(roleId)delete f.roleAssignments[roleId];clearTalentContract(f,tid);syncRoleAssignments(f);save();render();return;
 }
 if(ids.length>=maxSupportingRoles(f))return showToast(`This production scale supports ${maxSupportingRoles(f)} supporting role${maxSupportingRoles(f)===1?'':'s'} in the principal package.`);
 const roleId=!f.roleAssignments?.support1?'support1':'support2',role=roleById(f,roleId),decline=talentDeclineForRole(f,tid,roleId);
 if(decline)return showToast(`${t?.name||'That performer'} has already passed on ${role.name}.`);
 const interest=talentProjectInterest(t,f,role,'select');
 if(!interest.accept){markTalentDecline(f,t,roleId,interest.reason,'role');save();render();return}
 f.roleAssignments[roleId]=tid;syncRoleAssignments(f);
 f.history=f.history||[];f.history.push(`${typeof calendarDateLabel==='function'?calendarDateLabel():'Week '+state.week}: ${t.name} attached as ${role.name}.`);
 save();render();
}
function clearSupportingCast(f){
 ensureProductionDepth(f);ensureFilmRoles(f);f.supportingCastIds.forEach(id=>clearTalentContract(f,id));delete f.roleAssignments.support1;delete f.roleAssignments.support2;syncRoleAssignments(f);save();render();
}
function ensembleCampaignStar(f){
 const principals=(f.cast||[]).map(talentById).filter(Boolean).map(t=>{ensureTalentMarketEconomy(t);return actorCommercialDraw(t)}).sort((a,b)=>b-a),support=supportingActors(f).map(t=>actorCommercialDraw(t)).sort((a,b)=>b-a);
 const base=principals.length===1?principals[0]:principals.length?principals[0]*.62+principals[1]*.38:0;
 const bonus=support.slice(0,2).reduce((a,v)=>a+Math.max(0,v-52)*.07,0);
 return clamp(base+Math.min(9,bonus),0,99);
}
function producerStrategy(f){ensureProductionDepth(f);return PRODUCER_STRATEGIES[f.producerStrategy]||PRODUCER_STRATEGIES.lean}
function effectsApproach(f){ensureProductionDepth(f);return EFFECTS_APPROACHES[f.effectsApproach]||EFFECTS_APPROACHES.hybrid}
function productionDepthCost(f){
 const p=producerStrategy(f),e=effectsApproach(f);
 return +(p.cost+(f.budget||0)*e.costRate).toFixed(2);
}

function productionChoiceFeedbackHTML(f){
 ensureProductionDepth(f);const ratio=(f.budget||0)/Math.max(1,scriptById(f.scriptId)?.naturalBudget||1),rows=[];
 rows.push(f.producerStrategy==='creative'?['Creative cover','More room for performance and direction; slightly looser cost control.','good']:f.producerStrategy==='commercial'?['Commercial discipline','More pace and clarity for a broad audience; some creative nuance may be traded away.','warn']:['Budget control','Stronger stability and overrun control; limited creative upside.','blue']);
 rows.push(f.effectsApproach==='digital'&&ratio<.9?['VFX funding risk','The digital ambition is above the budget level the effects plan is comfortable carrying.','bad']:f.effectsApproach==='digital'?['Technical ambition','Higher craft ceiling, with more exposure if schedule or budget slips.','good']:f.effectsApproach==='practical'?['In-camera emphasis','Tangible work can help actors and texture, but puts more pressure on the shooting schedule.','blue']:['Balanced execution','Hybrid effects spread technical risk without chasing the highest ceiling.','blue']);
 return '<div class="card" style="margin-top:12px"><div class="row"><strong>Executive notes</strong><span class="pill blue">Immediate read</span></div>'+rows.map(x=>'<div class="listrow"><div><strong>'+x[0]+'</strong><div class="small">'+x[1]+'</div></div><span class="pill '+x[2]+'">'+(x[2]==='good'?'Upside':x[2]==='bad'?'Risk':x[2]==='warn'?'Trade-off':'Context')+'</span></div>').join('')+'</div>';
}
function filmChoiceCallback(f){
 const m=f.metrics||{},ratio=(f.budget||0)/Math.max(1,scriptById(f.scriptId)?.naturalBudget||1);
 if(f.effectsApproach==='digital'&&ratio<.9)return 'The VFX-forward plan became a visible constraint: the ambition survived, but the funding never fully caught up.';
 if(f.producerStrategy==='creative'&&((m.performances||0)>=78||(m.direction||0)>=78))return 'The Creative Producer choice survived into the finished film as a real performance/directing strength.';
 if(f.producerStrategy==='commercial'&&((m.pacing||0)>=78||(m.clarity||0)>=78))return 'The Commercial Producer choice shows up in the finished film’s pace and clarity.';
 if(f.producerStrategy==='lean'&&(m.stability||0)>=76)return 'The Budget-Control Producer delivered the stronger production stability the studio paid for.';
 return '';
}
function filmOutcomeFactorsHTML(f){
 if(!f?.review)return '';const sc=scriptById(f.scriptId),ratio=(f.budget||0)/Math.max(1,sc?.naturalBudget||1),intel=f.releaseWeek?releaseWindowIntel(f,f.releaseWeek):null,rows=[];
 if(ratio<.8)rows.push(['Underfunded production','Budget was materially below the screenplay’s natural scale.','bad']);else if(ratio>=.95&&ratio<=1.18)rows.push(['Budget fit','Funding stayed close to the material’s natural scale.','good']);
 const cb=filmChoiceCallback(f);if(cb)rows.push(['Production strategy',cb,/constraint/i.test(cb)?'bad':'good']);
 if(intel?.pressure>=.18)rows.push(['Release competition',intel.text,'bad']);else if(intel)rows.push(['Release window',intel.text,'blue']);
 const mr=(f.marketing||0)/Math.max(1,marketingRecommended(f));if(mr<.5)rows.push(['Campaign reach','Marketing was well below the recommended level for this release.','bad']);else if(mr>=.9)rows.push(['Campaign reach','The campaign had enough paid support to convert awareness.','good']);
 if(f.review.audience>=84)rows.push(['Audience word of mouth','Strong audience response supported later-week demand.','good']);else if(f.review.audience<58)rows.push(['Audience word of mouth','Weak audience response left the run exposed after opening.','bad']);
 if(f.releaseProfile?.type==='breakout'||f.releaseProfile?.type==='sleeper')rows.push(['Run shape','Demand expanded beyond the normal opening pattern.','good']);else if(f.releaseProfile?.type==='bomb'||f.releaseProfile?.type==='frontloaded')rows.push(['Run shape','Demand was consumed too quickly for the investment behind the release.','bad']);
 return '<div class="section-title"><h2>Why it happened</h2><span class="small">Major causal signals · not hidden-score disclosure</span></div><div class="card">'+rows.slice(0,6).map(x=>'<div class="listrow"><div><strong>'+x[0]+'</strong><div class="small">'+x[1]+'</div></div><span class="pill '+x[2]+'">'+(x[2]==='good'?'Helped':x[2]==='bad'?'Hurt':'Context')+'</span></div>').join('')+'</div>';
}
function bridgeDebtProjection(q,weeks){return q*1.14*Math.pow(1+(state.finance?.weeklyInterest||0),weeks)}
function bridgeRecoveryContext(){
 const fs=playerFilms().filter(f=>!['complete','shelved'].includes(f.stage)),c=fs.find(f=>f.stage==='cinema');if(c)return c.title+' is already generating theatrical receipts, but the remaining run is uncertain.';
 const d=fs.filter(f=>f.releaseWeek&&f.releaseWeek>=state.week).sort((a,b)=>a.releaseWeek-b.releaseWeek)[0];if(d){const w=d.releaseWeek-state.week;return d.title+' is the nearest dated release, opening in '+w+' week'+(w===1?'':'s')+'.';}
 const late=fs.find(f=>['post','marketing'].includes(f.stage));return late?late.title+' is nearest to release, but no theatrical cash date is committed yet.':'No near-term player film has a committed theatrical cash event.';
}

function applyProductionDepthMetrics(f){
 const p=producerStrategy(f),e=effectsApproach(f);
 Object.entries(p.effects).forEach(([k,v])=>f.metrics[k]=clamp((f.metrics[k]||65)+v,20,98));
 Object.entries(e.effects).forEach(([k,v])=>f.metrics[k]=clamp((f.metrics[k]||65)+v,20,98));
 if(e===EFFECTS_APPROACHES.digital&&f.budget/scriptById(f.scriptId).naturalBudget<.9){f.metrics.technical=clamp(f.metrics.technical-7,20,98);f.metrics.stability=clamp(f.metrics.stability-3,20,98)}
 const support=supportingActors(f);
 support.forEach((actor,i)=>{
  const fit=actorProjectFit(actor,f),weight=i===0?1:.72,boost=((actor.acting-70)*.06+(fit-65)*.07)*weight;
  f.metrics.performances=clamp(f.metrics.performances+boost,20,98);
  f.metrics.chemistry=clamp(f.metrics.chemistry+(fit-65)*.035*weight,20,98);
  f.metrics.stability=clamp(f.metrics.stability+(actor.reliability-70)*.025*weight,20,98);
 });
 if(support.length>=2)f.metrics.chemistry=clamp(f.metrics.chemistry+1.2,20,98);
}
function ensureAvailabilityWatches(st=state){st.availabilityWatches=st.availabilityWatches||[];return st.availabilityWatches}
function watchFilmTalentAvailability(f,ids){
 const list=[...new Set((ids||[]).filter(Boolean))];if(!list.length)return showToast('There is nobody to watch for this project.');
 const watches=ensureAvailabilityWatches(),key=f.id;
 const existing=watches.find(x=>x.filmId===key);
 if(existing)existing.talentIds=list;
 else watches.push({filmId:key,talentIds:list,createdWeek:state.week});
 addNews(state,`${state.studio.name} asked its casting team to monitor availability for ${list.map(id=>talentById(id)?.name).filter(Boolean).join(' and ')} on ${f.title}.`,'Casting');
 save();render();
}
function availabilityWatchForFilm(f){return ensureAvailabilityWatches().find(x=>x.filmId===f.id)||null}
function cancelAvailabilityWatch(f){state.availabilityWatches=ensureAvailabilityWatches().filter(x=>x.filmId!==f.id);save();render()}
function checkAvailabilityWatches(){
 const keep=[];
 ensureAvailabilityWatches().forEach(w=>{
  const f=filmById(w.filmId);if(!f||f.stage!=='development')return;
  const people=w.talentIds.map(talentById).filter(Boolean),ready=people.length&&people.every(t=>!busy(t));
  if(ready){
   notify(`availability:${f.id}:${state.week}`,`${f.title}: talent now available`,`${people.map(t=>t.name).join(' and ')} ${people.length===1?'is':'are'} now available for the project.`,f.id,true,'info');
   addNews(state,`${people.map(t=>t.name).join(' and ')} ${people.length===1?'is':'are'} now available for ${f.title}.`,'Casting');
  }else keep.push(w);
 });
 state.availabilityWatches=keep;
}
function heldProjectWeeklyCost(f){return f.paused?.012:0}
function heldProjectCostLabel(){return '$12k/week'}
function returningTalentToWatch(f){
 if(!f.ipParentId)return [];
 const parent=filmById(f.ipParentId);return (parent?.cast||[]).map(talentById).filter(t=>t&&busy(t));
}


function releaseOutcomeProfile(f,audience,awareness,r){
 const expectation=campaignExpectationPenalty(f,audience),marketingRatio=f.marketing/Math.max(1,marketingRecommended(f));
 // Commercial extremes stay conditional on the package. v4.0a.4 broadens the middle failure/sleeper
 // cases so strong AI packaging does not make almost every release narratively 'standard'.
 let bombChance=.055;
 if(audience<62)bombChance+=.045;
 if(audience<52)bombChance+=.065;
 if(expectation>4)bombChance+=.050;
 if(marketingRatio<.45)bombChance+=.035;
 if(awareness>72&&audience<68)bombChance+=.025;
 let breakoutChance=.015;
 if(audience>=82)breakoutChance+=.032;
 if(audience>=90)breakoutChance+=.040;
 if((f.audienceSegments?.['Genre Fans']||0)>=90)breakoutChance+=.020;
 let sleeperChance=0;
 if(audience>=80)sleeperChance+=.045;
 if(audience>=86)sleeperChance+=.035;
 if(audience>=80&&awareness<62)sleeperChance+=.030;
 if(marketingRatio<.72&&audience>=83)sleeperChance+=.020;
 let frontloadChance=0;
 if(audience<68)frontloadChance+=.055;
 if(awareness>=66&&audience<74)frontloadChance+=.060;
 if(expectation>4)frontloadChance+=.045;
 if(marketingRatio>1.05&&audience<72)frontloadChance+=.030;
 bombChance=clamp(bombChance,.025,.30);breakoutChance=clamp(breakoutChance,.01,.18);sleeperChance=clamp(sleeperChance,0,.16);frontloadChance=clamp(frontloadChance,0,.18);
 const x=r();
 let type='standard',openingMult=.68+r()*.34,legsBias=0;
 if(x<bombChance){type='bomb';openingMult=.28+r()*.30;legsBias=-.13}
 else if(x>1-breakoutChance){type='breakout';openingMult=1.02+r()*.21;legsBias=.09}
 else if(r()<sleeperChance){type='sleeper';openingMult=.60+r()*.15;legsBias=.18}
 else if(r()<frontloadChance){type='frontloaded';openingMult=.98+r()*.17;legsBias=-.14}
 return {type,openingMult,legsBias,bombChance,breakoutChance,sleeperChance,frontloadChance,awareness:+awareness.toFixed(1)};
}
function buildTheatricalRun(f,opening,audience,audienceContext,r,intlMult,profile=null){
 profile=profile||releaseOutcomeProfile(f,audience,0,r);
 opening=clamp(opening*profile.openingMult,.05,96);
 const baseWom=clamp((audience-65)/40+(audienceContext?.nicheWom||0)+profile.legsBias,-.82,.56);
 const dom=[opening];
 for(let i=1;i<7;i++){
  const weekNoise=(r()-.5)*.095;
  let drop=.615-baseWom*.65+i*.021+weekNoise;
  if(profile.type==='sleeper'&&i===1)drop-=.30;else if(profile.type==='sleeper'&&i===2)drop-=.18;
  if(profile.type==='breakout'&&i===1)drop-=.10;
  if(profile.type==='bomb'&&i===1)drop+=.11;
  drop=clamp(drop,-.22,.90);
  dom.push(Math.max(.03,dom[i-1]*(1-drop)));
 }
 const intl=dom.map((x,i)=>x*intlMult*(.86+r()*.22)*(profile.type==='bomb'&&i===0?.91:1));
 return {
  profile,
  dom,
  intl,
  plan:dom.map((d,i)=>({week:i+1,dom:d,intl:intl[i],drop:i===0?null:1-d/dom[i-1]}))
 };
}
function filmRowAtWorldWeek(f,worldWeek){
 return (f.weeklyResults||[]).find(w=>(w.worldWeek??((f.releaseWeek||worldWeek)+w.week-1))===worldWeek)||null;
}
function boxRankAtWeek(f,worldWeek){
 const own=filmRowAtWorldWeek(f,worldWeek);if(own?.settledRank)return own.settledRank;
 const rows=state.films.map(x=>({film:x,row:filmRowAtWorldWeek(x,worldWeek)})).filter(x=>x.row).sort((a,b)=>b.row.dom-a.row.dom);
 const idx=rows.findIndex(x=>x.film.id===f.id);return idx>=0?idx+1:null;
}
function settleBoxOfficeWeek(worldWeek){
 const rows=state.films.map(f=>({film:f,row:filmRowAtWorldWeek(f,worldWeek)})).filter(x=>x.row).sort((a,b)=>b.row.dom-a.row.dom||b.row.intl-a.row.intl||a.film.id.localeCompare(b.film.id));
 rows.forEach((x,i)=>{x.row.settledRank=i+1;x.row.settledWeek=worldWeek});
 rows.forEach(({film})=>{
  film.numberOneWeeks=(film.weeklyResults||[]).filter(w=>w.settledRank===1).length;
  if(film.stage==='complete'&&film.legacy?.built)buildFilmLegacy(film,{});
 });
 return rows;
}
function boxRunStats(f){
 const results=f.weeklyResults||[];
 const ranks=results.map(w=>({week:w.worldWeek??((f.releaseWeek||0)+w.week-1),rank:w.settledRank||null})).filter(x=>x.rank);
 const current=ranks.at(-1)?.rank||null,previous=ranks.length>1?ranks.at(-2).rank:null;
 const best=ranks.length?Math.min(...ranks.map(x=>x.rank)):null,weeksAtOne=ranks.filter(x=>x.rank===1).length;
 return {ranks,current,previous,best,weeksAtOne,change:current&&previous?previous-current:0};
}
function weekendTrackingLabel(row){
 const dom=row?.dom||0;
 if(dom>=42)return 'Event-level';
 if(dom>=26)return 'Very strong';
 if(dom>=15)return 'Strong';
 if(dom>=8)return 'Moderate';
 if(dom>=3)return 'Soft';
 return 'Very soft';
}
function breakEvenWorldwideEstimate(f){
 // Approximate theatrical + ancillary studio share; shown as a planning marker, not an accounting guarantee.
 return Math.max(1,(f.investment||0)/.405);
}
function theatricalPace(f){
 const gross=(f.weeklyResults||[]).reduce((a,w)=>a+w.dom+w.intl,0),be=breakEvenWorldwideEstimate(f),ratio=gross/be;
 if(f.releaseProfile?.type==='bomb')return {label:'Bombing',cls:'bad',text:'The release has fallen materially below pre-release expectations.'};
 if(f.releaseProfile?.type==='breakout')return {label:'Breakout',cls:'good',text:'Demand is running ahead of the normal model for this release.'};
 if(f.releaseProfile?.type==='sleeper')return {label:'Sleeper',cls:'good',text:'Word of mouth is expanding the run beyond its opening footprint.'};
 if(ratio>=1.15)return {label:'Ahead of break-even pace',cls:'good',text:'Current worldwide gross is comfortably ahead of the film’s rough theatrical recovery marker.'};
 if(ratio>=.65)return {label:'In the fight',cls:'blue',text:'The film is still building toward its rough recovery marker.'};
 return {label:'Under pressure',cls:'warn',text:'The run needs stronger holds or ancillary value to recover its investment.'};
}
function boxMovementHTML(change){
 if(change>0)return `<span class="boxmove up">▲ ${change}</span>`;
 if(change<0)return `<span class="boxmove down">▼ ${Math.abs(change)}</span>`;
 return `<span class="boxmove flat">—</span>`;
}
function boxOfficeMilestones(f){
 const s=boxRunStats(f),gross=(f.weeklyResults||[]).reduce((a,w)=>a+w.dom+w.intl,0),out=[];
 if(s.weeksAtOne>=2)out.push(`${s.weeksAtOne} weeks at #1`);
 else if(s.weeksAtOne===1)out.push('Reached #1');
 if(s.best&&s.best<=3)out.push(`Peak #${s.best}`);
 if(f.weeklyResults?.some(w=>w.drop!==null&&w.drop<0))out.push('Weekend growth');
 if(f.weeklyResults?.some(w=>w.drop!==null&&w.drop<.20))out.push('Exceptional legs');
 if(f.releaseProfile?.type==='bomb')out.push('Box-office bomb');
 if(f.releaseProfile?.type==='breakout')out.push('Breakout run');
 if(gross>=100)out.push('$100m+ worldwide');
 if(gross>=250)out.push('$250m+ worldwide');
 return out;
}

function generateBoxOfficeWeekPress(){
 const chart=currentBoxChart();if(!chart.length)return;
 state.boxOfficeMemory=state.boxOfficeMemory||{leaderId:null,streak:0,lastWeek:0};
 const leader=chart[0],m=state.boxOfficeMemory;
 if(m.lastWeek===state.week)return;
 if(m.leaderId===leader.id)m.streak=(m.streak||0)+1;else{m.leaderId=leader.id;m.streak=1}
 m.lastWeek=state.week;
 const f=filmById(leader.id);
 if(m.streak===1&&f?.cinemaWeek>1)addNews(state,`${leader.title} climbs into the #1 domestic position in Theatrical Week ${leader.week}, overtaking newer competition.`,'Box Office Alert');
 if(m.streak===2)addNews(state,`${leader.title} remains #1 for a second straight week, taking ${money(leader.gross)} domestic despite fresh competition.`,'Box Office Alert');
 if(m.streak===3)addNews(state,`${leader.title} completes a third consecutive week at #1. The release has moved beyond a strong opening and into genuine event-run territory.`,'Box Office Alert');
 if(m.streak===4)addNews(state,`${leader.title} refuses to give up the top spot, extending its domestic #1 streak to four weeks.`,'Box Office Alert');
}
