--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-03 17:23:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 33546)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    alert_id integer NOT NULL,
    student_id integer,
    class_id integer,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 33545)
-- Name: alerts_alert_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerts_alert_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_alert_id_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 229
-- Name: alerts_alert_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerts_alert_id_seq OWNED BY public.alerts.alert_id;


--
-- TOC entry 234 (class 1259 OID 33591)
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    user_id integer NOT NULL,
    class_id integer NOT NULL,
    code character varying(10),
    status character varying(10) DEFAULT 'present'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 33497)
-- Name: attendance_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_codes (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    faculty_id integer,
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    class_id integer,
    expires_at timestamp without time zone
);


ALTER TABLE public.attendance_codes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 33496)
-- Name: attendance_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_codes_id_seq OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 223
-- Name: attendance_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_codes_id_seq OWNED BY public.attendance_codes.id;


--
-- TOC entry 233 (class 1259 OID 33590)
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 233
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- TOC entry 226 (class 1259 OID 33510)
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    student_id integer,
    code_id integer,
    marked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    class_id integer
);


ALTER TABLE public.attendance_records OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 33509)
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_records_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 225
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- TOC entry 220 (class 1259 OID 25331)
-- Name: class_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_sessions (
    session_id integer NOT NULL,
    faculty_id integer,
    subject character varying(100),
    session_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.class_sessions OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25330)
-- Name: class_sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.class_sessions_session_id_seq OWNER TO postgres;

--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 219
-- Name: class_sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_sessions_session_id_seq OWNED BY public.class_sessions.session_id;


--
-- TOC entry 228 (class 1259 OID 33529)
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    class_id integer NOT NULL,
    name character varying(100) NOT NULL,
    subject character varying(100),
    faculty_id integer
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 33528)
-- Name: classes_class_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classes_class_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_class_id_seq OWNER TO postgres;

--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 227
-- Name: classes_class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classes_class_id_seq OWNED BY public.classes.class_id;


--
-- TOC entry 232 (class 1259 OID 33566)
-- Name: student_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_classes (
    id integer NOT NULL,
    student_id integer,
    class_id integer
);


ALTER TABLE public.student_classes OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 33565)
-- Name: student_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_classes_id_seq OWNER TO postgres;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 231
-- Name: student_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_classes_id_seq OWNED BY public.student_classes.id;


