--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

--
-- Name: enum_Orders_deliveryMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_deliveryMethod" AS ENUM (
    'самовывоз',
    'курьер',
    'доставка сервисом'
);


ALTER TYPE public."enum_Orders_deliveryMethod" OWNER TO postgres;

--
-- Name: enum_Orders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_status" AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);


ALTER TYPE public."enum_Orders_status" OWNER TO postgres;

--
-- Name: enum_PriceListItems_itemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_PriceListItems_itemType" AS ENUM (
    'service',
    'component',
    'product',
    'custom'
);


ALTER TYPE public."enum_PriceListItems_itemType" OWNER TO postgres;

--
-- Name: enum_PriceLists_listType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_PriceLists_listType" AS ENUM (
    'services',
    'components',
    'products',
    'combined'
);


ALTER TYPE public."enum_PriceLists_listType" OWNER TO postgres;

--
-- Name: enum_Products_condition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Products_condition" AS ENUM (
    'new',
    'used'
);


ALTER TYPE public."enum_Products_condition" OWNER TO postgres;

--
-- Name: enum_RepairWarranties_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_RepairWarranties_status" AS ENUM (
    'active',
    'expired',
    'void'
);


ALTER TYPE public."enum_RepairWarranties_status" OWNER TO postgres;

--
-- Name: enum_ServiceCenters_specialization; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ServiceCenters_specialization" AS ENUM (
    'горные велосипеды',
    'шоссейные велосипеды',
    'городские велосипеды',
    'электровелосипеды'
);


ALTER TYPE public."enum_ServiceCenters_specialization" OWNER TO postgres;

--
-- Name: enum_ServiceRequests_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ServiceRequests_status" AS ENUM (
    'запрошена',
    'в работе',
    'выполнена',
    'отменена'
);


ALTER TYPE public."enum_ServiceRequests_status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CartItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItems" (
    id integer NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CartItems" OWNER TO postgres;

--
-- Name: CartItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CartItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartItems_id_seq" OWNER TO postgres;

--
-- Name: CartItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CartItems_id_seq" OWNED BY public."CartItems".id;


--
-- Name: Carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Carts" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Carts" OWNER TO postgres;

--
-- Name: Carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Carts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Carts_id_seq" OWNER TO postgres;

--
-- Name: Carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Carts_id_seq" OWNED BY public."Carts".id;


--
-- Name: Components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Components" (
    id integer NOT NULL,
    "serviceCenterId" integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    manufacturer character varying(255) NOT NULL,
    supplier character varying(255),
    "partNumber" character varying(255),
    "compatibleManufacturers" character varying(255)[],
    "compatibleModels" character varying(255)[],
    stock integer DEFAULT 0 NOT NULL,
    unit character varying(255) DEFAULT 'pcs'::character varying NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Components" OWNER TO postgres;

--
-- Name: Components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Components_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Components_id_seq" OWNER TO postgres;

--
-- Name: Components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Components_id_seq" OWNED BY public."Components".id;


--
-- Name: OrderItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItems" (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "priceAtPurchase" numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "orderId" integer,
    "productId" integer
);


ALTER TABLE public."OrderItems" OWNER TO postgres;

--
-- Name: OrderItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItems_id_seq" OWNER TO postgres;

--
-- Name: OrderItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItems_id_seq" OWNED BY public."OrderItems".id;


--
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Orders" (
    id integer NOT NULL,
    "deliveryAddress" character varying(255) NOT NULL,
    "totalCost" numeric(10,2) NOT NULL,
    status public."enum_Orders_status" NOT NULL,
    "paymentMethod" character varying(255) NOT NULL,
    "trackingNumber" character varying(255),
    "orderDate" timestamp with time zone NOT NULL,
    "deliveryMethod" public."enum_Orders_deliveryMethod" NOT NULL,
    "serviceCenterId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."Orders" OWNER TO postgres;

--
-- Name: Orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Orders_id_seq" OWNER TO postgres;

