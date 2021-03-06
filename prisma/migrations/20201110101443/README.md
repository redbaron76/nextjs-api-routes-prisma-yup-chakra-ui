# Migration `20201110101443`

This migration has been generated by redbaron76 at 11/10/2020, 11:14:43 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."Role" AS ENUM ('USER', 'PLAYER', 'SHOP', 'ADMIN')

CREATE TABLE "public"."User" (
"id" SERIAL,
"email" text   NOT NULL ,
"firstName" text   NOT NULL ,
"lastName" text   NOT NULL ,
"password" text   NOT NULL ,
"role" "Role"  NOT NULL DEFAULT E'USER',
"count" integer   NOT NULL DEFAULT 0,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Profile" (
"id" SERIAL,
"bio" text   NOT NULL ,
"userId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Book" (
"id" SERIAL,
"title" text   NOT NULL ,
"userId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Category" (
"id" SERIAL,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."_BookToCategory" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "Profile_userId_unique" ON "public"."Profile"("userId")

CREATE UNIQUE INDEX "_BookToCategory_AB_unique" ON "public"."_BookToCategory"("A", "B")

CREATE INDEX "_BookToCategory_B_index" ON "public"."_BookToCategory"("B")

ALTER TABLE "public"."Profile" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Book" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BookToCategory" ADD FOREIGN KEY("A")REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BookToCategory" ADD FOREIGN KEY("B")REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201110101443
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,50 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+enum Role {
+  USER
+  PLAYER
+  SHOP
+  ADMIN
+}
+
+model User {
+  id        Int     @id @default(autoincrement())
+  email     String  @unique
+  firstName String
+  lastName  String
+  password  String
+  role      Role    @default(USER)
+  count     Int     @default(0)
+  books     Book[]
+  profile   Profile
+}
+
+model Profile {
+  id     Int    @id @default(autoincrement())
+  bio    String
+  user   User   @relation(fields: [userId], references: [id])
+  userId Int
+}
+
+model Book {
+  id         Int        @id @default(autoincrement())
+  title      String
+  author     User       @relation(fields: [userId], references: [id])
+  userId     Int
+  categories Category[]
+}
+
+model Category {
+  id    Int    @id @default(autoincrement())
+  books Book[]
+}
```


