import test from 'node:test';
import assert from 'node:assert/strict';
import { getRitualJournal } from './ritualJournal.js';
test('journal retains deleted ritual titles and date-only days, and deduplicates replayed events',()=>{
 const event={eventUuid:'earned-1',date:'2026-11-22',ritualTitle:'Walk outside'};
 assert.deepEqual(getRitualJournal([event,event,null,{date:'bad'},{}, {date:'2026-02-31'}]),[{id:'earned-1',day:'2026-11-22',title:'Walk outside'}]);
});
test('timestamped check-ins use the same local day as the calendar',()=>{
 const date=new Date('2026-11-21T23:55:00Z'), expected=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
 assert.equal(getRitualJournal([{occurredAt:date.toISOString(),ritualId:'r'}])[0].day,expected);
 assert.equal(getRitualJournal([{date:'2026-11-22',ritualTitle:'Old habit'}])[0].title,'Old habit');
});