--
-- Name: Orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Orders_id_seq" OWNED BY public."Orders".id;


--
-- Name: PriceListItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PriceListItems" (
    id integer NOT NULL,
    "priceListId" integer NOT NULL,
    "itemType" public."enum_PriceListItems_itemType" NOT NULL,
    "referenceId" integer,
    "itemName" character varying(255) NOT NULL,
    description text,
    unit character varying(255) DEFAULT 'pcs'::character varying NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "durationMinutes" integer,
    "warrantyMonths" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PriceListItems" OWNER TO postgres;

--
-- Name: PriceListItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PriceListItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PriceListItems_id_seq" OWNER TO postgres;

--
-- Name: PriceListItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PriceListItems_id_seq" OWNED BY public."PriceListItems".id;


--
-- Name: PriceLists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PriceLists" (
    id integer NOT NULL,
    "serviceCenterId" integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "listType" public."enum_PriceLists_listType" DEFAULT 'combined'::public."enum_PriceLists_listType" NOT NULL,
    "effectiveFrom" timestamp with time zone,
    "effectiveTo" timestamp with time zone,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PriceLists" OWNER TO postgres;

--
-- Name: PriceLists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PriceLists_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PriceLists_id_seq" OWNER TO postgres;

--
-- Name: PriceLists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PriceLists_id_seq" OWNED BY public."PriceLists".id;


--
-- Name: Products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Products" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    category character varying(255) NOT NULL,
    brand character varying(255) NOT NULL,
    model character varying(255),
    condition public."enum_Products_condition" DEFAULT 'new'::public."enum_Products_condition" NOT NULL,
    warranty character varying(255),
    stock integer DEFAULT 0 NOT NULL,
    photo character varying(255),
    "serviceCenterId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Products" OWNER TO postgres;

--
-- Name: Products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Products_id_seq" OWNER TO postgres;

--
-- Name: Products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Products_id_seq" OWNED BY public."Products".id;


--
-- Name: RepairWarranties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RepairWarranties" (
    id integer NOT NULL,
    "serviceCenterId" integer NOT NULL,
    "serviceRequestId" integer NOT NULL,
    "workshopServiceId" integer,
    "coverageDescription" text NOT NULL,
    "warrantyPeriodMonths" integer NOT NULL,
    conditions text,
    status public."enum_RepairWarranties_status" DEFAULT 'active'::public."enum_RepairWarranties_status" NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."RepairWarranties" OWNER TO postgres;

--
-- Name: RepairWarranties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RepairWarranties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RepairWarranties_id_seq" OWNER TO postgres;

--
-- Name: RepairWarranties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RepairWarranties_id_seq" OWNED BY public."RepairWarranties".id;


--
-- Name: Reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reviews" (
    id integer NOT NULL,
    rating integer NOT NULL,
    "shortReview" character varying(255) NOT NULL,
    "reviewText" text,
    "userId" integer NOT NULL,
    "orderId" integer NOT NULL,
    "serviceCenterId" integer NOT NULL,
    "productId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Reviews" OWNER TO postgres;

--
-- Name: Reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reviews_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reviews_id_seq" OWNER TO postgres;

--
-- Name: Reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reviews_id_seq" OWNED BY public."Reviews".id;


--
-- Name: ServiceCenters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceCenters" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "contactPerson" character varying(255) NOT NULL,
    "registrationNumber" character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    logo character varying(255),
    "establishedYear" integer,
    specialization public."enum_ServiceCenters_specialization" NOT NULL,
    "offersDelivery" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ServiceCenters" OWNER TO postgres;

--
-- Name: ServiceCenters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceCenters_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ServiceCenters_id_seq" OWNER TO postgres;

--
-- Name: ServiceCenters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceCenters_id_seq" OWNED BY public."ServiceCenters".id;


