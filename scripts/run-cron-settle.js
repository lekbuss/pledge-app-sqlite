import fetch from 'node-fetch';
const res = await fetch(process.env.APP_BASE_URL + '/api/jobs/settle', {
  method: 'POST',
  headers: { 'x-cron-secret': process.env.CRON_SECRET || '' }
});
console.log(await res.text());
