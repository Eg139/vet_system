import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrandingToOrganizations1768953363746 implements MigrationInterface {
    name = 'AddBrandingToOrganizations1768953363746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "primaryColor" character varying NOT NULL DEFAULT '#3b82f6'`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "borderRadius" character varying NOT NULL DEFAULT '0.5rem'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "borderRadius"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "primaryColor"`);
    }

}