--
-- Name: ServiceComponents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceComponents" (
    id integer NOT NULL,
    "workshopServiceId" integer NOT NULL,
    "componentId" integer NOT NULL,
    quantity numeric(10,2) DEFAULT 1 NOT NULL,
    unit character varying(255) DEFAULT 'pcs'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ServiceComponents" OWNER TO postgres;

--
-- Name: ServiceComponents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceComponents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ServiceComponents_id_seq" OWNER TO postgres;

--
-- Name: ServiceComponents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceComponents_id_seq" OWNED BY public."ServiceComponents".id;


--
-- Name: ServiceRequests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceRequests" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "serviceCenterId" integer NOT NULL,
    "workshopServiceId" integer,
    "componentId" integer,
    "requestDate" timestamp with time zone NOT NULL,
    status public."enum_ServiceRequests_status" NOT NULL,
    "bikeModel" character varying(255),
    "problemDescription" text NOT NULL,
    "technicianNotes" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ServiceRequests" OWNER TO postgres;

--
-- Name: ServiceRequests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ServiceRequests_id_seq" OWNER TO postgres;

--
-- Name: ServiceRequests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceRequests_id_seq" OWNED BY public."ServiceRequests".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    "birthDate" timestamp with time zone,
    address character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    photo character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: WarrantyServices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WarrantyServices" (
    id integer NOT NULL,
    "orderItemId" integer NOT NULL,
    "warrantyPeriod" character varying(255) NOT NULL,
    "serviceConditions" text NOT NULL,
    "serviceCenterContacts" character varying(255) NOT NULL,
    "validUntil" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."WarrantyServices" OWNER TO postgres;

--
-- Name: WarrantyServices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WarrantyServices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WarrantyServices_id_seq" OWNER TO postgres;

--
-- Name: WarrantyServices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WarrantyServices_id_seq" OWNED BY public."WarrantyServices".id;


--
-- Name: WorkshopServices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkshopServices" (
    id integer NOT NULL,
    "serviceCenterId" integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(255),
    "basePrice" numeric(10,2) NOT NULL,
    "durationMinutes" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."WorkshopServices" OWNER TO postgres;

--
-- Name: WorkshopServices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WorkshopServices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WorkshopServices_id_seq" OWNER TO postgres;

--
-- Name: WorkshopServices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WorkshopServices_id_seq" OWNED BY public."WorkshopServices".id;


--
-- Name: CartItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems" ALTER COLUMN id SET DEFAULT nextval('public."CartItems_id_seq"'::regclass);


--
-- Name: Carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts" ALTER COLUMN id SET DEFAULT nextval('public."Carts_id_seq"'::regclass);


--
-- Name: Components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Components" ALTER COLUMN id SET DEFAULT nextval('public."Components_id_seq"'::regclass);


--
-- Name: OrderItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems" ALTER COLUMN id SET DEFAULT nextval('public."OrderItems_id_seq"'::regclass);


--
-- Name: Orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);


--
-- Name: PriceListItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceListItems" ALTER COLUMN id SET DEFAULT nextval('public."PriceListItems_id_seq"'::regclass);


--
-- Name: PriceLists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceLists" ALTER COLUMN id SET DEFAULT nextval('public."PriceLists_id_seq"'::regclass);


--
-- Name: Products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products" ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);


--
-- Name: RepairWarranties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RepairWarranties" ALTER COLUMN id SET DEFAULT nextval('public."RepairWarranties_id_seq"'::regclass);


--
-- Name: Reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews" ALTER COLUMN id SET DEFAULT nextval('public."Reviews_id_seq"'::regclass);


--
-- Name: ServiceCenters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters" ALTER COLUMN id SET DEFAULT nextval('public."ServiceCenters_id_seq"'::regclass);


--
-- Name: ServiceComponents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceComponents" ALTER COLUMN id SET DEFAULT nextval('public."ServiceComponents_id_seq"'::regclass);


