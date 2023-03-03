import { MigrationInterface, QueryRunner } from 'typeorm';

export class v11677813432003 implements MigrationInterface {
  name = 'v11677813432003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "email" character varying(128), "password_hash" character varying(255) NOT NULL, "status" integer NOT NULL DEFAULT '1', "id_rol" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."status" IS '0: inactive, 1: active'; COMMENT ON COLUMN "users"."id_rol" IS '1: rider, 2: driver'`,
    );
    await queryRunner.query(
      `CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "id_user" integer NOT NULL, "available" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id")); COMMENT ON COLUMN "drivers"."available" IS '1 = available, 0 = not available'`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "reference" character varying(150) NOT NULL, "id_trx_wompi" character varying(150) NOT NULL, "id_travel" integer NOT NULL, "total" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "status" integer NOT NULL, "wompi_response" text, "approval_at" TIMESTAMP, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")); COMMENT ON COLUMN "transactions"."reference" IS 'reference of the transaction'; COMMENT ON COLUMN "transactions"."id_trx_wompi" IS 'id of the transaction in wompi'; COMMENT ON COLUMN "transactions"."total" IS 'total amount of the travel'; COMMENT ON COLUMN "transactions"."created_at" IS 'date of the transaction'; COMMENT ON COLUMN "transactions"."status" IS '0 Pending, 1 approved, 2 rejected, 3 cancelled, 4 internal error of the payment method, 5 undefined status'; COMMENT ON COLUMN "transactions"."wompi_response" IS 'will store future wompi response'; COMMENT ON COLUMN "transactions"."approval_at" IS 'date of the wompi approval'`,
    );
    await queryRunner.query(
      `CREATE TABLE "travels" ("id" SERIAL NOT NULL, "id_driver" integer NOT NULL, "id_rider" integer NOT NULL, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP, "lat_start" text NOT NULL, "long_start" text NOT NULL, "lat_end" text, "long_end" text, "total" text, "status" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_cc2d44f93ba8f6b268978971e2b" PRIMARY KEY ("id")); COMMENT ON COLUMN "travels"."id_driver" IS 'assigned driver id'; COMMENT ON COLUMN "travels"."id_rider" IS 'creator passenger id'; COMMENT ON COLUMN "travels"."start_at" IS 'start time of the travel'; COMMENT ON COLUMN "travels"."end_at" IS 'end time of the travel'; COMMENT ON COLUMN "travels"."lat_start" IS 'start latitude'; COMMENT ON COLUMN "travels"."long_start" IS 'start longitude'; COMMENT ON COLUMN "travels"."lat_end" IS 'end latitude'; COMMENT ON COLUMN "travels"."long_end" IS 'end longitude'; COMMENT ON COLUMN "travels"."total" IS 'total amount of the travel'; COMMENT ON COLUMN "travels"."status" IS '1: Created, 2: Finished'`,
    );
    await queryRunner.query(
      `CREATE TABLE "riders" ("id" SERIAL NOT NULL, "id_user" integer NOT NULL, "id_payment_source" integer, CONSTRAINT "PK_6c17e67f760677500c29d68e689" PRIMARY KEY ("id")); COMMENT ON COLUMN "riders"."id_payment_source" IS 'id of the previously tokenized payment method'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_ff96d447f9655473415fd33c26c" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD CONSTRAINT "FK_ccb0b80a217e1ebb7dc2e751a6a" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_a8b5364a7fe3680f3482fe964f3" FOREIGN KEY ("id_travel") REFERENCES "travels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "travels" ADD CONSTRAINT "FK_d5e0afd75e537bf1fe4cde0b6fd" FOREIGN KEY ("id_driver") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "travels" ADD CONSTRAINT "FK_1ef13000a620bf6c8b49bdb672e" FOREIGN KEY ("id_rider") REFERENCES "riders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "riders" ADD CONSTRAINT "FK_cfd150c084a2679511e103bbb2e" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    /* INSERT SEED OF DATA IN DEV ----- PLEASE CHANGE  id_payment_source IN RIDERS TABLE FOR THE REAL DATA OF YOUR CLIENT */

    if (process.env.NODE_ENV === 'development') {
      await queryRunner.query(
        `INSERT INTO roles (name, description)
            VALUES  ('RIDER','RIDER'), ('DRIVER','DRIVER');`,
      );
      await queryRunner.query(
        `INSERT INTO users (username, email, password_hash, status, id_rol)
            VALUES
                ('rider1','rider1@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,1),
                ('rider2','rider2@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,1),
                ('rider3','rider3@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,1),
                ('rider4','rider4@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,1),
                ('driver1','driver1@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,2),
                ('driver2','driver2@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,2),
                ('driver3','driver3@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,2),
                ('driver4','driver4@gmail.com','$2a$12$98V1ZJ/Mmu1mLOwoA0MwXOok6uuSu9O13IWv4VwU47ffD90Z95b/W',1,2);`,
        [],
        true,
      );
      await queryRunner.query(`
        INSERT INTO riders (id_user,id_payment_source)
        VALUES (1,1),(2,1),(3,1),(4,1)
        `);

      await queryRunner.query(`INSERT INTO drivers (id_user)
      VALUES (5),(6),(7),(8)`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "riders" DROP CONSTRAINT "FK_cfd150c084a2679511e103bbb2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "travels" DROP CONSTRAINT "FK_1ef13000a620bf6c8b49bdb672e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "travels" DROP CONSTRAINT "FK_d5e0afd75e537bf1fe4cde0b6fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_a8b5364a7fe3680f3482fe964f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP CONSTRAINT "FK_ccb0b80a217e1ebb7dc2e751a6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_ff96d447f9655473415fd33c26c"`,
    );
    await queryRunner.query(`DROP TABLE "riders"`);
    await queryRunner.query(`DROP TABLE "travels"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "drivers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
