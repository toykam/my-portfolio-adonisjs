import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { v4 } from "uuid";

export default class CreateServices extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('service_name', 225).unique().notNullable()
      table.text('service_description').notNullable()
      table.string('service_image').notNullable()
      table.uuid('service_id').unique().defaultTo(v4())


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
