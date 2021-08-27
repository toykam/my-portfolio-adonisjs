import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Skills extends BaseSchema {
  protected tableName = 'skills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('skill_name').unique().notNullable()
      table.string('skill_image_url').notNullable()
      table.text('skill_description').notNullable()
      table.string('learn_more_link').notNullable().unique()
      table.string('skill_id').unique().notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.datetime('created_at', { useTz: true })
      table.datetime('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
