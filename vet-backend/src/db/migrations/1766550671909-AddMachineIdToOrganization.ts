import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMachineIdToOrganization1766550671909 implements MigrationInterface {
    name = 'AddMachineIdToOrganization1766550671909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "machineId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "machineId"`);
    }

}