--
-- Name: ServiceRequests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequests" ALTER COLUMN id SET DEFAULT nextval('public."ServiceRequests_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: WarrantyServices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WarrantyServices" ALTER COLUMN id SET DEFAULT nextval('public."WarrantyServices_id_seq"'::regclass);


--
-- Name: WorkshopServices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkshopServices" ALTER COLUMN id SET DEFAULT nextval('public."WorkshopServices_id_seq"'::regclass);


--
-- Data for Name: CartItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItems" (id, "cartId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
2	1	1	1	2025-10-12 17:37:08.295+03	2025-10-12 17:37:08.295+03
\.


--
-- Data for Name: Carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Carts" (id, "userId", "createdAt", "updatedAt") FROM stdin;
1	1	2025-10-09 23:04:16.385+03	2025-10-09 23:04:16.385+03
\.


--
-- Data for Name: Components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Components" (id, "serviceCenterId", name, description, manufacturer, supplier, "partNumber", "compatibleManufacturers", "compatibleModels", stock, unit, "unitPrice", "isActive", "createdAt", "updatedAt") FROM stdin;
1	3	Покрышка 28x1.60 (42-622) Schwalbe Hurricane Performance	Шина для легкого бездорожья. Новые шины Hurricane имеют современный и скоростной дизайн протектора. Быстрое качение, благодаря сплошной центральной дорожке и низкий уровень шума на асфальте. Массивные блоки по бокам обеспечивают хорошее сцепление на лесных и гравийных дорогах, обеспечивая отличные внедорожные качества шин. Боковые микровыступы оптимальной формы гарантируют безопасность на каждом повороте. Hurricane — это превосходная вездеходная шина для велосипедистов, которые хотят быстро ездить по дорогам и преодолевать бездорожья.	Schwalbe	Велотрейд	568674574	{Stern,Specizlized}	{Racer,Aheron,Destiny}	11	pcs	2800.00	t	2025-10-09 22:59:23.85+03	2025-10-09 22:59:23.85+03
2	3	Покрышка 29x2.00" (50-622) Continental Double Fighter 3 Reflex	Вес: 915 г; TPI: 180TPI; Допустимое давление: 50 — 65 PSI; Особенности: защита от проколов, светоотражающая полоса	Continental	Велотрейд Городской	382035092	{Stern,Aist}	{Waves,Style}	8	pcs	3000.00	t	2025-10-09 23:01:55.051+03	2025-10-09 23:01:55.051+03
\.


--
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItems" (id, quantity, "priceAtPurchase", "createdAt", "updatedAt", "orderId", "productId") FROM stdin;
1	1	14000.00	2025-10-12 17:06:46.721+03	2025-10-12 17:06:46.721+03	1	1
\.


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Orders" (id, "deliveryAddress", "totalCost", status, "paymentMethod", "trackingNumber", "orderDate", "deliveryMethod", "serviceCenterId", "createdAt", "updatedAt", "userId") FROM stdin;
1	пшпщ	14000.00	shipped	cash	TRK-1760278006668-389219	2025-10-12 17:06:46.669+03	самовывоз	3	2025-10-12 17:06:46.673+03	2025-10-27 00:05:26.069+03	1
\.


--
-- Data for Name: PriceListItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PriceListItems" (id, "priceListId", "itemType", "referenceId", "itemName", description, unit, "unitPrice", "durationMinutes", "warrantyMonths", "isActive", "createdAt", "updatedAt") FROM stdin;
1	1	service	2	Замена покрышек	Разборка велосипеда , установление новой покрышки	pcs	1000.00	30	\N	t	2025-10-12 17:25:37.976+03	2025-10-12 17:25:37.976+03
\.


