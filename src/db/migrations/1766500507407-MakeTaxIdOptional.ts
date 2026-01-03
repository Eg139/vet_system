import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeTaxIdOptional1766500507407 implements MigrationInterface {
    name = 'MakeTaxIdOptional1766500507407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_c80dc89bda210489339f429121d"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "taxId"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "taxId" text`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_c80dc89bda210489339f429121d" UNIQUE ("taxId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_c80dc89bda210489339f429121d"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "taxId"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "taxId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_c80dc89bda210489339f429121d" UNIQUE ("taxId")`);
    }

}
