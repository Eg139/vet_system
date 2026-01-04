import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLicensingToOrganization1766521404549 implements MigrationInterface {
    name = 'AddLicensingToOrganization1766521404549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "isLicenseActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "licenseExpiration" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "licensePlan" character varying NOT NULL DEFAULT 'FREE'`);
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
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "licensePlan"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "licenseExpiration"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "isLicenseActive"`);
    }

}
