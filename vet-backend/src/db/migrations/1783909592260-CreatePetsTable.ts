import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePetsTable1783909592260 implements MigrationInterface {
    name = 'CreatePetsTable1783909592260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pets" ("id" uuid NOT NULL, "name" character varying NOT NULL, "species" character varying NOT NULL, "breed" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "owner_id" uuid NOT NULL, "org_id" uuid NOT NULL, "blood_type" character varying NOT NULL DEFAULT 'Desconocido', "is_neutered" boolean NOT NULL DEFAULT false, "chronic_allergies" text NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d6c565fded8031d4cdd54fe104" ON "pets" ("owner_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_568c6fc0135284a0c838945040" ON "pets" ("org_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0312701c1ed93482182e154309" ON "pets" ("id", "org_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0312701c1ed93482182e154309"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_568c6fc0135284a0c838945040"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6c565fded8031d4cdd54fe104"`);
        await queryRunner.query(`DROP TABLE "pets"`);
    }

}
