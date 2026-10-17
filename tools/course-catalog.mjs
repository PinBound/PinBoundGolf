import {COURSES} from '../src/courses.mjs';
import {holesFor} from '../src/competition.mjs';
import {CURRENT_RULES,courseStats} from '../src/course-design.mjs';
import {writeFile} from 'node:fs/promises';
let text='# Pinbound course catalog\n\nCurrent redesigned layouts (`courses-2`). Pars follow the reference course scorecards; routes and yardages are original game designs. The three short courses use the reference front nine. See [design notes and sources](COURSE-DESIGN.md).\n';
for(const original of COURSES){const c=courseStats(original.id,original);text+=`\n## ${c.name} — ${c.location}\n\n${c.count} holes · Par ${c.par} · ${c.parThrees} par-3s / ${c.parFours} par-4s / ${c.parFives} par-5s\n\n| Hole | Name | Par | Yards | Routing |\n| --- | --- | ---: | ---: | --- |\n`;for(const h of holesFor({mode:'course',courseId:c.id,rules:CURRENT_RULES}))text+=`| ${h.number} | ${h.title} | ${h.par} | ${h.yards} | ${h.routing} |\n`;}
await writeFile(new URL('../docs/COURSE-CATALOG.md',import.meta.url),text);
