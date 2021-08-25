import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Skills extends BaseSchema {
  protected tableName = 'skills'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('position').notNullable().defaultTo(0);
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('position')
    })
  }
}
