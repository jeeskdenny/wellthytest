CREATE TABLE orders(
   id BIGSERIAL PRIMARY KEY     NOT NULL,
   status         varchar(50)  NOT NULL,
   distance       bigint     NOT NULL,
   timestamp      timestamp NOT NULL DEFAULT NOW()
);