--
-- Data for Name: PriceLists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PriceLists" (id, "serviceCenterId", name, description, "listType", "effectiveFrom", "effectiveTo", "isDefault", "createdAt", "updatedAt") FROM stdin;
1	3	Сезонные скидки	2 одинаковые услуги по цене 1	services	2025-10-10 03:00:00+03	2025-11-11 03:00:00+03	t	2025-10-12 17:25:37.95+03	2025-10-12 17:25:37.95+03
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Products" (id, name, description, price, category, brand, model, condition, warranty, stock, photo, "serviceCenterId", "createdAt", "updatedAt") FROM stdin;
1	Велосипед складной Denton Journey 20" 2024	Компактный складной велосипед Denton Journey 20 с небольшими 20-дюймовыми колесами. Байк станет отличным выбором для коротких поездок по городу и его окрестностям. Модель подойдет как взрослым, так и подросткам: она рассчитана на начинающих райдеров ростом от 155 см до 190 см. Велосипед прошел тестирование по международным стандартам ISO 4210 и GB 3565	14000.00	Городские велосипеды	Denton	Journey	new	5 лет	6	/uploads/products/1760039390850_123554610299.jpg	3	2025-10-09 22:49:50.873+03	2025-10-09 22:49:50.873+03
\.


--
-- Data for Name: RepairWarranties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RepairWarranties" (id, "serviceCenterId", "serviceRequestId", "workshopServiceId", "coverageDescription", "warrantyPeriodMonths", conditions, status, "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reviews" (id, rating, "shortReview", "reviewText", "userId", "orderId", "serviceCenterId", "productId", "createdAt", "updatedAt") FROM stdin;
1	5	Хороший велосипед	Качественные детали, прекрасно чистится. Подходит для езды в городе	1	1	3	1	2025-10-12 17:10:11.099+03	2025-10-12 17:10:11.099+03
\.


--
-- Data for Name: ServiceCenters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceCenters" (id, name, "contactPerson", "registrationNumber", phone, email, password, address, logo, "establishedYear", specialization, "offersDelivery", "createdAt", "updatedAt") FROM stdin;
1	Велотрейд Горный	Влад	45678902846543466798	80447407808	vlad@gmail.com	$2a$12$lD4ovX7JO/zzCDcDMRY2pun.fg6IO3Csk5P7zQjTZi0bnBJXMfA0q	г.Могилев ,ул. проспект Независимости 15	\N	2019	горные велосипеды	t	2025-10-09 22:43:33.889+03	2025-10-09 22:43:33.889+03
2	Велотрейд Шоссейный	Иван	45678391876543461111	+375297102910	ivan@gmail.com	$2a$12$HIkW1RkiQ3XFLjtEkEof4eCq7hnj.7BNesEueTX2dNX2kDchY9Nny	г.Могилев ,ул. Восточная 30	\N	2019	шоссейные велосипеды	t	2025-10-09 22:45:20.363+03	2025-10-09 22:45:20.363+03
3	Велотрейд Городской	Дмитрий	82818902846543400000	+375292956001	dmitriy@gmail.com	$2a$12$CDYvjw02FDqz6VYJVpoWcu7d.LGmpKk6Xm9NQU6.e.7wZNhHdVKwa	г.Могилев ,ул. Северная 13	\N	2020	городские велосипеды	t	2025-10-09 22:47:16.218+03	2025-10-27 01:24:21.582+03
\.


--
-- Data for Name: ServiceComponents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceComponents" (id, "workshopServiceId", "componentId", quantity, unit, "createdAt", "updatedAt") FROM stdin;
1	2	1	1.00	pcs	2025-10-09 23:03:09.649+03	2025-10-09 23:03:09.649+03
2	2	2	1.00	pcs	2025-10-09 23:03:09.649+03	2025-10-09 23:03:09.649+03
\.


