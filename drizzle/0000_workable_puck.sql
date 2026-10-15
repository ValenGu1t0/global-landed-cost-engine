CREATE TABLE "duties_commercial_agreements" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_country" text NOT NULL,
	"destination_country" text NOT NULL,
	"raw_material" text NOT NULL,
	"cost_group" text,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "duties_commercial_agreements_pk" UNIQUE("origin_country","destination_country","raw_material","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "ground_freight" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor" text NOT NULL,
	"factory_name" text NOT NULL,
	"origin_country" text NOT NULL,
	"destination_country" text NOT NULL,
	"destination_warehouse" text NOT NULL,
	"container_type" text NOT NULL,
	"cost_detail" text,
	"value" real,
	"cost_group" text,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "ground_freight_pk" UNIQUE("vendor","factory_name","origin_country","destination_country","destination_warehouse","container_type","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "hts_codes" (
	"hts_code" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"hts_category" text,
	"min_value" real,
	"max_value" real,
	"type" text,
	"duty" real,
	"cost_group" text,
	"hts_product_subtype" text,
	"fixed_duty_per_piece" real,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "incoterm_cost_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"cost_group" text NOT NULL,
	"vendor" text NOT NULL,
	"country" text NOT NULL,
	"incoterm" text NOT NULL,
	CONSTRAINT "incoterm_cost_group_pk" UNIQUE("cost_group","vendor","country","incoterm")
);
--> statement-breakpoint
CREATE TABLE "inland_parameters" (
	"id" serial PRIMARY KEY NOT NULL,
	"inland_type" text NOT NULL,
	"port" text NOT NULL,
	"country" text NOT NULL,
	"zip_code" integer,
	"value" real,
	"cost_group" text,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "inland_pk" UNIQUE("inland_type","port","country","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "ocean_freight" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_port" text NOT NULL,
	"origin_country" text NOT NULL,
	"destination_port" text NOT NULL,
	"destination_country" text NOT NULL,
	"container_type" text NOT NULL,
	"value" real,
	"cost_group" text,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "ocean_freight_pk" UNIQUE("origin_port","origin_country","destination_port","destination_country","container_type","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "port_cost" (
	"id" serial PRIMARY KEY NOT NULL,
	"logistic_cost" text NOT NULL,
	"value" real,
	"cost_group" text,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "port_cost_pk" UNIQUE("logistic_cost","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "products_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"photo_url" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"price" real NOT NULL,
	"category" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "name_user_idx" UNIQUE("name","user_id")
);
--> statement-breakpoint
CREATE TABLE "hts_exceptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"hts_code" text NOT NULL,
	"origin_country" text NOT NULL,
	"destination_country" text NOT NULL,
	"special_tariff_value" real,
	"cost_group" text,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "hts_exceptions_pk" UNIQUE("hts_code","origin_country","destination_country","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "tariff_parameters" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_country" text NOT NULL,
	"destination_country" text NOT NULL,
	"value" real,
	"cost_group" text,
	"duty_dependent" boolean,
	"user" text,
	"start_date" timestamp,
	"end_date" timestamp DEFAULT '2100-01-01T00:00:00Z',
	CONSTRAINT "tariff_parameters_pk" UNIQUE("origin_country","destination_country","start_date","end_date")
);
--> statement-breakpoint
CREATE TABLE "vendor_ports" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor" text NOT NULL,
	"country" text NOT NULL,
	"port" text NOT NULL,
	"main_port" boolean,
	"user_id" text,
	CONSTRAINT "vendor_port_pk" UNIQUE("vendor","country","port")
);
