import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupOrganizationEntity1766541551405 implements MigrationInterface {
    name = 'CleanupOrganizationEntity1766541551405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "planType"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "planType" character varying NOT NULL DEFAULT 'FREE'`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

}
