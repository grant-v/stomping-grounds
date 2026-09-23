// One object per My War episode, oldest first. `stats` is an ordered list of [label, value, highlight?].
// Only put numbers here that a source actually states — leave the rest out.
// approx: true  = pinned at city/neighbourhood level (hollow pin, wider 3D view).
// no lat/lng    = spot never identified; shows in the list with stats + video but has no pin.
// camera        = optional per-spot 3D framing: { tilt, range (metres), heading }.
var EL_TORO = { lat: 33.6378, lng: -117.68909, camera: { tilt: 72, range: 135, heading: -30 } };
var CLIPPER = { lat: 37.74936, lng: -122.43282 };

window.MYWAR = [
  {
    skater: 'Dane Burman',
    title: 'My War: Dane Burman',
    trick: '50-50 grind',
    spot: 'Municipal Services Building kinked rail',
    city: 'Philadelphia, Pennsylvania', country: 'USA',
    lat: 39.95413, lng: -75.1644,
    year: 2015, youtubeId: 'Y-zYVtwaGCo',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-dane-burman/',
    stats: [
      ['Battle span', 'A few months'],
      ['Filmed for', 'Zero "Cold War" (2013) — ender'],
      ['Earned', 'Thrasher cover, December 2013']
    ],
    summary: 'Dane wages a months-long war on the giant Philly Municipal rail for his last trick in Zero\'s Cold War — a stunt Thrasher calls one of the gnarliest of all time.'
  },
  {
    skater: 'Dave Bachinsky',
    title: 'My War: Dave Bachinsky',
    trick: 'Kickflip',
    spot: 'El Toro 20',
    city: 'Lake Forest, California', country: 'USA',
    lat: EL_TORO.lat, lng: EL_TORO.lng, camera: EL_TORO.camera,
    year: 2015, youtubeId: 'SR02gR-G1ok',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-dave-bachinsky/',
    stats: [
      ['Stairs', '20', true],
      ['Landed', '2006'],
      ['Episode', 'Retrospective, released 2015']
    ],
    summary: 'A look back at Bachinsky\'s game-changing 2006 kickflip down the El Toro 20, one of the landmark tricks in street skating history.'
  },
  {
    skater: 'Arto Saari',
    title: 'My War: Arto Saari',
    trick: 'Backside lipslide',
    spot: 'Double-set double-kink rail (school undisclosed)',
    city: 'San Pedro, Los Angeles, California', country: 'USA',
    lat: 33.7358518, lng: -118.2922934, approx: true,
    year: 2015, youtubeId: 'WdpA-Xhr98A',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-arto-saari/',
    stats: [
      ['Filmed for', 'Alien Workshop "Mind Field" (2009) — opener'],
      ['Injuries', 'Hit his head on the kinker'],
      ['Eyewitness', 'Terry Kennedy'],
      ['Later', 'Same rail hosted Bust or Bail "Trouble at the Double" (2019)']
    ],
    summary: 'One of the heaviest handrail stunts of all time, retold with an eyewitness account from Terry Kennedy. The trick is identified from Thrasher\'s later references to "Arto\'s back lip".'
  },
  {
    skater: 'Jamie Thomas',
    title: 'My War: Jamie Thomas',
    trick: 'Impossible to frontside 50-50',
    spot: 'Clipper hubba (James Lick Middle School)',
    city: 'San Francisco, California', country: 'USA',
    lat: CLIPPER.lat, lng: CLIPPER.lng,
    year: 2015, youtubeId: 'Y7ebSFQpB-g',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-jamie-thomas/',
    stats: [
      ['Trips', '5', true],
      ['Age', 'Closing in on 40'],
      ['Filmed for', 'Zero "Cold War" (2013) — ender']
    ],
    summary: 'Nearing 40 with an untouchable legacy, The Chief still battled over five visits for his Cold War ender at Clipper.'
  },
  {
    skater: 'Tommy Sandoval',
    title: 'My War: Tommy Sandoval',
    trick: 'Frontside flip',
    spot: 'Valencia Park Elementary 20 stair',
    city: 'San Diego, California', country: 'USA',
    lat: 32.7018, lng: -117.0701,
    year: 2015, youtubeId: 'pD1vL2J_u6Q',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-tommy-sandoval/',
    stats: [
      ['Stairs', '20', true],
      ['Filmed for', 'Zero "Cold War" (2013) — last part'],
      ['Spot ID', 'The only San Diego 20-stair among Cold War\'s tagged spots — Thrasher never names it']
    ],
    summary: 'With the Cold War deadline looming, Tommy targeted a 20 set in San Diego to lock in last part with a frontside flip.'
  },
  {
    skater: 'Chris Joslin',
    title: 'My War: Chris Joslin',
    trick: '360 flip (tre flip)',
    spot: 'Davis Gap (by Roessler Hall, UC Davis)',
    city: 'Davis, California', country: 'USA',
    lat: 38.53699, lng: -121.75167,
    year: 2016, youtubeId: 'ukcmncNJKy8',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-chris-joslin/',
    stats: [
      ['Attempts', '12', true],
      ['Filmed for', 'Plan B "True" (2014) — ender']
    ],
    summary: 'Joslin turned the world upside down with a 360 flip over the mountainous Davis gap; the episode shows every attempt of how it went down.'
  },
  {
    skater: 'Don "Nuge" Nguyen',
    title: 'My War: Nuge\'s Hill Bomb',
    trick: 'Hill bomb',
    spot: 'Baxter Street',
    city: 'Los Angeles, California', country: 'USA',
    lat: 34.0915152, lng: -118.2549956,
    camera: { tilt: 72, range: 260, heading: 60 },
    year: 2016, youtubeId: 'lmJ73LWSgq0',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-nuge-s-hill-bomb/',
    stats: [
      ['Grade', '~32%', true],
      ['Dared by', 'Neckface'],
      ['The hill', 'One of the steepest streets in the US — the block between N Alvarado and Allesandro'],
      ['Heckle', 'A kid yelled "You\'re going to die!" before the bomb'],
      ['The law', 'Hill bombing has been banned in LA since 2012 — $250 fine']
    ],
    summary: 'Neckface brought Nuge to the steepest hill he could find in LA and dared him to bomb it. Never bet against Nuge.'
  },
  {
    skater: 'Black Dave',
    title: 'My War: Black Dave',
    trick: 'Frontside bluntslide',
    spot: 'Spot across from the World Trade Center (now unskateable)',
    city: 'New York City, New York', country: 'USA',
    lat: 40.7127, lng: -74.0134, approx: true,
    year: 2016, youtubeId: 'Eg6WIDZ2Yqo',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-black-dave/',
    stats: [
      ['Injuries', 'One vicious slam'],
      ['Spot status', 'No longer skateable']
    ],
    summary: 'After one of the worst slams you\'ll ever see, Dave went back to the same spot and rode away.'
  },
  {
    skater: 'Justin "Figgy" Figueroa',
    title: 'My War: Justin "Figgy" Figueroa',
    spot: 'Muirlands Middle School 14-stair rail',
    city: 'La Jolla, San Diego, California', country: 'USA',
    lat: 32.83312, lng: -117.26886,
    year: 2016, youtubeId: 'fVF6g-u7oEQ',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-justin-figgy-figueroa/',
    stats: [
      ['Stairs', '14', true]
    ],
    summary: 'Nobody puts up a fight like Figgy: he takes the big hits and refuses to give in until four wheels hit the \'crete.'
  },
  {
    skater: 'Ryan Decenzo',
    title: 'My War: Ryan Decenzo',
    trick: 'Kickflip',
    spot: 'Infamous San Francisco double set',
    city: 'San Francisco, California', country: 'USA',
    lat: 37.7749, lng: -122.4194, approx: true,
    year: 2017, youtubeId: 'NyFNX2GKOA0',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-ryan-decenzo/',
    stats: [
      ['Before him', 'Only ollied — Diego Bucchieri, 1999'],
      ['Pushed by', 'Jake Phelps'],
      ['Verdict', 'Andrew Reynolds: probably the biggest kickflip of all time']
    ],
    summary: 'A San Francisco double set that had only ever been ollied gets one of the biggest kickflips of all time.'
  },
  {
    skater: 'Jamie Foy',
    title: 'My War: Jamie Foy',
    trick: 'Frontside crooked grind',
    spot: 'El Toro 20 rail',
    city: 'Lake Forest, California', country: 'USA',
    lat: EL_TORO.lat, lng: EL_TORO.lng, camera: EL_TORO.camera,
    year: 2017, youtubeId: 'Ofhz8VgQ6Ho',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-jamie-foy/',
    stats: [
      ['Stairs', '20', true],
      ['Filmed for', 'Ty Evans\' "The Flat Earth" (2017)'],
      ['Earned', 'Thrasher cover, January 2018 · 2017 Skater of the Year']
    ],
    summary: 'El Toro has been a benchmark since Heath Kirchart\'s lipslide in The End; Foy\'s front crook down the 20-stair rail is still hard to comprehend.'
  },
  {
    skater: 'Gabriel Summers',
    title: 'My War: Gabriel Summers',
    trick: 'Frontside 50-50',
    spot: 'Rail with parked cars in the landing',
    city: 'Sydney', country: 'Australia',
    lat: -33.8688, lng: 151.2093, approx: true,
    year: 2018, youtubeId: 'ZuJnqdKbsBc',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-gabriel-summers/',
    stats: [
      ['Battle span', 'About 6 months'],
      ['Casualties', 'Broken boards; slams into parked cars']
    ],
    summary: 'Gabbers engages in a gruesome, months-long confrontation with a rail that pushed him to his mental and physical limits.'
  },
  {
    skater: 'Chase Webb',
    title: 'My War: Chase Webb',
    trick: '50-50 and boardslide',
    spot: '"Super mutant" multi-kink rail',
    year: 2018, youtubeId: '4rJI7ty-3YI',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-chase-webb-2/',
    stats: [
      ['Battle span', 'Several days'],
      ['Landed', 'Final day, with an hour of sunlight left']
    ],
    summary: 'A super mutant rail that has no business being skated; Chase launched himself into the history books with a one-two punch.'
  },
  {
    skater: 'Miles Silvas',
    title: 'My War: Miles Silvas',
    trick: 'Single-take marathon line',
    spot: 'Wilshire Blvd, Koreatown',
    city: 'Los Angeles, California', country: 'USA',
    lat: 34.0618, lng: -118.305,
    camera: { tilt: 68, range: 420, heading: 90 },
    year: 2018, youtubeId: 'Tr2kaIKBInM',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-miles-silvas/',
    stats: [
      ['City blocks', '7', true],
      ['Line length', '~5 min', true],
      ['Distance', 'About a mile — Wilshire/Normandie to Wilshire/Western'],
      ['Filmed for', 'adidas "One Stop" (dir. Colin Kennedy)']
    ],
    summary: 'Miles\' marathon one-take line is a battle of mental endurance as much as skill; a behind-the-scenes look at a truly amazing feat.'
  },
  {
    skater: 'Pedro Delfino',
    title: 'My War: Pedro Delfino',
    trick: 'Backside boardslide',
    spot: 'House banister, Ingleside',
    city: 'San Francisco, California', country: 'USA',
    lat: 37.7233, lng: -122.453, approx: true,
    year: 2018, youtubeId: 'yk2VP_iDxOY',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-pedro-delfino-2/',
    stats: [
      ['Earned', 'Thrasher cover, February 2018 (photo: Jon Spitzer)'],
      ['Approach', 'Carved down a steep grade, then leaped onto the house']
    ],
    summary: 'Pedro carved down a steep grade and leaped onto somebody\'s house for one of the best Thrasher covers of all time.'
  },
  {
    skater: 'Chris Joslin',
    title: 'My War: Chris Joslin',
    trick: 'Blizzard flip (backside 360 kickflip)',
    spot: 'Cologne Cathedral stairs (Domplatte)',
    city: 'Cologne', country: 'Germany',
    lat: 50.9413, lng: 6.9583,
    year: 2018, youtubeId: 'ZYNcoe2xgu4',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-chris-joslin-2/',
    stats: [
      ['Up against', 'Bad weather, crowds, security, injuries']
    ],
    summary: 'Chris stomps an epic blizzard flip over and over at the Cologne Cathedral stairs, yet a roll-away requires an all-out war.'
  },
  {
    skater: 'Zion Wright',
    title: 'My War: Zion Wright',
    trick: 'Half Cab backside Smith grind',
    spot: 'Hollywood High 16',
    city: 'Hollywood, Los Angeles, California', country: 'USA',
    lat: 34.10003, lng: -118.33889,
    year: 2018, youtubeId: 'JoFSMvn64r0',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-zion-wright/',
    stats: [
      ['Stairs', '16', true]
    ],
    summary: 'Zion took a ludicrously gnarly trick to one of skateboarding\'s most iconic proving grounds, the Hollywood High 16.'
  },
  {
    skater: 'Clive Dixon',
    title: 'My War: Clive Dixon',
    trick: 'Boardslide',
    spot: 'Rail between the Mojave water tanks',
    city: 'Mojave, California', country: 'USA',
    lat: 35.006176, lng: -118.15702,
    camera: { tilt: 70, range: 220, heading: -30 },
    year: 2019, youtubeId: '1AazV1J6uQQ',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-clive-dixon/',
    stats: [
      ['Earned', 'Thrasher cover (photo: Michael Burnett)'],
      ['Homage to', 'Jeremy Wray\'s water tower gap']
    ],
    summary: 'A palm-sweating, high-consequence boardslide between desert water tanks that harkens back to Jeremy Wray atop a water tower.'
  },
  {
    skater: 'Milton Martinez',
    title: 'My War: Milton Martinez',
    trick: 'Kickflip off the roof into the bank',
    spot: 'Sunset Carwash',
    city: 'Hollywood, Los Angeles, California', country: 'USA',
    lat: 34.098194, lng: -118.363106,
    year: 2020, youtubeId: 'BAqNOneGRiM',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-milton-martinez/',
    stats: [
      ['Battle span', 'Years — first attempt mid-2010s, landed 2019'],
      ['Injuries', 'Broke his ankle/leg on an earlier ollie attempt here'],
      ['Filmed for', 'Volcom/Creature "¡Demolición!" — ender'],
      ['Earned', 'Thrasher cover, December 2019 · 2019 Skater of the Year'],
      ['Heat', 'Police showed up mid-battle'],
      ['Spot status', 'Blocked with a guardrail in 2021']
    ],
    summary: 'From the history of the Car Wash to broken bones and creeping cops, Milton\'s roof-to-bank kickflip is a My War for the ages.'
  },
  {
    skater: 'Miles Silvas',
    title: 'My War: Miles Silvas vs Wallenberg',
    trick: 'Switch backside heelflip',
    spot: 'Wallenberg four block',
    city: 'San Francisco, California', country: 'USA',
    lat: 37.78014, lng: -122.44664,
    year: 2020, youtubeId: 'W1-Kyv3M33w',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-miles-silvas-2/',
    stats: [
      ['Trips', '5', true],
      ['Years at war', '4', true],
      ['Landed', 'Nov 9, 2019'],
      ['The gap', '4 blocks — ~4 ft 5 in high, ~16 ft 6 in long'],
      ['Status', 'NBD at Wallenberg']
    ],
    summary: 'Five trips, four years and one epic switch back heel crossed off the NBD list; Miles\' Wallenberg victory didn\'t come easy.'
  },
  {
    skater: 'Sammy Baca',
    title: 'My War: Sammy Baca',
    trick: 'Noseslide nollie shove-it out',
    spot: 'Large curved handrail',
    city: 'Los Angeles, California', country: 'USA',
    lat: 34.0522, lng: -118.2437, approx: true,
    year: 2020, youtubeId: 'WHASYE2e5Xo',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-sammy-baca/',
    stats: [
      ['Bus trips', '27', true],
      ['Years at war', '~2', true],
      ['Commute', 'Every trip by bus from Las Vegas'],
      ['Filmed for', 'Baker 4 (2019) — ender']
    ],
    summary: 'Baca got broke off going big for Baker 4; twenty-seven bus trips from Vegas finally paid off in the end.'
  },
  {
    skater: 'Beagle',
    title: 'My War: Beagle',
    city: 'Los Angeles area, California', country: 'USA',
    lat: 34.0522, lng: -118.2437, approx: true,
    year: 2020, youtubeId: 'SB9ldNNL2zU',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-beagle/',
    stats: [
      ['Filmed for', 'Baker 4 (2019) — ender'],
      ['Day job', 'Baker\'s filmer']
    ],
    summary: 'Baker\'s filmer lifts his "trick curse" with his epic Baker 4 ender: a real skate filmer doesn\'t just document the battles, he fights them too.'
  },
  {
    skater: 'Zane Timpson',
    title: 'My War: Zane Timpson',
    trick: 'Frontside 360 ollie',
    spot: 'Hunters Point Sundial',
    city: 'San Francisco, California', country: 'USA',
    lat: 37.7329, lng: -122.38365,
    year: 2020, youtubeId: '53FVtRJlmvc',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-zane-timpson/',
    stats: [
      ['Injuries', 'Bloody slams — "you gotta be willing to bleed"']
    ],
    summary: 'Zane respects the legacy of the Hunters Point Sundial and adds to its history with the heaviest huck so far.'
  },
  {
    skater: 'Ronnie Sandoval',
    title: 'My War: Ronnie Sandoval',
    trick: 'Drop from a ledge into a steep bank',
    spot: 'Glendale Blvd bank',
    city: 'Glendale, California', country: 'USA',
    lat: 34.12158, lng: -118.25673,
    year: 2021, youtubeId: 'CzmwGZ3Ohpc',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-ronnie-sandoval/',
    stats: [
      ['Sessions', 'Multiple return sessions'],
      ['Injuries', 'Heavy road rash — wore a jacket and gloves on later days']
    ],
    summary: 'Ronnie battles a chaotic drop to bank, losing his skin and sanity in the process. The Old Man woulda loved this one.'
  },
  {
    skater: 'Gabriel Summers',
    title: 'My War: Gabriel Summers',
    trick: 'Boardslide',
    spot: 'Four-kink handrail',
    year: 2022, youtubeId: 'nLY-kH9n_tY',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-gabriel-summers-2/',
    stats: [
      ['Hours', '40', true],
      ['Trips', '10', true],
      ['Kinks', '4', true],
      ['Broken collarbones', '1', true],
      ['Battle span', 'About 6 months'],
      ['Near-makes', 'Stomped it 5–6 times without rolling away'],
      ['His own count', '"Probably 12 or 15" visits, per his Slam interview'],
      ['The rail', 'At an abandoned apartment block; capped with a pillar in the way until Dane Burman helped make it skateable'],
      ['Filmed for', 'Zero "Damn It All" (2019) — ender']
    ],
    summary: 'Forty hours, ten trips, four kinks and one broken collarbone are just part of the saga of Gabbers\' fight for his Damn It All ender.'
  },
  {
    skater: 'Alex Midler',
    title: 'My War: Alex Midler',
    trick: 'Kickflip backside lipslide',
    spot: 'Double-set double-kink rail (school undisclosed)',
    city: 'San Pedro, Los Angeles, California', country: 'USA',
    lat: 33.7358518, lng: -118.2922934, approx: true,
    year: 2022, youtubeId: 'SSpr7Evz1zc',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-alex-midler/',
    stats: [
      ['Event', 'Thrasher Bust or Bail "Trouble at the Double" (2019)'],
      ['Window', 'School allowed the skate-stoppers off for one day only'],
      ['Same rail as', 'Arto Saari\'s Mind Field back lip']
    ],
    summary: 'Arto set the bar and Midler raised it, attacking and sacking the famed double kinker for Bust-or-Bail glory.'
  },
  {
    skater: 'Ryan Sheckler',
    title: 'My War: Ryan Sheckler',
    trick: 'Frontside flip (bungee tow-in)',
    spot: 'The "Euro gap"',
    city: 'Burbank, California', country: 'USA',
    lat: 34.1812089, lng: -118.307201, approx: true,
    year: 2023, youtubeId: 'dDTlAieAbgo',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-ryan-sheckler/',
    stats: [
      ['Trips', '3', true],
      ['Broken bungees', '2', true],
      ['Heat', '100°F', true],
      ['Injuries', 'Torn ACL'],
      ['Before him', 'Pedro Delfino ollied into the gap first'],
      ['Aftermath', 'Drew blood trying to ollie back down it after the make'],
      ['Filmed for', 'Red Bull "LIFER" (2023)']
    ],
    summary: 'Two broken bungees, 100-degree heat and a torn ACL tried to keep Ryan from riding away on this three-trip battle.'
  },
  {
    skater: 'Rob Pace',
    title: 'My War: Rob Pace',
    trick: 'Three rails in one line',
    spot: 'Yonkers triple rail',
    city: 'Yonkers, New York', country: 'USA',
    lat: 40.9312099, lng: -73.8987469, approx: true,
    year: 2023, youtubeId: 'rZVAwWPfEC8',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-rob-pace/',
    stats: [
      ['Rails', '3', true],
      ['Trips', 'Multiple return trips'],
      ['Filmed for', 'Santa Cruz "F#$% Em" (2023)'],
      ['Location source', 'Santa Cruz names it the Yonkers triple rail; Thrasher doesn\'t say'],
      ['Obstacles', 'Flew into the wrong city; an irate park employee'],
      ['Sparked by', 'A post from Meinholz']
    ],
    summary: 'A post from Meinholz got Rob going to take down three rails in one rip — through a wrong-city landing, an irate park employee and multiple return trips.'
  },
  {
    skater: 'David Reyes',
    title: 'My War: David Reyes vs Clipper',
    trick: '360 flip noseblunt slide',
    spot: 'Clipper hubba (James Lick Middle School)',
    city: 'San Francisco, California', country: 'USA',
    lat: CLIPPER.lat, lng: CLIPPER.lng,
    year: 2023, youtubeId: 'fv2XXUnUh-c',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-david-reyes/',
    stats: [
      ['Trips', '6', true],
      ['Attempts', 'Hundreds', true],
      ['First session', '2 hours'],
      ['Incident', 'A literal pistol whipping'],
      ['Filmed for', 'Thank You Skateboards part — ender'],
      ['Status', 'NBD at Clipper']
    ],
    summary: 'A two-hour session at Clipper was just the first of six trips; hundreds of attempts and a literal pistol whipping all played their part in this ender saga.'
  },
  {
    skater: 'Ethan Loy',
    title: 'My War: Ethan Loy',
    spot: 'Brick Banks, Los Angeles Mall',
    city: 'Downtown Los Angeles, California', country: 'USA',
    lat: 34.05364, lng: -118.24173,
    year: 2025, youtubeId: 'aiJLTpF2i9k',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-ethan-loy/',
    stats: [
      ['Sessions', '26', true],
      ['Filmed for', '"Avalon" part (Thrasher, 2024)'],
      ['Record', 'Thrasher: perhaps the longest battle in My War history']
    ],
    summary: 'In perhaps the longest battle of My War history, Ethan pushes through 26 grueling sessions against LA\'s most maddening bricks.'
  },
  {
    skater: 'Chris Joslin',
    title: 'My War: Chris Joslin vs El Toro',
    trick: '360 flip (tre flip)',
    spot: 'El Toro 20',
    city: 'Lake Forest, California', country: 'USA',
    lat: EL_TORO.lat, lng: EL_TORO.lng, camera: EL_TORO.camera,
    year: 2025, youtubeId: 'jH7rLKQHBgg',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-chris-joslin-el-toro/',
    stats: [
      ['Stairs', '20', true],
      ['Years at war', '~9', true],
      ['Sessions', '3', true],
      ['Boards snapped', '2', true],
      ['Attempts', 'No official count published'],
      ['First attempts', 'c. 2016, age 19 (sources range 2016–18)'],
      ['Landed', 'Fall 2025, age 29'],
      ['Filmed for', 'His "G-Ma" video part'],
      ['Status', 'NBD — first 360 flip down El Toro'],
      ['Injuries', 'Badly swollen hip (first session)'],
      ['In his corner', 'Ryan Sheckler (second session)'],
      ['Earned', 'Thrasher cover, issue #544 (photo: Atiba Jefferson) · 2025 Skater of the Year']
    ],
    summary: 'Joslin first threw a 360 flip down El Toro as a teenager, snapping two boards and wrecking his hip. A second session with Sheckler on hand ended in a shaky, disputed landing. Nine years after the first try he went back and rode away clean — the clip that landed him the Thrasher cover and Skater of the Year.'
  },
  {
    skater: 'Jace De Tomasso',
    title: 'My War: Jace De Tomasso vs Costco Gap',
    trick: 'Switch ollie',
    spot: 'Costco Gap',
    city: 'Laguna Niguel, California', country: 'USA',
    lat: 33.55618, lng: -117.67856,
    camera: { tilt: 72, range: 180, heading: -30 },
    year: 2026, youtubeId: 'r7c4YNWO8DU',
    thrasherUrl: 'https://www.thrashermagazine.com/articles/videos/my-war-jace-de-tomasso/',
    stats: [
      ['The gap', '~14 ft', true],
      ['Earned', 'Thrasher cover, issue #554 (September 2026)'],
      ['History', 'First new trick here since Ryan Sheckler\'s 2008 kickflip']
    ],
    summary: 'Made famous by Ryan Sheckler, the Costco gap lay dormant for years until Jace\'s towering switch ollie landed him on the cover of the mag.'
  }
];