--
-- Data for Name: ServiceRequests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceRequests" (id, "userId", "serviceCenterId", "workshopServiceId", "componentId", "requestDate", status, "bikeModel", "problemDescription", "technicianNotes", "createdAt", "updatedAt") FROM stdin;
1	1	3	2	1	2025-10-09 23:09:00+03	запрошена	hbibbbb	hbihbhbhjhbhb	Покрышка сменена	2025-10-09 23:52:13.269+03	2025-10-27 00:08:58.951+03
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "firstName", "lastName", phone, "birthDate", address, email, password, photo, "createdAt", "updatedAt") FROM stdin;
1	Семен	Деревяненко	+375298503833	2006-02-01 03:00:00+03	г.Могилев ,ул. Крупской 72	semen@gmail.com	$2a$12$eldMpaqKfYTvJVBYaNenE.MRn72b.6ZQ3EEnX5Czcnk.8LvwpKqZm	\N	2025-10-09 23:04:15.479+03	2025-10-09 23:04:15.479+03
\.


--
-- Data for Name: WarrantyServices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WarrantyServices" (id, "orderItemId", "warrantyPeriod", "serviceConditions", "serviceCenterContacts", "validUntil", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WorkshopServices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkshopServices" (id, "serviceCenterId", name, description, category, "basePrice", "durationMinutes", "isActive", "createdAt", "updatedAt") FROM stdin;
1	3	Пакет Стандарт	Осмотр всего велосипеда\nПроверка всех узлов на наличие люфтов / устранение\nПереподтяжка педалей, системы шатунов, зажатие колёс\nЧистка, мойка, смазка системы трансмиссии: цепь, звезды, переключатели\nПроверка тормозной системы, настройка тормозов: колодки, диски\nНастройка системы переключения\nПроверка состояния тросов и оплётки\nЧистка амортизационной вилки, смазка\nПодкачка колёс	Городские велосипеды	2000.00	90	t	2025-10-09 22:53:40.38+03	2025-10-09 22:53:40.38+03
2	3	Замена покрышек	Разборка велосипеда , установление новой покрышки	Городские велосипеды	1000.00	30	t	2025-10-09 23:03:09.618+03	2025-10-09 23:03:09.618+03
\.


--
-- Name: CartItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItems_id_seq"', 2, true);


--
-- Name: Carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Carts_id_seq"', 1, true);


--
-- Name: Components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Components_id_seq"', 2, true);


--
-- Name: OrderItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItems_id_seq"', 1, true);


--
-- Name: Orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Orders_id_seq"', 1, true);


--
-- Name: PriceListItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PriceListItems_id_seq"', 1, true);


--
-- Name: PriceLists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PriceLists_id_seq"', 1, true);


--
-- Name: Products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Products_id_seq"', 1, true);


--
-- Name: RepairWarranties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RepairWarranties_id_seq"', 1, false);


--
-- Name: Reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reviews_id_seq"', 1, true);


--
-- Name: ServiceCenters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceCenters_id_seq"', 3, true);


--
-- Name: ServiceComponents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceComponents_id_seq"', 2, true);


--
-- Name: ServiceRequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceRequests_id_seq"', 3, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, true);


--
-- Name: WarrantyServices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WarrantyServices_id_seq"', 1, false);


--
-- Name: WorkshopServices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WorkshopServices_id_seq"', 2, true);


--
-- Name: CartItems CartItems_cartId_productId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_cartId_productId_key" UNIQUE ("cartId", "productId");


--
-- Name: CartItems CartItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_pkey" PRIMARY KEY (id);


--
-- Name: Carts Carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_pkey" PRIMARY KEY (id);


--
-- Name: Components Components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Components"
    ADD CONSTRAINT "Components_pkey" PRIMARY KEY (id);


--
-- Name: OrderItems OrderItems_orderId_productId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_productId_key" UNIQUE ("orderId", "productId");


--
-- Name: OrderItems OrderItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (id);


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: PriceListItems PriceListItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceListItems"
    ADD CONSTRAINT "PriceListItems_pkey" PRIMARY KEY (id);


--
-- Name: PriceLists PriceLists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceLists"
    ADD CONSTRAINT "PriceLists_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: RepairWarranties RepairWarranties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RepairWarranties"
    ADD CONSTRAINT "RepairWarranties_pkey" PRIMARY KEY (id);


