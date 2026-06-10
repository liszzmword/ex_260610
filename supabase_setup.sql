-- 프로포즈 서비스 데이터 테이블
-- Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 실행하세요.

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  groom_name text not null,          -- 신랑 이름
  bride_name text not null,          -- 신부 이름
  wedding_date date not null,        -- 결혼식 날짜 (예상 날짜 포함)
  used_at date not null,             -- 서비스를 사용한 날짜
  days_diff integer not null,        -- 결혼식 날짜 - 서비스 이용 날짜 (일)
  created_at timestamptz not null default now()
);

-- RLS: 익명 사용자는 저장만 가능, 조회/수정/삭제 불가
alter table proposals enable row level security;

create policy "anyone can insert"
  on proposals
  for insert
  to anon
  with check (true);
