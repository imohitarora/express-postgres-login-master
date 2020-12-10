CREATE TABLE public.users (
	id serial NOT NULL,
	username varchar(300) NOT NULL,
	email varchar(300) NOT NULL,
	firstname varchar(300) NULL,
	lastname varchar(300) NULL,
	"password" varchar(300) NULL,
	CONSTRAINT "PK_af8abf4cfabc19b55b932d905bd" PRIMARY KEY (id)
);

SELECT * FROM users;