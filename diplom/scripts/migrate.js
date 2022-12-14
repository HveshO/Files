const db=require('../db');//подключает базу

;(async () => {
    try {
        await db.any(`
        Create or replace function random_string(length integer) returns text as
$$
declare
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer := 0;
begin
  if length < 0 then
    raise exception 'Given length cannot be less than 0';
  end if;
  for i in 1..length loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$ language plpgsql;

        DROP TABLE IF EXISTS public.discipline;

CREATE TABLE IF NOT EXISTS public.discipline
(
    disc_id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name_disc text COLLATE pg_catalog."default" NOT NULL,
    attempt_ekz bigint NOT NULL DEFAULT 1,
    attempt_demo bigint NOT NULL DEFAULT 1,
    access_teacher bigint[],
    access_student bigint[],
    CONSTRAINT discipline_pkey PRIMARY KEY (disc_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.discipline
    OWNER to postgres;
    
    DROP TABLE IF EXISTS public.table_answer;

CREATE TABLE IF NOT EXISTS public.table_answer
(
    table_ans_id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    answer text[] COLLATE pg_catalog."default",
    test text COLLATE pg_catalog."default" NOT NULL,
    table_id bigint NOT NULL,
    point integer DEFAULT 0,
    disc_id bigint,
    users_id bigint,
    CONSTRAINT table_answer_pkey PRIMARY KEY (table_ans_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.table_answer
    OWNER to postgres;
    DROP TABLE IF EXISTS public.table_demo;

CREATE TABLE IF NOT EXISTS public.table_demo
(
    table_id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name_q text COLLATE pg_catalog."default",
    text_q text COLLATE pg_catalog."default",
    point numeric,
    type_q text COLLATE pg_catalog."default",
    variants text[] COLLATE pg_catalog."default",
    right_q text[] COLLATE pg_catalog."default",
    disc_id bigint,
    CONSTRAINT table_demo_pkey PRIMARY KEY (table_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.table_demo
    OWNER to postgres;
    DROP TABLE IF EXISTS public.table_ekz;

CREATE TABLE IF NOT EXISTS public.table_ekz
(
    table_id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name_q text COLLATE pg_catalog."default",
    text_q text COLLATE pg_catalog."default",
    point numeric,
    type_q text COLLATE pg_catalog."default",
    variants text[] COLLATE pg_catalog."default",
    right_q text[] COLLATE pg_catalog."default",
    disc_id bigint,
    CONSTRAINT table_ekz_pkey PRIMARY KEY (table_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.table_ekz
    OWNER to postgres;
    DROP TABLE IF EXISTS public.table_score;

CREATE TABLE IF NOT EXISTS public.table_score
(
    score_id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    disc_id bigint NOT NULL,
    users_id bigint NOT NULL,
    final_score numeric NOT NULL,
    max_score numeric NOT NULL,
    per_score numeric NOT NULL,
    separation numeric[] DEFAULT '{50,70,90}'::numeric[],
    attempt bigint DEFAULT 1,
    test text COLLATE pg_catalog."default" NOT NULL DEFAULT 'ekz'::text,
    grade integer GENERATED ALWAYS AS (
CASE
    WHEN (per_score <= separation[1]) THEN 2
    ELSE
    CASE
        WHEN ((per_score >= separation[1]) AND (per_score <= separation[2])) THEN 3
        ELSE
        CASE
            WHEN ((per_score >= separation[2]) AND (per_score <= separation[3])) THEN 4
            ELSE 5
        END
    END
END) STORED,
    CONSTRAINT table_score_pkey PRIMARY KEY (score_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.table_score
    OWNER to postgres;
    DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    users_id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    fio text COLLATE pg_catalog."default" NOT NULL,
    login text COLLATE pg_catalog."default" NOT NULL DEFAULT random_string(((5)::double precision)::integer),
    passwords text COLLATE pg_catalog."default" NOT NULL DEFAULT random_string(((5)::double precision)::integer),
    numgroup text COLLATE pg_catalog."default",
    roles text[] COLLATE pg_catalog."default" DEFAULT '{студент}'::text[],
    email text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (users_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

    INSERT INTO public.users (fio, login, passwords, numgroup, roles, email) VALUES ('werwre', 'tester', 'tester', '4', '{"главный администратор"}', '123@com');`)
console.log("Успешно")
process.exit(1)
} catch (err) {
    console.log(err)
    process.exit(1)
  }
})()