const BASE='https://api.jolpi.ca/ergast/f1';
const json = (body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=600, s-maxage=3600','access-control-allow-origin':'*'}});
const get=async path=>{const r=await fetch(`${BASE}${path}`,{cf:{cacheTtl:3600,cacheEverything:true}});if(!r.ok)throw new Error(`Jolpica ${r.status}`);return r.json()};
const displayDate = iso => new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'short',timeZone:'Europe/Madrid'}).format(new Date(`${iso}T12:00:00Z`));
const displaySession = s => s?.date ? `${new Intl.DateTimeFormat('es-ES',{weekday:'short',timeZone:'Europe/Madrid'}).format(new Date(`${s.date}T${s.time||'12:00:00Z'}`))} · ${new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(new Date(`${s.date}T${s.time||'12:00:00Z'}`))}` : 'Por confirmar';

export async function onRequestGet(){
  try{
    const year=new Date().getUTCFullYear();
    const [scheduleData,driverData,teamData,lastData]=await Promise.all([
      get(`/${year}.json?limit=100`),get(`/${year}/driverstandings.json`),get(`/${year}/constructorstandings.json`),get(`/${year}/last/results.json`)
    ]);
    const races=scheduleData.MRData?.RaceTable?.Races||[];
    const now=new Date();
    const next=races.find(r=>new Date(`${r.date}T${r.time||'12:00:00Z'}`)>=now)||races.at(-1);
    const sessionFields=[['FirstPractice','Práctica 1'],['SecondPractice','Práctica 2'],['ThirdPractice','Práctica 3'],['Sprint','Sprint'],['SprintQualifying','Clasificación sprint'],['Qualifying','Clasificación']];
    const sessions=sessionFields.filter(([k])=>next?.[k]).map(([k,label])=>[label,displaySession(next[k])]);
    if(next) sessions.push(['Carrera',displaySession(next)]);
    const drivers=(driverData.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[]).slice(0,10).map(x=>[`${x.Driver.givenName} ${x.Driver.familyName}`,x.Constructors?.[0]?.name||'',Number(x.points)]);
    const teams=(teamData.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings||[]).slice(0,10).map(x=>[x.Constructor.name,Number(x.points)]);
    const last=lastData.MRData?.RaceTable?.Races?.[0];
    const results=last?[ [last.raceName,...(last.Results||[]).slice(0,3).map(x=>`${x.Driver.givenName} ${x.Driver.familyName}`)] ]:[];
    const calendar=races.map(r=>[r.raceName.replace(/ Grand Prix$/,'').replace(/GP$/,''),displayDate(r.date)]);
    return json({
      next:next?{name:next.raceName,circuit:next.Circuit?.circuitName,country:`${next.Circuit?.Location?.locality}, ${next.Circuit?.Location?.country}`,round:Number(next.round),date:next.date}:null,
      sessions,calendar,drivers,teams,results,source:'Jolpica F1',updatedAt:new Date().toISOString()
    });
  }catch(error){return json({error:'F1 provider unavailable',detail:error.message},502)}
}
