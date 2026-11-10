const SPORT_MAP = {
  Soccer: 'soccer', Basketball: 'basketball', Volleyball: 'volleyball', Tennis: 'tennis',
  Handball: 'handball', 'American Football': 'football', Motorsport: 'motogp', 'Motor Sports': 'motogp'
};

const json = (body, status=200) => new Response(JSON.stringify(body), {
  status,
  headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=300, s-maxage=900','access-control-allow-origin':'*'}
});

function normalize(e) {
  const sport = SPORT_MAP[e.strSport];
  if (!sport) return null;
  const statusText = String(e.strStatus || '').toLowerCase();
  const hasScore = e.intHomeScore !== null && e.intHomeScore !== '';
  return {
    id:`tsdb-${e.idEvent}`, date:e.dateEvent, sport, league:e.strLeague || e.strSeason || 'Competición',
    home:e.strHomeTeam || e.strEvent?.split(/ vs /i)[0] || e.strEvent || 'Participante 1',
    away:e.strAwayTeam || e.strEvent?.split(/ vs /i)[1] || 'Participante 2',
    time:(e.strTime || '00:00').slice(0,5), channel:e.strTVStation || e.strChannel || 'Por confirmar',
    venue:e.strVenue || e.strCircuit || 'Por confirmar', homeScore:e.intHomeScore, awayScore:e.intAwayScore,
    status:hasScore || statusText.includes('finished') || statusText.includes('match finished') ? 'finished' : 'scheduled',
    interest:68, image:e.strThumb || e.strPoster || null, source:'TheSportsDB'
  };
}

export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const raw = (url.searchParams.get('dates') || '').split(',').filter(Boolean).slice(0,7);
  const valid = raw.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d));
  if(!valid.length) return json({error:'Provide dates=YYYY-MM-DD'},400);
  const key = env.SPORTSDB_API_KEY || '123';
  try {
    const pages = await Promise.all(valid.map(async date=>{
      const endpoint=`https://www.thesportsdb.com/api/v1/json/${encodeURIComponent(key)}/eventsday.php?d=${date}`;
      const res=await fetch(endpoint,{cf:{cacheTtl:900,cacheEverything:true}});
      if(!res.ok) throw new Error(`Sports provider ${res.status}`);
      const data=await res.json();
      return (data.events||[]).map(normalize).filter(Boolean);
    }));
    const events=pages.flat();
    return json({events,dates:valid,source:'TheSportsDB',updatedAt:new Date().toISOString()});
  } catch(error) {
    return json({events:[],error:'Sports provider unavailable',detail:error.message},502);
  }
}
