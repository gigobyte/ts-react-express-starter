CREATE TABLE users (
  id bigserial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  "password" text NOT NULL,
  created_on timestamptz NOT NULL DEFAULT now()
);