const topics = new Map([
  ['music','作品與語言版本 · Music & editions · 作品・言語版'],
  ['purchase','購買或下載 · Purchase or download · 購入・ダウンロード'],
  ['collaboration','授權與合作 · Licensing or collaboration · 利用許諾・コラボ'],
  ['other','其他 · Other · その他']
]);
const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSez4VdByvZf94h3DB5tF0dXa8bz-3m5Tfo8ISuI7D1g-5dL7Q/formResponse?hl=en';
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/enquiry') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return new Response(null,{status:405,headers:{Allow:'POST'}});
    if (request.headers.get('Origin') !== url.origin) return new Response(null,{status:403});
    if (!request.headers.get('Content-Type')?.includes('application/json')) return new Response(null,{status:415});
    let data;
    try { data = await request.json(); } catch { return new Response(null,{status:400}); }
    const topic = topics.get(data?.topic);
    const clean = key => typeof data?.[key] === 'string' ? data[key].trim() : '';
    const email = clean('email'), message = clean('message'), name = clean('name');
    if (!topic || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || !message || message.length>4000 || name.length>120)
      return new Response(null,{status:422});
    const fields = new URLSearchParams({'entry.366351295':topic,'entry.40183493':email,'entry.1788637190':message,'entry.1153329893':name,pageHistory:'0',fvv:'1'});
    try {
      const response = await fetch(formUrl,{method:'POST',body:fields,signal:AbortSignal.timeout(12000)});
      const received = response.ok && (await response.text()).includes('Your response has been recorded.');
      return Response.json({received},{status:received?200:502,headers:{'Cache-Control':'no-store'}});
    } catch { return Response.json({received:false},{status:502}); }
  }
};