--
-- TOC entry 222 (class 1259 OID 33464)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password text NOT NULL,
    role character varying(20) DEFAULT 'student'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33463)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 221
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 218 (class 1259 OID 25319)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    full_name character varying(100),
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['student'::character varying, 'faculty'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25318)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4793 (class 2604 OID 33549)
-- Name: alerts alert_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts ALTER COLUMN alert_id SET DEFAULT nextval('public.alerts_alert_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 33594)
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 33500)
-- Name: attendance_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_codes ALTER COLUMN id SET DEFAULT nextval('public.attendance_codes_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 33513)
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 25334)
-- Name: class_sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions ALTER COLUMN session_id SET DEFAULT nextval('public.class_sessions_session_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 33532)
-- Name: classes class_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes ALTER COLUMN class_id SET DEFAULT nextval('public.classes_class_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 33569)
-- Name: student_classes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes ALTER COLUMN id SET DEFAULT nextval('public.student_classes_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 33467)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 25322)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4994 (class 0 OID 33546)
-- Dependencies: 230
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (alert_id, student_id, class_id, description, created_at) FROM stdin;
\.


--
-- TOC entry 4998 (class 0 OID 33591)
-- Dependencies: 234
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, user_id, class_id, code, status, created_at) FROM stdin;
\.


--
-- TOC entry 4988 (class 0 OID 33497)
-- Dependencies: 224
-- Data for Name: attendance_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_codes (id, code, faculty_id, generated_at, class_id, expires_at) FROM stdin;
23	7523	1	2025-08-02 03:01:38.796	1	2025-08-02 03:04:38.796
\.


--
-- TOC entry 4990 (class 0 OID 33510)
-- Dependencies: 226
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_records (id, student_id, code_id, marked_at, class_id) FROM stdin;
5	1	23	2025-08-02 03:01:53.448615	1
\.


--
-- TOC entry 4984 (class 0 OID 25331)
-- Dependencies: 220
-- Data for Name: class_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_sessions (session_id, faculty_id, subject, session_date, created_at) FROM stdin;
\.


--
-- TOC entry 4992 (class 0 OID 33529)
-- Dependencies: 228
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (class_id, name, subject, faculty_id) FROM stdin;
1	Math 101	Mathematics	4
\.


--
-- TOC entry 4996 (class 0 OID 33566)
-- Dependencies: 232
-- Data for Name: student_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_classes (id, student_id, class_id) FROM stdin;
\.


--
-- TOC entry 4986 (class 0 OID 33464)
-- Dependencies: 222
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, email, password, role, created_at) FROM stdin;
1	Jasmeen	jassae631@gmail.com	$2b$10$OpHQdk19bEXeLipSbmaiX.HGr8webR1hsffTkGiA5uYTZmAAPm6yS	student	2025-07-31 16:08:12.540244
4	Student	anureet@gmail.com	$2b$10$I87N1vlxdaEbxhCq.ZGxwe/egn0JAxRn44M1neAIbRR66eO0mVuW6	student	2025-08-02 02:39:04.247366
5	Anisha	anisha@gmail.com	$2b$10$cp2BnwRKUihmwrhAtIL3..OuMGRF0fmE3VvRdCSaxSdyctENxGxOm	student	2025-08-02 02:40:02.628326
6	Nirmal	nirmal@gmail.com	$2b$10$G6qvfXBB0QfFT5xxCPwCxu/P4DqaBk3mm75a.3VvudSMrMKPry78m	student	2025-08-02 02:40:27.695102
8	Jassu	jassu@gmail.com	$2b$10$5/1W6jncPldsolODA/ejBeGYRaS6VyW0C8fhReIaTy3YqdgO0HA5O	student	2025-08-02 02:41:27.077524
\.


--
-- TOC entry 4982 (class 0 OID 25319)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, full_name, email, password_hash, role) FROM stdin;
4	Professor Nukhet	nukhet@gmail.com	$2b$10$OI1p9PE5LAbx7Iz4BhGl7uh/YY0lBt1DVl746/9JXCzVto8IGTToG	faculty
5	Student	jasmeen@gmail.com	$2b$10$BXe6SlcpcveLjIT7zbHwX.RADajPZHspsCHPFTKvpuGx6vLGiAu1C	student
7	Student	student@gmail.com	$2b$10$NqhlQ9Jpuof4oR5HtdsyXOJeGKX/3lfazPF8UO58ItG61BrvJDCFq	student
9	Student	anureet@gmail.com	$2b$10$I87N1vlxdaEbxhCq.ZGxwe/egn0JAxRn44M1neAIbRR66eO0mVuW6	student
10	Anisha	anisha@gmail.com	$2b$10$cp2BnwRKUihmwrhAtIL3..OuMGRF0fmE3VvRdCSaxSdyctENxGxOm	student
11	Nirmal	nirmal@gmail.com	$2b$10$G6qvfXBB0QfFT5xxCPwCxu/P4DqaBk3mm75a.3VvudSMrMKPry78m	student
12	Jasmeen	jass@gmail.com	$2b$10$1hlCeY.YZPazA5Q5XT9yEOTrTvmJj4AqLWFV9W2/pDj3O94MJ/qhW	student
14	Jassu	jassu@gmail.com	$2b$10$5/1W6jncPldsolODA/ejBeGYRaS6VyW0C8fhReIaTy3YqdgO0HA5O	student
1	Faculty	liwei@example.com	$2b$10$26ppl1p5ED/F0CetVW9yz.jtsEgL95mksw4pjadfGEmtCJuc3uvsO	faculty
\.


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 229
-- Name: alerts_alert_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerts_alert_id_seq', 1, false);


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 223
-- Name: attendance_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_codes_id_seq', 23, true);


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 233
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 225
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 5, true);


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 219
-- Name: class_sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_sessions_session_id_seq', 1, false);


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 227
-- Name: classes_class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_class_id_seq', 1, true);


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 231
-- Name: student_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_classes_id_seq', 1, false);


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 221
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 8, true);


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 14, true);


--
-- TOC entry 4821 (class 2606 OID 33554)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (alert_id);


--
-- TOC entry 4813 (class 2606 OID 33503)
-- Name: attendance_codes attendance_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_codes
    ADD CONSTRAINT attendance_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 33598)
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 33516)
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 25337)
-- Name: class_sessions class_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4819 (class 2606 OID 33534)
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (class_id);


--
-- TOC entry 4823 (class 2606 OID 33571)
-- Name: student_classes student_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 2606 OID 33477)
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- TOC entry 4809 (class 2606 OID 33475)
-- Name: students students_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_name_key UNIQUE (name);


--
-- TOC entry 4811 (class 2606 OID 33473)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 33602)
-- Name: attendance_records unique_attendance_per_class; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT unique_attendance_per_class UNIQUE (student_id, class_id);


--
-- TOC entry 4801 (class 2606 OID 25329)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4803 (class 2606 OID 25327)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4832 (class 2606 OID 33560)
-- Name: alerts alerts_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id);


--
-- TOC entry 4833 (class 2606 OID 33555)
-- Name: alerts alerts_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 33540)
-- Name: attendance_codes attendance_codes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_codes
    ADD CONSTRAINT attendance_codes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id) ON DELETE CASCADE;


--
-- TOC entry 4828 (class 2606 OID 33504)
-- Name: attendance_codes attendance_codes_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_codes
    ADD CONSTRAINT attendance_codes_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.users(user_id);


--
-- TOC entry 4829 (class 2606 OID 33522)
-- Name: attendance_records attendance_records_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_code_id_fkey FOREIGN KEY (code_id) REFERENCES public.attendance_codes(id);


--
-- TOC entry 4830 (class 2606 OID 33517)
-- Name: attendance_records attendance_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id);


--
-- TOC entry 4826 (class 2606 OID 25338)
-- Name: class_sessions class_sessions_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.users(user_id);


--
-- TOC entry 4831 (class 2606 OID 33535)
-- Name: classes classes_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4834 (class 2606 OID 33577)
-- Name: student_classes student_classes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id) ON DELETE CASCADE;


--
-- TOC entry 4835 (class 2606 OID 33572)
-- Name: student_classes student_classes_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-08-03 17:23:48

--
-- PostgreSQL database dump complete
--

