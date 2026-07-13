import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientsAndOwnersTables1783911029074 implements MigrationInterface {
    name = 'CreatePatientsAndOwnersTables1783911029074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "user_id" uuid, "org_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f6bd589d3b8a701bf4e96ea932" ON "owners" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8510bc5321e24f0ac1db6d9408" ON "owners" ("org_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_01606255845cf9c31d1b7124bf" ON "owners" ("id", "org_id") `);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_d6c565fded8031d4cdd54fe1043" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_d6c565fded8031d4cdd54fe1043"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01606255845cf9c31d1b7124bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8510bc5321e24f0ac1db6d9408"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6bd589d3b8a701bf4e96ea932"`);
        await queryRunner.query(`DROP TABLE "owners"`);
    }

}
