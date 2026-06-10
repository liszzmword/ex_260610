// Vercel 서버리스 함수: 프로포즈 데이터를 Supabase에 저장
// 환경변수 (Vercel → Settings → Environment Variables):
//   SUPABASE_URL      - Supabase 프로젝트 URL (https://xxxx.supabase.co)
//   SUPABASE_ANON_KEY - Supabase anon public key
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' });
  }

  const { groom_name, bride_name, wedding_date, used_at, days_diff } = req.body || {};
  if (!groom_name || !bride_name || !wedding_date || !used_at || typeof days_diff !== 'number') {
    return res.status(400).json({ error: '잘못된 요청입니다.' });
  }

  // 환경변수에 끝 슬래시나 /rest/v1 경로가 포함되어 있어도 동작하도록 정규화
  const baseUrl = SUPABASE_URL.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');

  const resp = await fetch(`${baseUrl}/rest/v1/proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ groom_name, bride_name, wedding_date, used_at, days_diff })
  });

  if (!resp.ok) {
    const detail = await resp.text();
    return res.status(502).json({ error: 'Supabase 저장 실패', detail });
  }

  return res.status(201).json({ ok: true });
}
