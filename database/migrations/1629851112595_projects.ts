import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { v4 } from "uuid";

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('project_name').unique().notNullable()
      table.text('project_description').notNullable()
      table.string('project_image').notNullable()
      table.string('project_url').unique().notNullable().defaultTo(v4())
      table.uuid('project_id').unique().notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