--
-- Name: Reviews Reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCenters ServiceCenters_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key1" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key10" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key11" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key12" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key13" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key14" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key15" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key16" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key17" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key2" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key3" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key4" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key5" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key6" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key7" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key8" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_email_key9" UNIQUE (email);


--
-- Name: ServiceCenters ServiceCenters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCenters"
    ADD CONSTRAINT "ServiceCenters_pkey" PRIMARY KEY (id);


--
-- Name: ServiceComponents ServiceComponents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceComponents"
    ADD CONSTRAINT "ServiceComponents_pkey" PRIMARY KEY (id);


--
-- Name: ServiceComponents ServiceComponents_workshopServiceId_componentId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceComponents"
    ADD CONSTRAINT "ServiceComponents_workshopServiceId_componentId_key" UNIQUE ("workshopServiceId", "componentId");


--
-- Name: ServiceRequests ServiceRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequests"
    ADD CONSTRAINT "ServiceRequests_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key10" UNIQUE (email);


--
-- Name: Users Users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key11" UNIQUE (email);


--
-- Name: Users Users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key12" UNIQUE (email);


--
-- Name: Users Users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key13" UNIQUE (email);


--
-- Name: Users Users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key14" UNIQUE (email);


--
-- Name: Users Users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key15" UNIQUE (email);


--
-- Name: Users Users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key16" UNIQUE (email);


--
-- Name: Users Users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key17" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: WarrantyServices WarrantyServices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WarrantyServices"
    ADD CONSTRAINT "WarrantyServices_pkey" PRIMARY KEY (id);


--
-- Name: WorkshopServices WorkshopServices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkshopServices"
    ADD CONSTRAINT "WorkshopServices_pkey" PRIMARY KEY (id);


--
-- Name: CartItems CartItems_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Carts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItems CartItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Carts Carts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Components Components_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Components"
    ADD CONSTRAINT "Components_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItems OrderItems_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItems OrderItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Orders Orders_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Orders Orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PriceListItems PriceListItems_priceListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceListItems"
    ADD CONSTRAINT "PriceListItems_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES public."PriceLists"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PriceLists PriceLists_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PriceLists"
    ADD CONSTRAINT "PriceLists_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Products Products_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RepairWarranties RepairWarranties_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RepairWarranties"
    ADD CONSTRAINT "RepairWarranties_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RepairWarranties RepairWarranties_serviceRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RepairWarranties"
    ADD CONSTRAINT "RepairWarranties_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES public."ServiceRequests"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RepairWarranties RepairWarranties_workshopServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RepairWarranties"
    ADD CONSTRAINT "RepairWarranties_workshopServiceId_fkey" FOREIGN KEY ("workshopServiceId") REFERENCES public."WorkshopServices"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reviews Reviews_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reviews Reviews_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reviews Reviews_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reviews Reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceComponents ServiceComponents_componentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceComponents"
    ADD CONSTRAINT "ServiceComponents_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES public."Components"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceComponents ServiceComponents_workshopServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceComponents"
    ADD CONSTRAINT "ServiceComponents_workshopServiceId_fkey" FOREIGN KEY ("workshopServiceId") REFERENCES public."WorkshopServices"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceRequests ServiceRequests_componentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequests"
    ADD CONSTRAINT "ServiceRequests_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES public."Components"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequests ServiceRequests_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequests"
    ADD CONSTRAINT "ServiceRequests_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceRequests ServiceRequests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequests"
    ADD CONSTRAINT "ServiceRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceRequests ServiceRequests_workshopServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequests"
    ADD CONSTRAINT "ServiceRequests_workshopServiceId_fkey" FOREIGN KEY ("workshopServiceId") REFERENCES public."WorkshopServices"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WarrantyServices WarrantyServices_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WarrantyServices"
    ADD CONSTRAINT "WarrantyServices_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItems"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkshopServices WorkshopServices_serviceCenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkshopServices"
    ADD CONSTRAINT "WorkshopServices_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES public."ServiceCenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

